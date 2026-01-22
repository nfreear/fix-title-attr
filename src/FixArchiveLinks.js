const { customElements } = window;

/**
 *
 * @see https://codepen.io/nfreear/pen/VYjWOYO,
 */
export class FixArchiveLinks {
  #DEFAULTS = {
    linkSelector: 'a[ href *= archive ]',
    target: document,
    customElementName: 'title-tip',
    moreInfoText: 'More info on %s',
    patterns: [
      {
        pattern: /\/web.(archive.org)\/web\/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})\//i,
        template: 'Page saved at Archive.org, on %s'
      }
    ]
  };

  #opt = {};
  #patterns = [];
  #elements = [];
  #createdEl = [];
  #metaData = [];

  get customElementName () { return this.#opt.customElementName; }
  get #moreInfoText () { return this.#opt.moreInfoText; }

  constructor (options = {}) {
    this.#opt = { ...this.#DEFAULTS, ...options };
    this.#patterns = [...this.#DEFAULTS.patterns, ...(options.patterns ?? [])];
  }

  defineElement (elementClass) {
    customElements.define(this.customElementName, elementClass);
  }

  run () {
    console.assert(this.#opt.target, 'opt.target is missing');
    console.assert(customElements.get(this.customElementName), 'custom element not defined');

    this.#elements = this.#opt.target.querySelectorAll(this.#opt.linkSelector);

    this.#createdEl = [...this.#elements].map((el, idx) => this.#tryCreateTip(el, idx));
  }

  #tryCreateTip (element, idx) {
    const { href } = element;
    let tipElem;

    this.#patterns.forEach(({ pattern, template }) => {
      const M = href.match(pattern);
      if (M) {
        const data = this.#getRegexData(M);
        const text = template.replace('%s', data.date);
        console.debug('Link:', text, href);

        tipElem = this.#createArchiveTip(element, text, idx);
        tipElem.dataset.archiveHost = data.host;
        tipElem.dataset.archiveDate = data.iso;

        this.#metaData.push(data);
      }
    });

    return tipElem;
  }

  #createArchiveTip (element, text, idx) {
    const tipElem = document.createElement(this.customElementName);
    console.assert(typeof tipElem.buttonText === 'string', 'missing buttonText setter');

    tipElem.buttonText = this.#moreInfoText.replace('%s', element.textContent);
    tipElem.dataset.text = element.textContent;
    tipElem.dataset.tag = element.tagName.toLowerCase();
    tipElem.dataset.archiveIdx = idx;
    tipElem.textContent = text;
    // tipElem.id = this.#getId(idx);

    element.after(tipElem);

    return tipElem;
  }

  #getRegexData (M) {
    const D = {
      host: M[1],
      year: M[2],
      month: M[3],
      day: M[4],
      hour: M[5],
      minute: M[6],
      second: M[7],
      dateObj: null,
      date: null,
      iso: null
    };
    D.iso = `${D.year}-${D.month}-${D.day}T${D.hour}:${D.minute}:${D.second}Z`;
    const unix = Date.parse(D.iso);
    D.dateObj = new Date(unix);
    D.date = D.dateObj.toString().replace(/\(Greenwich [\w ]+\)/, '');
    return D;
  }
}

export function fixArchiveLinks (options = {}, elementClass) {
  const worker = new FixArchiveLinks(options);

  worker.defineElement(elementClass);
  worker.run();

  return worker;
}

export default fixArchiveLinks;
