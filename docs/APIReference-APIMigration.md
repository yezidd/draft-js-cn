---
id: v0-10-api-migration
title: v0.10 API Migration(v0.10 API迁移)
---

The Draft.js v0.10 release includes a change to the API for managing
`DraftEntity` data; the global 'DraftEntity' module is being deprecated and
`DraftEntity` instances will be managed as part of `ContentState`. This means
that the methods which were previously accessed on `DraftEntity` are now moved
to the `ContentState` record.

> Draftjs v0.10 发行版本包含了一个针对管理 `DraftEntity` 数据的 API 变更； 全局 'DraftEntity' 模块废弃 和 `DraftEntity` 实例将作为 ContentState 的一部分进行管理。这意味着以前在 `DraftEntity` 上访问的方法现在被移动到 `ContentState` record 对象中。

The old API was set to be permanently removed in v0.11, but will now be removed in v0.12. Make sure to migrate over!

> 旧的 API 在 v0.11 中被设置为永久删除，但是现在将在 v0.12 中删除。请务必要迁移 API！

This API improvement unlocks the path for many benefits that will be available in v0.12:

> 这个 API 的改进为 v0.12 中 API 使用的路径提供了许多好处:

- DraftEntity instances and storage will be immutable.
- DraftEntity will no longer be globally accessible.
- Any changes to entity data will trigger a re-render.

> - DraftEntity 实例和存储将是 immutable 的.
> - DraftEntity 不会再在全局被访问到.
> - 对实体数据的任何更改都将触发重新渲染.

## Quick Overview

Here is a quick list of what has been changed and how to update your application:

> 这里是一个简单的列表展示新版已经改变了什么，以及如何更新你的应用程序:

### Creating an Entity

**Old Syntax**

```js
const entityKey = Entity.create(urlType, 'IMMUTABLE', {src: urlValue});
```

**New Syntax**

```js
const contentStateWithEntity = contentState.createEntity(urlType, 'IMMUTABLE', {
  src: urlValue,
});
const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
```

### Getting an Entity

**Old Syntax**

```js
const entityInstance = Entity.get(entityKey);
// entityKey is a string key associated with that entity when it was created
```

**New Syntax**

```js
const entityInstance = contentState.getEntity(entityKey);
// entityKey is a string key associated with that entity when it was created
```

### Decorator strategy arguments change

**Old Syntax**

```js
const compositeDecorator = new CompositeDecorator([
  {
    strategy: (contentBlock, callback) =>
      exampleFindTextRange(contentBlock, callback),
    component: ExampleTokenComponent,
  },
]);
```

**New Syntax**

```js
const compositeDecorator = new CompositeDecorator([
  {
    strategy: (contentBlock, callback, contentState) => (
      contentBlock, callback, contentState
    ),
    component: ExampleTokenComponent,
  },
]);
```

Note that ExampleTokenComponent will receive contentState as a prop.

> 请注意,ExampleTokenComponent 将接受 contentState 作为一个 props 传递进来

Why does the 'contentState' get passed into the decorator strategy now? Because we may need it if our strategy is to find certain entities in the contentBlock:

> 为什么现在 装饰器(decorator)的策略(strategy)中想要把 'contentState' 传递过去呢?因为如果我们在策略中想要在 contentBlock 中找到某些实体,我们可能需要它:

```js
const mutableEntityStrategy = function(contentBlock, callback, contentState) {
  contentBlock.findEntityRanges(character => {
    const entityKey = character.getEntity();
    if (entityKey === null) {
      return false;
    }
    // To look for certain types of entities,
    // or entities with a certain mutability,
    // you may need to get the entity from contentState.
    // In this example we get only mutable entities.
    return contentState.getEntity(entityKey).getMutability() === 'MUTABLE';
  }, callback);
};
```

### Decorator Strategies that find Entities

**Old Syntax**

```js
function findLinkEntities(contentBlock, callback) {
  contentBlock.findEntityRanges(character => {
    const entityKey = character.getEntity();
    return entityKey !== null && Entity.get(entityKey).getType() === 'LINK';
  }, callback);
}
```

**New Syntax**

```js
function findLinkEntities(contentBlock, callback, contentState) {
  contentBlock.findEntityRanges(character => {
    const entityKey = character.getEntity();
    return (
      entityKey !== null &&
      contentState.getEntity(entityKey).getType() === 'LINK'
    );
  }, callback);
}
```

## More Information

See the [updated examples](https://github.com/facebook/draft-js/tree/master/examples/draft-0-10-0).

> 有关更多信息，请参见[updated examples](https://github.com/facebook/draft-js/tree/master/examples/draft-0-10-0).
