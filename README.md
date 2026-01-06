[![Lint][ci-badge]][ci]

# fix-title-attr #

Try to make HTML `title` attributes more accessible, using the [Popover API][].

Used in [Dive Into Accessibility][] archive ([repo][dia-repo]).

Suitable where you have legacy content.

## Why?

Using the `title` attribute in HTML can be thought of as an [anti-pattern][], as it actively excludes multiple groups of users, including keyboard users, mobile/ touch users, screen reader users (mostly) and so on.

### Further reading:

* [Accessibility concerns - title - Mozilla Developer Network][title-mdn]
* [Using the HTML title attribute – updated March 2020, by Steve Faulkner, TPGi][title-tpgi]
* [Tooltips & Toggletips, by Heydon Pickering, Inclusive Components (2017)][title-inc]
* [The Trials and Tribulations of the Title Attribute, by Scott O'Hara (2017)][title-24]

## Usage

For HTML like the following:
```html
<main>
  <a href="…" title="I'm a title attribute">Hello</a>
  <abbr title="hypertext markup language">HTML</abbr>
  …
</main>
```

Use JavaScript like this:

```js
import fixTitleAttributes from 'fix-title-attr';

fixTitleAttributes({
  titleSelector: 'main [ title ]'
});
```

You can vary the `titleSelector` option to suit your website. For example:

```js
fixTitleAttributes({
  titleSelector: '#main [title], .full-page-2 [title]' // …
});
```

## License

* License: [MIT][]

[mit]: https://nfreear.mit-license.org/#2026-
[ci]: https://github.com/nfreear/fix-title-attr/actions/workflows/node.js.yml
[ci-badge]: https://github.com/nfreear/fix-title-attr/actions/workflows/node.js.yml/badge.svg

[popover api]: https://developer.mozilla.org/en-US/docs/Web/API/Popover_API
[anchor positioning]: https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Anchor_positioning
[dive into accessibility]: http://nfreear.github.io/diveintoaccessibility/
[dia-repo]: https://github.com/nfreear/diveintoaccessibility

[title-mdn]: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/title#accessibility_concerns
[title-spec]: https://html.spec.whatwg.org/multipage/dom.html#the-title-attribute
[title-tpgi]: https://www.tpgi.com/using-the-html-title-attribute-updated/
[title-inc]: https://inclusive-components.design/tooltips-toggletips/
[title-24]: https://www.24a11y.com/2017/the-trials-and-tribulations-of-the-title-attribute/
[anti-pattern]: https://en.wikipedia.org/wiki/Anti-pattern
