# Coating Engineer (涂布工程专家)

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg) ![Platform](https://img.shields.io/badge/platform-WeChat_Mini_Program-green.svg) ![CloudBase](https://img.shields.io/badge/backend-Cloud_Functions-orange.svg) ![License](https://img.shields.io/badge/license-Private-red.svg)

## 📖 项目简介 | Introduction

**涂布工程专家 (Coating Engineer)** 是一款专为涂布行业研发工程师与工艺人员打造的微信小程序。

本项目旨在通过标准化的计算模型、丰富的知识库和便捷的工具集，解决涂布工艺中常见的**卷材参数计算**、**流体力学分析**及**工程单位换算**等痛点，辅助工程师进行精益成本核算与工艺参数优化，提升研发效率与生产良率。

## ✨ 核心功能 | Features

功能顺序与小程序首页保持一致：

### 📚 1. 涂布工程师手册 (Handbook)

随身携带的工艺知识库：

- **工艺流程**：标准涂布工艺流程详解（如：Micro-Gravure, Slot Die 等）。
- **测试标准**：涂层性能测试方法与标准（GB/ASTM/ISO）。
- **常见问题**：涂布缺陷（气泡、划痕、厚度不均）对照与解决方案。

### 💰 2. 生产成本核算 (Cost Accounting)

分段式精益成本核算模型：

- **工序流管理**：支持自定义多道工序（如：涂布、复合、分切），灵活配置。
- **精细化BOM**：
  - **基材成本**：自动关联涂宽与原宽利用率。
  - **胶液成本**：内置配方计算器，支持多组分混合成本与固含推算。
- **制造成本**：机台费率与人工费率的参数化配置与分摊。
- **良率累计**：自动计算直通率 (First Pass Yield) 对最终成本的累计影响。

### 🏭 3. 涂布生产计算 (Coating & Coil)

核心工艺参数的快速求解，支持**由参数变更触发的实时自动计算 (Auto-Calculation)**：

- **卷径计算**：基于收卷长度与厚度的实时估算，支持多层复合结构。
- **卷材重量估算**：支持 PET、PI、铜箔、铝箔等多种基材的重量计算。
- **泵速与湿胶重**：精密涂布供液泵速与涂层湿重的双向推导，输入任一参数即自动更新结果。

### 💧 4. 流体力学计算 (Fluid Mechanics)

针对涂布流体特性的专业分析工具，内含**防抖自动计算**机制：

- **供液管路压降**：计算非牛顿流体在管路输送中的压力损失。
- **狭缝模头 (Slot Die) 压降**：模头内部流变特性的简易模拟与压降估算。
- **一键计算全部**：支持单独计算管道/模头或一键计算总压降。

### 🔄 5. 工程单位换算 (Toolkit)

- **动态粘度**：mPa·s / cP / Poise
- **流体压力**：MPa / bar / psi / kgf/cm²
- **涂覆相关**：干重 g/m² ↔ 湿膜厚度 μm

### 🛡️ 安全与体验 (Security & UX)

- **云端访问控制**：集成微信云开发验证机制，通过云数据库校验访问口令，保障核心数据安全。
- **暗黑模式 (Dark Mode)**：全站适配 iOS/Android 深色模式，保护视力，适应车间环境。
- **管理后台 (Admin)**：专用管理入口，用于动态配置参数与查看日志（仅限管理员）。

## 📂 项目结构 | Project Structure

```
CoatingEngineer/
├── behaviors/          # 共享逻辑 (Mixins), 如成本计算逻辑
├── cloudfunctions/     # 微信云函数 (后端逻辑)
│   ├── verifyPasscode/ # 口令验证函数
│   └── updateSettings/ # 配置更新函数
├── components/         # 通用组件库 (UI Kit)
├── pages/              # 页面视图层
│   ├── home/           # 首页 dashboard
│   ├── handbook/       # 工程师手册模块 (Menu 1)
│   ├── cost/           # 成本核算模块 (Menu 2)
│   ├── coating/        # 涂布计算模块 (Menu 3)
│   ├── fluid/          # 流体计算模块 (Menu 4)
│   ├── tools/          # 工具模块 (Menu 5 - Converter)
│   ├── history/        # 历史记录 (Menu 6)
│   └── admin/          # 管理后台
├── utils/              # 工具函数
└── app.json            # 全局配置
```

## 🛠️ 技术栈 | Tech Stack

- **客户端**：微信小程序原生开发 (Native Framework)
- **服务端**：微信云开发 (WeChat Cloud Base) - 云函数 (Node.js) + 云数据库 (NoSQL)
- **样式**：CSS Variables (动态主题), Flexbox/Grid 布局
- **规范**：ES6+, Component-based Architecture

## 🔐 访问说明 | Access

本项目已启用增强型访问拦截。

- **验证方式**：首次进入敏感模块需输入访问口令。
- **口令管理**：通过后台配置，存储于云数据库 `access_codes` 集合中。

## 📝 待办事项 | Roadmap

- [x] **v1.0**: 核心计算模块（涂布/流体/换算）上线
- [x] **Engineer Handbook**: 新增工程师手册模块
- [x] **Cloud Integration**: 接入云开发，实现动态口令验证
- [x] **Cost Accounting**: 全新及生产成本核算模块
- [ ] **Data Sync**: 云端历史记录同步与导出功能
- [ ] **AI Feature**: 智能工艺参数推荐 (Experimental)

## 📄 版权说明 | License

Copyright © 2026 EA Studio. All Rights Reserved.
本项目为内部辅助工具，旨在提升工程效率。

---

_Designed & Developed by EA Studio_
