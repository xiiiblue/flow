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

- Astro 7.4.0，纯静态输出，无服务端、数据库、账户或外部字体。页脚沿用 ACDL 的不蒜子公开访问计数，仅在 `www.bluexiii.com` 加载；本地预览不发送统计请求。
- 首页：现成能力复用、蜂巢/ACDL/HiveFlow 关系、流程演进、群使用示例、当前状态和阅读入口。
- 用户指南：`/flow/read/user-guide/`，用自然语言介绍群里@提问、报Bug、提需求、补充信息和登记后的决定。
- 规范与指南：10 篇 Markdown 阅读页，章节导航、桌面页内目录、深色主题与打印样式。
- 首页明确自动开发尚未启用。示意图不显示实时任务、不代表自动化已经跑通。
- 规范来源为 `src/data/source.json` 中的固定提交和逐文件 SHA-256。快照只取明确列出的规范文件，不采集运行配置、日志、群消息或审批记录。
- 项目概览开头的英文简介在本站译为中文，并在来源说明中标注；来源清单仍记录原始规范文件哈希。
- 修改规范快照前，先审阅规范仓库当前版本、公开范围和受影响链接；同步这10篇页面与来源清单，再运行全部检查。快照和源仓库不会自动双向同步。
- `src/styles/site.css` 维护家族式浅底深蓝文字与 HiveFlow 青绿色强调；无需图片服务。

## GitHub Pages 准备状态

目标站点：**https://www.bluexiii.com/flow/**。实际发布结果以 GitHub Actions 和线上页面为准。

`astro.config.mjs` 的 base 固定为 `/flow`、输出为 `dist/`，包含 `.nojekyll`。站内链接与资源都经过该子路径验证，不添加 CNAME，不修改 DNS。未设置 canonical 或 sitemap 以免把未发布站点标成现存页面。

核验到的家族站点：

|项目|实际地址|技术|
|---|---|---|
|蜂巢|https://www.bluexiii.com/hive/|Astro，静态 Pages workflow|
|ACDL|https://www.bluexiii.com/acdl/|Next.js，静态导出，Pages workflow|

个人 Pages 仓库已配置 `www.bluexiii.com`；上述项目站 Pages 记录没有单独 CNAME，并实际在个人域名子路径访问。flow 采用同样的路径安排，但仍需真实启用后验收。

网站源码与规范仓库分开：公开网站仓库为 `xiiiblue/flow`，规范仓库 `xiiiblue/hive-flow` 继续保持私有。网站包含经审阅的规范快照，访客无需访问私有仓库即可阅读。

`.github/workflows/pages.yml` 在 main 推送或手动触发时构建、检查并发布 `dist/`；仓库 Pages 使用 GitHub Actions。不会创建凭据、修改 DNS 或启用任何研发自动模式。`deploy/pages-workflow.yml.example` 保留为手动发布的参考模板。

后续内容修改先检查公开范围，再通过本地检查和对应提交的 Actions；发布后验收真实 `/flow/` 页面、资源、阅读链接、404 和手机布局。构建通过不等于线上验收通过。

## 许可

许可证待负责人选择，当前未添加 LICENSE。引用的规范快照保留来源标识，公开发布与贡献授权方式仍需明确。

## 页脚访问统计

备案信息与工信部链接核对自 ACDL 公开站点及 `xiiiblue/acdl` 的 `components/SiteFooter.tsx`：鲁ICP备18050487号-1。

复用 ACDL 的不蒜子 2.3 公开脚本，不复制其 Cloudflare beacon 或 token，也不新增账户、凭据或付费服务。脚本通过 JSONP 向 `busuanzi.ibruce.info` 请求计数，使用 `no-referrer-when-downgrade` 提供页面 Referrer；服务端会接收常规网络请求信息（如 IP、浏览器请求头）。已检查的客户端脚本不写入 cookie/localStorage，不采集登录身份；第三方服务端的处理与保留策略不由本站控制。

`site_uv` / `site_pv` 按域名汇总，可能包含同域的其他项目，因此显示为“域名访客 / 域名浏览”，不声称是 Flow 独立数据。数字初始为空且整项隐藏，仅由服务返回后显示；脚本被阻断或不可用时，备案和其他页脚内容保持可用。
