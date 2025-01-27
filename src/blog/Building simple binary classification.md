---
title: Building simple binary classification
author: Lee Ski
description: "Ten minutes building a simple binary classification model using pytorch."
image:
  url: "@postImages/johannes-plenio-DKix6Un55mw-unsplash.jpg"
  alt: "A ship laying under a cloudy sky."
pubDate: 2025-01-27
isPublished: true
tags: ["ai","machine learning","learning"]
---

## 1.实施

### 1.1 引入包

``` python
import torch
import torch.nn as nn
import torch.nn.functional as F
```

### 1.2 定义数据集

``` python
X = torch.tensor([[1,2,3,4,5,6,7,8,9,10,-1,-2,-3,-4,-5,-6,-7,-8,-9,-10]], dtype=torch.float32)
Y = torch.tensor([[1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0]], dtype=torch.float32)
```

对于任意输入X大于0的样本，输出Y为1，否则输出Y为0。

### 1.3 定义隐藏层

第一层，10个神经元

``` python
w1 = torch.randn(1,10, requires_grad=True)
b1 = torch.randn(10, requires_grad=True)
```

第二层，输出层，1个神经元

``` python
w2 = torch.randn(10,1,requires_grad=True)
b2 = torch.randn(1,requires_grad=True)
```

隐藏层使用`randn`函数随机初始化权重，初始化的权重范围[0,1]，数据取值服从正态分布。

### 1.4 训练模型

#### 1.4.1 正向传播

``` python
h1 = torch.matmul(X[:,0],w1)+b1
a1 = nn.ReLU()(h1)
h2 = torch.matmul(a1,w2)+b2
loss = F.binary_cross_entropy_with_logits(h2,Y[:,0])
```

以X[0]和对应的结果Y[0]为例，计算隐藏层的输出结果为h1，通过激活函数ReLU得到a1，然后计算输出层的输出结果为h2

通过 `F.binary_cross_entropy_with_logits` 计算损失函数，`binary_cross_entropy_with_logits`函数内部会对logits进行sigmoid操作，并计算二分类交叉熵损失。

#### 1.4.2 反向传播

``` python
loss.backward()
```

#### 1.4.3 定义学习率

``` python
learning_rate = 0.01
```

#### 1.4.4 使用梯度更新权重

``` python
w1.data -= learning_rate * w1.grad.data
b1.data -= learning_rate * b1.grad.data
w2.data -= learning_rate * w2.grad.data
b2.data -= learning_rate * b2.grad.data
```

`-=`表示朝着梯度的反方向更新权重，因为梯度如果是正的，表明在当前参数下，增加权重的值会使得损失函数值增大，那么为了使得损失函数减小，就需要减小权重的值，所以`-=`表示朝着梯度的反方向更新权重，反之亦然。

**注意：在更新权重的时候，需要更新的是`data`属性，而不是更新`w`，否则会因为生成新的张量而破坏原来的计算图。**

#### 1.4.5 整合循环

``` python
for epoch in range(1000):
    lossi = []
    for i in range(len(X[0])):
        h1 = torch.matmul(X[:,i],w1)+b1
        a1 = nn.ReLU()(h1)
        h2 = torch.matmul(a1,w2)+b2
        loss = F.binary_cross_entropy_with_logits(h2,Y[:,i])
        w1.grad = None
        b1.grad = None
        w2.grad = None
        b2.grad = None
        loss.backward()
        w1.data -= learning_rate * w1.grad.data
        b1.data -= learning_rate * b1.grad.data
        w2.data -= learning_rate * w2.grad.data
        b2.data -= learning_rate * b2.grad.data
        print(f'epoch: {epoch}, i: {i}, loss: {loss.item()}')
        lossi.append(loss.item())
    print(f'lossi: {sum(lossi)}')
```

每次训练一个样本，更新一次权重，打印损失函数值。

**注意在反向传播之前清空参数的梯度，否则会累加梯度。**

执行完成后应该可以看到lossi大概收敛到一个很小的值

``` python
lossi: 0.015019937555940806
```

### 1.5 预测

``` python
# 测试模型的输出
test_input = torch.Tensor([1])
# 前向传播
h1 = torch.matmul(test_input,w1)+b1
a1 = nn.ReLU()(h1)
h2 = torch.matmul(a1,w2)+b2
# sigmoid 表示预测为正样本的概率，即模型输出为1的概率
probab = torch.sigmoid(h2)
print(f'probability of positive class: {probab.item()}')
pred_value = 1 if probab.item() > 0.5 else 0
print(f'predicted value: {pred_value}')
```

这里使用`1`来测试模型的输出，通过前向传播的计算得到输出层的置信度输出值`logits`即`h2`，然后通过`sigmoid`函数将`logits`转换为概率值，大于`0.5`的概率值表示预测为正样本的概率。

如果`probab`大于`0.5`，则预测为`1`，否则预测为`0`。

0.5是因为在此例中正负样本是均匀分布的，所以阈值可以取0.5，如果针对某些正负样本不均衡或者是判断负样本的评估代价更高，可以调整阈值更高等。

End.