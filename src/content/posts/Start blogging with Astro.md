---
title: 'Start blogging with Astro'
pubDate: 2024-08-12
isPublished: true
description: '这是我 Astro 博客的第一篇文章。'
author: 'Lee Ski'
image:
    url: '@assets/images/posts/used/1.jpg'
    alt: 'A stone in the island of lake.'
tags: ["astro", "blogging"]
---

欢迎来到我学习关于 Astro 的新博客！在这里，我将分享我建立新网站的学习历程。

## 1. What I do

 1. **安装 Astro**：首先，我创建了一个新的 Astro 项目并上传到 Github 仓库。

 2. **制作页面**：然后我学习了如何通过创建新的 `.astro` 文件并将它们保存在 `src/pages/` 文件夹里来制作页面。

 3. **发表博客文章**：这是我的第一篇博客文章！我现在有用 Astro 编写的页面和用 Markdown 写的文章了！

 4. **部署网站**：部署了网站到 Github Pages,部署方式参照官方文档，就是注意设置了 site 后，引用路径都需要增加对应的 site 前缀。

## 2. Why Astro?

### 2.1 Build websites with a modern stack

在使用 Astro 之前，我一直使用 Next.js 来建立网站，但是 Next.js 对 Markdown 处理能力不太好，我使用了一个 Markdown 编辑器来实现在网页上写文章 ，但是在真正撰写 Markdown 的时候，编辑器的体验感远不如使用本地编辑器，例如 Visual Studio Code。

而且如果仅仅是构建个人网站，Next.js 不免给人一种牛刀小用的感觉，因此我一直在寻找到底有哪样的框架适合构建个人网站🤔。

### 2.2 Before I know Astro

在认识到 Astro 之前，我理解中的博客个人网站构建应该是和各类官方文档网站是相似的，它们的构建方式应该是由类似于 Vuepress 这样的静态网站生成器来实现的。

 Vuepress 是基于 VUE 框架来实现的，但是最近的一年来，我疯狂的痴迷 React 开发，因此我有想过，有哪些 React 相关的博客网站构建工具可以学习一下。

基于 React 实现的博客网站构建工具对标 Vuepress 的有一个非常著名的框架叫 Docusaurus，不过我还未来得及尝试，因为我先了解到了 Astro。

### 2.3 How I know Astro

说到痴迷 React 这一块，我前段时间在 Bilibili 和 Youtube 上学习关于 React 源码方面的视频，顺便一提，源码的学习确实非常有挑战性，即使是跟着视频学习，我仍然时常感觉力不从心。

因此，我开始搜索不同的博主发布的 React 源码解读的相关教程，发现 Youtube 上有一位博主的视频质量相当可以，他的名字叫做 JSer ，顺便我还拜访了他的个人网站 [JSer.dev](https://jser.dev/)，里面关于 React 的很多说明真的很棒，不过在我闲逛之余，我也在想，这样的人是用什么框架完成他的个人网站建设的？这样的个人博客网站似乎就是我一直想搭建的，构建个人的技术博客网站，应该就是这样的简洁明了。

于是，我使用 F12 进入到浏览器的开发者界面，在 initiator 中看到了有一部分 url 包含了 astro 字样，我想这一定是某个框架，于是我开始搜索到底什么是 Astro ，就这样认识到了 Astro。

### 2.4 Why I choose Astro

如何评判一个开源框架或者说作品是否值得花费相当的经历去投入学习，直接从它的介绍开始看起，官网就是最佳介绍媒介，Astro 的官网毫无疑问是符合我的审美，并且文档之全，使用文字毫不晦涩难懂，丰富的 tutorial 教程，以及各种一眼看上去就足够心动的功能，我想，没有哪位程序员会拒绝它，并且当我在一天内完成了它的教程，并构建了这个博客个人网站之后，我确实觉得它是一款值得推荐的框架。
