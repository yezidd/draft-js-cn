---
id: quickstart-api-basics
title: API Basics(基本的API)
---

This document provides an overview of the basics of the `Draft` API. A
[working example](https://github.com/facebook/draft-js/tree/master/examples/draft-0-10-0/plaintext)
is also available to follow along.

> 本文档提供了Draft API基础的概述。你也可以跟着[可以运行的例子](https://github.com/facebook/draft-js/tree/master/examples/draft-0-10-0/plaintext)进行学习。

## Controlled Inputs

The `Editor` React component is built as a controlled ContentEditable component,
with the goal of providing a top-level API modeled on the familiar React
_controlled input_ API.

> 这个`Editor React组件`是作为一个内容受控的组件，我们的目标是提供一个顶级的API，它以我们熟悉的React  受控输入 API为原型设计。

As a brief refresher, controlled inputs involve two key pieces:

1. A _value_ to represent the state of the input
2. An _onChange_ prop function to receive updates to the input

> 简单的复习一下,受控输入符合以下两点: <br/>
> 1.一个value属性代表了输入的状态 <br/>
> 2.一个onChange函数属性接收输入更新 <br/>

This approach allows the component that composes the input to have strict
control over the state of the input, while still allowing updates to the DOM to
provide information about the text that the user has written.

> 这种方法允许被输入的组件能够严格控制输入的状态，同同时仍然允许更新DOM以提供关于用户所写文本的信息。

```js
const MyInput = () => {
  const [value, setValue] = useState('');
  const onChange = evt => setValue(evt.target.value);

  return <input value={value} onChange={onChange} />;
};
```

The top-level component can maintain control over the input state via this
`value` state property.

## Controlling Rich Text

In a React rich text scenario, however, there are two clear problems:

1. A string of plaintext is insufficient to represent the complex state of a
   rich editor.
2. There is no such `onChange` event available for a ContentEditable element.

State is therefore represented as a single immutable
[EditorState](/docs/api-reference-editor-state) object, and `onChange` is
implemented within the `Editor` core to provide this state value to the top
level.

The `EditorState` object is a complete snapshot of the state of the editor,
including contents, cursor, and undo/redo history. All changes to content and
selection within the editor will create new `EditorState` objects. Note that
this remains efficient due to data persistence across immutable objects.

```js
import {Editor, EditorState} from 'draft-js';

const MyInput = () => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty(),
  );

  return <Editor editorState={editorState} onChange={setEditorState} />;
};
```

For any edits or selection changes that occur in the editor DOM, your `onChange`
handler will execute with the latest `EditorState` object based on those
changes.
