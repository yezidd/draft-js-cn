---
id: getting-started
title: Overview(概述)
onPageNav: 'none'
---

Draft.js is a framework for building rich text editors in React, powered by an immutable model and abstracting over cross-browser differences.

> Draft.js 是一个基于 React 用于构建富文本编辑器的框架，由持久化数据层(Immutable)作为驱动，并且跨浏览器兼容。

Draft.js allows you to build any type of rich text input, whether you're only looking to support a few inline text styles or building a complex text editor for composing long-form articles.

> Draft.js 使得创建任何类型的文本输入都变得容易，无论你仅仅是想支持一些内联文本样式还是为了构建长篇文章的复杂编辑器。

Draft.js was introduced at [React.js Conf](https://conf2016.reactjs.org/schedule#rich-text-editing-with-react) in February 2016.

> Draft.js 在 2016 年 2 月的 React.js Conf 公开与众。

<iframe width="100%" height="365" src="https://www.youtube.com/embed/feUYwoLhE_4" frameBorder="0" allowFullScreen></iframe>

## Installation

Draft.js is distributed via npm. It depends on React and React DOM which must also be installed.

> Draft.js 目前需要通过 npm 安装，而且此项目强依赖于 React 和 React DOM，因此也必须一起安装。

```sh
npm install draft-js react react-dom
# or alternately
yarn add draft-js react react-dom
```

Draft.js uses some modern ECMAScript features which are not available to IE11 and not part of create-react-app's default babel config. If you're running into problems out-of-the-box try installing a shim or polyfill alongside Draft.

> Draft.js 使用了一些先进的 ECMAScript 特性，目前这些特性还不支持 IE11 和 create-react-app 使用的默认的 babel 配置。如果你在开箱即用的配置上使用产生了问题，请尝试安装 shim 或者 polyfill 并且在 Draft 之前声明。

```sh
npm install draft-js react react-dom babel-polyfill
# or
yarn add draft-js react react-dom es6-shim
```

Learn more about [using a shim with Draft](/docs/advanced-topics-issues-and-pitfalls#polyfills).

> 学习更多关于 [在 Draft 中使用 shim](http://localhost:3000/docs/advanced-topics-issues-and-pitfalls#polyfills)。

## API Changes Notice

Before getting started, please be aware that we recently changed the API of
Entity storage in Draft. Draft.js version `v0.10.0` and `v0.11.0` support both the old
and new API. Following that up will be `v0.12.0` which will remove the old API.

> 在开始之前，请注意我们最近修改了Draft中的实体(Entity)存储API。Draft.js ' v0.10.0 ' 和' v0.11.0 '版本支持新的和旧的api.接下来是' v0.12.0 '，它将删除旧的API。

## Usage

```js
import React from 'react';
import ReactDOM from 'react-dom';
import {Editor, EditorState} from 'draft-js';
import 'draft-js/dist/Draft.css';

class MyEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {editorState: EditorState.createEmpty()};
    this.onChange = editorState => this.setState({editorState});
  }

  render() {
    return (
      <Editor editorState={this.state.editorState} onChange={this.onChange} />
    );
  }
}

ReactDOM.render(<MyEditor />, document.getElementById('container'));
```

Since the release of React 16.8, you can use [Hooks](https://reactjs.org/docs/hooks-intro.html) as a way to work with `EditorState` without using a class.

> 自从React 16.8 版本发布,你能够使用[Hooks](https://reactjs.org/docs/hooks-intro.html), 一种不依赖class类但是 `EditorState` 依旧能够使用的方式。

```js
import React from 'react';
import ReactDOM from 'react-dom';
import {Editor, EditorState} from 'draft-js';
import 'draft-js/dist/Draft.css';

function MyEditor() {
  const [editorState, setEditorState] = React.useState(() =>
    EditorState.createEmpty(),
  );

  return <Editor editorState={editorState} onChange={setEditorState} />;
}

ReactDOM.render(<MyEditor />, document.getElementById('container'));
```

Because Draft.js supports unicode, you must have the following meta tag in the `<head></head>` block of your HTML file:

> 由于Draft.js 支持unicode,所以你必须下列的meta tag 在你的 HTMl 文件的 `<head></head>` 标签块内

```html
<meta charset="utf-8" />
```

`Draft.css` should be included when rendering the editor. Learn more about [why](/docs/advanced-topics-issues-and-pitfalls#missing-draftcss).

> Draft.css 需要在编辑器渲染的时候被包含进来。了解更多关于 [为什么需要这样](/docs/advanced-topics-issues-and-pitfalls#missing-draftcss)。

Next, let's go into the basics of the API and learn what else you can do with Draft.js.

> 下一步，让我们走进基本的API并且学习其他Draft.js能做的事情.