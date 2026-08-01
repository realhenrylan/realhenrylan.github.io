# MNEME Website

Mneme 产品官网 — 基于 GitHub Pages 的静态网站。

## 简介

本仓库托管 [Mneme](https://github.com/realhenrylan/mneme) 的产品展示网站，包含产品首页、功能说明、使用指南和工程博客。

**在线地址**：https://realhenrylan.github.io/MNEME/

## 技术栈

- 纯静态网站（HTML / CSS / JavaScript）
- 无构建工具，无框架依赖
- 托管于 GitHub Pages
- 使用 CSS 自定义属性实现主题切换（浅色 / 深色模式）

## 项目结构

```
.
├── index.html              # 英文首页
├── about.html              # 关于页面
├── mneme-site.css          # 全局样式（含主题变量）
├── mneme-site.js           # 交互脚本（搜索、主题、移动端菜单）
├── mneme-logo.svg          # 品牌 Logo
├── tui-real-screenshot.png # TUI 界面截图
├── 404.html                # 404 错误页
├──
├── blog/                   # 工程博客
├── features/               # 功能文档
│   ├── hybrid-retrieval.html
│   ├── graph-rag.html
│   ├── query-decomposition.html
│   └── safety.html
├── guide/                  # 使用指南
│   ├── getting-started.html
│   ├── configuration.html
│   └── tui-commands.html
├── reference/              # 参考文档
│   ├── configuration.html
│   ├── supported-files.html
│   └── changelog.html
├── zh/                     # 中文页面
└── CHANGELOG.md            # 更新日志
```

## 本地预览

```bash
# 方式一：Python HTTP 服务器
python -m http.server 8765
# 访问 http://localhost:8765/

# 方式二：Node.js
npx serve .
```

## 部署

网站通过 GitHub Pages 自动部署，主分支（`main`）推送后自动更新。

## 设计规范

详细设计说明见 [`MNEME-website-redesign-spec.zh-CN.md`](./MNEME-website-redesign-spec.zh-CN.md)。

## 国际化

- 英文为默认语言
- 中文页面位于 `zh/` 目录
- 语言切换通过导航栏链接实现

## 主题切换

支持浅色 / 深色模式：
- 通过导航栏主题按钮手动切换
- 偏好设置持久化于 `localStorage`
- 遵循 `prefers-color-scheme` 媒体查询

## 许可证

与 Mneme 主项目保持一致。
