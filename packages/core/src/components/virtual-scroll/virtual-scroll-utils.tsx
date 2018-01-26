const VIEWPORT_MARGIN = 100;
const MARGIN_BUFFER = 1;
const BATCH = 0;


export const enum CellType {
  Item,
  Header,
  Footer
}

export interface Cell {
  type: CellType;
  value: any;
  index: number;
  height: number;
}

export interface VirtualNode {
  cell: Cell;
  top: number;
  change: number;
  _d: boolean;
}

export type HeaderFn = (item: any, index: number, items: any[]) => string | null;
export type ItemHeightFn = (item: any, index?: number) => number;
export type ItemRenderFn = (el: HTMLElement|null, item: any, type: CellType, index?: number) => HTMLElement;
export type DomRenderFn = (dom: VirtualNode[], height: number) => void;


export function updateVDom(dom: VirtualNode[], heightIndex: Uint32Array, cells: Cell[], top: number, bottom: number) {
  // reset dom
  for (const node of dom) {
    node.top = -9999;
    node.change = 0;
    node._d = true;
  }

  // try to match into exisiting dom
  const toMutate = [];
  const end = bottom + 1;

  for (let i = top; i < end; i++) {
    const cell = cells[i];
    const node = dom.find((n) => n._d && n.cell === cell);
    if (node) {
      node._d = false;
      node.change = 1;
      node.top = heightIndex[i];
    } else {
      toMutate.push(cell);
    }
  }

  // needs to append
  const pool = dom.filter((n) => n._d);

  // console.log('toMutate', toMutate.length);
  for (const cell of toMutate) {
    const node = pool.find(n => n._d && n.cell.type === cell.type);
    const index = cell.index;
    if (node) {
      node._d = false;
      node.change = 2;
      node.cell = cell;
      node.top = heightIndex[index];
    } else {
      dom.push({
        _d: false,
        change: 2,
        cell: cell,
        top: heightIndex[index],
      });
    }
  }
}

export function doRender(el: HTMLElement, itemRender: ItemRenderFn, dom: VirtualNode[], total: number) {
  const children = el.children;
  let child: HTMLElement;
  for (let i = 0; i < dom.length; i++) {
    const node = dom[i];
    const cell = node.cell;
    if (node.change === 2) {
      if (i < children.length) {
        child = children[i] as HTMLElement;
        itemRender(child, cell.value, cell.type, cell.index);
      } else {
        child = itemRender(null, cell.value, cell.type, cell.index);
        child.classList.add('virtual-item');
        el.appendChild(child);
      }
    } else {
      child = children[i] as HTMLElement;
    }
    if (node.change !== 0) {
      child.style.transform = `translate3d(0,${node.top}px,0)`;
    }
  }
  el.style.height = total + 'px';
}

export function getTotalHeight(heightIndex: Uint32Array) {
  return heightIndex[heightIndex.length - 1];
}

export function getBounds(heightIndex: Uint32Array, viewportHeight: number, scrollTop: number) {
  const topPos = scrollTop - VIEWPORT_MARGIN;
  const bottomPos = scrollTop + viewportHeight + VIEWPORT_MARGIN;

  // find top index
  let i = 0;
  for (; i < heightIndex.length; i++) {
    if (heightIndex[i] > topPos) {
      break;
    }
  }
  const top = Math.max(i - MARGIN_BUFFER, 0);

  // find bottom index
  for (; i < heightIndex.length; i++) {
    if (heightIndex[i] > bottomPos) {
      break;
    }
  }
  const bottom = Math.min(i + MARGIN_BUFFER, heightIndex.length - 1);
  return { top, bottom };
}

export function getShouldUpdate(currentTop: number, currentBottom: number, top: number, bottom: number) {
  return (
    Math.abs(currentTop - top) > BATCH ||
    Math.abs(currentBottom - bottom) > BATCH
  );
}
