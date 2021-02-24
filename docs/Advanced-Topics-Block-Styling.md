---
id: advanced-topics-block-styling
title: Block Styling(块级样式)
---

Within `Editor`, some block types are given default CSS styles to limit the amount
of basic configuration required to get engineers up and running with custom
editors.

> 在`Editor`组件中,一些块类型会被赋予默认的样式,这是为了减少开发者工作量做的必要的基础配置.

By defining a `blockStyleFn` prop function for an `Editor`, it is possible
to specify classes that should be applied to blocks at render time.

> 通过在 `Editor` 组件上 声明 `blockStyleFn` prop 函数，可以在渲染的时候为块类型元素加上指定的 class 样式名。

## DraftStyleDefault.css

The Draft library includes default block CSS styles within
[DraftStyleDefault.css](https://github.com/facebook/draft-js/blob/master/src/component/utils/DraftStyleDefault.css). _(Note that the annotations on the CSS class names are
artifacts of Facebook's internal CSS module management system.)_

> 在[DraftStyleDefault.css](https://github.com/facebook/draft-js/blob/master/src/component/utils/DraftStyleDefault.css)中,库包含了默认的块类型元素的 CSS 样式。(请注意，CSS 类名上的注释是 Facebook 内部 CSS 模块管理系统的产物)

These CSS rules are largely devoted to providing default styles for list items,
without which callers would be responsible for managing their own default list
styles.

> 这些 CSS 规则主要用于为列表项提供默认样式，没有这些样式，开发者将需要管理自己的默认列表样式。

## blockStyleFn

The `blockStyleFn` prop on `Editor` allows you to define CSS classes to
style blocks at render time. For instance, you may wish to style `'blockquote'`
type blocks with fancy italic text.

> `Editor`组件上的 `blockStyleFn` prop 函数，允许你去块类型元素的 class 样式名在渲染的时候。例如，您可能希望将`'blockquote'`类型的块元素样式设置为花里胡哨的斜体文本。

```js
function myBlockStyleFn(contentBlock) {
  const type = contentBlock.getType();
  if (type === 'blockquote') {
    return 'superFancyBlockquote';
  }
}

// Then...
import {Editor} from 'draft-js';
class EditorWithFancyBlockquotes extends React.Component {
  render() {
    return <Editor ... blockStyleFn={myBlockStyleFn} />;
  }
}
```

Then, in your own CSS:

> 然后在你自己的 CSS 文件中这样定义:

```css
.superFancyBlockquote {
  color: #999;
  font-family: 'Hoefler Text', Georgia, serif;
  font-style: italic;
  text-align: center;
}
```
