---
title: Retrieval augmented generation (RAG) practice
author: Ski Lee
description: "Practice of RAG with Ollama and Chromadb"
image:
  url: "@postImages/joshua-sortino-m5P0c6ABWDs-unsplash.jpg"
  alt: "A group of people walking in the desert"
pubDate: 2024-11-07
isPublished: true
tags: ["ai", "learning"]
---

## 1.介绍

## 2.Usage

[RAG Hallucination Checker using Bespoke-Minicheck](https://github.com/ollama/ollama/tree/main/examples/python-grounded-factuality-rag-check)

[embedding-models](https://ollama.com/blog/embedding-models)

> Embedding models are models that are trained specifically to generate vector embeddings: long arrays of numbers that represent semantic meaning for a given sequence of text:

![alt text](@postImages/embedding.png)

> The resulting vector embedding arrays can then be stored in a database, which will compare them as a way to search for data that is similar in meaning.

## 3.Advanced Usage

如果想要提高RAG的效果，有以下两种方法：

### 3.1. 重叠分割

针对按段落分割的情况，如果两个段落的内容是连续的，采用按段落分词，存储到向量数据库中的单条数据就会被分割成独立的数据，造成在向量数据库中查询出来的结果不匹配或者丢失了关键信息，可以尝试重叠分割，然后再进行查询。

例如将进行分割的文本按照1000个字符进行切分，然后每个分割文本之间前后重叠100个字符，这样可以在某种程度上保证上下文的连续性。

### 3.2. 查询后评价

通常根据向量数据库可以查询出最接近词义的存储结果，可以设置查询的条目数，然后对查询出来的结果使用一个评价模型，进行评分，这样做的好处是不依赖向量数据查询出的结果进行排序，而是使用限定领域的大模型提供更接近query的结果。

## End

**以上相关的代码可以参考仓库[GitHub](https://github.com/LeeSKII/ollama-python-example)**
