---
id: advanced-topics-editorstate-race-conditions
title: EditorState Race Conditions(EditorState竞态条件)
---

Draft `Editor` is a _controlled input_ component (you can read about this in detail in the [API Basics](/docs/quickstart-api-basics) section), meaning that changes made to the `Editor` state are propagated upwards through `onChange` and it's up to the app to feed it back to the `Editor` component.

> Draft 的`Editor`是一个完全受控的组件.(你能够在 [API Basics](/docs/quickstart-api-basics) 这一栏目中了解到详细信息),意味着那些针对 `Editor` state 的更改将通过`onChange`向上传播，并由自己的应用程序将其反馈给`Editor`组件。

This cycle usually looks like:

> 这个周期通常是这样的:

```js
...
this.onChange = function(editorState) {
  this.setState({editorState: editorState});
}
...
<Editor
  editorState={this.state.editorState}
  onChange={this.onChange}
  placeholder="Enter some text..."
/>
```

Different browser events can trigger the `Editor` to create a new state and call `onChange`. For instance, when the user pastes text into it, Draft parses the new content and creates the necessary data structure to represent it.

> 不同的浏览器事件可以触发编辑器创建新状态并调用`onChange`。 例如,当用户粘贴文本进编辑器的时候,Draft 会解析新内容并创建必要的数据结构来表示新内容.

This cycle works great, however, it is an asynchronous operation because of the `setState` call. This introduces a delay between setting the state and rendering the `Editor` with the new state. During this time period other JS code can be executed.

> 这个循环可以很好的执行,然而,由于`setState`的调用,它成为了一个异步操作.这在编辑器设置状态和使用新状态渲染之间引入了延迟.在这个期间内，其他 JS 代码可以被执行.

![Race condition diagram 1](/img/editorstate-race-condition-1-handler.png)

Non-atomic operations like this can potentially introduce race conditions.
Here's an example: Suppose you want to remove all the text styles that come from the paste. This can be implemented by listening to the onPaste event and removing all styles from the `EditorState`:

> 像这样的非原子操作很可能会引入竞态条件.这里有个例子:假设您想删除来自粘贴的所有文本的样式。这可以通过监听 onPaste 事件并从`EditorState`中删除所有样式来实现:

```js
this.onPaste = function() {
  this.setState({
    editorState: removeEditorStyles(this.state.editorState),
  });
};
```

However, this won't work as expected. You now have two event handlers that set a new `EditorState` in the exact same browser event. Since the event handlers will run one after the other only the last `setState` will prevail. Here's how it looks like in the JS timeline:

> 然而这可能不能像预期一样执行。你现在有两个事件处理程序，他们在完全相同的浏览器事件中设置新的`EditorState`。因为事件处理程序会一个接一个的运行，所有只有最后一个`setState`将会占上风，真正的执行。以下是它在 JS 时间轴上的样子:

![Race condition diagram 2](/img/editorstate-race-condition-2-handlers.png)

As you can see, since `setState` is an asynchronous operation, the second `setState` will override whatever it was set on the first one making the `Editor` lose all the contents from the pasted text.

> 如您所见，由于`setState`是一个异步操作，第二个 setState 将覆盖它在第一个 setState 上设置的任何内容，从而使编辑器丢失粘贴文本中的所有内容。

You can observe and explore the race condition in [this running example](https://jsfiddle.net/qecccw3r/). The example also has logging to highlight the JS timeline so make sure to open the developer tools.

> 在这个[this running example](https://jsfiddle.net/qecccw3r/)中，您可以观察和探索竞态条件。这个例子还有日志记录来突出 JS 时间轴，所以一定要打开开发者工具。

As a rule of thumb avoid having different event handlers for the same event that manipulate the `EditorState`. Using setTimeout to run `setState` might also land you in the same situation.
Anytime you feel you're “losing state” make sure you're not overriding it before the `Editor` re-rendering.

> 根据经验，我们应该避免为操作`EditorState`的同一个事件使用不同的事件处理程序。使用 setTimeout 运行 setState 可能也会使您处于相同的情况。任何时候，当你觉得你在“losing state”时，确保你在编辑器重新渲染状态之前没有覆盖它。

## Best Practices

Now that you understand the problem, what can you do to avoid it? In general be mindful of where you're getting the `EditorState` from. If you're using a local one (stored in `this.state`) then there's the potential for it to not be up to date.
To minimize this problem Draft offers the latest `EditorState` instance in most of its callback functions. In your code you should use the provided `EditorState` instead of your local one to make sure you're basing your changes on the latest one.
Here's a list of supported callbacks on the `Editor`:

> 既然你已经了解了这个问题，你能做些什么来避免它呢?一般来说，要注意从哪里获得`EditorState`。如果您使用的是本地的(存储在 this.state 中)，那么它就有可能不是最新的。为了最小化这个问题，Draft 在它的大多数回调函数中提供了最新的`EditorState`实例。在您的代码中，您应该使用提供的`EditorState`而不是本地的`EditorState`，以确保您的更改基于最新的 EditorState。

- `handleReturn(event, editorState)`
- `handleKeyCommand(command, editorState)`
- `handleBeforeInput(chars, editorState)`
- `handlePastedText(text, html, editorState)`

The paste example can then be re-written in a race condition free way by using these methods:

> 然后可以使用以下方法以无竞争条件的方式重写粘贴示例：

```js
this.handlePastedText = (text, styles, editorState) => {
  this.setState({
    editorState: removeEditorStyles(text, editorState),
  });
};
//...
<Editor
  editorState={this.state.editorState}
  onChange={this.onChange}
  handlePastedText={this.handlePastedText}
  placeholder="Enter some text..."
/>;
```

With `handlePastedText` you can implement the paste behavior by yourself.

> 通过`handlePastedText`，您可以自己实现粘贴行为。

NOTE: If you need to have this behavior in your Editor, you can achieve it by setting the `Editor`'s `stripPastedStyles` property to `true`.

> 注意:如果需要在编辑器中实现此行为，可以通过将编辑器的`stripPastedStyles`属性设置为`true`来实现。
