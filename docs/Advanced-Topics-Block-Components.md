---
id: advanced-topics-block-components
title: Custom Block Components(自定义块组件)
---

Draft is designed to solve problems for straightforward rich text interfaces
like comments and chat messages, but it also powers richer editor experiences
like [Facebook Notes](https://www.facebook.com/notes/).

> Draft 被设计出来就是为了解决直接的富文本界面问题(比如评论和聊天消息),但它也支持更丰富的编辑体验(像 [Facebook Notes](https://www.facebook.com/notes/))

Users can embed images within their Notes, either loading from their existing
Facebook photos or by uploading new images from the desktop. To that end,
the Draft framework supports custom rendering at the block level, to render
content like rich media in place of plain text.

> 用户需要在他们的笔记中嵌入图片,不管是从他们现有的 Facebook 照片中选择并加载，还是是从桌面中上传新的图片。为此,Draft 框架支持块元素级别的自定义渲染,以渲染富媒体等内容来代替文本显示.

The [TeX editor](https://github.com/facebook/draft-js/tree/master/examples/draft-0-10-0/tex)
in the Draft repository provides a live example of custom block rendering, with
TeX syntax translated on the fly into editable embedded formula rendering via the
[KaTeX library](https://khan.github.io/KaTeX/).

> 在 Draft 的 git 存储库中提供了一个自定义块元素渲染的可运行的例子[TeX editor](https://github.com/facebook/draft-js/tree/master/examples/draft-0-10-0/tex),其中 TeX 语法通过[KaTeX library](https://khan.github.io/KaTeX/)实时转换为可编辑的嵌入式公式块元素渲染。

A [media example](https://github.com/facebook/draft-js/tree/master/examples/draft-0-10-0/media) is also
available, which showcases custom block rendering of audio, image, and video.

> 还有一个[media example](https://github.com/facebook/draft-js/tree/master/examples/draft-0-10-0/media)可以获取,它展示了音频、图像和视频的自定义块渲染。

By using a custom block renderer, it is possible to introduce complex rich
interactions within the frame of your editor.

> 通过使用自定义块元素渲染器,可以在编辑器的框架内引入复杂的富文本交互。

## Custom Block Components

Within the `Editor` component, one may specify the `blockRendererFn` prop.
This prop function allows a higher-level component to define custom React
rendering for `ContentBlock` objects, based on block type, text, or other
criteria.

> 在 `Editor` 组件中,可以指定 `blockRendererFn` 属性.这个 prop 函数允许一个更高级别的组件来作为基于块类型元素,文本或者其他条件的 ContentBlock 对象的自定义 React 渲染。

For instance, we may wish to render `ContentBlock` objects of type `'atomic'`
using a custom `MediaComponent`.

> 例如,我们可能希望使用一个自定义的`MediaComponent`组件来渲染块类型为`'atomic'`的`ContentBlock`对象.

```js
function myBlockRenderer(contentBlock) {
  const type = contentBlock.getType();
  if (type === 'atomic') {
    return {
      component: MediaComponent,
      editable: false,
      props: {
        foo: 'bar',
      },
    };
  }
}

// Then...
import {Editor} from 'draft-js';
class EditorWithMedia extends React.Component {
  ...
  render() {
    return <Editor ... blockRendererFn={myBlockRenderer} />;
  }
}
```

If no custom renderer object is returned by the `blockRendererFn` function,
`Editor` will render the default `EditorBlock` text block component.

> 如果`blockRendererFn`函数没有返回自定义渲染器对象，编辑器将渲染默认的`EditorBlock`文本块元素组件。

The `component` property defines the component to be used, while the optional
`props` object includes props that will be passed through to the rendered
custom component via the `props.blockProps` sub property object. In addition,
the optional `editable` property determines whether the custom component is
`contentEditable`.

> `component` 属性叮咬要使用的组件，而可选传递的 props 对象，则是通过 `props.blockProps`子属性对象传递给渲染的自定义组件的 props 上。此外，这个可选的`editable`属性决定了自定义组件是否是`contentEditable`。

It is strongly recommended that you use `editable: false` if your custom
component will not contain text.

> 强烈建议您使用`editable: false`(如果您的自定义组件不包含文本)。

If your component contains text as provided by your `ContentState`, your custom
component should compose an `EditorBlock` component. This will allow the
Draft framework to properly maintain cursor behavior within your contents.

> 如果你的组件包含由你的`ContentState`提供的文本,您的自定义组件应构成一个`EditorBlock`组件。这将允许 Draft 框架在富文本内容中正确地维护光标行为。

By defining this function within the context of a higher-level component,
the props for this custom component may be bound to that component, allowing
instance methods for custom component props.

> 通过在更高级别的组件的 context 中定义此函数，可以将此定制组件的 props 绑定到该组件上，从而允许使用定制组件 props 的实例方法。

## Defining custom block components

Within `MediaComponent`, the most likely use case is that you will want to
retrieve entity metadata to render your custom block. You may apply an entity
key to the text within a `'atomic'` block during `EditorState` management,
then retrieve the metadata for that key in your custom component `render()`
code.

> 针对`MediaComponent`，最有可能的使用案例是你想要检索实体的 metadata 来渲染你的自定义块元素.在`EditorState`管理期间,你可以应用一个实体 key 在一个`'atomic'`块元素中的文本上,然后在自定义组件的`render()`代码中检索该键的元数据。

```js
class MediaComponent extends React.Component {
  render() {
    const {block, contentState} = this.props;
    const {foo} = this.props.blockProps;
    const data = contentState.getEntity(block.getEntityAt(0)).getData();
    // Return a <figure> or some other content using this data.
  }
}
```

The `ContentBlock` object and the `ContentState` record are made available
within the custom component, along with the props defined at the top level. By
extracting entity information from the `ContentBlock` and the `Entity` map, you
can obtain the metadata required to render your custom component.

> `ContentBlock` 对象和 `ContentState` record 对象能够在自定义的组件上被访问到，通过自定义组件的顶级的 props 定义.并且通过从`ContentBlock`对象和`Entity`映射中提取实体信息,你能够获取到渲染你的自定义组件所需要的元数据.

_Retrieving the entity from the block is admittedly a bit of an awkward API,
and is worth revisiting._

> 从块元素中检索实体确实是一种笨拙的 API，值得再次探讨。

## Recommendations and other notes

If your custom block renderer requires mouse interaction, it is often wise
to temporarily set your `Editor` to `readOnly={true}` during this
interaction. In this way, the user does not trigger any selection changes within
the editor while interacting with the custom block. This should not be a problem
with respect to editor behavior, since interacting with your custom block
component is most likely mutually exclusive from text changes within the editor.

> 如果你的自定义块渲染器包含了鼠标交互,通常明智的做法是在此交互期间将编辑器临时设置为 readOnly={true}.通过这种方式，用户在与自定义块交互时不会在编辑器中触发任何选择更改。对于编辑器行为而言，这应该不是问题，因为与自定义块组件交互很可能与编辑器中的文本更改相互排斥。

The recommendation above is especially important for custom block renderers
that involve text input, like the TeX editor example.

> 上面的建议对于涉及文本输入的自定义块渲染器尤其重要，比如 TeX 编辑器示例。

It is also worth noting that within the Facebook Notes editor, we have not
tried to perform any specific SelectionState rendering or management on embedded
media, such as rendering a highlight on an embedded photo when selecting it.
This is in part because of the rich interaction provided on the media
itself, with resize handles and other controls exposed to mouse behavior.

> 同样值得注意的是，在 Facebook Notes 编辑器中，我们没有尝试在嵌入式媒体上执行任何特定的 SelectionState 渲染或管理行为，例如在选择嵌入式照片时呈现突出显示。这在一定程度上是因为媒体本身提供了丰富的交互功能，可以调整大小和其他暴露于鼠标行为的控制操作.

Since an engineer using Draft has full awareness of the selection state
of the editor and full control over native Selection APIs, it would be possible
to build selection behavior on static embedded media if desired. So far, though,
we have not tried to solve this at Facebook, so we have not packaged solutions
for this use case into the Draft project at this time.

> 由于使用 Draft 的工程师完全了解编辑器的选择状态并完全掌控原生的 Selection API，因此，如果需要，可以在静态嵌入式媒体上构建选择行为。 不过，到目前为止，我们还没有尝试在 Facebook 上解决此问题，因此我们目前尚未将针对该用例的解决方案打包到 Draft 项目中.
