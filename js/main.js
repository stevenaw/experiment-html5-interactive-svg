class SvgDragState {
  constructor() {
    this.selectedElement = null;
    this.offset = null;
    this.transform = null;
  }
}

function getMousePosition(evt, svg) {
  const CTM = svg.getScreenCTM();

  if (evt.touches) {
    evt = evt.touches[0];
  }

  return {
    x: (evt.clientX - CTM.e) / CTM.a,
    y: (evt.clientY - CTM.f) / CTM.d
  };
}

document.addEventListener('DOMContentLoaded', () => {
  const svg = document.getElementById('target-svg');
  const elementFilter = '.piece';

  let dragState;

  svg.addEventListener('mousedown', startDrag, false);
  svg.addEventListener('mousemove', drag, false);
  svg.addEventListener('mouseup', endDrag, false);
  svg.addEventListener('mouseleave', endDrag, false);

  const touchOpts = { passive: true };
  svg.addEventListener('touchstart', startDrag, touchOpts);
  svg.addEventListener('touchmove', drag, touchOpts);
  svg.addEventListener('touchend', endDrag, touchOpts);
  svg.addEventListener('touchleave', endDrag, touchOpts);
  svg.addEventListener('touchcancel', endDrag, touchOpts);

  function startDrag(evt) {
    const selectedElement = evt.target;
    if (selectedElement.matches(elementFilter)) {
      const offset = getMousePosition(evt, svg);
      const transforms = selectedElement.transform.baseVal;

      let transform = transforms.length && transforms.getItem(0);
      if (!transform || transform.type !== SVGTransform.SVG_TRANSFORM_TRANSLATE) {
        transform = svg.createSVGTransform();

        transform.setTranslate(0, 0);
        selectedElement.transform.baseVal.insertItemBefore(transform, 0);
      }
      
      offset.x -= transform.matrix.e;
      offset.y -= transform.matrix.f;

      dragState = new SvgDragState();
      dragState.selectedElement = selectedElement;
      dragState.offset = offset;
      dragState.transform = transform;
    }
  }

  function drag(evt) {
    if (dragState) {
      const coord = getMousePosition(evt, svg);

      const dx = coord.x - dragState.offset.x;
      const dy = coord.y - dragState.offset.y;

      dragState.transform.setTranslate(dx, dy);
    }
  }

  function endDrag(evt) {
    if (dragState) {
      const coord = getMousePosition(evt, svg);

      const startX = parseInt(dragState.selectedElement.getAttributeNS(null, 'x'), 10);
      const startY = parseInt(dragState.selectedElement.getAttributeNS(null, 'y'), 10);
      const deltaX = Math.round(coord.x - dragState.offset.x);
      const deltaY = Math.round(coord.y - dragState.offset.y);
      const endX = startX + deltaX;
      const endY = startY + deltaY;
      
      dragState.selectedElement.setAttributeNS(null, "x", endX);
      dragState.selectedElement.setAttributeNS(null, "y", endY);
      dragState.transform.setTranslate(0, 0);

      dragState = null;
    }
  }
});