import FixTitleAttributes from '../src/FixTitleAttributes.js';

const fix = new FixTitleAttributes({
  titleSelector: 'main [ title ]'
});
fix.run();

console.debug('fix:', fix);
