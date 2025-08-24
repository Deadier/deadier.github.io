const { calculateZoomLevel } = require('../js/utils');

describe('calculateZoomLevel', () => {
  test('returns 20 for radius 10', () => {
    expect(calculateZoomLevel(10)).toBe(20);
  });

  test('returns 17 for radius 200', () => {
    expect(calculateZoomLevel(200)).toBe(17);
  });

  test('returns 14 for radius 2200', () => {
    expect(calculateZoomLevel(2200)).toBe(14);
  });

  test('returns 12 for radius 5000', () => {
    expect(calculateZoomLevel(5000)).toBe(12);
  });

  test('returns 11 for radius greater than 8800', () => {
    expect(calculateZoomLevel(9000)).toBe(11);
  });
});
