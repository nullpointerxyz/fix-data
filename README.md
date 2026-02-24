# Data Transformer (数据转换工具)

[![GitHub Pages](https://img.shields.io/badge/website-online-brightgreen.svg)](https://nullpointerxyz.github.io/fix-data/)

🚀 **在线访问地址**: [https://nullpointerxyz.github.io/fix-data/](https://nullpointerxyz.github.io/fix-data/)

Data Transformer 是一款基于纯前端技术实现的高效、优雅的数据清洗与格式转换工具集。针对开发者的日常使用场景，整合了多种常用实用功能，所有功能全部在浏览器本地完成处理，速度极快且充分保障数据安全。

## 🌟 核心功能

1. **🧹 文本清洗**：支持一键删除特定字符（空格、逗号、引号等）、去重、排序，及将结果按特定格式拼接输出（如 `IN ('a','b')`、纯 ID、JSON 数组等）。
2. **☕ ToString → JSON**：将 Java 标准输出的 `toString()` 对象结构（如 `User(id=1, name=张三)`）一键转换并格式化为标准 JSON 数据。
3. **📋 JSON 格式化**：JSON 字符串高亮着色、层级格式化以及单行文本压缩。
4. **🔍 JSON 比对**：结构化比对左右两组 JSON 数据，直观显示增改差异。
5. **🕐 时间戳转换**：支持毫秒 (ms) 或秒 (s) 级时间戳自动识别，并能够与标准日期格式（如 `yyyy-MM-dd HH:mm:ss`）互相转换。
6. **🔑 密码生成**：可高度自定义包含的字符规则、密码长度及单次生成条数，生成安全随机密码。
7. **🔠 编码转换**：内置 Base64 编解码、URL 编解码、Unicode 编解码以及 HTML 实体转义和还原。
8. **📝 拼接编辑器**：一个全局中转站，可将其他工具处理后得到的数据在此处直接自由编写、组合和拼接。
9. **📌 临时粘贴板**：提供 5 个快速记录数据的多文本区域，数据自动保存到浏览器的 `localStorage` 中，刷新防丢失。
10. **📏 字符统计**：实时统计输入文本中的中英文字符、数字、全角/半角符号，及字节占用长度（UTF-8 或 GBK 估算）。
11. **🖼️ 占位图生成**：支持指定宽、高、颜色以及精准的**目标文件大小**(填充全零无用字节以“撑大”体积)的占位图片快速生成与下载保存。
12. **🌍 谷歌翻译**：内置 Google 翻译直链通道入口，辅助阅读文档。

## 📂 目录结构

项目经过整洁规范化组织，目前的顶层目录结构如下：

```text
├── assets/               # 前端静态资源主目录
│   ├── css/              # 全局及字体样式表 (style.css, fonts.css)
│   ├── fonts/            # Web字体文件包 (Inter, JetBrains Mono)
│   ├── img/              # 图片、图标资产 (favicon.svg)
│   └── js/               # Javascript 服务逻辑及各工具模块脚本
├── index.html            # 主程序的入口页面
├── Dockerfile            # Docker Nginx 部署配置文件
├── deploy_docker.sh      # 一键构建与发布 Docker 脚本
└── README.md             # 本文档
```

## 🚀 部署与使用

因为本项目采用 100% 纯静态逻辑，不仅轻量，而且部署方案十分省心：

### 1. 本地双击运行
由于无需任何后端环境依赖，您可以直接下载项目，然后在任意现代浏览器中双击打开 `index.html` 即可使用。

### 2. 通过 GitHub Pages 或静态托管
极力推荐搭配 GitHub Pages、Vercel 等平台建立无需维护成本的免费托管环境。改动代码推送完成后就可以直接发布网页供多端访问。

### 3. Docker 私有化部署
如果您的环境中存在 Docker 并且需要将其挂载为服务：
```bash
# 方法 1：使用提供的 shell 脚本一键构建和部署
./deploy_docker.sh

# 方法 2：手动执行
docker build -t fix-data:latest .
docker run -d -p 80:80 --name fix-data fix-data:latest
```

## 🔧 技术选型

*   **框架**: 纯原生实现 (`Vanilla JS` + `HTML5` + `CSS3`)，无第三方重型框架。
*   **设计**: 玻璃拟物UI (Glassmorphism)、暗阶高级配色风格、CSS 平滑微动画补间。
*   **状态存储**: 浏览器原生 `localStorage` 持久缓存。
