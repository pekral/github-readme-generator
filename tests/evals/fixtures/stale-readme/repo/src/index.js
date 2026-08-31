export function palette(baseColour, { steps = 5 } = {}) {
  if (!/^#[0-9a-f]{6}$/i.test(baseColour)) throw new TypeError('palette() needs a #rrggbb colour.');

  return Array.from({ length: steps }, (_, step) => shade(baseColour, step / (steps - 1)));
}

function shade(colour, amount) {
  const channels = [1, 3, 5].map((offset) => parseInt(colour.slice(offset, offset + 2), 16));
  const mixed = channels.map((channel) => Math.round(channel + (255 - channel) * amount));

  return `#${mixed.map((channel) => channel.toString(16).padStart(2, '0')).join('')}`;
}
