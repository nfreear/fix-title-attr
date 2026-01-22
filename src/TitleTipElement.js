const { HTMLElement, getComputedStyle } = window;

/**
 * Custom element to encapsulate trigger <button> and popover tooltip.
 * Allows use of CSS anchor positioning.
 *
 * @customElement title-tip
 * @copyright ©Nick Freear.
 */
export default class TitleTipElement extends HTMLElement {
  #buttonText = 'More info';
  #metaData;

  set buttonText (text) { this.#buttonText = text; }
  get buttonText () { return this.#buttonText; }

  set metaData (data) { this.#metaData = data; }
  get metaData () { return this.#metaData; }

  // Multiplier: 0.36 for Times New Roman; 0.42 for Arial; 0.48 for Verdana font.
  get #defaultWidthMultipler () { return 0.44; }

  get #widthMultiplierProp () {
    const style = getComputedStyle(this);
    return style.getPropertyValue('--fix-title-width-multiplier');
  }

  get #characterCount () { return this.textContent.length; }

  connectedCallback () {
    const rootElem = this.attachShadow({ mode: 'open' });
    const { button, tip, style } = this.#createElements();

    rootElem.appendChild(button);
    rootElem.appendChild(tip);
    rootElem.appendChild(style);

    // console.debug('<title-tip>', [this]);
  }

  #createElements () {
    const id = 'my-tip';
    const button = document.createElement('button');
    const tip = document.createElement('div');
    const arrowEl = document.createElement('div');
    const slotEl = document.createElement('slot');
    const style = document.createElement('style');

    button.setAttribute('part', 'button');
    button.setAttribute('aria-label', this.buttonText);
    button.setAttribute('popovertarget', id);
    button.setAttribute('aria-describedby', id);
    button.textContent = ''; // Was: '?'

    tip.id = id;
    tip.setAttribute('part', 'tip');
    tip.setAttribute('popover', '');
    tip.appendChild(slotEl);
    tip.appendChild(arrowEl);

    arrowEl.setAttribute('part', 'arrow');

    style.textContent = this.#stylesheet;

    return { button, tip, style };
  }

  get #stylesheet () {
    return `
  @supports (position-anchor: --my-name) {
    button {
      anchor-name: --my-tip;

      &::after {
        content: '?';
      }
    }

    [ popover ] {
      margin-bottom: 2px;
      position-anchor: --my-tip;
      position: fixed;
      position-area: top center;
    }
  }

  [ popover ] {
    width: calc(${this.#characterCount} * var(--fix-title-width-multiplier, ${this.#defaultWidthMultipler}rem)); /* = ${this.#calculateWidthRem}rem */
  }
    `;
  }

  get #calculateWidthRem () {
    return this.#characterCount * parseFloat(this.#widthMultiplierProp);
  }
}
