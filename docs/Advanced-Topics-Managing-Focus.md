---
id: advanced-topics-managing-focus
title: Managing Focus(焦点管理)
---

Managing text input focus can be a tricky task within React components. The browser
focus/blur API is imperative, so setting or removing focus via declarative means
purely through `render()` tends to feel awkward and incorrect, and it requires
challenging attempts at controlling focus state.

> 在 React 组件中,管理文本输入的焦点是一件棘手的任务。浏览器的 focus/blur API 肯定是不能缺失的,因此纯粹在 `render()` 中,通过声明性的方式设置或者删除焦点往往让人感到笨拙和不正确的,并且它还包含了针对控制焦点状态的挑战性的尝试。

With that in mind, at Facebook we often choose to expose `focus()` methods
on components that wrap text inputs. This breaks the declarative paradigm,
but it also simplifies the work needed for engineers to successfully manage
focus behavior within their apps.

> 考虑到这一点,在 facebook 中，我们经常选择在包装文本输入的组件上暴露 `focus()` 方法。这打破了声明式的规范，但是也简化了工程师在应用程序中管理焦点行为的工作量。

The `Editor` component follows this pattern, so there is a public `focus()`
method available on the component. This allows you to use a ref within your
higher-level component to call `focus()` directly on the component when needed.

> `Editor` 组件允许这种模式，因此在组件上可以调用到公共的 `focus()` 方法.这允许你在需要的时候，在高阶组件中使用 ref 来直接调用 `focus()`来实现编辑器的焦点获取.

The event listeners within the component will observe focus changes and
propagate them through `onChange` as expected, so state and DOM will remain
correctly in sync.

> 组件中的事件监听器将监听焦点的更改，并且按照预期通过 `onChange` 方法来传递 state 状态，因此 state 和 DOM 将保持一致。

## Translating container clicks to focus

Your higher-level component will most likely wrap the `Editor` component in a
container of some kind, perhaps with padding to style it to match your app.

> 你的更高级别的组件也许会在一个容器中包裹 `Editor` 组件，也许还会为了适配你的应用程序，带上 padding 样式。

By default, if a user clicks within this container but outside of the rendered
`Editor` while attempting to focus the editor, the editor will have no awareness
of the click event. It is therefore recommended that you use a click listener
on your container component, and use the `focus()` method described above to
apply focus to your editor.

> 默认情况下，如果用户尝试让此编辑器聚焦在这个容器里面的时候，但是却在渲染的`Editor`组件之外点击了,编辑器是不会响应点击事件的。因此，建议你在容器组件中建议一个点击事件监听器,然后用上述的 `focus()` 方法聚焦到你的编辑器中。

The [plaintext editor example](https://github.com/facebook/draft-js/tree/master/examples/draft-0-10-0/plaintext),
for instance, uses this pattern.

> 例如，[plaintext editor example](https://github.com/facebook/draft-js/tree/master/examples/draft-0-10-0/plaintext)使用此模式。
