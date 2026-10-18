# HiveFlow 网站

蜂巢的第二个副产物：从 Director 逐步组织 Agent 协作，探索授权边界内的自动流转。网站品牌为 **HiveFlow**；本目录是独立静态介绍与规范阅读站，不是运行服务或调度器。

## 本地开发与验证

需要 Node.js 24.18.0+（同一主版本）、npm。依赖由 package-lock.json 锁定。

```sh
npm ci --ignore-scripts
npm run dev
npm test
npm run preview -- --port 4330
npm run test:browser
```

浏览器检查默认使用 macOS 上已有的 Google Chrome；其他机器通过 `FLOW_CHROME` 指定浏览器可执行文件，`FLOW_PREVIEW` 可指定预览源站。不会连接机器人、执行规范中的业务流程或发送外部消息。检查结束可用 `npx astro preview stop` 停止本项目预览。

## 内容与技术

- Astro 7.4.0，纯静态输出，无服务端、数据库、账户、外部字体或分析脚本。
- 首页：理念、蜂巢/ACDL/HiveFlow 关系、流程演进、当前状态、阅读入口。
- 规范：9 篇 Markdown 阅读页，章节导航、桌面页内目录、深色主题与打印样式。
- 首页明确自动开发尚未启用。示意图不显示实时任务、不代表自动化已经跑通。
- 规范来源为 `src/data/source.json` 中的固定提交和逐文件 SHA-256。快照只取明确列出的规范文件，不采集运行配置、日志、群消息或审批记录。
- 修改规范快照前，先审阅规范仓库当前版本、公开范围和受影响链接；同步这9篇页面与来源清单，再运行全部检查。快照和源仓库不会自动双向同步。
- `src/styles/site.css` 维护家族式浅底深蓝文字与 HiveFlow 青绿色强调；无需图片服务。

## GitHub Pages 准备状态

预期站点：**https://www.bluexiii.com/flow/**（尚未发布）。

`astro.config.mjs` 的 base 固定为 `/flow`、输出为 `dist/`，包含 `.nojekyll`。站内链接与资源都经过该子路径验证，不添加 CNAME，不修改 DNS。未设置 canonical 或 sitemap 以免把未发布站点标成现存页面。

核验到的家族站点：

|项目|实际地址|技术|
|---|---|---|
|蜂巢|https://www.bluexiii.com/hive/|Astro，静态 Pages workflow|
|ACDL|https://www.bluexiii.com/acdl/|Next.js，静态导出，Pages workflow|

个人 Pages 仓库已配置 `www.bluexiii.com`；上述项目站 Pages 记录没有单独 CNAME，并实际在个人域名子路径访问。flow 采用同样的路径安排，但仍需真实启用后验收。

当前登录所有者下 `xiiiblue/flow` 返回 404，因此此交付只保存在本地，没有创建远端仓库、推送或启用 Pages。后续需要负责人确定：

1. 创建 `xiiiblue/flow`，选择仓库可见性及许可证。公开前审阅快照与权利；没有自动继承规范仓库的许可。
2. 推送本目录源码到其主分支，保持规范与网站仓库分离。
3. 明确授权后在仓库 Settings → Pages 选择 GitHub Actions，参照 `deploy/pages-workflow.yml.example` 安装工作流。
4. 首次发布后检查真实 `/flow/` 页面、资源、阅读链接、404 和手机布局。构建通过不等于已经上线。

示例工作流在 deploy 目录，不在 `.github/workflows` 中，不会自动触发发布。此交付不改变其他仓库、自动模式、运行环境或 bridge。

## 许可

许可证待负责人选择，当前未添加 LICENSE。引用的规范快照保留来源标识，公开发布与贡献授权方式仍需明确。
