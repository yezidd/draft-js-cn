---
id: quickstart-rich-styling
title: Rich Styling(丰富的样式)
---

Now that we have established the basics of the top-level API, we can go a step
further and examine how basic rich styling can be added to a `Draft` editor.

> 现在，我们已经建立了编辑器顶级 API 的基础，我们可以进一步研究如何将基本的富文本样式添加到 Draft 编辑器中。

A [rich text example](https://github.com/facebook/draft-js/tree/master/examples/draft-0-10-0/rich)
is also available to follow along.

> 本文还提供了一个[富文本示例](https://github.com/facebook/draft-js/tree/master/examples/draft-0-10-0/rich)。

## EditorState: Yours to Command

The previous article introduced the `EditorState` object as a snapshot of the full state of the editor, as provided by the `Editor` core via the `onChange` prop.

> 前一篇文章介绍了 EditorState 对象，它是编辑器完整状态的快照，由编辑器 core 通过 onChange 属性方法提供状态更新。

However, since your top-level React component is responsible for maintaining the state, you also have the freedom to apply changes to that `EditorState` object in any way you see fit.

> 然而,因为你顶级的 React 组件负责维护 state, 你可以很轻松的将各种 changes 以你认为合适的方式 应用到 EditorState 对象上去.

For inline and block style behavior, for example, the [`RichUtils`](/docs/api-reference-rich-utils) module provides a number of useful functions to help manipulate state.

> 例如,针对 行内元素 或者 块级元素的 样式表现, [RichUtils 模块](/docs/api-reference-rich-utils)提供了许多有用的函数来帮助处理状态。

Similarly, the [`Modifier`](/docs/api-reference-modifier) module also provides a
number of common operations that allow you to apply edits, including changes
to text, styles, and more. This module is a suite of edit functions that
compose simpler, smaller edit functions to return the desired `EditorState`
object.

> 类似的, [`Modifier`](/docs/api-reference-modifier) 模块也提供了许多允许你富文本内容编辑的通用操作,包含对文本、样式等的更改.这个模块是一组编辑函数，由更简单、更小的编辑函数组成，以返回所需的 `EditorState` 对象。

For this example, we'll stick with `RichUtils` to demonstrate how to apply basic
rich styling within the top-level component.

> 对于本例，我们将继续使用 `RichUtils` 模块来演示如何在顶级组件中应用基本的富文本样式。

## RichUtils and Key Commands

`RichUtils` has information about the core key commands available to web editors,
such as Cmd+B (bold), Cmd+I (italic), and so on.

> `RichUtils` 为 web 编辑器提供了核心快捷键的能力，例如 Cmd+B(粗体)，Cmd+I(斜体)，等等。

We can observe and handle key commands via the `handleKeyCommand` prop, and
hook these into `RichUtils` to apply or remove the desired style.

> 我们可以通过`handleKeyCommand` prop 属性观察和处理键盘 key 命令，并将它们与 `RichUtils` 模块中相对应的函数相关联，以应用或删除所需的样式。

```js
import {Editor, EditorState, RichUtils} from 'draft-js';

class MyEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {editorState: EditorState.createEmpty()};
    this.onChange = editorState => this.setState({editorState});
    this.handleKeyCommand = this.handleKeyCommand.bind(this);
  }

  handleKeyCommand(command, editorState) {
    const newState = RichUtils.handleKeyCommand(editorState, command);

    if (newState) {
      this.onChange(newState);
      return 'handled';
    }

    return 'not-handled';
  }

  render() {
    return (
      <Editor
        editorState={this.state.editorState}
        handleKeyCommand={this.handleKeyCommand}
        onChange={this.onChange}
      />
    );
  }
}
```

> `handleKeyCommand`
>
> The `command` argument supplied to `handleKeyCommand` is a string value, the
> name of the command to be executed. This is mapped from a DOM key event. The
> `editorState` argument represents the latest editor state as it might be
> changed internally by draft when handling the key. Use this instance of the
> editor state inside `handleKeyCommand`. See
> [Advanced Topics - Key Binding](/docs/advanced-topics-key-bindings) for more
> on this, as well as details on why the function returns `handled` or `not-handled`.
>
> `handleKeyCommand`
> 提供给 `handleKeyCommand` 的 `command` 参数是一个字符串，即要执行的快捷键命令的名称。这个命令是从一个 DOM key 事件映射的。
> `editorState` 参数传递了编辑器最近的 state, 因为它有可能在 Draft 响应和处理 key 事件的时候在内部被改变并产生一个新的 state。
> 关于如何在 `handleKeyCommand` 内部使用 editor state 实例, 请参阅[Advanced Topics - Key Binding](/docs/advanced-topics-key-bindings)以获得更多信息，以及关于函数返回 handled 或 not-handled 的详细信息。

## Styling Controls in UI

Within your React component, you can add buttons or other controls to allow
the user to modify styles within the editor. In the example above, we are using
known key commands, but we can add more complex UI to provide these rich
features.

> 在 React 组件中，可以添加按钮或其他控件，以允许用户在编辑器中修改样式。在上面的例子中，我们使用已知的键盘命令，但是我们可以添加更复杂的 UI 来控制和实现这些丰富的特性。

Here's a super-basic example with a "Bold" button to toggle the `BOLD` style.

> 这里有一个非常基础的例子，用一个 BOLD 按钮来控制 BOLD 样式。

```js
class MyEditor extends React.Component {
  // ...

  _onBoldClick() {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'));
  }

  render() {
    return (
      <div>
        <button onClick={this._onBoldClick.bind(this)}>Bold</button>
        <Editor
          editorState={this.state.editorState}
          handleKeyCommand={this.handleKeyCommand}
          onChange={this.onChange}
        />
      </div>
    );
  }
}
```
