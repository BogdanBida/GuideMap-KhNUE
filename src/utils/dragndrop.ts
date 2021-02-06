export class DragNDrop {
  public static onMouseDown(event, target): void {
    target.ondragstart = () => false;
    target.style.position = 'absolute';

    const box = target.getBoundingClientRect();
    const coords = {
      top: box.top + pageYOffset,
      left: box.left + pageXOffset
    };
    const shiftX = event.pageX - coords.left;
    const shiftY = event.pageY - coords.top;

    document.body.appendChild(target);
    document.onmouseup = () => {
      document.onmousemove = null;
      target.onmouseup = null;
    };
    document.onmousemove = (e) => {
      target.style.left = e.pageX - shiftX + 'px';
      target.style.top = e.pageY - shiftY + 'px';

      const left = +target.style.left.replace('px', '');
      const top = +target.style.top.replace('px', '');
      const maxWidth = 3500 - window.innerWidth;
      const maxHeight = 2550 - window.innerHeight;

      left > 0 && (target.style.left = 0);
      left < -maxWidth && (target.style.left = `-${maxWidth}px`);
      top > 0 && (target.style.top = 0);
      top < -maxHeight && (target.style.top = `-${maxHeight}px`);
    };
  }
}
