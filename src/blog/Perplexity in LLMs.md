---
title: Perplexity in LLMs
author: Ski Lee
description: "What is perplexity and how to use it to evaluate the performance of an LLM"
image:
  url: "@postImages/nasa-NuE8Nu3otjo-unsplash.jpg"
  alt: "A spaceship with a telescope in the space"
pubDate: 2025-04-04
isPublished: true
tags: ["ai", "learning"]
---

## 1.介绍

Perplexity 的意思是‘困惑度’，是一种度量/评价（Evaluate）语言模型预测准确性的指标。它是对语言模型预测的困难程度的一种量化，其值越低，说明模型的预测能力越强。

Perplexity 的值介于 1 和 vocabulary_size 之间，当值为 1 时，说明模型完美的预测了下一个 token，当值越大的时候，说明模型开始在这些候选 token 之间犹豫，无法做出明确的预测。

## 2.说明

在一个LLM还没有开始训练的时候，预测得到的下一个 token 应该是什么？

由于LLM还属于最初的阶段，因此模型此时给出的输出应该是无偏的，即每个token的概率都相同。因此，预测得到的下一个token的概率分布应该是均匀的，每个token的概率都等于1/vocabulary_size。

那么模型会在 vocabulary_size 个 token 中开始纠结，因为每个 token 的概率都相同，因此模型无法做出置信度高的预测。

当模型训练的足够充分的时候，预测得到的下一个 token 的概率分布会变得更加集中，例如候选的高概率 token 越来越多，低概率 token 越来越少。

意味着模型在更少的 token 中开始选择下一个 token，这意味着模型不再犹豫，开始对预测结果自信，因此表示其困惑度降低。

在 2017-2023 年，随着 LLMs 的发展，Perplexity 已经从70降到了不到10的水平。

Perplexity 目前在学术界实际指标评价中应用较少了，主要的原因是会受到两个因素的影响：

1. Tokenizer 分词器的选择（例如Gemini的词表大小为1e6，而GPT-3的词表大小为1e5，那么GPT-3的Perplexity值会比Gemini的低很多）；
2. 训练数据的分布；

现在对 LLMs 的评价更多依赖于各种 benchmark 数据。

但是，Perplexity 在训练中仍然是一个非常实用的指标，可以给你一种直觉用来评估 LLMs 的预测能力。

## 3.总结

从直觉上说，Perplexity 就是量化了模型在多少个 token 之间犹豫的指标。

如果他知道下一个 token 是什么，那么会毫不犹豫的选择那个 token，此时 Perplexity 值应该为 1。

如果他不知道下一个 token 是什么，那么会在多个 token 之间犹豫，此时 Perplexity 值就是这些 token 的数量。