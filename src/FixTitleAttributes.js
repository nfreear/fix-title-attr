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
    focusableSelector: 'a[ href ], button, [ tabindex="0" ]',
    moreInfoText: 'More info on %s',
    visualLabel: '?',
    prefix: 'title-fix-'
  };

  #opt = {};
  #elements = [];
  #filterInEl = [];
  #filterOutEl = [];
  #iframes = [];
  #createdEl = [];

  constructor (options = {}) {
    this.#opt = { ...this.#DEFAULTS, ...options };
  }

  run () {
    this.#elements = this.#opt.target.querySelectorAll(this.#opt.titleSelector);

    this.#filterInEl = [...this.#elements].filter(el => this.#filter(el));

    this.#createdEl = this.#filterInEl.map((el, idx) => this.#createPopover(el, idx));

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

  #createPopover (element, idx) {
    const prefix = this.#opt.prefix;
    const id = `${prefix}${idx}`;
    const button = document.createElement('button');
    const tip = document.createElement('div');
    button.textContent = this.#opt.visualLabel;
    button.setAttribute('aria-label', this.#opt.moreInfoText.replace('%s', element.textContent));
    button.setAttribute('popovertarget', id);
    button.classList.add(`${prefix}button`);
    tip.classList.add(`${prefix}tip`);
    tip.textContent = element.getAttribute('title');
    tip.id = id;
    tip.setAttribute('popover', '');
    element.after(button, tip);

    element.setAttribute('aria-describedby', id);

    return { button, tip };
  }
}
