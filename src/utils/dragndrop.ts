export class DragNDrop {
  public static onDrag(event, target): void {

    target.ondragstart = () => false;

    const box = target.getBoundingClientRect();
    const coords = {
      top: box.top + pageYOffset,
      left: box.left + pageXOffset
    };
    const shiftX = (event.pageX || event.touches[0].pageX) - coords.left;
    const shiftY = (event.pageY || event.touches[0].pageY) - coords.top;

    document.body.appendChild(target);
    document.onmouseup = drop;
    document.ontouchend = drop;

    function drop(): void {
      document.onmousemove = null;
      document.ontouchmove = null;
      target.onmouseup = null;
      target.ontouchend = null;
    }
    document.onmousemove = (e) => {
      const top = e.pageY - shiftY;
      const left = e.pageX - shiftX;
      move(top, left);
    };

    document.ontouchmove = (e) => {
      const top = e.touches[0].pageY - shiftY;
      const left = e.touches[0].pageX - shiftX;
      move(top, left);
    };

    function move(top: number, left: number): void {
      target.style.top = top + 'px';
      target.style.left = left + 'px';

      const maxWidth = 3500 - window.innerWidth;
      const maxHeight = 2550 - window.innerHeight;

      left > 0 && (target.style.left = 0);
      left < -maxWidth && (target.style.left = `-${maxWidth}px`);
      top > 0 && (target.style.top = 0);
      top < -maxHeight && (target.style.top = `-${maxHeight}px`);
    }
  }
}
