---
id: advanced-topics-inline-styles
title: Complex Inline Styles(复杂的内联样式)
---

Within your editor, you may wish to provide a wide variety of inline style
behavior that goes well beyond the bold/italic/underline basics. For instance,
you may want to support variety with color, font families, font sizes, and more.
Further, your desired styles may overlap or be mutually exclusive.

> 在编辑器中,你可能需要各种各样的内联样式行为,这些行为远远超出了基本的 bold/italic/underline 样式要求。例如,你可能想要编辑器支持字体颜色,字体类型,字体大小等等各种样式.此外，您想要的样式可能重叠或相互排斥。

The [Rich Editor](http://github.com/facebook/draft-js/tree/master/examples/draft-0-10-0/rich) and
[Colorful Editor](http://github.com/facebook/draft-js/tree/master/examples/draft-0-10-0/color)
examples demonstrate complex inline style behavior in action.

> [Rich Editor](http://github.com/facebook/draft-js/tree/master/examples/draft-0-10-0/rich) 和 [Colorful Editor](http://github.com/facebook/draft-js/tree/master/examples/draft-0-10-0/color) 示例演示了复杂的行内样式行为。

## Model

Within the Draft model, inline styles are represented at the character level,
using an immutable `OrderedSet` to define the list of styles to be applied to
each character. These styles are identified by string. (See [CharacterMetadata](/docs/api-reference-character-metadata)
for details.)

> 在 Draft 的 model 中,内联样式用字符级别标识，使用不可变的`OrderedSet`对象类型来定义要应用于每个字符的样式列表.这些样式由字符串标识.(具体可见[CharacterMetadata](/docs/api-reference-character-metadata))。

For example, consider the text "Hello **world**". The first six characters of
the string are represented by the empty set, `OrderedSet()`. The final five
characters are represented by `OrderedSet.of('BOLD')`. For convenience, we can
think of these `OrderedSet` objects as arrays, though in reality we aggressively
reuse identical immutable objects.

> 例如,考虑这个"Hello **world**"文本.字符串的前六个字符由空集`OrderedSet()`来标识.最后五个字符由`OrderedSet.of('BOLD')`来表示.为了方便起见，我们可以将这些`OrderedSet`对象作为数组看待,尽管在现实中我们会大量服用相同的 immutable 对象.

In essence, our styles are:

> 在本质上，我们的样式是这样的:

```js
[
  [], // H
  [], // e
  // ...
  ['BOLD'], // w
  ['BOLD'], // o
  // etc.
];
```

## Overlapping Styles

Now let's say that we wish to make the middle range of characters italic as well:
He*llo* ***wo*rld**. This operation can be performed via the
[Modifier](/docs/api-reference-modifier) API.

> 现在，我们希望将字符串的中间部分也设置为斜体(italic):He*llo* ***wo*rld**.这个操作可以通过[Modifier](/docs/api-reference-modifier) API 来实现。

The end result will accommodate the overlap by including `'ITALIC'` in the
relevant `OrderedSet` objects as well.

> 最终的结果将通过在相关的`OrderedSet`对象中包含`'ITALIC'`字符串来适应样式上的重叠.

```js
[
  [], // H
  [], // e
  ['ITALIC'], // l
  // ...
  ['BOLD', 'ITALIC'], // w
  ['BOLD', 'ITALIC'], // o
  ['BOLD'], // r
  // etc.
];
```

When determining how to render inline-styled text, Draft will identify
contiguous ranges of identically styled characters and render those characters
together in styled `span` nodes.

> 当确定如何渲染内联样式的文本,Draft 将识别具有相同样式的字符的连续范围,并将这些字符一起渲染在具有样式的`span`节点中。

## Mapping a style string to CSS

By default, `Editor` provides support for a basic list of inline styles:
`'BOLD'`, `'ITALIC'`, `'UNDERLINE'`, and `'CODE'`. These are mapped to plain CSS
style objects, which are used to apply styles to the relevant ranges.

> 默认情况下,Editor 提供了一个基础的内联样式列表: `'BOLD'`, `'ITALIC'`, `'UNDERLINE'`, 和 `'CODE'`。它们被映射到普通的 CSS 样式对象上，CSS 样式对象用于将样式应用到相关字符范围上。

For your editor, you may define custom style strings to include with these
defaults, or you may override the default style objects for the basic styles.

> 对于您的编辑器，您可以自定义样式字符串来包含这些默认值，或者您可以覆盖基本样式字符串的默认样式对象。

Within your `Editor` use case, you may provide the `customStyleMap` prop
to define your style objects. (See
[Colorful Editor](http://github.com/facebook/draft-js/tree/master/examples/draft-0-10-0/color)
for a live example.)

> 在编辑器用例中,你可以提供一个`customStyleMap` 的 prop 属性去定义你的样式对象。(看 [Colorful Editor](http://github.com/facebook/draft-js/tree/master/examples/draft-0-10-0/color) 一个可运行的例子)

For example, you may want to add a `'STRIKETHROUGH'` style. To do so, define a
custom style map:

> 例如，您可能想要添加一个自定义的`'STRIKETHROUGH'`样式。为此，定义一个自定义样式映射:

```js
import {Editor} from 'draft-js';

const styleMap = {
  'STRIKETHROUGH': {
    textDecoration: 'line-through',
  },
};

class MyEditor extends React.Component {
  // ...
  render() {
    return (
      <Editor
        customStyleMap={styleMap}
        editorState={this.state.editorState}
        ...
      />
    );
  }
}
```

When rendered, the `textDecoration: line-through` style will be applied to all
character ranges with the `STRIKETHROUGH` style.

> 当渲染的时候,`textDecoration: line-through` 这个 css 样式将被用于所有具有`STRIKETHROUGH`样式字符的字符范围中.
