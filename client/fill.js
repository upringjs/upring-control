'use strict'

function setupFill (palette) {
  const idColors = new Map()
  var paletteCounter = 0

  return fill

  function fill (d, i) {
    const name = d.data.id
    var color = idColors.get(name)
    if (!color) {
      color = palette[paletteCounter++]
      idColors.set(name, color)
    }

    if (paletteCounter >= palette.length) {
      paletteCounter = 0
    }

    return color
  }
}

module.exports = setupFill
