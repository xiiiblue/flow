# HiveFlow网站

蜂巢的第二个副产物：连接反馈、决定和有证据的交付。HiveFlow2.0由Hermes接收企微反馈并协调远程Codex，Director直接协同MacMini；自动研发统一迁向远程Hermes，PR待审与完整交付共用一个调度入口，补齐长任务跟踪、窗口与上限、停止和结果核验。当前业务自动执行尚未启用。

本仓库是独立静态网站，不是研发运行服务或调度器。

## 内容依赖与来源

**HiveFlow规范→HiveFlow介绍→HiveFlow网站→独立副本。**

- 规范位于HiveOS的`docs/06-自动化/`，保存唯一权威执行规则。
- 介绍位于`docs/11-手册/05-自动化手册/`，解释方法、流程和案例，是网站正文的原始材料。
- 网站参考介绍整理公开内容，核对同版本规范，不从网页文案产生执行许可。

本次来源固定为`xiiiblue/hive-os`提交`888856c78b44403ceef32782760fe01887c99d6b`。`src/data/source.json`保存16份介绍材料的SHA-256、每篇网页与介绍章节的对应关系，以及本地对照的规范编号；`src/data/handbook.md`保留公开目录整理稿，以snapshotSHA256核验；原始摘要仍单列在files。同版本规范仅在本地核对，不导入网站，不保存运行配置、日志、群消息或审批记录。

阅读区有19篇页面：目录、12章正文、3篇附录和3篇专题说明。原有公开阅读地址继续可用，内容已按同一来源更新。页面标明源文档、固定提交和整理范围；上游介绍手册保持Review状态，网站不将它提升为执行规范。

文档图示整理为静态流程说明，不依赖外部图表脚本。合成案例明确标注，不作为真实交付或验收记录。独立hive-flow仓库负责公开参考分发，本站内容仍取材HiveOS介绍手册。

## 本地开发与验证

需要Node.js24.18.0+（同一主版本）和npm，依赖由`package-lock.json`锁定。macOS测试前设置`TMPDIR=/tmp`。

```sh
npm ci --ignore-scripts
npm run dev
TMPDIR=/tmp npm test
npm run preview -- --port 4330
TMPDIR=/tmp npm run test:browser
```

浏览器检查默认使用macOS已有的Google Chrome；其他机器通过`FLOW_CHROME`指定浏览器，`FLOW_PREVIEW`可指定预览源站。检查结束可用`npx astro preview stop`停止本项目预览。

`npm test`构建静态站点，并检查完整阅读目录、来源映射、四种组合、`/flow/`下的全部本地链接与锚点、公开内容边界和既有页脚行为。`npm run test:browser`验证首页与19篇阅读页在320、390、768、1440四种宽度下的布局，以及目录展开、章节导航、主题保留、打印和访问计数降级。截图与结果保存在忽略提交的`.verification/`，检查不执行HiveFlow业务流程或向群发送消息。

## 更新内容

1. 读取网站`AGENTS.md`，核对分支和本地差异。
2. 在HiveOS选择包含规范与介绍同步修订的完整提交，先读介绍及其规范依据。
3. 审阅公开范围，更新正文、首页摘要与章节导航，保留授权条件、合成案例和未验证范围。
4. 更新`src/data/source.json`中的提交、原始文件摘要、核对日期与页面映射。摘要对应源文件原始字节，不冒充网站整理稿的摘要。
5. 运行本地检查，实际查看桌面、手机及深色截图；区分文档检查与真实业务验收。
6. 按本次授权提交推送，检查对应提交的GitHub Actions和实际线上页面。只完成本地构建时，不宣称已经发布。

仓库内相对链接已改成本站阅读链接或说明文字，网页不提供私有HiveOS仓库链接。公开目录整理稿和来源映射可在flow仓库核对，网站可独立阅读，无需访问私有仓库。新增长期规则时，先回到HiveOS规范确认，不能在网站自行定义。

## 技术与发布

Astro7.4.0静态输出，无服务端、数据库、账户或外部字体。`astro.config.mjs`固定`base: /flow`、输出`dist/`并包含`.nojekyll`。新路径、资源和锚点都需通过子路径验证。

站点为[www.bluexiii.com/flow/](https://www.bluexiii.com/flow/)，公开源码仓库为[xiiiblue/flow](https://github.com/xiiiblue/flow)。既有`.github/workflows/pages.yml`在main推送或手动触发时构建、检查并发布；本次未改变Pages设置、DNS、凭据、可见性或HiveFlow业务启用状态。`deploy/pages-workflow.yml.example`保留为参考，不新增活动发布入口。

网站沿用蜂巢与ACDL的家族风格、HiveFlow青绿色强调、明暗主题、阅读导航和打印样式。首页展示2.0版本说明、Hermes与双机分工、两组独立选择、Director介入和有日期的验证限制。

本仓库flow的网站实现与经授权分发的介绍材料采用[Apache-2.0](LICENSE)，来源和分发声明见[NOTICE](NOTICE)。独立项目[hive-flow](https://github.com/xiiiblue/hive-flow)同样采用Apache-2.0，提供规范参考版、介绍和离线工具，官网页脚保留项目与网站许可入口。第三方组件和引用材料保留各自许可与声明；许可不覆盖私有HiveOS未分发材料或真实业务访问权。

## 页脚访问统计

沿用已核验的备案信息[鲁ICP备18050487号-1](https://beian.miit.gov.cn/)和不蒜子2.3公开脚本，仅在`www.bluexiii.com`加载；本地预览不发送统计请求。未新增Cloudflare beacon、账户、凭据或付费服务。

脚本通过JSONP向`busuanzi.ibruce.info`请求计数，使用`no-referrer-when-downgrade`提供页面Referrer。服务端会接收常规网络请求信息；此前检查的客户端脚本不写cookie/localStorage、不采集登录身份，第三方服务端的处理与保留策略不由本站控制。

`site_uv`和`site_pv`按域名汇总，可能包含同域其他项目，因此显示“域名访客／域名浏览”，不声称是Flow独立数据。数字初始为空且隐藏，脚本被阻断时备案和其他页脚内容仍可用。

## 2.0同源更新

用`scripts/sync-handbook.py --source <本地HiveOS> --commit <完整SHA>`从固定Git对象整理16份介绍，随后人工更新首页与3篇专题页。环境简称泛化，私有链接改说明，图示转换为静态流程；脚本不导入规范或运行记录。网站与独立hive-flow的来源SHA一致，版本说明不改变业务启停或数据schema。

## 快捷通知说明更新（2026-11-01）

来源更新至`888856c78b44403ceef32782760fe01887c99d6b`。交付与回执章节补充固定通知入口、精确成员匹配、限时缓存、原通知账和提交一次机制；真实业务仓库与公开离线副本的能力分别说明，网站不保存实际群、身份或配置。

`npm test`的9项检查通过；本地浏览器覆盖20个路由及320、390、768、1440四种宽度，交互、打印与异常计数降级检查通过，新增段落的桌面和手机截图已查看。首次浏览器检查因未启动预览而失败；自带预览随后监听了通配地址，已停止，改用仅回环地址的静态预览后完整通过，测试后关闭。未改网站服务逻辑、Pages设置或业务通知权限。
