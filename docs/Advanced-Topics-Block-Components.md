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

For instance, we may wish to render `ContentBlock` objects of type `'atomic'`
using a custom `MediaComponent`.

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

The `component` property defines the component to be used, while the optional
`props` object includes props that will be passed through to the rendered
custom component via the `props.blockProps` sub property object. In addition,
the optional `editable` property determines whether the custom component is
`contentEditable`.

It is strongly recommended that you use `editable: false` if your custom
component will not contain text.

If your component contains text as provided by your `ContentState`, your custom
component should compose an `EditorBlock` component. This will allow the
Draft framework to properly maintain cursor behavior within your contents.

By defining this function within the context of a higher-level component,
the props for this custom component may be bound to that component, allowing
instance methods for custom component props.

## Defining custom block components

Within `MediaComponent`, the most likely use case is that you will want to
retrieve entity metadata to render your custom block. You may apply an entity
key to the text within a `'atomic'` block during `EditorState` management,
then retrieve the metadata for that key in your custom component `render()`
code.

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

_Retrieving the entity from the block is admittedly a bit of an awkward API,
and is worth revisiting._

## Recommendations and other notes

If your custom block renderer requires mouse interaction, it is often wise
to temporarily set your `Editor` to `readOnly={true}` during this
interaction. In this way, the user does not trigger any selection changes within
the editor while interacting with the custom block. This should not be a problem
with respect to editor behavior, since interacting with your custom block
component is most likely mutually exclusive from text changes within the editor.

The recommendation above is especially important for custom block renderers
that involve text input, like the TeX editor example.

It is also worth noting that within the Facebook Notes editor, we have not
tried to perform any specific SelectionState rendering or management on embedded
media, such as rendering a highlight on an embedded photo when selecting it.
This is in part because of the rich interaction provided on the media
itself, with resize handles and other controls exposed to mouse behavior.

Since an engineer using Draft has full awareness of the selection state
of the editor and full control over native Selection APIs, it would be possible
to build selection behavior on static embedded media if desired. So far, though,
we have not tried to solve this at Facebook, so we have not packaged solutions
for this use case into the Draft project at this time.
