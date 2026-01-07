const { HTMLElement } = window;

/**
 * Custom element to encapsulate trigger <button> and popover tooltip.
 * Allows use of CSS anchor positioning.
 *
 * @customElement title-tip
 * @copyright ©Nick Freear.
 */
export default class TitleTipElement extends HTMLElement {
  #buttonText = 'More info';

  set buttonText (text) { this.#buttonText = text; }

  get buttonText () { return this.#buttonText; }

  // Multiplier: 0.36 for Times New Roman; 0.42 for Arial; 0.48 for Verdana font.
  get widthMultipler () { return 0.42; }

  get characterCount () { return this.textContent.length; }

  connectedCallback () {
    const rootElem = this.attachShadow({ mode: 'open' });
    const { button, tip, style } = this.#createElements();

    rootElem.appendChild(button);
    rootElem.appendChild(tip);
    rootElem.appendChild(style);

    console.debug('<title-tip>', [this]);
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
    width: calc(${this.characterCount} * var(--fix-title-width-multiplier, ${this.widthMultipler}rem)); /* = ${this.calculateWidthRem}rem */

    /* max-width: 13rem;
    min-width: 8rem; */
  }
    `;
  }

  get calculateWidthRem () {
    return this.characterCount * this.widthMultipler;
  }
}
