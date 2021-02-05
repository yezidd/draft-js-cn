const {
  fbInternalOnly
} = require('internaldocs-fb-helpers');

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
module.exports = {
  title: 'Draft.js',
  tagline: '富文本编辑器框架 for React',
  url: 'https://draftjs.cn',
  baseUrl: '/',
  organizationName: '幽海(个人)',
  projectName: 'draft-js',
  favicon: 'img/draftjs-logo.ico',
  presets: [['@docusaurus/preset-classic', {
    docs: {
      path: '../docs',
      sidebarPath: require.resolve('./sidebars.js'),
      editUrl: 'https://github.com/facebook/draft-js/edit/master/docs',
      showLastUpdateAuthor: true,
      showLastUpdateTime: true
    },
    theme: {
      customCss: require.resolve('./src/css/custom.css')
    }
  }]],
  themeConfig: {
    disableDarkMode: true,
    navbar: {
      title: 'Draft.js中文网',
      logo: {
        alt: 'Draft.js Logo',
        src: 'img/draftjs-logo.svg'
      },
      links: [{
        to: 'docs/getting-started',
        label: '文档',
        position: 'right'
      }, {
        href: 'https://github.com/yezidd/draft-js-cn',
        label: 'GitHub',
        position: 'right'
      }, ...fbInternalOnly([{
        "to": "docs/fb/index",
        "label": "FB Internal",
        "position": "right"
      }])]
    },
    footer: {
      style: 'dark',
      links: [{
        title: 'Docs',
        items: [{
          label: '开始入门',
          to: 'docs/getting-started'
        }, {
          label: 'API 参考',
          to: 'docs/api-reference-editor'
        }]
      }, {
        title: '社区',
        items: [{
          label: 'Stack Overflow',
          href: 'https://stackoverflow.com/questions/tagged/draftjs'
        }, {
          label: 'Twitter',
          href: 'https://twitter.com/draft_js'
        }]
      }, {
        title: '更多',
        items: [{
          label: '英文github地址',
          href: 'https://github.com/facebook/draft-js'
        },{
          label: '英文官网地址',
          href: 'https://draftjs.org/'
        }]
      }],
      logo: {
        alt: 'Facebook Open Source Logo',
        src: '/img/oss_logo.png',
        href: 'https://opensource.facebook.com/'
      },
      copyright: `Copyright © ${new Date().getFullYear()} youhai, Inc.`
    }
  },
  plugins: [require.resolve('docusaurus-plugin-internaldocs-fb')],
};
