const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (email !== process.env.ADMIN_EMAIL) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const valid = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token });
});

module.exports = router;