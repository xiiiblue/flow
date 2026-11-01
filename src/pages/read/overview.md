---
layout: ../../layouts/Reader.astro
title: "阅读目录"
source: "docs/11-手册/05-自动化手册/README.md"
---

# 从这里认识HiveFlow

HiveFlow是面向开发者反馈循环的自动化开发流水线。开发者在群里提出缺陷和改进建议，流水线接着完成调查、任务整理、开发、检查和约定交付，再把结果带回原群。

它的目标是尽可能减少Human In The Loop中需要人反复转交、派单、催办和逐步确认的工作。任务在批准范围内连续推进，Director在需要采纳、明确范围或处理重要取舍的节点审批。

## 第一次来，先读这三篇

1. [HiveFlow是什么](/flow/read/introduction/)：为什么要把开发者反馈接成自动流水线。
2. [一条反馈怎样处理](/flow/read/workflow/)：从导出缺陷走到调查、开发、交付和原群反馈。
3. [完整案例与对话](/flow/read/owner-commands/)：开发者怎样反馈，流水线怎样推进，Director怎样介入。

## 按你要做的事继续读

|你想了解什么|从哪里开始|
|---|---|
|我在开发者群里反馈问题|[怎样在群里反馈](/flow/read/user-guide/)|
|我要让日常研发自动推进|[自动处理任务](/flow/read/automation/)|
|我需要设定范围或暂停任务|[采纳与授权](/flow/read/authorization/)、[两种交付方式](/flow/read/delivery/)|
|我想了解流水线用了哪些工具|[角色与工具](/flow/read/adapters/)|
|我想接入自己的项目|[接入流水线](/flow/read/acceptance/)|
|我想查术语|[术语与常见问题](/flow/read/glossary/)|

## Director怎样审批

Director先批准目标、项目、权限、环境和交付方式。符合条件的任务按这些约定推进；需要采纳、改变范围或决定PR后续等事项时，提交Director审批。

依赖审批的后续步骤先等待，批准后根据决定继续。已经批准的例行步骤不重复确认，已有修改和有效检查接着用，不从头开发。

在蜂巢采用的工具分工中，Hermes协调远程Codex；Director也可以直接在MacMini上与Codex协同开发。工具和机器分工见[角色与工具](/flow/read/adapters/)。

## 需要接入和维护时再查这些内容

- [事项状态](/flow/read/status/)：怎样看一项任务的决定、进展和结果。
- [交付与通知](/flow/read/receipts/)：怎样把处理结果带回原开发者群。
- [任务交接](/flow/read/adoption/)：怎样安排接手、撤销和恢复，避免重复工作。
- [调查与恢复](/flow/read/recovery/)：任务中断或结果不明时怎样继续。
- [反馈接收要点](/flow/read/group-intake/)、[安全与隐私](/flow/read/security/)、[执行前须知](/flow/read/agents/)：供负责接入和运行的人查阅。

网站的版本和取材说明见[内容来源与网站维护](/flow/read/contributing/)。公开项目和网站源码分别采用Apache-2.0，具体见各仓库的LICENSE与NOTICE。
