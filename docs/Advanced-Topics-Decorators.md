---
id: advanced-topics-decorators
title: Decorators(装饰器)
---

Inline and block styles aren't the only kind of rich styling that we might
want to add to our editor. The Facebook comment input, for example, provides
blue background highlights for mentions and hashtags.

> 内联样式和块样式并不是我们想要添加到编辑器中的唯一一种富文本样式。例如，在 Facebook 的评论输入中,为 mentions 和 hashtags 提供了一个蓝色背景的高亮。

To support flexibility for custom rich text, Draft provides a "decorator"
system. The [tweet example](https://github.com/facebook/draft-js/tree/master/examples/draft-0-10-0/tweet)
offers a live example of decorators in action.

> 为了支持自定义富文本格式的灵活性, Draft 提供了 一个 "装饰器(decorator)" 系统. [tweet example](https://github.com/facebook/draft-js/tree/master/examples/draft-0-10-0/tweet)示例提供了一个可运行的装饰器(decorator)示例。

## CompositeDecorator

The decorator concept is based on scanning the contents of a given
[ContentBlock](/docs/api-reference-content-block)
for ranges of text that match a defined strategy, then rendering them
with a specified React component.

> 装饰器的概念是基于对给定[ContentBlock](/docs/api-reference-content-block)的内容进行扫描，寻找与已定义策略(比如一个正则)相匹配的文本范围，然后使用指定的 React 组件去渲染它们。

You can use the `CompositeDecorator` class to define your desired
decorator behavior. This class allows you to supply multiple `DraftDecorator`
objects, and will search through a block of text with each strategy in turn.

> 您可以使用 `CompositeDecorator` 类来定义您想要的装饰器行为。这个类允许您提供多个 `DraftDecorator` 对象，并将依次使用每个策略搜索一个文本块。

Decorators are stored within the `EditorState` record. When creating a new
`EditorState` object, e.g. via `EditorState.createEmpty()`, a decorator may
optionally be provided.

> 装饰器存储在 `EditorState` record 对象中.当创建一个新的 `EditorState` 对象时, 例如，通过 `EditorState.createEmpty()` 创建的时候,可以选择传递一个装饰器参数.

> Under the hood
>
> When contents change in a Draft editor, the resulting `EditorState` object
> will evaluate the new `ContentState` with its decorator, and identify ranges
> to be decorated. A complete tree of blocks, decorators, and inline styles is
> formed at this time, and serves as the basis for our rendered output.
>
> In this way, we always ensure that as contents change, rendered decorations
> are in sync with our `EditorState`.

> 额外说一点
> 在一个 Draft 编辑器中，当内容改变的时候，产生的' EditorState '对象 将用它的装饰器重新计算出新的 `ContentState`，并且标识出要装饰的范围。此时，将形成一个完整的块，装饰器和内联样式树，并作为渲染输出的基础。
>
> 用这种方式，我们能确保当内容改变的时候，装饰器的渲染跟 EditorState 实时同步。

In the "Tweet" editor example, for instance, we use a `CompositeDecorator` that
searches for @-handle strings as well as hashtag strings:

> 在这个"Tweet"编辑器的样例中，举个例子，我们用一个 `CompositeDecorator` 搜索 @-handle 字符串和# hashtag 字符串。

```js
const compositeDecorator = new CompositeDecorator([
  {
    strategy: handleStrategy,
    component: HandleSpan,
  },
  {
    strategy: hashtagStrategy,
    component: HashtagSpan,
  },
]);
```

This composite decorator will first scan a given block of text for @-handle
matches, then for hashtag matches.

> 这个复合装饰器将首先扫描给定的文本块以查找 @-handle 匹配项，然后扫描 hashtag(#) 匹配项。

```js
// Note: these aren't very good regexes, don't use them!
const HANDLE_REGEX = /\@[\w]+/g;
const HASHTAG_REGEX = /\#[\w\u0590-\u05ff]+/g;

function handleStrategy(contentBlock, callback, contentState) {
  findWithRegex(HANDLE_REGEX, contentBlock, callback);
}

function hashtagStrategy(contentBlock, callback, contentState) {
  findWithRegex(HASHTAG_REGEX, contentBlock, callback);
}

function findWithRegex(regex, contentBlock, callback) {
  const text = contentBlock.getText();
  let matchArr, start;
  while ((matchArr = regex.exec(text)) !== null) {
    start = matchArr.index;
    callback(start, start + matchArr[0].length);
  }
}
```

The strategy functions execute the provided callback with the `start` and
`end` values of the matching range of text.

> 这个策略函数会执行并返回一个回调函数,回调函数传递匹配文字范围的 `start` 值和 `end` 值。

## Decorator Components

For your decorated ranges of text, you must define a React component to use
to render them. These tend to be plain `span` elements with CSS classes or
styles applied to them.

> 针对你要装饰的文本范围，你必须定义一个 React 组件用来渲染他们.这些可以是一个带着 CSS 类或者样式的 `span` 标签。

In our current example, the `CompositeDecorator` object names `HandleSpan` and
`HashtagSpan` as the components to use for decoration. These are basic
stateless components:

> 在我们这个例子中，`CompositeDecorator` 对象声明了 `HandleSpan` 和 `HashtagSpan` 用于装饰用的 Component，这些是 React 的无状态组件。

```js
const HandleSpan = props => {
  return (
    <span {...props} style={styles.handle}>
      {props.children}
    </span>
  );
};

const HashtagSpan = props => {
  return (
    <span {...props} style={styles.hashtag}>
      {props.children}
    </span>
  );
};
```

The Decorator Component will receive various pieces of metadata in `props`,
including a copy of the `contentState`, the `entityKey` if there is one, and the
`blockKey`. For a full list of props supplied to a Decorator Component see the
[DraftDecoratorComponentProps type](https://github.com/facebook/draft-js/blob/master/src/model/decorators/DraftDecorator.js).

> 装饰器组件将在 `props` 中接收一系列元数据,包括 `contentState` , entityKey(如果有的话),和 blockKey. 有关提供给装饰器组件完整的 props 列表，请参考 [DraftDecoratorComponentProps type](https://github.com/facebook/draft-js/blob/master/src/model/decorators/DraftDecorator.js)。

Note that `props.children` is passed through to the rendered output. This is
done to ensure that the text is rendered within the decorated `span`.

> 注意的是,`props.children` 被传递到渲染输出。这样做是为了确保装饰后的文字会在 span 内渲染。

You can use the same approach for links, as demonstrated in our
[link example](https://github.com/facebook/draft-js/tree/master/examples/draft-0-10-0/link).

> 你可以用相同的方法处理链接，就像[link example](https://github.com/facebook/draft-js/tree/master/examples/draft-0-10-0/link)中那样做的。

### Beyond CompositeDecorator

The decorator object supplied to an `EditorState` need only match the expectations
of the
[DraftDecoratorType](https://github.com/facebook/draft-js/blob/master/src/model/decorators/DraftDecoratorType.js)
Flow type definition, which means that you can create any decorator classes
you wish, as long as they match the expected type -- you are not bound by
`CompositeDecorator`.

> 装饰器对象被用于 EditorState，它仅仅需要匹配[DraftDecoratorType](https://github.com/facebook/draft-js/blob/master/src/model/decorators/DraftDecoratorType.js)的类型定义即可，这意味着你可以创建任何一个你期望的装饰器类，只要他们匹配期望的类 -- 你将不会被`CompositeDecorator` 束缚。

## Setting new decorators

Further, it is acceptable to set a new `decorator` value on the `EditorState`
on the fly, during normal state propagation, through immutable means.

> 而且，我们将可以在 `EditorState` 中设置新的 `decorator` 值, 通过 immutable 的方法，在正常的状态传递的过程中。

This means that during your app workflow, if your decorator becomes invalid or
requires a modification, you can create a new decorator object (or use
`null` to remove all decorations) and `EditorState.set()` to make use of the new
decorator setting.

> 这就意味着在你的 app 工作流程中，如果想要你的装饰器无效或者需要修改，你可以创建一个新的装饰器对象或者用 `null`删除所有的装饰器对象，并且用 `EditorState.set()` 来使新设置的装饰器对象生效。

For example, if for some reason we wished to disable the creation of @-handle
decorations while the user interacts with the editor, it would be fine to do the
following:

> 举个例子，因为某些原因，我们希望当用户操作编辑器的时候，禁用@-handle 装饰器，它会变得很简单，就像下面这样做：

```js
function turnOffHandleDecorations(editorState) {
  const onlyHashtags = new CompositeDecorator([
    {
      strategy: hashtagStrategy,
      component: HashtagSpan,
    },
  ]);
  return EditorState.set(editorState, {decorator: onlyHashtags});
}
```

The `ContentState` for this `editorState` will be re-evaluated with the new
decorator, and @-handle decorations will no longer be present in the next
render pass.

> `editorState` 中的 `ContentState` 会用新的装饰器重新计算，并且@-handle 装饰器不会在下个渲染过程中呈现出来。

Again, this remains memory-efficient due to data persistence across immutable
objects.

> 要再一次说明一下，因为使用持久化不可变数据对象，它依然会是高效的。
