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

具体计算式现为两个向量的对应元素相乘，然后求和，这意味着两个vector的shape必须一致。

## 3.点积的空间几何意义

$$
\vec{u} \cdot \vec{v} = |\vec{u}| |\vec{v}| \cos(\theta)
$$

上述公式使用结果推论，两个向量的点积等于两个向量的模长乘以它们之间夹角的余弦值。

从空间上说明，向量的点积等于两个向量中的任一向量的长度和另一向量在其上的投影（projected）长度乘积。

$$
\cos\theta = \frac{u \cdot v}{\|u\| \cdot \|v\|}
$$

**现在我无法证明这个推论**，但是可以根据这个推论得出两个向量的点积的结果是包含了向量的方向信息，因为$\cos(\theta)$被引入到了计算式中。

$$
\theta = \cos^{-1} \left( \frac{\vec{u} \cdot \vec{v}}{\|u\| \|v\|} \right)
$$

那么两个向量之间的夹角可由以上计算式得出。

那么点积既然包含了两个向量之间的方向信息，那么只看点积的数值就可以在直觉上得到两个向量的方向信息，例如：

- 如果两个向量的点积为正(positive)，则说明这两个向量方向的夹角小于90度，隐含它们之间的方向是接近的；
- 如果两个向量的点积为零(zero)，则说明这两个向量正交，即互相垂直，任一向量在另一向量上的投影的长度都为0；
- 如果两个向量的点积为负(negative)，则说明这两个向量方向的夹角大于90度，隐含它们之间的方向是相反的；

## 4.在机器学习中，词向量是如何计算的？

End.
