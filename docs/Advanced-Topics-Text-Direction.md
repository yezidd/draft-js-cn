---
id: advanced-topics-text-direction
title: Text Direction(文本方向)
---

Facebook supports dozens of languages, which means that our text inputs need
to be flexible enough to handle considerable variety.

> Facebook 支持数十种语言，这意味着我们的文本输入需要足够灵活，以处理相当多种类的语言。

For example, we want input behavior for RTL languages such as Arabic and Hebrew
to meet users' expectations. We also want to be able to support editor contents
with a mixture of LTR and RTL text.

> 例如，我们希望 RTL 语言(如阿拉伯语和希伯来语)的输入行为能够满足用户的期望。我们还希望编辑器能够支持包含 LTR 和 RTL 文本的内容。

To that end, Draft uses a bidi algorithm to determine appropriate
text alignment and direction on a per-block basis.

> 为此,Draft 使用 bidi 算法在每个块的基础上确定适当的文本对齐方式和方向。

Text is rendered with an LTR or RTL direction automatically as the user types.
You should not need to do anything to set direction yourself.

> 当用户键入文本时，文本将自动呈现为 LTR 或 RTL 方向。你不需要做任何事情来确定自己的方向。

## Text Alignment

While languages are automatically aligned to the left or right during composition,
as defined by the content characters, it is also possible for engineers to
manually set the text alignment for an editor's contents.

> 虽然在编写过程中，按照内容字符的定义，语言会自动向左或向右对齐，但工程师也可以手动设置编辑器内容的文本对齐方式。

This may be useful, for instance, if an editor requires strictly centered
contents, or needs to keep text aligned flush against another UI element.

> 这可能很有用，例如，如果编辑器需要严格居中的内容，或者需要对另一个 UI 元素保持文本对齐。

The `Editor` component therefore provides a `textAlignment` prop, with a
small set of values: `'left'`, `'center'`, and `'right'`. Using these values,
the contents of your editor will be aligned to the specified direction regardless
of language and character set.

> 因此 Editor 组件提供了一个`textAlignment` prop，带有一组值:`'left'`, `'center'`, and `'right'`。使用这些值，编辑器的内容将与指定的方向对齐，而与语言和字符集无关
