import FixTitleAttributes from './src/FixTitleAttributes.js';
import TitleTipElement from './src/TitleTipElement.js';

function fixTitleAttributes (options) {
  const fix = new FixTitleAttributes({
    titleSelector: 'main [ title ]'
  });

  fix.defineElement(TitleTipElement);
  const result = fix.run();

  console.debug('fix-title-attr:', fix);
  return result;
}

export { FixTitleAttributes, TitleTipElement };

export default fixTitleAttributes;
