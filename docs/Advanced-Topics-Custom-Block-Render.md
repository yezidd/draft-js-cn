---
id: advanced-topics-custom-block-render-map
title: Custom Block Rendering(自定义块渲染)
---

This article discusses how to customize Draft default block rendering.
The block rendering is used to define supported block types and their respective
renderers, as well as converting pasted content to known Draft block types.

> 本文讨论如何自定义 Draft 默认的块元素的渲染.自定义块元素渲染被用来定义支持的块类型元素以及它们各自对应的渲染器，以及将粘贴的内容转化为已知的 Draft 块类型元素。

When pasting content, or when calling
[convertFromHTML](/docs/api-reference-data-conversion#convertfromhtml),
Draft will convert pasted content to the respective block rendering type
by matching the Draft block render map with the matched tag.

> 当粘贴内容时或者调用[convertFromHTML](/docs/api-reference-data-conversion#convertfromhtml)的时候，Draft 会转换粘贴的内容成相应的块渲染类型元素,通过将 Draft 块渲染元素与对应匹配的 HTML 标签进行映射.

## Draft default block render map

| HTML element    | Draft block type                          |
| --------------- | ----------------------------------------- |
| `<h1/>`         | header-one                                |
| `<h2/>`         | header-two                                |
| `<h3/>`         | header-three                              |
| `<h4/>`         | header-four                               |
| `<h5/>`         | header-five                               |
| `<h6/>`         | header-six                                |
| `<blockquote/>` | blockquote                                |
| `<pre/>`        | code-block                                |
| `<figure/>`     | atomic                                    |
| `<li/>`         | unordered-list-item,ordered-list-item\*\* |
| `<div/>`        | unstyled\*\*\*                            |

\*\* - Block type will be based on the parent `<ul/>` or `<ol/>`

> \*\* - 块类型会基于父元素 `<ul/>` 或者 `<ol/>`

\*\*\* - Any block that is not recognized by the block rendering mapping will be treated as unstyled

> \*\*\* - 任何一个不会被识别的块渲染元素会被认为是 unstyled

## Configuring block render map

Draft's default block render map can be overwritten by passing an
[Immutable Map](https://web.archive.org/web/20150623131347/http://facebook.github.io:80/immutable-js/docs/#/Map) to
the editor blockRender props.

> 可以通过传递 [Immutable Map](https://web.archive.org/web/20150623131347/http://facebook.github.io:80/immutable-js/docs/#/Map) 给编辑器 blockRenderMap prop 函数来覆盖掉默认的块元素渲染的映射。

_example of overwriting default block render map:_

> 覆盖默认块渲染映射的例子:

```js
// The example below deliberately only allows
// 'heading-two' as the only valid block type and
// updates the unstyled element to also become a h2.
// 下面这个例子只允许'head-two'作为唯一有效的块类型
// 并且更新所有的unstyled块类型元素都转化成h2
const blockRenderMap = Immutable.Map({
  'header-two': {
    element: 'h2'
  },
  'unstyled': {
    element: 'h2'
  }
});

class RichEditor extends React.Component {
  render() {
    return (
      <Editor
        ...
        blockRenderMap={blockRenderMap}
      />
    );
  }
}
```

There are cases where instead of overwriting the defaults, we only want to add new block types.
This can be done by using the DefaultDraftBlockRenderMap reference to create a new blockRenderMap

> 下面一个例子,与重写默认的块渲染元素映射不同,我们仅仅是想添加一个新的块类型元素.我们可以使用 DefaultDraftBlockRenderMap 的 API 创建一个新的 blockRenderMap。

_example of extending default block render map:_

> 扩展默认块渲染元素映射的例子:

```js
const blockRenderMap = Immutable.Map({
  'section': {
    element: 'section'
  }
});

// Include 'paragraph' as a valid block and updated the unstyled element but
// keep support for other draft default block types
// 'paragraph' 会被作为一个有效的块元素并更新了 unstyled 元素的样式，然而其他的默认块类型依然会被支持
const extendedBlockRenderMap = Draft.DefaultDraftBlockRenderMap.merge(blockRenderMap);

class RichEditor extends React.Component {
  render() {
    return (
      <Editor
        ...
        blockRenderMap={extendedBlockRenderMap}
      />
    );
  }
}
```

When Draft parses pasted HTML, it maps from HTML elements back into
Draft block types. If you want to specify other HTML elements that map to a
particular block type, you can add the array `aliasedElements` to the block config.

> 当 Draft 解析粘贴进来的 HTML 的时候，它将 HTML 元素映射回 Draft 块类型元素.如果你想指定其他的 HTML 元素变成一个特定的块类型元素,你可以在块配置中加一个`aliasedElements`的数据，其值为数组类型.

_example of unstyled block type alias usage:_

> unstyled 块类型 alias 用法:

```js
'unstyled': {
  element: 'div',
  aliasedElements: ['p'],
}
```

## Custom block wrappers

By default, the html element is used to wrap block types. However, a react component
can also be provided to the _blockRenderMap_ to wrap the EditorBlock.

> 默认情况下,html 节点用来包装块类型元素。然而,也可以向 _blockRenderMap_ 提供一个 react 组件来包装 Editor 块元素。

During pasting, or when calling
[convertFromHTML](/docs/api-reference-data-conversion#convertfromhtml),
the html will be scanned for matching tag elements. A wrapper will be used when there is a definition for
it on the _blockRenderMap_ to wrap that particular block type. For example:

> 在粘贴 HTML 过程中，或者在调用[convertFromHTML](/docs/api-reference-data-conversion#convertfromhtml)时，html 将被扫描以查找匹配的标记元素。当在*blockRenderMap*上有定义时，将使用定义的包装器来包装特定的块类型类型.

Draft uses wrappers to wrap `<li/>` inside either `<ol/>` or `<ul/>`, but wrappers can also be used
to wrap any other custom block type.

> Draft 使用包装器将 `<li/>` 包装在`<ol/>`或`<ul/>`中，但是包装器也可以用于包装任何其他自定义块类型元素。

_example of extending default block render map to use a react component for a custom block:_

> 用一个针对自定义块元素的 React 组件拓展默认的块渲染映射的例子:

```js
class MyCustomBlock extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='MyCustomBlock'>
        {/* here, this.props.children contains a <section> container, as that was the matching element */}
        {/* 在这里，this.props.children包含一个<section>容器，因为它是匹配元素  */}
        {this.props.children}
      </div>
    );
  }
}

const blockRenderMap = Immutable.Map({
  'MyCustomBlock': {
    // element is used during paste or html conversion to auto match your component;
    // it is also retained as part of this.props.children and not stripped out
    //元素在粘贴或html转换期间用于自动匹配您的组件；
    //它也保留为this.props.children的一部分，不会被剥离
    element: 'section',
    wrapper: <MyCustomBlock />,
  }
});

// keep support for other draft default block types and add our myCustomBlock type
// //保持对其他draft默认块类型元素的支持，并添加我们的`myCustomBlock`类型
const extendedBlockRenderMap = Draft.DefaultDraftBlockRenderMap.merge(blockRenderMap);

class RichEditor extends React.Component {
  ...
  render() {
    return (
      <Editor
        ...
        blockRenderMap={extendedBlockRenderMap}
      />
    );
  }
}
```
