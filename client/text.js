'use strict'

function create (svg, height, main, arc, width, fill) {
  var lines = []
  var lineHeight = 18

  return { add, resize }

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

    svg.selectAll('text')
      .filter((d) => {
        return d.y < lineHeight * 2
      })
      .transition()
      .duration(500)
      .attr('opacity', 0)
      .remove()

    svg.selectAll('line')
      .data(lines)
      .enter()
      .append('line')
      .attr('x1', () => 80) // TODO make this dynamic
      .attr('x2', (d) => d.arcCoord.x)
      .attr('y1', (d) => Math.floor(d.y - lineHeight / 2))
      .attr('y2', (d) => d.arcCoord.y)
      .attr('opacity', 0)

    svg.selectAll('line')
      .filter((d) => {
        return d.y < lineHeight * 2
      })
      .transition()
      .attr('opacity', 0)
      .remove()

    svg.selectAll('line')
      .filter((d) => {
        return d.y >= lineHeight * 2
      })
      .transition()
      .duration(500)
      .attr('x1', () => 80) // TODO make this dynamic
      .attr('x2', (d) => d.arcCoord.x)
      .attr('y1', (d) => Math.floor(d.y - lineHeight / 2))
      .attr('y2', (d) => d.arcCoord.y)
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

    svg.selectAll('line')
      .transition('winresize')
      .attr('x1', () => 80) // TODO make this dynamic
      .attr('x2', (d) => d.arcCoord.x)
      .attr('y1', (d) => Math.floor(d.y - lineHeight / 2))
      .attr('y2', (d) => d.arcCoord.y)

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
}

module.exports = create
