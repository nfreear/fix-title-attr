const { customElements } = window;

/**
 * Try to make HTML title attributes more accessible, using Popover API.
 *
 * @see https://codepen.io/nfreear/pen/JoXqver
 * @copyright ©Nick Freear.
 */
export default class FixTitleAttributes {
  #DEFAULTS = {
    target: document,
    titleSelector: '[title]',
    focusableSelector: 'a[ href ], button, [ tabindex = "0" ]',
    moreInfoText: 'More info on %s',
    customElementName: 'title-tip',
    visualLabel: '?', // Legacy.
    prefix: 'fix-title-attr-'
  };

  #opt = {};
  #elements = [];
  #filterInEl = [];
  #filterOutEl = [];
  #iframes = [];
  #createdEl = [];

  get customElementName () { return this.#opt.customElementName; }

  constructor (options = {}) {
    this.#opt = { ...this.#DEFAULTS, ...options };
  }

  defineElement (elementClass) {
    customElements.define(this.customElementName, elementClass);
  }

  run () {
    console.assert(this.#opt.target, 'opt.target is missing');
    console.assert(customElements.get(this.customElementName), 'custom element not defined');

    this.#elements = this.#opt.target.querySelectorAll(this.#opt.titleSelector);

    this.#filterInEl = [...this.#elements].filter(el => this.#filter(el));

    this.#createdEl = this.#filterInEl.map((el, idx) => this.#createCustomTip(el, idx));

    // this.#filterOutEl.forEach(el) // @TODO: aria-describedby?
  }

  #filter (elem) {
    if (this.#isIframe(elem)) {
      this.#iframes.push(elem);
      return false;
    }

    if (this.#isAncestorFocusable(elem)) {
      this.#filterOutEl.push(elem);
      return false;
    }

    return true;
  }

  // Title is OK on <iframe>.
  #isIframe (el) { return (el.tagName === 'IFRAME'); }

  #isAncestorFocusable (el) {
    const focusable = el.closest(this.#opt.focusableSelector);

    if (focusable === el) { return false; }

    // console.debug('isAncestorFocusable?', !!focusable, el, focusable);
    return focusable;
  }

  #createCustomTip (element, idx) {
    const tipElem = document.createElement(this.#opt.customElementName);
    console.assert(typeof tipElem.buttonText === 'string', 'missing buttonText setter');

    tipElem.buttonText = this.#opt.moreInfoText.replace('%s', element.textContent);
    tipElem.dataset.tag = element.tagName.toLowerCase();
    tipElem.dataset.idx = idx;
    tipElem.textContent = element.title;
    tipElem.id = this.#getId(idx);

    element.setAttribute('aria-describedby', this.#getId(idx));

    element.after(tipElem);

    return tipElem;
  }

  #getId (idx) { return `${this.#opt.prefix}${idx}`; }

  #createPopoverLegacy (element, idx) {
    const prefix = this.#opt.prefix;
    const button = document.createElement('button');
    const tip = document.createElement('div');
    button.textContent = this.#opt.visualLabel;
    button.setAttribute('aria-label', this.#opt.moreInfoText.replace('%s', element.textContent));
    button.setAttribute('popovertarget', this.#getId(idx));
    button.classList.add(`${prefix}button`);
    tip.classList.add(`${prefix}tip`);
    tip.textContent = element.getAttribute('title');
    tip.id = this.#getId(idx);
    tip.setAttribute('popover', '');
    element.after(button, tip);

    element.setAttribute('aria-describedby', this.#getId(idx));

    return { button, tip };
  }
}
