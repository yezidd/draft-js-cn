---
id: advanced-topics-issues-and-pitfalls
title: Issues and Pitfalls(问题和缺陷)
---

This article addresses some known issues with the Draft editor framework, as
well as some common pitfalls that we have encountered while using the framework
at Facebook.

> 本文讨论了有关编辑器框架 Draft 的一些已知问题，以及我们在 Facebook 上使用该框架时遇到的一些常见陷阱。

## Common Pitfalls

### Delayed state updates

A common pattern for unidirectional data management is to batch or otherwise
delay updates to data stores, using a setTimeout or another mechanism. Stores are
updated, then emit changes to the relevant React components to propagate
re-rendering.

> 单向数据管理的一种常见模式是使用 setTimeout 或其他机制，来批处理或延迟数据存储的更新.stores 被更新，然后向相关的 React 组件传播以让组件重新渲染。

When delays are introduced to a React application with a Draft editor, however,
it is possible to cause significant interaction problems. This is because the
editor expects immediate updates and renders that stay in sync with the user's typing
behavior. Delays can prevent updates from being propagated through the editor
component tree, which can cause a disconnect between keystrokes and updates.

> 但是，当使用 Draft 编辑器像 React 应用程序那样引入延迟更新状态时，可能会导致严重的交互问题。这是因为编辑器期望立即更新并呈现与用户输入行为同步的内容。延迟会阻止更新在编辑器组件树中传播，这会导致用户键盘输入和更新之间的断开。

To avoid this while still using a delaying or batching mechanism, you should
separate the delay behavior from your `Editor` state propagation. That is,
you must always allow your `EditorState` to propagate to your `Editor`
component without delay, and independently perform batched updates that do
not affect the state of your `Editor` component.

> 为了避免这种情况，同时仍然使用延迟或批处理机制，您应该将延迟行为与编辑器状态传播分离开来。也就是说，您必须始终允许您的`EditorState`毫不延迟地传播到您的`Editor`组件，并独立地执行不影响编辑器组件状态的批量更新。

### Missing `Draft.css`

The Draft framework includes a handful of CSS resources intended for use with
the editor, available in a single file via the build, `Draft.css`.

> Draft 框架包含了一些用于编辑器完整的 CSS 资源,可通过构建 repo 然后在`Draft.css`中获得。

This CSS should be included when rendering the editor, as these styles set defaults
for text alignment, spacing, and other important features. Without it, you may
encounter issues with block positioning, alignment, and cursor behavior.

> 在编辑器渲染的时候应该包括这个 css,因为这些样式设置了文本对齐,间距和其他重要特性的默认值.如果没有它，你可能会遇到块元素定位,对齐以及光标行为方面的问题。

If you choose to write your own CSS independent of `Draft.css`, you will most
likely need to replicate much of the default styling.

> 如果你选择写自己的 CSS 独立于`Draft.css`，您很可能需要复制大部分默认样式。

## Known Issues

### Custom OSX Keybindings

Because the browser has no access to OS-level custom keybindings, it is not
possible to intercept edit intent behaviors that do not map to default system
key bindings.

> 因为浏览器没有权限获取到系统级别的自定义按键绑定，因此无法拦截未映射到默认系统键绑定的编辑意图行为。

The result of this is that users who use custom keybindings may encounter
issues with Draft editors, since their key commands may not behave as expected.

> 这样做的结果是，使用自定义键绑定的用户在使用 Draft 编辑器时可能会遇到问题，因为他们的按键命令的行为可能与预期的不同。

### Browser plugins/extensions

As with any React application, browser plugins and extensions that modify the
DOM can cause Draft editors to break.

> 与任何 React 应用程序一样，修改 DOM 的浏览器插件和扩展可能会导致 Draft 编辑器崩溃。

Grammar checkers, for instance, may modify the DOM within contentEditable
elements, adding styles like underlines and backgrounds. Since React cannot
reconcile the DOM if the browser does not match its expectations,
the editor state may fail to remain in sync with the DOM.

> 例如，语法检查器可以在编辑器内容中修改 DOM，添加诸如下划线和背景之类的样式。由于 React 无法在浏览器与预期不匹配的情况下协调 DOM，因此编辑器状态可能无法与 DOM 保持同步。

Certain old ad blockers are also known to break the native DOM Selection
API -- a bad idea no matter what! -- and since Draft depends on this API to
maintain controlled selection state, this can cause trouble for editor
interaction.

> 某些老的广告拦截器也会破坏本地 DOM 选择 API——不管怎样，这都不是一个好主意!——由于 Draft 依赖于此 API 来维护受控选择状态，这可能会给编辑器交互带来麻烦。

### IME and Internet Explorer

As of IE11, Internet Explorer demonstrates notable issues with certain international
input methods, most significantly Korean input.

> 从 IE11 开始，IE 浏览器在某些国际输入法上出现了明显的问题，最明显的是韩文输入法。

### Polyfills

Some of Draft's code and that of its dependencies make use of ES2015 language
features. Syntax features like `class` are compiled away via Babel when Draft is
built, but it does not include polyfills for APIs now included in many modern
browsers (for instance: `String.prototype.startsWith`). We expect your browser
supports these APIs natively or with the assistance of a polyfill. One such
polyfill is [es6-shim](https://github.com/es-shims/es6-shim), which we use in
many examples but you are free to use
[babel-polyfill](https://babeljs.io/docs/usage/polyfill/) if that's more
your scene.

> Draft 的某些代码及其依赖项的代码使用 ES2015 语言功能。 构建 Draft 时，会通过 Babel 编译掉诸如 class 之类的语法功能，但是它不包括现在许多现代浏览器中都包含的 API 的 polyfills（例如：String.prototype.startsWith）。 我们希望您的浏览器原生或在 polyfill 的支持下支持这些 API。 [es6-shim](https://github.com/es-shims/es6-shim)是这样的 polyfill 之一，我们在许多示例中都使用了 es6-shim，但如果您的场景更丰富，则可以自由使用[babel-polyfill](https://babeljs.io/docs/usage/polyfill/)。

When using either polyfill/shim, you should include it as early as possible in
your application's entrypoint (at the very minimum, before you import Draft).
For instance, using
[create-react-app](https://github.com/facebookincubator/create-react-app) and
targeting IE11, `src/index.js` is probably a good spot to import your polyfill:

> 当使用 polyfill/shim 时，您应该尽早将其包含在应用程序的入口点中(至少在导入 Draft 之前)。例如，使用[create-react-app](https://github.com/facebookincubator/create-react-app)并以 IE11 为目标，src/index.js 可能是一个导入你的 polyfill 的好地方:

**`src/index.js`**

```js
import 'babel-polyfill';
// or
import 'es6-shim';

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

ReactDOM.render(<App />, document.getElementById('root'));
```

### Mobile Not Yet Supported

Draft.js is moving towards full mobile support, but does not officially support
mobile browsers at this point. There are some known issues affecting Android and
iOS - see issues tagged
['android'](https://github.com/facebook/draft-js/labels/android) or
['ios'](https://github.com/facebook/draft-js/labels/ios) for the current status.

> Draft.js 正在向完全移动端支持转变，但目前还没有正式支持移动浏览器。有一些已知的影响 Android 和 iOS 的问题-请查看标记为['android'](https://github.com/facebook/draft-js/labels/android)或['ios'](https://github.com/facebook/draft-js/labels/ios)的问题的当前状态。
