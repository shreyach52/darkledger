const { deriveSector } = require('../enrichSector');

describe('deriveSector', () => {
  test('classifies healthcare descriptions correctly', () => {
    expect(deriveSector('A leading cardiology hospital in Texas.')).toBe('Healthcare');
  });

  test('classifies manufacturing descriptions correctly', () => {
    expect(deriveSector('A steel foundry specializing in industrial equipment.')).toBe('Manufacturing');
  });

  test('is case-insensitive', () => {
    expect(deriveSector('HOSPITAL AND MEDICAL CENTER')).toBe('Healthcare');
  });

  test('returns Unclassified when no keywords match', () => {
    expect(deriveSector('A generic small business with no clear category.')).toBe('Unclassified');
  });

  test('handles null description without throwing', () => {
    expect(deriveSector(null)).toBe('Unclassified');
  });

  test('handles undefined description without throwing', () => {
    expect(deriveSector(undefined)).toBe('Unclassified');
  });

  test('handles empty string description', () => {
    expect(deriveSector('')).toBe('Unclassified');
  });
});