---
id: advanced-topics-nested-lists
title: Nested Lists(嵌套列表)
---

The Draft framework provides support for nested lists, as demonstrated in the
Facebook Notes editor. There, you can use `Tab` and `Shift+Tab` to add or remove
depth to a list item.

> 正如在 Facebook Notes 编辑器中演示的那样，Draft 框架提供了对嵌套列表的支持。因此，你能够用 Tab 或者 Shift+Tab 来添加或删除列表项的层级。

## Implementation

The [`RichUtils`](/docs/api-reference-rich-utils) module provides a handy `onTab` method that manages this
behavior, and should be sufficient for most nested list needs. You can use
the `onTab` prop on your `Editor` to make use of this utility.

> [`RichUtils`](/docs/api-reference-rich-utils)模块提供了一个方便的`onTab`方法来管理这个行为,对于大多数嵌套列表的需求应该足够了。您可以在编辑器上声明`onTab` prop 来使用这个能力。

By default, styling is applied to list items to set appropriate spacing and
list style behavior, via `DraftStyleDefault.css`.

> 默认情况下,通过`DraftStyleDefault.css`样式应用于列表项，来设置合适的间距和列表样式行为。

Note that there is currently no support for handling depth for blocks of any type
except `'ordered-list-item'` and `'unordered-list-item'`.

> 值得注意的是,目前不支持处理除了 'ordered-list-item' 和'unordered-list-item' 之外的任何类型的块类型元素.
