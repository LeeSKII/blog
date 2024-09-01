---
title: React versus Vue
author: Lee Ski
description: "What is the difference between React and Vue?"
image:
  url: "@postImages/lawrence-crayton-x7eUeiEmpBM-unsplash.jpg"
  alt: "man in orange t-shirt and gray pants holding black and white cat."
pubDate: 2024-08-31
isPublished: true
tags: ["react", "vue3", "programming"]
---

## Introduction

Who is the better frontend framework? React or Vue? In this article, we will explore the differences between React and Vue. We will also discuss the pros and cons of each framework and provide a comparison of their features.

### 1.Thinking from global variables

如果需要设置一个全局变量，并且在多个组件之间实现共享，用React和Vue分别是如何实现的？

1. Vue3

   - 通过新建一个 `store.js` 文件，模块作用域下定义 `ref` 或者 `reactive` 变量，然后导出，在其它组件直接引入该模块文件的导出变量或者是其它导出了该变量的函数。

   - 通过 `provide` 和 `inject` 两个 API，可以实现跨组件的全局变量共享。

2. React

   - 通过 `useContext` 这个 API，可以实现跨组件的全局变量共享。

在这里可以看出来， Vue的控制粒度相比于React是更细的。

React的state必须是属于组件的一部分，而Vue的state可以是全局的，也可以是局部的。

React是通过setState来实现触发组件的更新，而Vue是通过Proxy代理了对象的set方法，从而触发引用了该变量的组件更新。

### 2.渲染机制的不同

1. Vue3

   - Vue3在生成虚拟DOM时，会对比新旧虚拟DOM，只更新需要更新的部分，而不是重新渲染整个DOM。

2. React

   - React在组件更新时会重新调用hooks，当组件的状态发生变化时，React会重新渲染整个组件，而不是仅仅更新部分。(这里非常关键，重新执行hooks意味着组件重新进入生命周期，可能会重新执行多项耗时任务，例如请求数据、渲染DOM等。)

参考Vue官方文档的[链接](https://cn.vuejs.org/guide/extras/composition-api-faq.html#comparison-with-react-hooks)
