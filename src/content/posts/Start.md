---
title: 'Astro 博客的起点'
pubDate: 2024-08-12
description: '这是我 Astro 博客的第一篇文章。'
author: 'Lee Ski'
image:
    url: '../../assets//images/posts/post-1/1.jpg'
    alt: 'A stone in the island of lake.'
tags: ["astro", "blogging"]
---

欢迎来到我学习关于 Astro 的新博客！在这里，我将分享我建立新网站的学习历程。

## 1. 我做了什么

 1. **安装 Astro**：首先，我创建了一个新的 Astro 项目并上传到 Github 仓库。

 2. **制作页面**：然后我学习了如何通过创建新的 `.astro` 文件并将它们保存在 `src/pages/` 文件夹里来制作页面。

 3. **发表博客文章**：这是我的第一篇博客文章！我现在有用 Astro 编写的页面和用 Markdown 写的文章了！

 4. **部署网站**：部署了网站到 Github Pages,部署方式参照官方文档，就是注意设置了 site 后，引用路径都需要增加对应的 site 前缀。

## 2. 图像的处理

图片保存到`src`文件夹内，使用`astro`内置的`Image`组件处理图片, 并且设置了 img 标签的样式。
