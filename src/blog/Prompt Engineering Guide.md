---
title: Prompt Engineering Guide
author: Lee Ski
description: "Prompt Engineering Guide."
image:
  url: "@postImages/the-new-york-public-library-YrxU-GwcyFE-unsplash.jpg"
  alt: "A group of people seating in the classroom"
pubDate: 2024-10-31
isPublished: true
tags: ["ai", "learning"]
---

## 1 Preface

什么是提示词工程 "Prompt Engineering" ，学习[文档](https://www.promptingguide.ai/)

e.g

```text
Q:The sky is
A:blue.
```

```text
Q:
Complete the sentence:
The sky is
A:blue during the day and dark at night.
```

目的：提示词工程可以让 LLM 输出更准确和有效的回答。

## 2 Introduction

### 2.1 Basic

#### 2.1.1 zero-shot prompt

```text
Q: <Question>?
A:
```

> When prompting like the above, it's also referred to as zero-shot prompting, i.e., you are directly prompting the model for a response without any examples or demonstrations about the task you want it to achieve. Some large language models have the ability to perform zero-shot prompting but it depends on the complexity and knowledge of the task at hand and the tasks the model was trained to perform good on.

#### 2.1.2 few-shot prompt

```text
Q: <Question>?
A: <Answer>
Q: <Question>?
A: <Answer>
Q: <Question>?
A: <Answer>
Q: <Question>?
A:
```

> Others recommend that you place instructions at the beginning of the prompt. Another recommendation is to use some clear separator like "###" to separate the instruction and context.

> In fact, providing examples in the prompt is very effective to get desired output in specific formats.

> Another common tip when designing prompts is to avoid saying what not to do but say what to do instead. This encourages more specificity and focuses on the details that lead to good responses from the model.

糟糕的示例：

```text
The following is an agent that recommends movies to a customer. DO NOT ASK FOR INTERESTS. DO NOT ASK FOR PERSONAL INFORMATION.

Customer: Please recommend a movie based on my interests.
Agent:
```

output:

```text
Sure, I can recommend a movie based on your interests. What kind of movie would you like to watch? Do you prefer action, comedy, romance, or something else?
```

better:

```text
The following is an agent that recommends movies to a customer. The agent is responsible to recommend a movie from the top global trending movies. It should refrain from asking users for their preferences and avoid asking for personal information. If the agent doesn't have a movie to recommend, it should respond "Sorry, couldn't find a movie to recommend today.".
Customer: Please recommend a movie based on my interests.
Agent:
```

output:

```text
Sorry, I don't have any information about your interests. However, here's a list of the top global trending movies right now: [list of movies]. I hope you find something you like!
```

some examples from ["Best practices for prompt engineering with OpenAI API" article."](https://help.openai.com/en/articles/6654000-best-practices-for-prompt-engineering-with-the-openai-api)

### 2.2 Zero-shot Prompting

> Instruction tuning has been shown to improve zero-shot learning [Wei et al. (2022)](https://arxiv.org/pdf/2109.01652). Instruction tuning is essentially the concept of finetuning models on datasets described via instructions. Furthermore, [RLHF](https://arxiv.org/abs/1706.03741) (reinforcement learning from human feedback) has been adopted to scale instruction tuning wherein the model is aligned to better fit human preferences. This recent development powers models like ChatGPT. We will discuss all these approaches and methods in upcoming sections.

### 2.3 Few-shot Prompting

#### 2.3.1 The Limitations of Few-shot Prompting

> Standard few-shot prompting works well for many tasks but is still not a perfect technique, especially when dealing with more complex reasoning tasks.

e.g:

```text
The odd numbers in this group add up to an even number: 15, 32, 5, 13, 82, 7, 1.
A:
```

output:

```text
Yes, the odd numbers in this group add up to 107, which is an even number.
```

```text
The odd numbers in this group add up to an even number: 4, 8, 9, 15, 12, 2, 1.
A: The answer is False.

The odd numbers in this group add up to an even number: 17,  10, 19, 4, 8, 12, 24.
A: The answer is True.

The odd numbers in this group add up to an even number: 16,  11, 14, 4, 8, 13, 24.
A: The answer is True.

The odd numbers in this group add up to an even number: 17,  9, 10, 12, 13, 4, 2.
A: The answer is False.

The odd numbers in this group add up to an even number: 15, 32, 5, 13, 82, 7, 1.
A:
```

output:

```text
The answer is True.
```

That didn't work.

> Overall, it seems that providing examples is useful for solving some tasks. When zero-shot prompting and few-shot prompting are not sufficient, it might mean that whatever was learned by the model isn't enough to do well at the task. From here it is recommended to start thinking about fine-tuning your models or experimenting with more advanced prompting techniques. Up next we talk about one of the popular prompting techniques called [chain-of-thought](https://arxiv.org/abs/2201.11903) prompting which has gained a lot of popularity.

### 2.4 Chain-of-Thought Prompting

> One recent idea that came out more recently is the idea of [zero-shot CoT (Kojima et al. 2022)](https://arxiv.org/abs/2205.11916) that essentially involves adding "Let's think step by step" to the original prompt. Let's try a simple problem and see how the model performs:

### 2.5 Retrieval Augmented Generation (RAG)

![rag-prompt](@postImages/rag.png)
