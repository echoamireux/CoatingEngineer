# 涂布智算Pro (Coating Engineer)

![Version](https://img.shields.io/badge/version-1.1.0-blue.svg) ![Platform](https://img.shields.io/badge/platform-WeChat_Mini_Program-green.svg) ![License](https://img.shields.io/badge/license-Private-red.svg)

## 📖 项目简介 | Introduction

**涂布智算Pro (Coating Engineer)** 是一款专为涂布行业研发工程师与工艺人员打造的微信小程序。

本项目旨在通过标准化的计算模型和便捷的工具集，解决涂布工艺中常见的**卷材参数计算**、**流体力学分析**及**工程单位换算**等痛点，辅助工程师进行精益成本核算与工艺参数优化，提升研发效率与生产良率。

现在，项目已全面接入**微信云开发 (WeChat Cloud)**，实现了**云端鉴权**与**动态配置**，无需发版即可实时管理应用状态。

## ✨ 核心功能 | Features

### 💰 1. 生产成本核算 (Cost Accounting)

多层级精益成本核算模型，支持：

- **智能报价模拟**：基于原料、制程、人工、能耗的综合报价分析。
- **自定义费率**：支持配置机台费率与人工工时。
- **可视化结果**：清晰展示各环节成本占比。

### 🏭 2. 涂布与卷材计算 (Coating & Coil)

核心工艺参数的快速求解，支持以下计算：

- **智能卷径估算**：基于收卷长度与材料厚度的动态卷径预测，辅助收放卷控制。
- **卷材重量计算**：集成多材质密度库（PET/PI/铜箔/铝箔等），精准计算卷材理论重量。
- **涂布工艺反算**：建立“泵速-湿重-涂宽-线速”联动模型，支持双向推导，快速设定机台参数。

### 💧 3. 流体力学计算 (Fluid Mechanics)

针对涂布流体特性的专业分析工具：

- **供液管路压降**：计算非牛顿流体在管路输送中的压力损失。
- **狭缝模头 (Slot Die) 压降**：模头内部流变特性的简易模拟与压降估算。

### 🔄 4. 工程单位换算 (Unit Converter)

涂布行业专用单位的一键转换：

- **粘度**：mPa·s / cP / Poise 等动态粘度换算。
- **压力**：MPa / bar / psi / kgf/cm² 等压力单位互转。
- **涂布量**：干重 (g/m²) 与 湿膜厚度 (μm) 的换算。

### 📜 5. 历史记录 (History)

方便随时回溯与比对：

- **手动触发**：在各计算子模块完成计算后，结果将自动暂存并显示，非自动持久化保存。
- **一键复用**：点击历史记录可直接填充至计算器，快速进行二次计算。

---

## 🛡️ 安全与管理 | Security & Management

本项目采用了业界领先的**云端+本地**双重安全架构：

### ☁️ 云端口令验证 (Cloud Verification)

- **安全鉴权**：访问口令不再硬编码于前端，而是存储于云数据库 (`access_codes` 集合)。
- **实时验证**：通过云函数 `verifyPasscode` 进行校验，杜绝前端破解风险。
- **本地灾备**：内置安全的本地备用口令机制 (`config.local.js`)，确保在网络故障时仍可应急访问。

### 📱 移动端管理员后台 (Mobile Admin Dashboard)

无需电脑，通过手机即可掌控一切：

- **隐蔽入口**：在“关于作者”页面连续点击标题激活。
- **动态配置**：
  - **强制验证开关**：一键开启/关闭全站口令拦截（方便过审）。
  - **赞赏入口开关**：一键显示/隐藏赞赏码。
  - **口令提示词**：实时修改前端显示的提示文本。
- **口令管理**：随时随地修改访问口令，即刻生效。

## 🛠️ 技术栈 | Tech Stack

- **核心框架**：微信小程序原生 (Native Framework)
- **云开发 (Serverless)**：
  - **Cloud Functions**：业务逻辑、鉴权、配置更新
  - **Cloud Database**：NoSQL 数据库存储配置与口令
- **前端技术**：WXML, WXSS, JavaScript (ES6+), CSS Variables (Dark Mode)
- **设计风格**：极简主义工程风 (Emoji Icons + CSS Shapes)

## 🔐 部署说明 | Deployment

由于本项目涉及敏感配置，克隆后请注意：

1.  **环境配置**：
    - 在 `utils/` 下创建 `config.local.js` (参考 `config.local.template.js`)。
    - 在 `cloudfunctions/updateSettings/` 下创建 `secret.js` (参考 `secret.example.js`)。
2.  **云开发初始化**：
    - 开通微信云开发环境。
    - 创建数据库集合：`app_settings`, `access_codes`。
    - 部署云函数：`verifyPasscode`, `updateSettings`, `customerService`。

## 📝 开发计划 | Roadmap

- [x] **v1.0**: 核心计算模块上线 (涂布/流体/换算)
- [x] **v1.1**: UI 视觉升级与暗黑模式适配
- [x] **v1.2**: 接入云开发，实现云端鉴权与动态配置
- [x] **v1.3**: 上线移动端管理员后台
- [x] **v1.4**: 历史记录模块上线
- [x] **v2.0**: 生产成本核算模块完整上线 (Current Version)
- [ ] **v2.1**: 历史记录云端同步功能 (Future)

## 📄 版权说明 | License

Copyright © 2026 EA Studio. All Rights Reserved.
本项目为内部工程工具，未经授权严禁复制、分发或用于商业用途。

---

_Powered by echoamireux_
