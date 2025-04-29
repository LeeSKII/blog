---
title: Prompt Engineering Practice
author: Lee Ski
description: ""
image:
  url: "@postImages/daniel-sessler.jpg"
  alt: "A small island in the middle of the ocean."
pubDate: 2025-04-25
isPublished: true
tags: ["ai", "prompt engineering"]
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

## Reflective Prompting

也被称为 Self-Reflection Prompting, 是让模型进行自我反思的技术

1. Chain-of-Thought (CoT) Reflection

在复杂问题中让模型分步思考后，通过追加提示（如*"请检查你的回答是否有逻辑错误？"*）触发自我反思。

2. Self-Consistency Checking

要求模型验证自身答案的一致性（例如："你之前的回答是否与已知事实冲突？请反思。"）

3. Meta-Reasoning Prompts

通过元认知指令让模型评估自己的推理过程（如*"请分析你的思考过程中可能存在的偏见。"*）

4. Critique-and-Refine Frameworks

分阶段提示模型先输出答案，再以批评者角色自我修正（例如："假设你是专家，请批判以下回答…"）

5. 递归式反思（Recursive Reflection）

在多轮对话中要求模型迭代改进回答（如*"基于你刚才的回答，现在请提出三个优化建议。"*）

学术文献中常用的术语包括：

- "Self-Reflection in LLMs" (Shinn et al., 2023)
- "Iterative Reflection" (Madaan et al., 2023)

实际应用时，典型prompt结构可能是：

```
"请先解决问题，然后从以下角度反思你的答案：
1. 逻辑漏洞
2. 数据可靠性
3. 潜在偏见
最后生成修订版回答。"
```

## Cross-Examination | Third-Party Verification

### 技术分类

1. 模型间验证（Inter-Model Verification）

   - 技术名：Model-of-Models (MoM) 或 Cross-Model Checking
   - 原理：用一个或多个辅助模型（如更小/更专精的模型）对主模型的输出进行逻辑、事实或安全性的二次验证。
   - 示例Prompt：

   ```text
   主模型生成回答后，第三方模型收到指令：
   "请检查以下回答是否存在事实错误或逻辑矛盾：[主模型输出]。若有问题，请指出并修正。"
   ```

2. 辩论式验证（Debate-Based Verification）

   - 技术名：AI Debate 或 Adversarial Prompting
   - 原理：让多个模型（或同一模型的不同实例）针对主模型的输出进行辩论，通过对抗性讨论暴露潜在问题。
   - 示例场景：
     - 模型A生成回答 → 模型B扮演反对者提出质疑 → 模型A或模型C最终裁决。

3. 分阶段验证（Staged Verification）

   - 技术名：Two-Stage Verification 或 Critic-Refiner Framework
   - 原理：主模型生成内容后，由另一个专用“批评者模型”进行优化（如安全性、合规性检查）。
   - 示例Prompt：

   ```
   批评者模型的指令：
   "你是一个安全审核员，请从隐私和伦理角度评估以下文本，标记高风险内容：[主模型输出]"
   ```

4. 人类对齐验证（Human-Aligned Verification）

   - 技术名：Human-in-the-Loop (HITL) Verification
   - 原理：通过Prompt让第三方模型模拟人类专家的视角进行审核（如法律、医疗领域）。
   - 示例Prompt：

   ```
   "假设你是一名医生，请验证以下诊断建议是否合理：[主模型输出]"
   ```

### 关键技术要点

- 动态反馈循环：主模型和验证模型之间可通过多轮交互迭代改进输出。
- 角色分离：明确分配验证模型的角色（如“事实检查员”“伦理顾问”），避免验证偏差。
- 验证维度：通常包括逻辑一致性、事实准确性、安全性、伦理合规性等。

### 典型应用场景

1. 事实核查：用检索增强的模型（如RAG）验证主模型的生成结果。
2. 安全过滤：通过专用安全模型（如Moderation API）检测有害内容。
3. 复杂任务分解：主模型处理核心任务，辅助模型负责错误检查（如代码生成+静态分析）。

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
