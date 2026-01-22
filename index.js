import FixTitleAttributes from './src/FixTitleAttributes.js';
import TitleTipElement from './src/TitleTipElement.js';
import { fixArchiveLinks, FixArchiveLinks } from './src/fixArchiveLinks.js';

function fixTitleAttributes (options) {
  const fix = new FixTitleAttributes({
    titleSelector: 'main [ title ]'
  });

  fix.defineElement(TitleTipElement);
  const result = fix.run();

  console.debug('fix-title-attr:', fix);
  return result;
}

export {
  FixTitleAttributes, TitleTipElement, FixArchiveLinks, fixArchiveLinks
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

    fixTitleAttributes(options);
  });
}
