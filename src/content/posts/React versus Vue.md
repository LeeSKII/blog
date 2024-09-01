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

   - Vue3因为setup的原因，其运行只会在组件挂载时执行一次。

2. React

   - React在组件更新时会重新调用hooks，当组件的状态发生变化时，React会重新运行hooks函数。(这里非常关键，重新执行hooks意味着组件重新进入生命周期，可能会重新执行多项耗时任务，例如请求数据、渲染DOM等。)

由于React在父组件更新时，会重新调用子组件的hooks，因此可能会导致不必要的性能损失，但是由于React的useEffect的依赖数组机制，可以避免子组件的hooks函数被调用的时候重新计算。

在正常使用React中可能会很少感觉到和Vue之间的差距，甚至是函数式的组件写法更符合编程风格。但是在开发过程中的心智模型下，Vue更符合直觉，在需要渲染，依赖的时候完全可以无脑使用ref等响应式变量进行同步更新，在需要侦听变化的时候使用computed和watch等函数。

React中的useEffect则需要深刻理解其依赖数组的概念，以及useEffect的执行时机。

通过比较后的理解来看，React和Vue实际使用的心智模型不同，在精通React后更容易因为其简洁的API和函数式编程思想而加深理解，但Vue的开发思想更符合直觉和同步的思想，Proxy的响应式机制使其更细粒度，但是组合式API和React Hooks一样，需要对代码的组织能力有相当的控制和逻辑思维，否则更容易写出难以维护的代码。

参考Vue官方文档的[链接](https://cn.vuejs.org/guide/extras/composition-api-faq.html#comparison-with-react-hooks)
