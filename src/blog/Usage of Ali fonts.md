---
title: Usage of Alibaba fonts
author: 'Lee Ski'
description: "Ali icon fonts 的用法。"
image:
    url: "@postImages/2.jpg"
    alt: "The Astro logo on a dark background with a purple gradient arc."
pubDate: 2024-08-13
isPublished: true
tags: ["css", "fonts"]
---

## How to use Alibaba Fonts

### 1. 下载字体文件

按照阿里巴巴字体库官网的说明，下载字体文件。

### 2. 引入文件

将下载的字体文件放到项目的 `public/fonts` 文件夹下，然后在`global.css` 文件中引入字体文件。

```css
/* 注册你的自定义字体并告诉浏览器它在哪里 */
@font-face {
  font-family: "AlimamaAgileVF-Thin";
  src: url("/blog/fonts/AlimamaAgileVF-Thin.woff") format("woff");
  font-display: swap;
}
```

### 3. 使用字体

在 `global.css` 文件中，使用 `font-family` 属性指定字体名称。

```css
/* 全局使用字体 */
html {
  background-color: #f1f5f9;
  font-family: "AlimamaAgileVF-Thin";
}
```

### 4. 设置字体样式

常规的设置字体斜体，不会生效，例如`font-style: italic;`，必须使用`font-variation-settings`属性进行控制，控制的哪个样式的属性需要在官网使用开发者面板查看。

斜体样式示例：

```css
a {
  color: blue;
  font-weight: 600;
  font-variation-settings: "slnt" 12;
}
```
