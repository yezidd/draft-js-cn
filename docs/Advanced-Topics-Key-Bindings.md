---
id: advanced-topics-key-bindings
title: Key Bindings(按键绑定)
---

The `Editor` component offers flexibility to define custom key bindings
for your editor, via the `keyBindingFn` prop. This allows you to match key
commands to behaviors in your editor component.

> `Editor` 组件针对你的编辑器，通过 `keyBindingFn` prop 参数,提供了灵活的自定义按键绑定功能。它允许你匹配按键命令然后控制你的编辑器组件的行为。

## Defaults

The default key binding function is `getDefaultKeyBinding`.

> 默认的按键绑定函数是 `getDefaultKeyBinding`。

Since the Draft framework maintains tight control over DOM rendering and
behavior, basic editing commands must be captured and routed through the key
binding system.

> 由于 Draft.js 框架 严格控制 DOM 的渲染和行为，故基本的编辑命令需要通过按键绑定系统捕获和实现。

`getDefaultKeyBinding` maps known OS-level editor commands to `DraftEditorCommand`
strings, which then correspond to behaviors within component handlers.

> `getDefaultKeyBinding` 将已知的系统级别的编辑器命令映射到 `DraftEditorCommand` 字符串，然后对应于组件处理程序中的行为。

For instance, `Ctrl+Z` (Win) and `Cmd+Z` (OSX) map to the `'undo'` command,
which then routes our handler to perform an `EditorState.undo()`.

> 例如，`Ctrl+Z` (Win) 和 `Cmd+Z` (OSX) 对应 `'undo'` (撤销)命令，组件收到 'undo' (撤销)命令就会执行 `EditorState.undo()`。

## Customization

You may provide your own key binding function to supply custom command strings.

> 您可以使用自定义按键绑定函数来提供自定义的快捷键命令。

It is recommended that your function use `getDefaultKeyBinding` as a
fall-through case, so that your editor may benefit from default commands.

> 推荐使用 `getDefaultKeyBinding` 作为失败垫底的处理方案，这样你的编辑器可能受益于默认命令。

With your custom command string, you may then implement the `handleKeyCommand`
prop function, which allows you to map that command string to your desired
behavior. If `handleKeyCommand` returns `'handled'`, the command is considered
handled. If it returns `'not-handled'`, the command will fall through.

> 针对你自定义的命令字符串，你需要实现一个 `handleKeyCommand` prop 函数,该函数允许您将改名了字符串，映射到所需的编辑器行为上。如果 handleKeyCommand 函数返回 'handled'，则该命令被视为已处理。 如果它返回 'not-handled'，则该命令处理失败。

## Example

Let's say we have an editor that should have a "Save" mechanism to periodically
write your contents to the server as a draft copy.

> 假如我们有个编辑器,需要将内容作为草稿副本，定期地保存到服务器上。

First, let's define our key binding function:

> 首先，我们定义一个按键绑定函数：

```js
import {getDefaultKeyBinding, KeyBindingUtil} from 'draft-js';
const {hasCommandModifier} = KeyBindingUtil;

function myKeyBindingFn(e: SyntheticKeyboardEvent): string | null {
  if (e.keyCode === 83 /* `S` key */ && hasCommandModifier(e)) {
    return 'myeditor-save';
  }
  return getDefaultKeyBinding(e);
}
```

Our function receives a key event, and we check whether it matches our criteria:
it must be an `S` key, and it must have a command modifier, i.e. the command
key for OSX, or the control key otherwise.

> 我们的函数接收一个键盘事件，之后我们检查它是否匹配我们所写的条件：首先必须是 's' 按键，之后它必须有一个命令修饰符(例如，在 OSX 上是 'cmd'，在 windows 上是 'ctrl' ).

If the command is a match, return a string that names the command. Otherwise,
fall through to the default key bindings.

> 如果该键盘事件是匹配的，则返回一个我们指定的命令名称。否则，使用默认的按键绑定函数 getDefaultKeyBinding 来处理。

In our editor component, we can then make use of the command via the
`handleKeyCommand` prop:

> 在我们的编辑器组件中，我们可以通用 `handleKeyCommand` 这个 prop 参数来实现按键命令:

```js
import {Editor} from 'draft-js';
class MyEditor extends React.Component {

  constructor(props) {
    super(props);
    this.handleKeyCommand = this.handleKeyCommand.bind(this);
  }
  // ...

  handleKeyCommand(command: string): DraftHandleValue {
    if (command === 'myeditor-save') {
      // Perform a request to save your contents, set
      // a new `editorState`, etc.
      // 这里可以发送个保存内容的请求，设置个新的 editorState 等等
      return 'handled';
    }
    return 'not-handled';
  }

  render() {
    return (
      <Editor
        editorState={this.state.editorState}
        handleKeyCommand={this.handleKeyCommand}
        keyBindingFn={myKeyBindingFn}
        ...
      />
    );
  }
}
```

The `'myeditor-save'` command can be used for our custom behavior, and returning
`'handled'` instructs the editor that the command has been handled and no more work
is required.

> `'myeditor-save'` 命令能够被用来做一些自定义操作，之后返回 'handled' 来告诉编辑器，这个命令已经被处理了不需要再做其它操作了。

By returning `'not-handled'` in all other cases, default commands are able to fall
through to default handler behavior.

> 在其他情况下通过返回 `'not-handled'` , 默认处理事件就能够去响应这个命令，作为命令没有响应的失败垫底行为.
