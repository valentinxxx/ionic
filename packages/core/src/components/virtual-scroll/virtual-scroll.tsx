import { Component, Element, EventListenerEnable, Listen, Prop, Watch } from '@stencil/core';
import { DomController } from '../../index';
import { VirtualNode, doRender, getBounds, getShouldUpdate, getTotalHeight, updateDom } from './virtual-scroll-utils';

/**
 * @name VirtualScroll
 * @description
 * Virtual Scroll displays a virtual, "infinite" list. An array of records
 * is passed to the virtual scroll containing the data to create templates
 * for. The template created for each record, referred to as a cell, can
 * consist of items, headers, and footers.
 *
 * For performance reasons, not every record in the list is rendered at once;
 * instead a small subset of records (enough to fill the viewport) are rendered
 * and reused as the user scrolls.
 *
 * ### The Basics
 *
 * The array of records should be passed to the `virtualScroll` property.
 * The data given to the `virtualScroll` property must be an array. An item
 * template with the `*virtualItem` property is required in the `virtualScroll`.
 * The `virtualScroll` and `*virtualItem` properties can be added to any element.
 *
 * ```html
 * <ion-list [virtualScroll]="items">
 *
 *   <ion-item *virtualItem="let item">
 *     {% raw %}{{ item }}{% endraw %}
 *   </ion-item>
 *
 * </ion-list>
 * ```
 *
 *
 * ### Section Headers and Footers
 *
 * Section headers and footers are optional. They can be dynamically created
 * from developer-defined functions. For example, a large list of contacts
 * usually has a divider for each letter in the alphabet. Developers provide
 * their own custom function to be called on each record. The logic in the
 * custom function should determine whether to create the section template
 * and what data to provide to the template. The custom function should
 * return `null` if a template shouldn't be created.
 *
 * ```html
 * <ion-list [virtualScroll]="items" [headerFn]="myHeaderFn">
 *
 *   <ion-item-divider *virtualHeader="let header">
 *     Header: {% raw %}{{ header }}{% endraw %}
 *   </ion-item-divider>
 *
 *   <ion-item *virtualItem="let item">
 *     Item: {% raw %}{{ item }}{% endraw %}
 *   </ion-item>
 *
 * </ion-list>
 * ```
 *
 * Below is an example of a custom function called on every record. It
 * gets passed the individual record, the record's index number,
 * and the entire array of records. In this example, after every 20
 * records a header will be inserted. So between the 19th and 20th records,
 * between the 39th and 40th, and so on, a `<ion-item-divider>` will
 * be created and the template's data will come from the function's
 * returned data.
 *
 * ```ts
 * myHeaderFn(record, recordIndex, records) {
 *   if (recordIndex % 20 === 0) {
 *     return 'Header ' + recordIndex;
 *   }
 *   return null;
 * }
 * ```
 *
 *
 * ### Approximate Widths and Heights
 *
 * If the height of items in the virtual scroll are not close to the
 * default size of 40px, it is extremely important to provide a value for
 * approxItemHeight height. An exact pixel-perfect size is not necessary,
 * but without an estimate the virtual scroll will not render correctly.
 *
 * The approximate width and height of each template is used to help
 * determine how many cells should be created, and to help calculate
 * the height of the scrollable area. Note that the actual rendered size
 * of each cell comes from the app's CSS, whereas this approximation
 * is only used to help calculate initial dimensions.
 *
 * It's also important to know that Ionic's default item sizes have
 * slightly different heights between platforms, which is perfectly fine.
 *
 *
 * ### Images Within Virtual Scroll
 *
 * HTTP requests, image decoding, and image rendering can cause jank while
 * scrolling. In order to better control images, Ionic provides `<ion-img>`
 * to manage HTTP requests and image rendering. While scrolling through items
 * quickly, `<ion-img>` knows when and when not to make requests, when and
 * when not to render images, and only loads the images that are viewable
 * after scrolling. [Read more about `ion-img`.](../../img/Img/)
 *
 * It's also important for app developers to ensure image sizes are locked in,
 * and after images have fully loaded they do not change size and affect any
 * other element sizes. Simply put, to ensure rendering bugs are not introduced,
 * it's vital that elements within a virtual item does not dynamically change.
 *
 * For virtual scrolling, the natural effects of the `<img>` are not desirable
 * features. We recommend using the `<ion-img>` component over the native
 * `<img>` element because when an `<img>` element is added to the DOM, it
 * immediately makes a HTTP request for the image file. Additionally, `<img>`
 * renders whenever it wants which could be while the user is scrolling. However,
 * `<ion-img>` is governed by the containing `ion-content` and does not render
 * images while scrolling quickly.
 *
 * ```html
 * <ion-list [virtualScroll]="items">
 *
 *   <ion-item *virtualItem="let item">
 *     <ion-avatar item-start>
 *       <ion-img [src]="item.avatarUrl"></ion-img>
 *     </ion-avatar>
 *    {% raw %} {{ item.firstName }} {{ item.lastName }}{% endraw %}
 *   </ion-item>
 *
 * </ion-list>
 * ```
 *
 *
 * ### Custom Components
 *
 * If a custom component is going to be used within Virtual Scroll, it's best
 * to wrap it with a good old `<div>` to ensure the component is rendered
 * correctly. Since each custom component's implementation and internals can be
 * quite different, wrapping within a `<div>` is a safe way to make sure
 * dimensions are measured correctly.
 *
 * ```html
 * <ion-list [virtualScroll]="items">
 *
 *   <div *virtualItem="let item">
 *     <my-custom-item [item]="item">
 *       {% raw %} {{ item }}{% endraw %}
 *     </my-custom-item>
 *   </div>
 *
 * </ion-list>
 * ```
 *
 *
 * ## Virtual Scroll Performance Tips
 *
 * #### iOS Cordova WKWebView
 *
 * When deploying to iOS with Cordova, it's highly recommended to use the
 * [WKWebView plugin](http://blog.ionic.io/cordova-ios-performance-improvements-drop-in-speed-with-wkwebview/)
 * in order to take advantage of iOS's higher performimg webview. Additionally,
 * WKWebView is superior at scrolling efficiently in comparision to the older
 * UIWebView.
 *
 * #### Lock in element dimensions and locations
 *
 * In order for virtual scroll to efficiently size and locate every item, it's
 * very important every element within each virtual item does not dynamically
 * change its dimensions or location. The best way to ensure size and location
 * does not change, it's recommended each virtual item has locked in its size
 * via CSS.
 *
 * #### Use `ion-img` for images
 *
 * When including images within Virtual Scroll, be sure to use
 * [`ion-img`](../img/Img/) rather than the standard `<img>` HTML element.
 * With `ion-img`, images are lazy loaded so only the viewable ones are
 * rendered, and HTTP requests are efficiently controlled while scrolling.
 *
 * #### Set Approximate Widths and Heights
 *
 * As mentioned above, all elements should lock in their dimensions. However,
 * virtual scroll isn't aware of the dimensions until after they have been
 * rendered. For the initial render, virtual scroll still needs to set
 * how many items should be built. With "approx" property inputs, such as
 * `approxItemHeight`, we're able to give virtual scroll an approximate size,
 * therefore allowing virtual scroll to decide how many items should be
 * created.
 *
 * #### Changing dataset should use `virtualTrackBy`
 *
 * It is possible for the identities of elements in the iterator to change
 * while the data does not. This can happen, for example, if the iterator
 * produced from an RPC to the server, and that RPC is re-run. Even if the
 * "data" hasn't changed, the second response will produce objects with
 * different identities, and Ionic will tear down the entire DOM and rebuild
 * it. This is an expensive operation and should be avoided if possible.
 *
 * #### Efficient headers and footer functions
 *
 * Each virtual item must stay extremely efficient, but one way to really
 * kill its performance is to perform any DOM operations within section header
 * and footer functions. These functions are called for every record in the
 * dataset, so please make sure they're performant.
 *
 */
@Component({
  tag: 'ion-virtual-scroll',
  styleUrl: 'virtual-scroll.scss'
})
export class VirtualScroll {

  private scrollEl: HTMLElement;
  private topIndex = -100;
  private bottomIndex = -100;
  private dirty = false;
  private heightIndex: Uint32Array;
  private viewportHeight: number;
  private virtualDom: VirtualNode[] = [];
  private isEnabled = false;

  @Element() el: HTMLElement;

  @Prop({context: 'dom'}) dom: DomController;
  @Prop({context: 'enableListener'}) enableListener: EventListenerEnable;

  @Prop() itemHeight: (item: any[]) => [number];
  @Prop() itemRender: (item: any, el?: HTMLElement) => HTMLElement;
  @Prop() domUpdate: (dom: VirtualNode[], height: number) => void;
  @Prop() items: any[];

  @Watch('itemHeight')
  @Watch('items')
  itemsChanged() {
    this.calcHeightIndex();
  }

  componentDidLoad() {
    this.scrollEl = this.el.closest('ion-scroll') as HTMLElement;
    if (!this.scrollEl) {
      console.error('virtual-scroll must be used inside ion-scroll/ion-content');
      return;
    }
    this.calcDimensions();
    this.calcHeightIndex();
    this.updateState();
  }

  componentDidUpdate() {
    this.updateState();
  }

  @Listen('scroll', {enabled: false, passive: false})
  onScroll() {
    this.updateVirtualScroll();
  }

  @Listen('window:resize')
  onResize() {
    this.calcDimensions();
    this.updateVirtualScroll();
  }

  private updateVirtualScroll() {
    // do nothing if there is a scheduled update
    if (this.dirty || !this.isEnabled) {
      return;
    }
    const scrollTop = this.scrollEl.scrollTop;
    // get bounds of visible items
    const {top, bottom} = getBounds(this.heightIndex, this.viewportHeight, scrollTop);

    // fast path, do nothing
    const shouldUpdate = getShouldUpdate(this.topIndex, this.bottomIndex, top, bottom);
    if (!shouldUpdate) {
      return;
    }
    this.topIndex = top;
    this.bottomIndex = bottom;

    // in place mutation of the virtual DOM
    updateDom(
      this.virtualDom,
      this.heightIndex,
      this.items,
      top,
      bottom);

    this.fireDomUpdate();
  }

  private fireDomUpdate() {
    this.dirty = true;
    const total = getTotalHeight(this.heightIndex);
    this.dom.write(() => {
      this.dirty = false;
      if (this.itemRender) {
        doRender(this.el, this.itemRender, this.virtualDom, total);
      } else if (this.domUpdate) {
        this.domUpdate(this.virtualDom, total);
      }
    });
  }

  private updateState() {
    const shouldEnable = !!(
      this.scrollEl &&
      this.items &&
      this.itemRender &&
      (this.itemRender || this.domUpdate) &&
      this.viewportHeight > 1
    );
    if (shouldEnable !== this.isEnabled) {
      this.enableScrollEvents(shouldEnable);
      if (shouldEnable) {
        this.updateVirtualScroll();
      }
    }
  }

  private enableScrollEvents(shouldListen: boolean) {
    this.isEnabled = shouldListen;
    this.enableListener(this, 'scroll', shouldListen, this.scrollEl);
  }

  private calcHeightIndex() {
    if (this.items && this.itemHeight) {
      const heightIndex = this.heightIndex = new Uint32Array(this.items.length);
      const heights = this.itemHeight(this.items);
      let acum = 0;
      for (let i = 0; i < heights.length; i++) {
        heightIndex[i] = acum;
        acum += heights[i];
      }
    }
  }

  private calcDimensions() {
    this.viewportHeight = this.scrollEl.offsetHeight;
  }
}
