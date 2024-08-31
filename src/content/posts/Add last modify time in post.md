---
title: Add last modify time in post
author: Lee Ski
description: "How to add last modify time in post."
image:
    url: "@assets//images/posts/used/daniel-sessler.jpg"
    alt: "A small island in the middle of the ocean."
pubDate: 2024-08-16
isPublished: true
tags: ["astro", "learning",'blogging' ]
---


## Introduction

This is a tutorial on how to add last modify time in post.

### Step 1: 修改 deploy.yaml 文件

在 build 中按如下设置

``` yaml
build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout your repository using git
        uses: actions/checkout@v4
        with:
          fetch-depth: 0 # 克隆整个仓库历史记录，包括所有提交。（可选）
      - name: Install, build, and upload your site
        uses: withastro/action@v2
```

增加一行`fetch-depth: 0`, 这样就可以获取到所有提交记录，不加这个参数的话，默认只获取最新提交记录。

因为默认是按 git 的提交记录来设置修改时间。

### Step 2: 增加 remark-modified-time.mjs 文件

按要求增加 `remark-modified-time.mjs` 文件，文件内容如下：

``` js
import { execSync } from "child_process";

export function remarkModifiedTime() {
  return function (tree, file) {
    const filepath = file.history[0];
    console.log(filepath.toString());
    const result = execSync(`git log -1 --pretty="format:%cI" "${filepath}"`);
    console.log(result.toString());
    file.data.astro.frontmatter.lastModified = result.toString();
  };
}
```

### Step 3: 在 `[...slug].astro` 中使用该文件

``` js
---
import { getCollection } from "astro:content";
import MarkdownPostLayout from "../../layouts/MarkdownPostLayout.astro";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

export async function getStaticPaths() {
  const blogEntries = (await getCollection("posts")).filter(
    (entry) => entry.data.isPublished
  );
  return blogEntries.map((entry) => ({
    params: { slug: entry.slug },
    props: { entry },
  }));
}

const { entry } = Astro.props;
const { Content, remarkPluginFrontmatter } = await entry.render();
const lastModified = dayjs(remarkPluginFrontmatter.lastModified)
  .utc()
  .format("HH:mm:ss DD MMMM YYYY UTC");
---

<MarkdownPostLayout frontmatter={{ ...entry.data, lastModified }}>
  <Content />
</MarkdownPostLayout>

```

注意要在 `render()` 函数中解构出 `remarkPluginFrontmatter` 变量，然后获取 `lastModified` 字段，并作为参数传递给自定义的 `MarkdownPostLayout` 组件。

### Step 4: 与教程差异问题

教程中使用的 markdownlayout 是 md 文件中 frontmatter 的内容，而本文中使用的是 `MarkdownPostLayout` 组件，所以需要手动将参数传入该组件。
