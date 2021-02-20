---
id: advanced-topics-entities
title: Entities(实体)
---

This article discusses the Entity system, which Draft uses for annotating
ranges of text with metadata. Entities introduce levels of richness beyond
styled text. Links, mentions, and embedded content can all be implemented
using entities.

> 本文讨论了实体系统, Draft 用该系统通过元数据来标注一个范围的文本。实体的引入提供了超越文本之外的丰富的样式显示。超链接(Links)、提及(mentions)和嵌入的内容(embedded)都可以使用实体来实现。

In the Draft repository, the
[link editor](https://github.com/facebook/draft-js/tree/master/examples/draft-0-10-0/link)
and
[entity demo](https://github.com/facebook/draft-js/tree/master/examples/draft-0-10-0/entity)
provide live code examples to help clarify how entities can be used, as well
as their built-in behavior.

> 在 Draft 的代码存储库中,[link editor](https://github.com/facebook/draft-js/tree/master/examples/draft-0-10-0/link)和[entity demo](https://github.com/facebook/draft-js/tree/master/examples/draft-0-10-0/entity)提供了可运行的代码示例，以帮助阐明如何使用实体以及它们的内置行为。

The [Entity API Reference](/docs/api-reference-entity) provides
details on the static methods to be used when creating, retrieving, or updating
entity objects.

> 在[Entity API Reference](/docs/api-reference-entity)中,提供了有关创建、检索或更新实体对象时使用的静态方法的详细信息。

For information about recent changes to the Entity API, and examples of how to
update your application,
[see our v0.10 API Migration Guide](/docs/v0-10-api-migration#content).

> 有关实体 API 最近更改的信息，以及如何更新应用程序中旧的 API 的示例，请参阅我们的[v0.10 API 迁移指南](/docs/v0-10-api-migration#content)。

## Introduction

An entity is an object that represents metadata for a range of text within a
Draft editor. It has three properties:

> 一个实体,在 Draft 富文本编辑器中,是代表标注一个文本范围的元数据的对象。

- **type**: A string that indicates what kind of entity it is, e.g. `'LINK'`,
  `'MENTION'`, `'PHOTO'`.
- **mutability**: Not to be confused with immutability a la `immutable-js`, this
  property denotes the behavior of a range of text annotated with this entity
  object when editing the text range within the editor. This is addressed in
  greater detail below.
- **data**: An optional object containing metadata for the entity. For instance,
  a `'LINK'` entity might contain a `data` object that contains the `href` value
  for that link.

> - type:表示它是哪种实体类型的字符串。例如:'LINK', 'MENTION', 'PHOTO'
> - mutability:不要将其与 immutable-js 中的不变特性混淆，该属性表示在编辑器中编辑文本范围时,使用该实体对象注释的文本范围的行为。下面将更详细地讨论这个问题。
> - data:包含实体元数据的可选对象。例如，'LINK'实体可能包含一个数据对象，该数据对象包含该链接的 href 值。

All entities are stored in the ContentState record. The entities are referenced
by key within `ContentState` and React components used to decorate annotated
ranges. (We are currently deprecating a previous API for accessing Entities; see
issue
[#839](https://github.com/facebook/draft-js/issues/839).)

> 所有的实体数据都被存储在 ContentState immutbale.js 的 record 类型的对象中。 在 ContentState 和 React 组件内,通过实体的 key 引用这些实体数据，以装饰带注释的文本范围。(我们目前正在弃用以前用于访问实体的 API;见问题[#839](https://github.com/facebook/draft-js/issues/839)。)

Using [decorators](/docs/advanced-topics-decorators) or
[custom block components](/docs/advanced-topics-block-components), you can
add rich rendering to your editor based on entity metadata.

> 通过使用 [decorators](/docs/advanced-topics-decorators) 或
> [custom block components](/docs/advanced-topics-block-components),你能够基于实体元数据向富文本编辑器添加丰富的样式展现。

## Creating and Retrieving Entities

Entities should be created using `contentState.createEntity`, which accepts the
three properties above as arguments. This method returns a `ContentState` record updated to include the newly created entity, then you can call `contentState.getLastCreatedEntityKey` to get the key of the newly created entity record.

> 实体应使用 `contentState.createEntity` 创建，它接受上述三个属性作为参数。此方法返回一个包含新创建的实体对象的 `ContentState` record 对象。然后你可以调用 `contentState.getLastCreatedEntityKey` 获取新创建的实体对象对应的 key 值。

This key is the value that should be used when applying entities to your
content. For instance, the `Modifier` module contains an `applyEntity` method:

> 此 key 是将实体应用到你的内容时应该使用的值。例如, `Modifier` 模块包含了一个 `applyEntity` 方法:

```js
const contentState = editorState.getCurrentContent();
const contentStateWithEntity = contentState.createEntity('LINK', 'MUTABLE', {
  url: 'http://www.zombo.com',
});
const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
const contentStateWithLink = Modifier.applyEntity(
  contentStateWithEntity,
  selectionState,
  entityKey,
);
const newEditorState = EditorState.set(editorState, {
  currentContent: contentStateWithLink,
});
```

For a given range of text, then, you can extract its associated entity key by using
the `getEntityAt()` method on a `ContentBlock` object, passing in the target
offset value.

```js
const contentState = editorState.getCurrentContent();
const blockWithLinkAtBeginning = contentState.getBlockForKey('...');
const linkKey = blockWithLinkAtBeginning.getEntityAt(0);
const linkInstance = contentState.getEntity(linkKey);
const {url} = linkInstance.getData();
```

## "Mutability"

Entities may have one of three "mutability" values. The difference between them
is the way they behave when the user makes edits to them.

Note that `DraftEntityInstance` objects are always immutable Records, and this
property is meant only to indicate how the annotated text may be "mutated" within
the editor. _(Future changes may rename this property to ward off potential
confusion around naming.)_

### Immutable

This text cannot be altered without removing the entity annotation
from the text. Entities with this mutability type are effectively atomic.

For instance, in a Facebook input, add a mention for a Page (e.g. Barack Obama).
Then, either add a character within the mentioned text, or try to delete a character.
Note that when adding or deleting characters, the entity is removed.

This mutability value is useful in cases where the text absolutely must match
its relevant metadata, and may not be altered.

### Mutable

This text may be altered freely. For instance, link text is
generally intended to be "mutable" since the href and linkified text are not
tightly coupled.

### Segmented

Entities that are "segmented" are tightly coupled to their text in much the
same way as "immutable" entities, but allow customization via deletion.

For instance, in a Facebook input, add a mention for a friend. Then, add a
character to the text. Note that the entity is removed from the entire string,
since your mentioned friend may not have their name altered in your text.

Next, try deleting a character or word within the mention. Note that only the
section of the mention that you have deleted is removed. In this way, we can
allow short names for mentions.

## Modifying Entities

Since `DraftEntityInstance` records are immutable, you may not update the `data`
property on an instance directly.

Instead, two `Entity` methods are available to modify entities: `mergeData` and
`replaceData`. The former allows updating data by passing in an object to merge,
while the latter completely swaps in the new data object.

## Using Entities for Rich Content

The next article in this section covers the usage of decorator objects, which
can be used to retrieve entities for rendering purposes.

The [link editor example](https://github.com/facebook/draft-js/tree/master/examples/draft-0-10-0/link)
provides a working example of entity creation and decoration in use.
