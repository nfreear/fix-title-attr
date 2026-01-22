const { customElements } = window;

/**
 * Create a `<title-tip>` for Archive.org links, containing meta-data.
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
        id: 'archive-org',
        pattern: /\/web.(archive.org)\/web\/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})\/(http.+)/i,
        template: 'Page saved at Archive.org, on %s'
      },
      { // https://webarchive.nationalarchives.gov.uk/ukgwa/20100703000205/http://archive.cabinetoffice.gov.uk/e-government/resources/handbook/html/2-4.asp#2.4.4
        id: 'na-gov-uk',
        pattern: /\/(webarchive.nationalarchives.gov.uk)\/\w+\/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})\/(http.+)/i,
        template: 'Page saved at UK National Archive, on %s'
      }
    ]
  };

  #opt = {};
  #patterns = [];
  #elements = [];
  #createdElem = [];
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

    this.#createdElem = [...this.#elements].map((el, idx) => this.#tryCreateTip(el, idx));
    return this;
  }

  #tryCreateTip (element, idx) {
    const { href } = element;
    let tipElem;

    this.#patterns.forEach(({ pattern, template, id }) => {
      const M = href.match(pattern);
      if (M) {
        const data = this.#getRegexData(M, id);
        const text = template.replace('%s', data.date);

        tipElem = this.#createArchiveTip(element, text, idx);
        tipElem.dataset.archiveId = id;
        tipElem.dataset.archiveDate = data.dateIso;
        tipElem.metaData = data;

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
    tipElem.dataset.archiveIndex = idx;
    tipElem.textContent = text;

    element.after(tipElem);
    element.dataset.archiveTip = true;

    return tipElem;
  }

  #getRegexData (M, _id) {
    const D = {
      _id,
      host: M[1],
      year: M[2],
      month: M[3],
      day: M[4],
      hour: M[5],
      minute: M[6],
      second: M[7],
      url: M[8],
      urlObj: null,
      dateObj: null,
      date: null,
      dateIso: null
    };
    D.dateIso = `${D.year}-${D.month}-${D.day}T${D.hour}:${D.minute}:${D.second}Z`;
    const unixTS = Date.parse(D.dateIso);
    D.dateObj = new Date(unixTS);
    D.date = D.dateObj.toString().replace(/\((Greenwich|British) [\w ]+\)/, '');
    D.urlObj = new URL(D.url);
    return D;
  }
}

export function fixArchiveLinks (elementClass, options = {}) {
  const worker = new FixArchiveLinks(options);

  if (elementClass) {
    worker.defineElement(elementClass);
  }
  return worker.run();
}

export default fixArchiveLinks;
