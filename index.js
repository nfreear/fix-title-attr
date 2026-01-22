import FixTitleAttributes from './src/FixTitleAttributes.js';
import TitleTipElement from './src/TitleTipElement.js';
import { fixArchiveLinks, FixArchiveLinks } from './src/FixArchiveLinks.js';

function fixTitleAttributes (elementClass, options = {}) {
  options = { ...{ titleSelector: 'main [ title ]' }, ...options };

  const fix = new FixTitleAttributes(options);

  if (elementClass) {
    fix.defineElement(elementClass);
  }
  const result = fix.run();

  console.debug('fix-title-attr:', fix);
  return result;
}

export {
  FixTitleAttributes, TitleTipElement, fixTitleAttributes,
  FixArchiveLinks, fixArchiveLinks
};

export default fixTitleAttributes;

// ------------------------------------

/**
 * Auto-run option.
 */

if (/run=(fix-title|true)/.test(import.meta.url)) {
  import('./src/importMapOpt.js').then(({ default: importMapOpt }) => {
    const options = importMapOpt('fixTitleAttr');

    console.debug('auto-run. Options:', options);

    fixTitleAttributes(TitleTipElement, options);
  });
}
