'use strict'

function setupFill (scale, maxColor) {
  const idColors = new Map()
  var paletteCounter = 0

  return fill

  function fill (d, i) {
    const name = d.data.id
    var color = idColors.get(name)
    if (!color) {
      color = scale(paletteCounter++)
      idColors.set(name, color)
    }

    if (paletteCounter >= maxColor) {
      paletteCounter = 0
    }

    return color
  }
}

module.exports = setupFill
