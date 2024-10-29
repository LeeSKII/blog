---
title: What is function calling
author: Lee Ski
description: "What is function calling?"
image:
  url: "@postImages/zach-wear-wjCYyd_KppE-unsplash.jpg"
  alt: "A group of people seating in the classroom"
pubDate: 2024-10-28
isPublished: true
tags: ["ai", "learning"]
---

## 1.介绍

什么是函数调用？

## 2.定义

- 根据 Ollama Github 中的 [example](https://github.com/ollama/ollama/tree/main/examples/typescript-functioncalling) 非常直观的阐述了什么是 function calling。

> One of the features added to some models is 'function calling'. It's a bit of a confusing name. It's understandable if you think that means the model can call functions, but that's not what it means. Function calling simply means that the output of the model is formatted in JSON, using a preconfigured schema, and uses the expected types. Then your code can use the output of the model and call functions with it. Using the JSON format in Ollama, you can use any model for function calling.

并且相关的案例代码阐述了如何使用 Ollama 的 function calling 能力。

- 根据A社的Github教程 [tool_use_overview](https://github.com/anthropics/courses/blob/master/tool_use/01_tool_use_overview.ipynb)

- 根据 [Qwen文档](https://qwen.readthedocs.io/zh-cn/latest/framework/function_call.html) 的定义：

> 函数调用本质上是通过提示词工程来实现的。

所以这就是为什么原始的 llama2 模型虽然不具备function calling的能力，但是经过微调后可以具备该能力。

## 3.示例

- 这里是关于使用 [Ollama](https://ollama.com/blog/tool-support) 进行函数调用的说明：具体的参考[示例](https://github.com/ollama/ollama-js/blob/main/examples/tools/tools.ts)
- 这篇来自HF的 [博客](https://huggingface.co/blog/zh/unified-tool-use) 综合说明了tool use在不同厂商提供的大模型是如何实践以及统一使用的。

## 4.总结

函数调用的本质是大语言模型在经过工具即 tool use 使用场景的指令微调之后，具备在固定场景的对话情境中输出调用工具的请求，一般是以`Json`格式进行回复，回复的内容会提示程序员调用何种函数，对应的参数是什么。程序员手动进行解析后然后根据回复调用相应的代码实现。

tool use的能力赋予了大模型接触外部系统的能力，但其关键在于如何让大模型能“聪明的”识别何种指令下调用哪些工具，已经识别调用该工具时如何从上下文中找到需要的参数。
