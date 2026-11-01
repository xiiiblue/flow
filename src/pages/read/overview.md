---
layout: ../../layouts/Reader.astro
title: "阅读目录"
source: "docs/11-手册/05-自动化手册/README.md"
---

# 从这里认识HiveFlow

HiveFlow是一套让AI助手参与软件开发的协作方法：用户提出问题，负责人决定改什么，助手调查、修改和检查，再把处理结果告诉提出问题的人。

比如，有人在工作群里说“导出的文件只有第一页”。HiveFlow关心接下来的整件事：先查清原因，确实需要修改时记下来，由负责人决定范围，再完成开发和约定的验收。最后，用户应该知道这个问题是否解决、在哪个环境可以使用。

## 第一次来，先读这三篇

1. [HiveFlow是什么](/flow/read/introduction/)：为什么需要它，哪些工作适合这样安排。
2. [一条反馈怎样处理](/flow/read/workflow/)：沿着导出问题看调查、决定、开发和结果通知。
3. [完整案例与对话](/flow/read/owner-commands/)：看用户、负责人和助手分别会说什么。案例是教学示例。

## 按你要做的事继续读

|你想了解什么|从哪里开始|
|---|---|
|我只是想提问或反馈问题|[怎样在群里反馈](/flow/read/user-guide/)|
|我负责决定要不要改、改到哪里|[采纳与授权](/flow/read/authorization/)、[两种交付方式](/flow/read/delivery/)|
|我想知道人和AI工具怎样配合|[角色与工具](/flow/read/adapters/)|
|我想把方法用到自己的项目|[接入与验证](/flow/read/acceptance/)|
|有些词我看不懂|[术语与常见问题](/flow/read/glossary/)|

## 现在可以用到什么程度

公开项目提供方法说明、规则参考和离线工具。按本网站采用的来源记录，业务自动开发尚未启用；长任务、跨天恢复和不同机器之间接手工作等情况仍需要实际验证。[接入与验证](/flow/read/acceptance/)列出了记录日期和未完成的检查。

在蜂巢的安排中，Hermes负责协调远程开发助手；负责人也直接在MacMini上使用Codex编程助手。你可以先看懂工作过程，再到[角色与工具](/flow/read/adapters/)了解这些名称。

## 需要接入和维护时再查这些内容

这些章节解释具体运行规则，初次阅读可以先跳过。

- [事项状态](/flow/read/status/)：怎样判断一项工作是在等待决定、正在开发，还是已经交付。
- [交付与通知](/flow/read/receipts/)：处理结果怎样告诉用户，通知没有确认时怎么办。
- [按计划处理任务](/flow/read/automation/)：先批准范围，再安排自动任务；本网站采用的记录中尚未启用。
- [任务交接](/flow/read/adoption/)：怎样安排接手、停止和恢复，避免重复工作。
- [调查与恢复](/flow/read/recovery/)：任务中断或结果不明时怎样继续。
- [反馈接收要点](/flow/read/group-intake/)、[安全与隐私](/flow/read/security/)、[执行前须知](/flow/read/agents/)：供负责接入和运行的人查阅。

网站内容的版本和取材说明见[内容来源与网站维护](/flow/read/contributing/)。公开项目和本站源码分别采用Apache-2.0，具体见各仓库的LICENSE与NOTICE。
