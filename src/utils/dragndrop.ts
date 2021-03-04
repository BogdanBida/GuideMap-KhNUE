export class DragNDrop {
  public static onDrag(width: number, height: number): (event, target) => void {
    return (event, target) => {
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

        const maxWidth = width - window.innerWidth;
        const maxHeight = height - window.innerHeight;
        const minWidth = 0;
        const minHeight = 0;

        left > minWidth && (target.style.left = minWidth);
        left < -maxWidth && (target.style.left = `-${maxWidth}px`);

        top > minHeight && (target.style.top = minHeight);
        top < -maxHeight && (target.style.top = `-${maxHeight}px`);
      }
    };
  }
}
