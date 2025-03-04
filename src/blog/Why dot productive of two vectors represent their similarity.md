---
title: Why dot productive of two vectors represent their similarity
author: Lee Ski
description: What is the meaning of dot product of two vectors and how it can be used to represent their similarity.
image:
  url: "@postImages/bryan-goff-f7YQo-eYHdM-unsplash.jpg"
  alt: "Beautiful galaxy."
pubDate: 2025-02-24
isPublished: true
tags: ["ai","machine learning","learning"]
---

## 1.场景

在机器学习中，通常会将词汇表中的每一个词映射到一个高维的向量空间，从而寄希望于这个向量空间能够捕捉到词汇本身的语义信息。

在端到端的训练过程中，用来表示词的向量也会参与到模型的训练中，从而不断地调整代表这个词的向量，使得这个向量能够理解这个词的语义信息。

在完成模型的训练后，如果将所有词的向量都在向量空间中进行可视化，可以发现相似语义词的向量会呈现出聚集关系，也就是它们之间的空间距离是相近的，这说明经过训练后的词向量已经在某种程度上掌握了语义的内涵。

这种表现形式在空间上直观体现为相似语义的的词汇呈现聚类状态。

如果要在数学表达上来描述这种关系，该如何表示呢？

## 2.向量空间中的点积

向量空间中的点积，又称之为内积，是一种二维向量运算，具体形式为：

$$
\vec{a} \cdot \vec{b} = \sum_{i=1}^{n} a_ib_i
$$

具体形式表现为两个向量的对应元素相乘，然后求和，这意味着两个vector的shape必须一致。

End.
