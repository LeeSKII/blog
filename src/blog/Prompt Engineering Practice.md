---
title: Prompt Engineering Practice
author: Lee Ski
description: ""
image:
    url: "@postImages/daniel-sessler.jpg"
    alt: "A small island in the middle of the ocean."
pubDate: 2025-04-25
isPublished: true
tags: ["ai",'prompt engineering']
---

## Introduction

How to make a specific filed chatbot using prompt engineering?

Combining some complex prompts to indicate the AI's response more relate and accurate.

## Zero-shot prompting

## Few-shot prompting

## System prompting

全局的instruction，可以让AI知道整个任务的背景和目的。

## Role prompting

角色扮演，让AI知道自己在这个任务中的角色，确定其背景知识，语气，回复风格。

## Contextual prompting

详细的任务说明和背景信息，可以让AI更准确的理解任务。

## Step-back prompting

退阶提示法

技术定义：
要求AI先退一步分析问题的宏观背景或核心概念（step back），再处理具体任务，以提高回答质量。

强调先让AI回归问题本质或上下文背景。

类似于R1的思考过程，突出“分步骤引导AI思考”的策略。

- 先从具体的问题回退到问题的背景和本质去分析，然后给出要点，再结合具体的问题分析，类似于R1的思考过程，先分析了用户的背景，再分析了用户的可能想要知道的内容。

## Chain of Thought (CoT)

think it step by step.

要求LLM生成中间的推理步骤（by generating intermediate reasoning steps.）

当zero-shot无法解决问题时，可以尝试使用CoT结合few-shot可能会有更好的效果。

### CoT Best practices

- putting the answer after the reasoning is required
- final answer, separated from the reasoning
- set the temperature to 0

## Tree of Thoughts (ToT)

相比较 CoT 是单一路径的推理过程，ToT 则是多路径的推理过程，可以尝试使用ToT来生成更加丰富的推理路径。

ToT 包含多个推理路径，每个路径都有不同的推理步骤，可以尝试使用多种推理方式来生成不同的推理路径。

例如解决某个复杂问题

先尝试提出三种解决方案，然后依次进行推理，或者是在推理的过程中，遇到失败进行回退，最后选择最佳方案或者得到结论。

[Large Language Model Guided Tree-of-Thought](https://ar5iv.labs.arxiv.org/html/2305.08291)

## ReAct (reason & act)

LLM进行推理然后制定一系列的action,然后LLM执行每一步的action再进行下一步的推理，直到获得结论。

> ReAct prompting works by combining reasoning and acting into a thought-action loop. The LLM first reasons about the problem and generates a plan of action. It then performs the actions in the plan and observes the results. The LLM then uses the observations to update its reasoning and generate a new plan of action. This process continues until the LLM reaches a solution to the problem.

## Automatic Prompt Engineering

使用LLM自动生成prompt，然后通过 BLEU (Bilingual Evaluation Understudy) or ROUGE (Recall-Oriented Understudy for Gisting Evaluation) 等方法来评估生成的prompt的质量。

例如：机器翻译优先用BLEU，文本摘要优先用ROUGE。

## Code prompting

### Writing code

提示 LLM 生成代码去执行任务

### Explaining code

### Translating code

## Best Practices

### Provide examples

### Design with simplicity

Try using verbs that describe the action. Here’s a set of examples:

**Act, Analyze, Categorize, Classify, Contrast, Compare, Create, Describe, Define,Evaluate, Extract, Find, Generate,Identify, List, Measure, Organize, Parse, Pick,Predict, Provide, Rank, Recommend, Return, Retrieve, Rewrite, Select,Show, Sort,Summarize, Translate, Write.**

### Be specific about the output

过于简短的指令可能导致 LLM 输出过于笼统或偏离预期。

如果想引导LLM生成更精准的结果，可以：

- 增加约束条件（如格式、长度、示例）。
- 明确具体需求（如“用技术术语解释”“列出3个优缺点”）。

### Use Instructions over Constraints

指令还是约束？

> Growing research suggests that focusing on positive instructions in prompting can be more effective than relying heavily on constraints. This approach aligns with how humans prefer positive instructions over lists of what not to do.

该怎么做？

> If possible, use positive instructions: instead of telling the model what not to do, tell it what to do instead. This can avoid confusion and improve the accuracy of the output.

### Use variables in prompts

### Experiment with output formats

一般来说结构化输出：xml可能优于json，从输出成本和可靠性分析。

但是可以通过`json-repair`库解决json格式不规范的问题。

### Working with Schemas

输入数据范式使用xml或json，个人建议使用xml。

