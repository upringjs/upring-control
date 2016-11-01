'use strict'

const d3 = require('d3')

function create (svg, height, main, arc, width, fill) {
  var lines = []
  var lineHeight = 18

  return { add, resize, clear }

  function add (em) {
    lines.push(em)

    lines.reduceRight((acc, line) => {
      line.y = acc - lineHeight
      return acc - lineHeight
    }, height)

    var linkTo = null

    main.selectAll('path')
      .each(function (p, i) {
        if (!linkTo) {
          linkTo = p
        }
        if (p.data.point < em.point) {
          linkTo = p
        }
      })

    var coord = arc.centroid(linkTo)

    em.id = linkTo.data.id

    // make them absolute
    em.arcCoord = {
      x: coord[0] + Math.floor(width / 2),
      y: coord[1] + Math.floor(height / 2)
    }

    var text = svg.selectAll('text')
      .data(lines)
      .enter()
      .append('text')

    text
      .attr('x', (d) => 0)
      .attr('y', (d) => d.y)
      .text((d) => d.text)
      .attr('font-family', 'sans-serif')
      .attr('font-size', lineHeight + 'px')
      .attr('fill', fill)
      .attr('opacity', 0)

    svg.selectAll('text')
      .filter((d) => {
        return d.y >= lineHeight * 2
      })
      .transition()
      .duration(500)
      .attr('x', (d) => 0)
      .attr('y', (d) => d.y)
      .text((d) => d.text)
      .attr('opacity', 1)
      .each(function (d) {
        d.textLength = this.getComputedTextLength()
      })

    svg.selectAll('text')
      .filter((d) => {
        return d.y < lineHeight * 2
      })
      .transition()
      .duration(500)
      .attr('opacity', 0)
      .remove()

    svg.selectAll('path')
      .data(lines)
      .enter()
      .append('path')
      .attr('class', 'line')
      .attr('d', renderLine)
      .attr('fill', 'rgba(255,255,255,0)')
      .attr('opacity', 0)

    svg.selectAll('path')
      .filter((d) => {
        return d.y < lineHeight * 2
      })
      .transition()
      .attr('opacity', 0)
      .remove()

    svg.selectAll('path')
      .filter((d) => {
        return d.y >= lineHeight * 2
      })
      .transition()
      .attr('d', renderLine)
      .duration(500)
      .attr('stroke', fill)
      .attr('opacity', 0.5)

    lines = lines.filter((d) => {
      return d.y >= lineHeight * 2
    })
  }

  function resize (w, h) {
    width = w
    height = h

    lines.reduceRight((acc, line) => {
      line.y = acc - lineHeight
      return acc - lineHeight
    }, height)

    svg.selectAll('path')
      .transition('winresize')
      .attr('d', renderLine)

    svg.selectAll('text')
      .filter((d) => {
        return d.y >= lineHeight * 2
      })
      .transition('winresize')
      .attr('x', (d) => 0)
      .attr('y', (d) => d.y)

    lines.forEach(function (em) {
      var linkTo

      main.selectAll('path')
        .each(function (p, i) {
          if (!linkTo) {
            linkTo = p
          }
          if (p.data.point < em.point) {
            linkTo = p
          }
        })

      var coord = arc.centroid(linkTo)

      // make them absolute
      em.arcCoord = {
        x: coord[0] + Math.floor(width / 2),
        y: coord[1] + Math.floor(height / 2)
      }
    })
  }

  function clear () {
    lines = []

    // TODO add a transition
    svg.selectAll('text')
      .remove()

    svg.selectAll('path')
      .remove()
  }

  function renderLine (d) {
    const source = {
      x: d.textLength + 10,
      y: Math.floor(d.y - lineHeight / 2)
    }
    const dest = d.arcCoord
    const mid = {
      x: Math.floor(dest.x / 2) - source.x,
      y: dest.y
    }
    const path = d3.path()

    path.moveTo(source.x, source.y)
    path.quadraticCurveTo(mid.x, mid.y, dest.x, dest.y)

    return path.toString()
  }
}

module.exports = create
