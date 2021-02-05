/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';

import Layout from '@theme/Layout';

import classnames from 'classnames';

import DraftEditorExample from '../components/DraftEditorExample';
import styles from './styles.module.css';

/** Won't render children on server */
function ClientOnly({children, fallback}) {
  if (typeof window === 'undefined') {
    return fallback || null;
  }
  return children;
}

function Home() {
  const context = useDocusaurusContext();
  const {siteConfig = {}} = context;

  return (
    <Layout permalink="/" description={siteConfig.tagline}>
      <div className="hero hero--primary shadow--lw">
        <div className="container">
          <div className="row">
            <div className="col">
              <h1 className="hero__title">{siteConfig.title}</h1>
              <p className="hero__subtitle">{siteConfig.tagline}</p>
              <div>
                <Link
                  className="button button--secondary button--lg"
                  to={useBaseUrl('docs/getting-started')}>
                  开始入门
                </Link>
              </div>
            </div>
            <div className="col text--center">
              <img
                className={styles.demoGif}
                src={useBaseUrl('/img/demo.gif')}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="margin-vert--xl">
          <div className="row">
            <div className="col">
              <h3>Extensible and Customizable</h3>
              <h3>可扩展的和可定制的</h3>
              <p>
                We provide the building blocks to enable the creation of a broad
                variety of rich text composition experiences, from basic text
                styles to embedded media.
              </p>
              <p>
                我们提供了构建块为了能够提供一个丰富多样的富文本文字创作经验，从基本的文字样式到嵌入式的媒体模块
              </p>
            </div>
            <div className="col">
              <h3>Declarative Rich Text</h3>
              <h3>声明式编程的富文本编辑器</h3>
              <p>
                Draft.js fits seamlessly into React applications, abstracting
                away the details of rendering, selection, and input behavior
                with a familiar declarative API.
              </p>
              <p>
                Draft.js无缝地融入React应用程序，用一个熟悉的声明性API抽象出渲染、选择和输入行为的细节。
              </p>
            </div>
            <div className="col">
              <h3>Immutable Editor State</h3>
              <h3>immutable编辑器的状态</h3>
              <p>
                The Draft.js model is built with{' '}
                <a
                  href="https://immutable-js.github.io/immutable-js/"
                  target="_blank"
                  rel="noreferrer noopener">
                  immutable-js
                </a>
                , offering an API with functional state updates and aggressively
                leveraging data persistence for scalable memory usage.
              </p>
              <p>
                Draft.js 的模型是基于{' '}
                <a
                  href="https://immutable-js.github.io/immutable-js/"
                  target="_blank"
                  rel="noreferrer noopener">
                  immutable-js
                </a>
                {' '}构建的, 一个提供了一个具有功能状态更新和积极利用数据持久性来扩展内存使用的API的库。
              </p>
            </div>
          </div>
        </div>
        <div
          className={classnames(
            'row',
            'margin-vert--xl',
            styles.hideOnTabletAndSmaller,
          )}>
          <ClientOnly fallback={null}>
            <div className="col col--6 col--offset-3">
              <h2>尝试一下!</h2>
              <p>这是一个基于Draft.js的简单的富文本编辑器例子</p>
              <div id="rich-example">
                <DraftEditorExample />
              </div>
            </div>
          </ClientOnly>
        </div>
        <div className="margin-vert--xl text--center">
          <Link
            className="button button--primary button--lg"
            to={useBaseUrl('docs/getting-started')}>
            学习更多有关 Draft.js
          </Link>
        </div>
      </div>
    </Layout>
  );
}

export default Home;
