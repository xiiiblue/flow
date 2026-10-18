# 本地验证记录

本记录仅描述本地静态网站，不代表 GitHub Pages 上线或自动开发能力通过。

## 基线与内容

- 独立网站目录创建前不存在，无已有文件被覆盖；未生成此前候选 hive-flow-site 目录。
- 规范快照固定在 bfc0a13835eecb3c1ba8530ed8f74dac6f14e432；9 篇文档与逐文件 SHA-256 见 src/data/source.json。
- 规范原仓库、ACDL、蜂巢与 bridge 源码均未更改。
- 已读取两个公开家族站点的 main 源码、构建配置与 Pages 元数据。ACDL 为 Next.js 静态导出，蜂巢为 Astro 静态输出；两者使用浅色背景、深蓝正文、蓝色强调、清晰文档导航和明暗主题。
- 实际 HTTPS 请求 ACDL /acdl/ 与蜂巢 /hive/ 均为 200；个人 Pages 的 CNAME 为 www.bluexiii.com，两项目的 CNAME 为空，实际使用个人域名子路径。
- 目标仓库 xiiiblue/flow 在当前登录所有者下返回 404。未建远端、未推送、未开启 Pages、未改 DNS 或可见性。

## 已通过

- Astro 静态构建 11 页：主页、9 篇阅读页和 404。
- npm test：4 项检查；273 个本地链接、静态资源及章节锚点解析成功。
- Playwright + 本机 Google Chrome：10 个主要路由 × 320/390/768/1440 四种屏宽共40组，无整页横向溢出，各页1个主标题。
- 首页到阅读页跳转、手机章节导航、当前章节、桌面页内目录、主题切换和刷新保留、打印阅读模式。
- 浏览器无页面脚本错误和失败的资源请求。
- npm audit --omit=dev：0 个已知漏洞。
- 构建产物的常见 token、私钥、个人主目录及私网地址模式检查通过。该模式检查不替代完整人工安全或权利审阅。
- 人工查看桌面/手机首页与深色阅读长图：排版和分区正常；流程示意与状态区均清楚标注愿景和当前边界。

## 截图与原始结果

本地 .verification/（不进 Git）：

- home-1440.png / home-390.png：完整首页。
- home-mobile-viewport.png / reader-mobile-viewport.png：实际390px手机视口。
- reader-1440.png / reader-390.png：核心流程阅读。
- home-dark-1440.png / reader-dark-1440.png：深色模式。
- reference-acdl.png / reference-hive.png：家族站点参考。
- browser-result.json：路由、屏宽与交互检查结果。

## 待完成

负责人创建/授权创建目标仓库，决定可见性与许可证；授权推送与 Pages 配置。首次发布后在真实 /flow/ 子路径验收。私有仓库是否支持 Pages 还需结合实际账户计划和仓库设置核对。

没有运行机器人收发测试、访问运行环境或启用任何自动开发任务。
