---
id: quickstart-api-basics
title: API Basics(基本的API)
---

This document provides an overview of the basics of the `Draft` API. A
[working example](https://github.com/facebook/draft-js/tree/master/examples/draft-0-10-0/plaintext)
is also available to follow along.

> 本文档提供了 Draft API 基础的概述。你也可以跟着[可以运行的例子](https://github.com/facebook/draft-js/tree/master/examples/draft-0-10-0/plaintext)进行学习。

## Controlled Inputs

The `Editor` React component is built as a controlled ContentEditable component,
with the goal of providing a top-level API modeled on the familiar React
_controlled input_ API.

> 这个`Editor React组件`是作为一个内容受控的组件，我们的目标是提供一个顶级的 API，它以我们熟悉的 React 受控输入 API 为原型设计。

As a brief refresher, controlled inputs involve two key pieces:

1. A _value_ to represent the state of the input
2. An _onChange_ prop function to receive updates to the input

> 简单的复习一下,受控输入符合以下两点: <br/> 1.一个 value 属性代表了输入的状态 <br/> 2.一个 onChange 函数属性接收输入更新 <br/>

This approach allows the component that composes the input to have strict
control over the state of the input, while still allowing updates to the DOM to
provide information about the text that the user has written.

> 这种方法允许被输入的组件能够严格控制输入的状态，同同时仍然允许更新 DOM 以提供关于用户所写文本的信息。

```js
const MyInput = () => {
  const [value, setValue] = useState('');
  const onChange = evt => setValue(evt.target.value);

  return <input value={value} onChange={onChange} />;
};
```

The top-level component can maintain control over the input state via this
`value` state property.

> 顶级受控组件可以通过这个 value 状态属性来对输入状态进行控制。

## Controlling Rich Text

In a React rich text scenario, however, there are two clear problems:

> 在一个 React 的富文本组件场景中,然而,会存在两个比较明显的问题:

1. A string of plaintext is insufficient to represent the complex state of a
   rich editor.

> 纯文本字符串不足以表示富编辑器的复杂状态。

2. There is no such `onChange` event available for a ContentEditable element.

> 在 ContentEditable 节点中不存在 onChange 事件可以用。

State is therefore represented as a single immutable
[EditorState](/docs/api-reference-editor-state) object, and `onChange` is
implemented within the `Editor` core to provide this state value to the top
level.

> 因此,State 代表了单一的 immutable EditorState 对象，并且 onChange 是在 Editor 组件核心中实现的，它将这个状态提供到顶层了。

The `EditorState` object is a complete snapshot of the state of the editor,
including contents, cursor, and undo/redo history. All changes to content and
selection within the editor will create new `EditorState` objects. Note that
this remains efficient due to data persistence across immutable objects.

> 这个 EditorState 对象是一个完整的 `Editor编辑器`状态的快照，包括了 contents(内容),cursor(游标),撤销(undo)/重做(redo) 历史. 所有针对编辑器内容和光标的改变都将重新创建出一个新的 EditorState 对象。值得注意的是，这依旧会十分高效，因为 immutable 对象所具有的数据持久特性。

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

> 对于 Editor 组件 DOM 中发生的任何编辑和光标选择更改的行为，你的 onChange 函数都会响应，并且将基于这些改变，计算和产生出最新的 EditorState 对象。
