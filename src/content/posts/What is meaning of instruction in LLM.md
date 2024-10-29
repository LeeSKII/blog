---
title: What is meaning of “instruction” in LLM?
author: Lee Ski
description: "What is meaning of “instruction” in LLM?"
image:
  url: "@postImages/bennie-bates-sampOrYRePY-unsplash.jpg"
  alt: "A planet with boosters"
pubDate: 2024-10-29
isPublished: true
tags: ["ai", "learning"]
---

## 1.介绍

根据 [Qwen文档](https://qwen.readthedocs.io/zh-cn/latest/getting_started/concepts.html) 官方文档：

> 基础语言模型 (base language models) 是在大量文本语料库上训练的基本模型，用于预测序列中的下一个词。它们的主要目标是捕捉语言的统计模式和结构，使它们能够生成连贯且具有上下文关联性的文本。这些模型具有多功能性，可以通过微调适应各种自然语言处理任务。虽然擅长生成流畅的文本，但它们可能需要情境学习 (in-context learning)或额外训练才能遵循特定指令或有效执行复杂推理任务。对于 Qwen 模型，基础模型是指那些没有 “-Instruct” 标识符的模型，例如 Qwen2.5-7B 和 Qwen2.5-72B 。

模型名称中的 “-Instruct” 后缀表示该模型为指令微调模型 (Instruction-tuned models)

> 指令微调语言模型 (Instruction-tuned language models) 是专门设计用于理解并以对话风格执行特定指令的模型。这些模型经过微调，能准确地解释用户命令，并能以更高的准确性和一致性执行诸如摘要、翻译和问答等任务。与在大量文本语料库上训练的基础模型不同，指令调优模型会使用包含指令示例及其预期结果的数据集进行额外训练，通常涵盖多个回合。这种训练方式使它们非常适合需要特定功能的应用，同时保持生成流畅且连贯文本的能力。对于 Qwen 模型，指令调优模型是指带有 “-Instruct” 后缀的模型，例如 Qwen2.5-7B-Instruct 和 Qwen2.5-72B-Instruct 。
