---
title: Deep dive into LLMs like ChatGPT
author: Lee Ski
description: "The general introduction of large language models like ChatGPT."
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

## How to build a ChatGPT

构建一个Chat GPT是一个按固定顺序的多步骤过程，下面是这些步骤的简要介绍。

## 1. Pre-training

预训练的第一个步骤是下载并处理大量的互联网文本数据。

### 1.1 Download and process Internet

为了大致了解这个步骤是怎么做，可以从huggingface的 [FineWeb](https://huggingface.co/spaces/HuggingFaceFW/blogpost-fineweb-v1)开始。

[FineWeb](https://huggingface.co/spaces/HuggingFaceFW/blogpost-fineweb-v1)的首页介绍了这个项目的整体情况，以及它是如何构建的。

所有主流的大语言模型如ChatGPT,Llama,Claude的母公司Openai,Anthropic,Meta，它们内部都有一个类似的数据集。

所以，概括的说，这个步骤是想要取得什么样的目标？

**大量的文本**，从公开领域搜集非常多非常多高质量的文本，同时，我们希望这些文本内容是极具多样性的，因为我们希望内部包含了很多方面的知识。

FineWeb是一个我们可以接触到的生产级别就绪的数据集的典型示例。

> a new, large-scale (15-trillion tokens, 44TB disk space) dataset for LLM pretraining.

但是以今天的互联网数据来说，这实际上并不是一个非常大的数据集。

FineWeb并不是一个从0开始的项目，它起源于 [Common crawl](https://commoncrawl.org/)

> The Common Crawl non–profit organization has been crawling the web since 2007 and releases a new crawl containing 200 to 400 TiB of textual content obtained via automatic web crawling usually every 1 or 2 months.

可以看到截至到2024年，Common crawl相关的网页搜索数据。

> the latest CC crawl (April 2024) contains 2.7 billion web pages, totaling 386 TiB of uncompressed HTML text content.

爬虫的工作方式：

> crawlers start with a few seed web pages and then follow links to other pages. 

Common crawl搜集的数据其实相对比较原始，要想成为一个大模型预训练的数据集，还需要进行很多处理。

> The Common Crawl dataset is a collection of web pages that are publicly available on the internet. It contains a large amount of textual data, but it is not always clean and well-structured.

构建像FineWeb这样的大型数据集实际是一个具有相当复杂程度的任务，需要从互联网中获取大量的文本并妥善处理多个步骤。

The FineWeb pipeline

![The FineWeb pipeline](../assets/images/posts/used/ai/fineweb-recipe.png)

1. URL Filtering: 使用 [blocklist](https://dsi.ut-capitole.fr/blacklists/)过滤掉那些不适合作为训练数据集的网页(例如暴力，歧视等网站)。
2. Text Extraction: 从网页中提取文本(原始的网页为HTML格式，可能还包含了CSS，JavaScript等代码，需要进行纯文本提取)。
3. Language Filtering: 使用 [fastText language classifier](https://fasttext.cc/docs/en/language-identification.html) 提取英语为主的文本。

    > The hottest new programming language is English.
    > --- [Andrej Karpathy](https://x.com/karpathy/status/1617979122625712128)

4. Gopher Filtering: Gopher过滤器。
5. MinHash Filtering: 过滤掉那些相似的网页。
6. C4 Filters: C4过滤器。
7. Custom Filters: 自定义过滤器，比如，过滤掉那些包含特定词汇的网页。
8. PⅡ Filtering: 删除可识别个人身份的信息ID Card。

[Final dataset](https://huggingface.co/datasets/HuggingFaceFW/fineweb) looks like

神经网络的输入的就是这个数据集中所有text的序列。

最终的目标是学习text之间的patterns，并生成符合语言规律的文本。

### 1.2 Tokenization

在将这些文本 Plug into Neural Networks 之前，我们需要对文本做一些转换工作，文本该如何被表示？

神经网络需要的是一维数字序列，所以如何将文本转换为数字序列？

从 UTF-8 （0-255）编码到 The bite pair encoding algorithm (BPE)。

BPE 是一种基于统计的文本分割算法，它可以将相邻出现频率最高的字符组合成一个单独的新 token。

每配对一次，就会在词汇表中增加一个新token。

GPT-4的词汇表大小为100,277，目前实践表明大约10W次的词汇表性能最优，GPT-4o的词汇表大小为20W。

Tokenization 就是将文本转换成token或者symbol的过程。

[Tiktokenizer](https://tiktokenizer.vercel.app/) 是可视化 tokenization 的网站。

可以查看 cl100k_base， 这是gpt-4的base模型的tokenizer。

[Tiktokenizer](https://tiktokenizer.vercel.app/)展示了像GPT-4这样的模型是如何看待Text的，也就是模型眼中的word，but actually is token。

### 1.3 Neural Network training

在这个步骤中，我们希望模型能statistical relationship of how these tokens follow each other in the sequence.

也就学习token之间的关系。

在将数据输入到神经网络之前，我们需要决定输入多少个token给网络，并且要限定一个最大的序列长度。

也就是context length，GPT-3的最大序列长度为1024, Deepseek v3的最大序列长度为128k，即128倍的GPT-3的context length。

越大的context length意味着模型可以学习到更长的文本序列的关系，但是同时也意味着模型的计算量也会增加。

### 1.3.1 Train target

Predict the next token with the given context.

通过给定的上下文，预测下一个 token。

![Train Neural Network](../assets/images/posts/used/ai/train-neural-network.png)

模型输入的 token 数量可以是 0-context length 中的任意数值，预测的目标值是已知训练数据的下一个 token。

一开始模型是随机初始化的，但是我们可以根据已知的 next token，来训练模型。

训练的目标是使得模型网络输出正确的 token 的概率更高，由于已知正确 next token，通过数学方法，调整模型的参数，从而提高正确结果的 token 的概率，然后不断循环迭代这一优化过程。

最终使得网络的输出 token 符合训练数据中的分布。

### 1.3.2 Calculate in parallel

上述的过程是单个sequence的训练，但是实际上，我们需要同时训练多个sequence，也就是batch，以批次为单位进行训练，从而发挥硬件并行计算的优势，提高训练效率。

### 1.3.3 Internal of the neural network

虽然模仿了生物学的神经网络结构，但是实际上，人工神经网络更像是一个巨大的计算公式，接受输入产生输出，不像生物神经，可能具有 Memory ，neural network 是 stateless 的，没有记忆。

![Neural Network Internal](../assets/images/posts/used/ai/neural-network-internal.png)

[Visualize the model like GPT](https://bbycroft.net/llm) 是可视化神经网络的网站。

### 1.3.4 Inference



## 3. Post-training