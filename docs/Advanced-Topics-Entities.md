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

> 然后，对于给定的文本范围,你可以通过在 `ContentBlock` 对象上使用 `getEntityAt()` 方法，传入给定的目标文本中的文本字符偏移量,提取其中文本相关联的实体对象 key 值.

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

> 实体 可能具有 三个 "mutability" 值中的其中一个。它们之间的区别是用户对它们进行编辑时它们的行为方式。

Note that `DraftEntityInstance` objects are always immutable Records, and this
property is meant only to indicate how the annotated text may be "mutated" within
the editor. _(Future changes may rename this property to ward off potential
confusion around naming.)_

> 需要注意的是,`DraftEntityInstance`对象一直是 immutable record 对象,并且此 "Mutability" 属性仅用于指示如何在编辑器中对带注释的文本进行“mutated(突变)”。 （将来的更改可能会重命名此属性，以防止命名方面的潜在混乱。）

### Immutable

This text cannot be altered without removing the entity annotation
from the text. Entities with this mutability type are effectively atomic.

> 在不从文本中删除实体注释的情况下，无法更改此文本。具有这种可变性类型的实体实际上是 atomic(原子)的。

For instance, in a Facebook input, add a mention for a Page (e.g. Barack Obama).
Then, either add a character within the mentioned text, or try to delete a character.
Note that when adding or deleting characters, the entity is removed.

> 例如,在 Facebook 页面的输入框中,添加一个 mention(提及) 功能(比如 Barack Obama).然后,不管是增加一个字符或者删掉一个字符，我们可以注意到删除或者添加字符的时候，文本上的实体注释将会被删除。(原子性的表现，表现为一个整体)

This mutability value is useful in cases where the text absolutely must match
its relevant metadata, and may not be altered.

> 当文字必须完全匹配它的相关的实体元数据，而且不能被改变的时候，此可变值就变得很有用了.

### Mutable

This text may be altered freely. For instance, link text is
generally intended to be "mutable" since the href and linkified text are not
tightly coupled.

> 文本可以自由地更改.例如,链接的文字是可以设置成 "mutable" 类型的，因为链接的地址和文字不是强关联的。

### Segmented

Entities that are "segmented" are tightly coupled to their text in much the
same way as "immutable" entities, but allow customization via deletion.

> 被 "segmented" 类型修饰的实体像 "mutable" 类型实体一样强关联对应的文字,但是允许自定义的删除。

For instance, in a Facebook input, add a mention for a friend. Then, add a
character to the text. Note that the entity is removed from the entire string,
since your mentioned friend may not have their name altered in your text.

> 例如,在 Facebook 的输入框中,添加一个朋友的 mention(提及),然后给这个 mention 文本添加了一个字符串。请注意,实体已经从整个字符串中删除，因为你提及的朋友并没有你修改字符串之后的名字。

Next, try deleting a character or word within the mention. Note that only the
section of the mention that you have deleted is removed. In this way, we can
allow short names for mentions.

> 接下来，尝试在你提及的朋友的名字中，删除一个字符或者一个单词。注意只有你删除的那一部分文本的实体会被删除，用这样的方式，我们可以允许名称的缩写。

## Modifying Entities

Since `DraftEntityInstance` records are immutable, you may not update the `data`
property on an instance directly.

> 由于 `DraftEntityInstance` record 类型对象是 immutable(不可变的), 所以你可能不能在实例上直接更新 `data` 属性的值。

Instead, two `Entity` methods are available to modify entities: `mergeData` and
`replaceData`. The former allows updating data by passing in an object to merge,
while the latter completely swaps in the new data object.

> 相反,两个 `Entity` 可以用来修改实体对象: `mergeData` 和 `replaceData`. 前者允许传入一个对象合并实体属性值来更新数据，而后者则完全替换实体属性值.

## Using Entities for Rich Content

The next article in this section covers the usage of decorator objects, which
can be used to retrieve entities for rendering purposes.

> 本节的下一篇文章将介绍 decorator(装饰器)对象的用法，它可用于检索实体以实现渲染的目的。

The [link editor example](https://github.com/facebook/draft-js/tree/master/examples/draft-0-10-0/link)
provides a working example of entity creation and decoration in use.

> [link editor example](https://github.com/facebook/draft-js/tree/master/examples/draft-0-10-0/link)提供了一个可直接运行的实体创建和装饰器(decorator)的工作示例.

```js
<!--
Copyright (c) Facebook, Inc. and its affiliates. All rights reserved.
This file provided by Facebook is for non-commercial testing and evaluation
purposes only. Facebook reserves all rights not expressly granted.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
-->
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Draft • Link Editor</title>
    <link rel="stylesheet" href="../../../dist/Draft.css" />
  </head>
  <body>
    <div id="target"></div>
    <script src="../../../node_modules/react/umd/react.development.js"></script>
    <script src="../../../node_modules/react-dom/umd/react-dom.development.js"></script>
    <script src="../../../node_modules/immutable/dist/immutable.js"></script>
    <script src="../../../node_modules/es6-shim/es6-shim.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/babel-core/5.8.34/browser.js"></script>
    <script src="../../../dist/Draft.js"></script>
    <script type="text/babel">
      'use strict';

      const {
        convertToRaw,
        CompositeDecorator,
        Editor,
        EditorState,
        RichUtils,
      } = Draft;

      class LinkEditorExample extends React.Component {
        constructor(props) {
          super(props);

          const decorator = new CompositeDecorator([
            {
              strategy: findLinkEntities,
              component: Link,
            },
          ]);

          this.state = {
            editorState: EditorState.createEmpty(decorator),
            showURLInput: false,
            urlValue: '',
          };

          this.focus = () => this.refs.editor.focus();
          this.onChange = (editorState) => this.setState({editorState});
          this.logState = () => {
            const content = this.state.editorState.getCurrentContent();
            console.log(convertToRaw(content));
          };

          this.promptForLink = this._promptForLink.bind(this);
          this.onURLChange = (e) => this.setState({urlValue: e.target.value});
          this.confirmLink = this._confirmLink.bind(this);
          this.onLinkInputKeyDown = this._onLinkInputKeyDown.bind(this);
          this.removeLink = this._removeLink.bind(this);
        }

        _promptForLink(e) {
          e.preventDefault();
          const {editorState} = this.state;
          const selection = editorState.getSelection();
          if (!selection.isCollapsed()) {
            const contentState = editorState.getCurrentContent();
            const startKey = editorState.getSelection().getStartKey();
            const startOffset = editorState.getSelection().getStartOffset();
            const blockWithLinkAtBeginning = contentState.getBlockForKey(startKey);
            const linkKey = blockWithLinkAtBeginning.getEntityAt(startOffset);

            let url = '';
            if (linkKey) {
              const linkInstance = contentState.getEntity(linkKey);
              url = linkInstance.getData().url;
            }

            this.setState({
              showURLInput: true,
              urlValue: url,
            }, () => {
              setTimeout(() => this.refs.url.focus(), 0);
            });
          }
        }

        _confirmLink(e) {
          e.preventDefault();
          const {editorState, urlValue} = this.state;
          const contentState = editorState.getCurrentContent();
          const contentStateWithEntity = contentState.createEntity(
            'LINK',
            'MUTABLE',
            {url: urlValue}
          );
          const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
          const newEditorState = EditorState.set(editorState, { currentContent: contentStateWithEntity });
          this.setState({
            editorState: RichUtils.toggleLink(
              newEditorState,
              newEditorState.getSelection(),
              entityKey
            ),
            showURLInput: false,
            urlValue: '',
          }, () => {
            setTimeout(() => this.refs.editor.focus(), 0);
          });
        }

        _onLinkInputKeyDown(e) {
          if (e.which === 13) {
            this._confirmLink(e);
          }
        }

        _removeLink(e) {
          e.preventDefault();
          const {editorState} = this.state;
          const selection = editorState.getSelection();
          if (!selection.isCollapsed()) {
            this.setState({
              editorState: RichUtils.toggleLink(editorState, selection, null),
            });
          }
        }

        render() {
          let urlInput;
          if (this.state.showURLInput) {
            urlInput =
              <div style={styles.urlInputContainer}>
                <input
                  onChange={this.onURLChange}
                  ref="url"
                  style={styles.urlInput}
                  type="text"
                  value={this.state.urlValue}
                  onKeyDown={this.onLinkInputKeyDown}
                />
                <button onMouseDown={this.confirmLink}>
                  Confirm
                </button>
              </div>;
          }

          return (
            <div style={styles.root}>
              <div style={{marginBottom: 10}}>
                Select some text, then use the buttons to add or remove links
                on the selected text.
              </div>
              <div style={styles.buttons}>
                <button
                  onMouseDown={this.promptForLink}
                  style={{marginRight: 10}}>
                  Add Link
                </button>
                <button onMouseDown={this.removeLink}>
                  Remove Link
                </button>
              </div>
              {urlInput}
              <div style={styles.editor} onClick={this.focus}>
                <Editor
                  editorState={this.state.editorState}
                  onChange={this.onChange}
                  placeholder="Enter some text..."
                  ref="editor"
                />
              </div>
              <input
                onClick={this.logState}
                style={styles.button}
                type="button"
                value="Log State"
              />
            </div>
          );
        }
      }

      function findLinkEntities(contentBlock, callback, contentState) {
        contentBlock.findEntityRanges(
          (character) => {
            const entityKey = character.getEntity();
            return (
              entityKey !== null &&
              contentState.getEntity(entityKey).getType() === 'LINK'
            );
          },
          callback
        );
      }

      const Link = (props) => {
        const {url} = props.contentState.getEntity(props.entityKey).getData();
        return (
          <a href={url} style={styles.link}>
            {props.children}
          </a>
        );
      };

      const styles = {
        root: {
          fontFamily: '\'Georgia\', serif',
          padding: 20,
          width: 600,
        },
        buttons: {
          marginBottom: 10,
        },
        urlInputContainer: {
          marginBottom: 10,
        },
        urlInput: {
          fontFamily: '\'Georgia\', serif',
          marginRight: 10,
          padding: 3,
        },
        editor: {
          border: '1px solid #ccc',
          cursor: 'text',
          minHeight: 80,
          padding: 10,
        },
        button: {
          marginTop: 10,
          textAlign: 'center',
        },
        link: {
          color: '#3b5998',
          textDecoration: 'underline',
        },
      };

      ReactDOM.render(
        <LinkEditorExample />,
        document.getElementById('target')
      );
    </script>
  </body>
</html>
```
