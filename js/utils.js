function calculateZoomLevel(radius) {
  radius = parseFloat(radius);
  if (radius <= 35) return 20;
  else if (radius <= 70) return 19;
  else if (radius <= 140) return 18;
  else if (radius <= 270) return 17;
  else if (radius <= 550) return 16;
  else if (radius <= 1100) return 15;
  else if (radius <= 2200) return 14;
  else if (radius <= 4400) return 13;
  else if (radius <= 8800) return 12;
  else return 11;
}

if (typeof module !== 'undefined') {
  module.exports = { calculateZoomLevel };
}
