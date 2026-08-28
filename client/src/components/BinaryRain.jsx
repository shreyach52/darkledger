import { useEffect, useRef } from 'react';

export default function BinaryRain() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;
    let columns, drops;

    const fontSize = 15;

    function setup() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      columns = Math.floor(canvas.width / fontSize);
      drops = Array(columns).fill(0).map(() => Math.random() * -100);
    }

    function draw() {
      // fading trail, not a hard clear -- gives the "chain" streak look
      ctx.fillStyle = 'rgba(10, 15, 13, 0.06)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px "JetBrains Mono", monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = Math.random() > 0.5 ? '1' : '0';
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // vary opacity so it reads as depth, not a flat wall of text
        const opacity = Math.random() * 0.35 + 0.08;
        ctx.fillStyle = `rgba(139, 124, 246, ${opacity})`;
        ctx.fillText(char, x, y);

        if (y > canvas.height && Math.random() > 0.98) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      animationId = requestAnimationFrame(draw);
    }

    setup();
    draw();
    window.addEventListener('resize', setup);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', setup);
    };
  }, []);

  return <canvas ref={canvasRef} className="binary-rain" />;
}