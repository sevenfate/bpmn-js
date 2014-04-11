var mousewheel = require('./mousewheel');

var bpmnModule = require('../../di').defaultModule;

function ZoomScroll(events, canvas) {

  var RANGE = { min: 0.2, max: 4 };

  var ZOOM_OFFSET = 5;
  var SCROLL_OFFSET = 50;

  function cap(scale) {
    return Math.max(RANGE.min, Math.min(RANGE.max, scale));
  }

  function zoom(direction, position) {

    var currentZoom = canvas.zoom();
    var factor = 1 + (direction / ZOOM_OFFSET);

    canvas.zoom(cap(currentZoom * factor), position);
  }


  function initMouseWheel(element) {

    mousewheel(element).on('mousewheel', function(event) {

      var shift = event.shiftKey,
          ctrl = event.ctrlKey;

      var x = event.deltaX,
          y = event.deltaY;

      if (shift || ctrl) {
        var delta = {};

        if (ctrl) {
          delta.dx = SCROLL_OFFSET * x;
        } else {
          delta.dy = SCROLL_OFFSET * x;
        }

        canvas.scroll(delta);
      } else {
        zoom(y, { x: event.offsetX, y: event.offsetY });
      }

      event.preventDefault();
    });
  }

  events.on('canvas.init', function(e) {
    initMouseWheel(e.paper.node);
  });

  // API
  this.zoom = zoom;
}


bpmnModule.type('zoomScroll', [ 'eventBus', 'canvas', ZoomScroll ]);

module.exports = ZoomScroll;