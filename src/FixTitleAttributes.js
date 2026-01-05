/**
 * Try to make title attributes more accessible.
 * @see https://codepen.io/nfreear/pen/JoXqver
 * @copyright ©Nick Freear.
 */
export default class FixTitleAttributes {
  #target = document;
  #titleSelector = 'main [title], [role = main] [title]';
  #focusableSelector = 'a[ href ], button, [ tabindex="0" ]';
  #moreInfoText = 'More info on %s';
  #visualLabel = '?';
  #prefix = 'title-fix-';
  #elements = [];
  #filterInEl = [];
  #filterOutEl = [];
  #iframes = [];

  constructor(titleSelector) {
    if (titleSelector) { // Check validity?
      this.#titleSelector = titleSelector;
    }
  }

  run () {
    this.#elements = this.#target.querySelectorAll(this.#titleSelector);

    this.#filterInEl = [...this.#elements].filter(el => this.#filter(el));

    this.#filterInEl.forEach((el, idx) => this.#createPopover(el, idx));

    // this.#filterOutEl.forEach(el) // @TODO: aria-describedby?
  }

  #filter (elem) {
    if (this.#isIframe(elem)) {
      this.#iframes.push(elem)
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
    const focusable = el.closest(this.#focusableSelector);

    if (focusable === el) { return false; }

    // console.debug('isAncestorFocusable?', !!focusable, el, focusable);
    return focusable;
  }

  #createPopover (el, idx) {
    const id = `${this.#prefix}${idx}`;
    const parentEl = el.parentElement;
    const buttonEl = document.createElement('button');
    const tipEl = document.createElement('div');
    buttonEl.textContent = this.#visualLabel;
    buttonEl.setAttribute('aria-label', this.#moreInfoText.replace('%s', el.textContent)); //`More info on ${el.textContent}`);
    buttonEl.setAttribute('popovertarget', id);
    buttonEl.classList.add(`${this.#prefix}button`);
    tipEl.classList.add(`${this.#prefix}tip`);
    tipEl.textContent = el.getAttribute('title');
    tipEl.id = id;
    tipEl.setAttribute('popover', '');
    el.after(buttonEl, tipEl);
    // parentEl.appendChild(buttonEl);
    // parentEl.appendChild(tipEl);

    el.setAttribute('aria-describedby', id);
  }
}
