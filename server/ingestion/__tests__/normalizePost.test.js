const { normalizePost, getStatus } = require('../fetchRansomlook');

describe('getStatus', () => {
  test('returns disclosed when description has real content', () => {
    const raw = { description: 'A healthcare company based in Texas.' };
    expect(getStatus(raw)).toBe('disclosed');
  });

  test('returns pending_disclosure for "To be announced..." description', () => {
    const raw = { description: 'To be announced...', post_title: 'Q... E...' };
    expect(getStatus(raw)).toBe('pending_disclosure');
  });

  test('returns pending_disclosure when description is null and title is a placeholder', () => {
    const raw = { description: null, post_title: 'N... M...' };
    expect(getStatus(raw)).toBe('pending_disclosure');
  });

  test('returns disclosed when title is a real company name even with no description', () => {
    const raw = { description: null, post_title: 'Crowe' };
    expect(getStatus(raw)).toBe('disclosed');
  });
});

describe('normalizePost', () => {
  test('maps raw API fields to internal schema shape', () => {
    const raw = {
      misp_uuid: 'abc-123',
      post_title: 'Acme Corp',
      group_name: 'lockbit5',
      description: 'A manufacturing company.',
      discovered: '2026-08-27 10:31:37.266020',
      link: '/post/abc123',
      screen: 'screenshots/lockbit5/acme.png',
    };

    const result = normalizePost(raw);

    expect(result.misp_uuid).toBe('abc-123');
    expect(result.post_title).toBe('Acme Corp');
    expect(result.group_name).toBe('lockbit5');
    expect(result.status).toBe('disclosed');
    expect(result.source).toBe('ransomlook.io');
    expect(result.discovered).toBeInstanceOf(Date);
  });

  test('handles missing optional fields without throwing', () => {
    const raw = { misp_uuid: 'xyz-789' };
    const result = normalizePost(raw);

    expect(result.post_title).toBeNull();
    expect(result.description).toBeNull();
    expect(result.discovered).toBeNull();
  });
});