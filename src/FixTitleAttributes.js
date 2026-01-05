/**
 * Try to make title attributes more accessible, using Popover API.
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

  constructor (options = {}) {
    this.#opt = { ...this.#DEFAULTS, ...options };
  }

  run () {
    this.#elements = this.#opt.target.querySelectorAll(this.#opt.titleSelector);

    this.#filterInEl = [...this.#elements].filter(el => this.#filter(el));

    this.#filterInEl.forEach((el, idx) => this.#createPopover(el, idx));

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

  #createPopover (el, idx) {
    const prefix = this.#opt.prefix;
    const id = `${prefix}${idx}`;
    const buttonEl = document.createElement('button');
    const tipEl = document.createElement('div');
    buttonEl.textContent = this.#opt.visualLabel;
    buttonEl.setAttribute('aria-label', this.#opt.moreInfoText.replace('%s', el.textContent));
    buttonEl.setAttribute('popovertarget', id);
    buttonEl.classList.add(`${prefix}button`);
    tipEl.classList.add(`${prefix}tip`);
    tipEl.textContent = el.getAttribute('title');
    tipEl.id = id;
    tipEl.setAttribute('popover', '');
    el.after(buttonEl, tipEl);

    el.setAttribute('aria-describedby', id);

    return { buttonEl, tipEl };
  }
}
