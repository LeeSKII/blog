---
title: Deep dive into LLMs like ChatGPT
author: Lee Ski
description: "The general introduction of ChatGPT."
image:
    url: "@postImages/david-georgiyev-VtUPR9iw5cY-unsplash.jpg"
    alt: "Lunar eclipse."
pubDate: 2025-03-27
isPublished: true
tags: ["ai", "learning",'blogging']
---

## Introduction

当你在ChatGPT的对话框中输入信息，并且点击“Send”按钮后，得到了ChatGPT的回答。

这个充满着神奇的工具背后的原理究竟是什么呢？

越来越多的人类将接触知识的媒介从搜索引擎的Input text转换到了聊天工具的Input Text，并且这个趋势还在持续增长。

但是在这个对话框中，你应该输入什么，AI给你的回答又是如何生成的？

希望通过这篇文章，你能了解ChatGPT背后的概念和原理，以及这样的工具是通过何种方式构建的。

并且你能知道这类工具究竟擅长什么领域，又不适合哪些任务，认识到这类工具在哪些特别情况可能成为双刃剑。

最后对AI的理解能有一个自己的独特认识。

*文章内容根据Andrej Karpathy的视频[Deep dive into LLMs like ChatGPT](https://www.youtube.com/watch?v=7xTGNNLPyMI) 进行整理。*

## 1. How to build a ChatGPT

构建一个Chat GPT是一个按固定顺序的多步骤过程，第一步是预训练。

### 1.1 Pre-training

预训练的第一个步骤是下载并处理大量的互联网文本数据。

#### 1.1.1 Download and process Internet

为了大致了解这个步骤是怎么做，可以从huggingface的[FineWeb](https://huggingface.co/spaces/HuggingFaceFW/blogpost-fineweb-v1)开始。

[FineWeb](https://huggingface.co/spaces/HuggingFaceFW/blogpost-fineweb-v1)的首页介绍了这个项目的整体情况，以及它是如何构建的。

所有主流的大语言模型如ChatGPT,Llama,Claude的母公司Openai,Anthropic,Meta，它们内部都有一个类似的数据集。

所以，概括的说，这个步骤是想要取得什么样的目标？

**大量的文本**，从公开领域搜集非常多非常多高质量的文本，同时，我们希望这些文本内容是极具多样性的，因为我们希望内部包含了很多方面的知识。

FineWeb是一个我们可以接触到的生产级别就绪的数据集的典型示例。

> a new, large-scale (15-trillion tokens, 44TB disk space) dataset for LLM pretraining.

但是以今天的互联网数据来说，这实际上并不是一个非常大的数据集。

FineWeb并不是一个从0开始的项目，它起源于[Common crawl](https://commoncrawl.org/)

> The Common Crawl non–profit organization has been crawling the web since 2007 and releases a new crawl containing 200 to 400 TiB of textual content obtained via automatic web crawling usually every 1 or 2 months.

可以看到截至到2024年，Common crawl相关的网页搜索数据。

> the latest CC crawl (April 2024) contains 2.7 billion web pages, totaling 386 TiB of uncompressed HTML text content.

构建这样一个数据集实际是一个具有相当复杂程度的任务，需要从互联网中获取大量的文本并妥善处理多个步骤。

Common crawl搜集的数据其实相对比较原始。

> The Common Crawl dataset is a collection of web pages that are publicly available on the internet. It contains a large amount of textual data, but it is not always clean and well-structured.

The FineWeb pipeline

![The FineWeb pipeline](../assets/images/posts/used/ai/fineweb-recipe.png)

1. URL Filtering: 过滤掉那些不适合作为训练数据集的网页。
2. Text Extraction: 从网页中提取文本，包括标题，正文，元数据等。
3. Language Filtering: 过滤掉那些不需要作为训练数据集的语言。
4. Gopher Filtering: 过滤掉那些不适合作为训练数据集的网页。
5. MinHash Filtering: 过滤掉那些相似的网页。
6. C4 Filters:
7. Custom Filters: 自定义过滤器，比如，过滤掉那些包含特定词汇的网页。
8. PⅡ Filtering: 。


