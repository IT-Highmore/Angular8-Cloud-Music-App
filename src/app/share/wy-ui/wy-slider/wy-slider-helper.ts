// tslint:disable-next-line:typedef
export function sliderEvent(e: Event) {
  e.stopPropagation();
  e.preventDefault();
}

export function getElementOffset(el: HTMLElement): { top: number; left: number; } {
  // 如果dom无数据
  if (!el.getClientRects().length) {
    return {
      top: 0,
      // tslint:disable-next-line:object-literal-sort-keys
      left: 0,
    };
  }

  const rect = el.getBoundingClientRect(); // 拿到dom矩形位置
  const win = el.ownerDocument.defaultView; // 取得元素所在doc节点

  return {
    top: rect.top + win.pageYOffset,
    // tslint:disable-next-line:object-literal-sort-keys
    left: rect.left + win.pageXOffset,
  };
}
