---
id: api-reference-editor
title: Editor Component
---

This article discusses the API and props of the core controlled contentEditable
component itself, `Editor`. Props are defined within
[`DraftEditorProps`](https://github.com/facebook/draft-js/blob/master/src/component/base/DraftEditorProps.js).

> 本文讨论核心受控的contentEditable组件,Editor组件本身的API和props.Props定义看这里:[`DraftEditorProps`](https://github.com/facebook/draft-js/blob/master/src/component/base/DraftEditorProps.js)

## Props

## Basics

See [API Basics](/docs/quickstart-api-basics) for an introduction.

> 看[API Basics](/docs/quickstart-api-basics)的介绍.

### `editorState`

```js
editorState: EditorState;
```

The `EditorState` object to be rendered by the `Editor`.

> 用于 `Editor`渲染的`EditorState`对象.

### `onChange`

```js
onChange: (editorState: EditorState) => void
```

The `onChange` function to be executed by the `Editor` when edits and selection
changes occur.

> `Editor` 在当编辑和选择更改发生的时候，`onChange`就会被执行。

## Presentation (Optional)

### `placeholder`

```js
placeholder?: string
```

Optional placeholder string to display when the editor is empty.

> 当编辑器为空时显示的可选占位符字符串。

Note: You can use CSS to style or hide your placeholder as needed. For instance,
in the [rich editor example](https://github.com/facebook/draft-js/tree/master/examples/draft-0-10-0/rich), the placeholder is hidden when the user changes block styling in an empty editor.
This is because the placeholder may not line up with the cursor when the style
is changed.

> 注意:您可以根据需要使用CSS设置样式或者隐藏占位符。例如，在[rich editor example](https://github.com/facebook/draft-js/tree/master/examples/draft-0-10-0/rich)中，当用户在空编辑器中更改块样式时，占位符将被隐藏。这是因为当样式改变时，占位符可能不会与光标对齐。

### `textAlignment`

```js
textAlignment?: DraftTextAlignment
```

Optionally set the overriding text alignment for this editor. This alignment value will
apply to the entire contents, regardless of default text direction for input text.

> 可选地 设置此编辑器地文本对齐方式.无论输入文本的默认文本方向是怎么样的,此文本对齐值将应用于整个编辑器内容.

You may use this if you wish to center your text or align it flush in one direction
to fit it within your UI design.

> 如果你想把编辑器的文本居中显示或者对齐到一个方向,使其符合你的UI设计，你可以使用这个属性.

If this value is not set, text alignment will be based on the characters within
the editor, on a per-block basis.

> 如果未设置此值,则文本对齐将基于编辑器中的字符(在一个基础块元素中)来展示。

### `textDirectionality`

```js
textDirectionality?: DraftTextDirectionality
```

Optionally set the overriding text directionality for this editor. The values include 'RTL' for right-to-left text, like Hebrew or Arabic, and 'LTR' for left-to-right text, like English or Spanish. This directionality will apply to the entire contents, regardless of default text direction for input text.

> 可选地，设置编辑器的文本方向.这些值包括从右到左的文本(如希伯来语或阿拉伯语)的'RTL'和从左到右的文本(如英语或西班牙语)的'LTR'。这种方向性将应用于整个内容，而不管输入文本的默认文本方向.

If this value is not set, text directionality will be based on the characters
within the editor, on a per-block basis.

> 如果未设置此值，则文本对齐将基于编辑器中的字符(在一个基础块元素中)来展示。

### `blockRendererFn`

```js
blockRendererFn?: (block: ContentBlock) => ?Object
```

Optionally set a function to define custom block rendering. See [Advanced Topics: Block Components](/docs/advanced-topics-block-components) for details on usage.

> 可选地,设置一个函数来定义自定义块元素渲染。有关使用的详细信息，请参阅[Advanced Topics: Block Components](/docs/advanced-topics-block-components).

### `blockRenderMap`

```js
blockRenderMap?: DraftBlockRenderMap
```

Provide a map of block rendering configurations. Each block type maps to element tag and an optional react element wrapper. This configuration is used for both rendering and paste processing. See
[Advanced Topics: Custom Block Rendering](/docs/advanced-topics-custom-block-render-map) for details on usage.

> 此属性提供了一个块元素渲染映射的配置.每个块类型元素对应着映射中的元素标记和一个可选的react元素包装器。此配置用于渲染和粘贴处理。有关使用的详细信息，请参阅[Advanced Topics: Custom Block Rendering](/docs/advanced-topics-custom-block-render-map)。

### `blockStyleFn`

```js
blockStyleFn?: (block: ContentBlock) => string
```

Optionally set a function to define class names to apply to the given block when it is rendered. See [Advanced Topics: Block Styling](/docs/advanced-topics-block-styling) for details on usage.

> 可选地,设置一个函数来定义样式类名，以便在渲染给定块类型元素时将其样式应用于该块类型元素。有关使用的详细信息，请参阅[Advanced Topics: Block Styling](/docs/advanced-topics-block-styling)。

### customStyleMap

```js
customStyleMap?: Object
```

Optionally define a map of inline styles to apply to spans of text with the specified style. See [Advanced Topics: Inline Styles](/docs/advanced-topics-inline-styles) for details on usage.

> 可选地

### `customStyleFn`

```js
customStyleFn?: (style: DraftInlineStyle, block: ContentBlock) => ?Object
```

Optionally define a function to transform inline styles to CSS objects that are applied to spans of text. See [Advanced Topics: Inline Styles](/docs/advanced-topics-inline-styles) for details on usage.

## Behavior (Optional)

### `autoCapitalize`

```js
autoCapitalize?: string
```

Set if auto capitalization is turned on and how it behaves. More about platform availability and usage can [be found on mdn](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Input#attr-autocapitalize).

### `autoComplete`

```js
autoComplete?: string
```

Set if auto complete is turned on and how it behaves. More about platform availability and usage can [be found on mdn](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Input#attr-autocomplete).

### `autoCorrect`

```js
autoCorrect?: string
```

Set if auto correct is turned on and how it behaves. More about platform availability and usage can [be found on MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Input#attr-autocorrect).

### `readOnly`

```js
readOnly?: boolean
```

Set whether the editor should be rendered as static DOM, with all editability disabled.

This is useful when supporting interaction within [custom block components](/docs/advanced-topics-block-components) or if you only want to display content for a static use case.

Default is `false`.

### `spellCheck`

```js
spellCheck?: boolean
```

Set whether spellcheck is turned on for your editor.

Note that in OSX Safari, enabling spellcheck also enables autocorrect, if the user
has it turned on. Also note that spellcheck is always disabled in IE, since the events
needed to observe spellcheck events are not fired in IE.

Default is `false`.

### `stripPastedStyles`

```js
stripPastedStyles?: boolean
```

Set whether to remove all information except plaintext from pasted content.

This should be used if your editor does not support rich styles.

Default is `false`.

## DOM and Accessibility (Optional)

### `tabIndex`

### ARIA props

These props allow you to set accessibility properties on your editor. See
[DraftEditorProps](https://github.com/facebook/draft-js/blob/master/src/component/base/DraftEditorProps.js) for the exhaustive list of supported attributes.

### `editorKey`

```js
editorKey?: string
```

You probably won't set `editorKey` on an `<Editor />` manually unless you're
rendering a Draft component serverside. If you _are_, you must set this prop
to avoid server/client mismatches.

If the key is not set, it is generated automatically when the component
renders and assigned as a prop of the Editor's `<DraftEditorContents />`
component.

If you _do_ set this prop, the key should be unique _per-editor_, as it is
used to determine if styles should be preserved when pasting text within an
editor.

## Cancelable Handlers (Optional)

These prop functions are provided to allow custom event handling for a small
set of useful events. By returning `'handled'` from your handler, you indicate that
the event is handled and the Draft core should do nothing more with it. By returning
`'not-handled'`, you defer to Draft to handle the event.

### `handleReturn`

```js
handleReturn?: (
  e: SyntheticKeyboardEvent,
  editorState: EditorState,
) => DraftHandleValue
```

Handle a `RETURN` keydown event. Example usage: Choosing a mention tag from a
rendered list of results to trigger applying the mention entity to your content.

### `handleKeyCommand`

```js
handleKeyCommand?: (
  command: string,
  editorState: EditorState,
  eventTimeStamp: number,
) => DraftHandleValue
```

Handle the named editor command. See
[Advanced Topics: Key Bindings](/docs/advanced-topics-key-bindings)
for details on usage.

### `handleBeforeInput`

```js
handleBeforeInput?: (
  chars: string,
  editorState: EditorState,
  eventTimeStamp: number,
) => DraftHandleValue
```

Handle the characters to be inserted from a `beforeInput` event. Returning `'handled'`
causes the default behavior of the `beforeInput` event to be prevented (i.e. it is
the same as calling the `preventDefault` method on the event).
Example usage: After a user has typed `-` at the start of a new block, you might
convert that `ContentBlock` into an `unordered-list-item`.

At Facebook, we also use this to convert typed ASCII quotes into "smart" quotes,
and to convert typed emoticons into images.

### `handlePastedText`

```js
handlePastedText?: (
  text: string,
  html?: string,
  editorState: EditorState,
) => DraftHandleValue
```

Handle text and html(for rich text) that has been pasted directly into the editor. Returning true will prevent the default paste behavior.

### `handlePastedFiles`

```js
handlePastedFiles?: (files: Array<Blob>) => DraftHandleValue
```

Handle files that have been pasted directly into the editor.

### `handleDroppedFiles`

```js
handleDroppedFiles?: (
  selection: SelectionState,
  files: Array<Blob>,
) => DraftHandleValue
```

Handle files that have been dropped into the editor.

### `handleDrop`

```js
handleDrop?: (
  selection: SelectionState,
  dataTransfer: Object,
  isInternal: DraftDragType,
) => DraftHandleValue
```

Handle other drop operations.

## Key Handlers (Optional)

Draft lets you supply a custom `keyDown` handler that wraps or overrides its
default one.

### `keyBindingFn`

```js
keyBindingFn?: (e: SyntheticKeyboardEvent) => ?string
```

This prop function exposes `keyDown` events to a handler of your choosing. If an
event of interest happens, you can perform custom logic and/or return a string
corresponding to a `DraftEditorCommand` or a custom editor command of your
own creation. Example: At Facebook, this is used to provide keyboard interaction
for the mentions autocomplete menu that appears when typing a friend's name.
You can find a more detailed explanation of this
[here](/docs/advanced-topics-key-bindings).

## Mouse events

### `onFocus`

```js
onFocus?: (e: SyntheticFocusEvent) => void
```

### `onBlur`

```js
onBlur?: (e: SyntheticFocusEvent) => void
```

## Methods

### `focus`

```js
focus(): void
```

Force focus back onto the editor node.

### `blur`

```js
blur(): void
```

Remove focus from the editor node.
