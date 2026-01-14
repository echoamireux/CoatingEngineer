# CoatingMaster Pro (涂布工程专家)

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg) ![Platform](https://img.shields.io/badge/platform-WeChat_Mini_Program-green.svg) ![License](https://img.shields.io/badge/license-Private-red.svg)

## 📖 项目简介 | Introduction

**涂布工程专家 (CoatingMaster Pro)** 是一款专为涂布行业研发工程师与工艺人员打造的微信小程序。

本项目旨在通过标准化的计算模型和便捷的工具集，解决涂布工艺中常见的**卷材参数计算**、**流体力学分析**及**工程单位换算**等痛点，辅助工程师进行精益成本核算与工艺参数优化，提升研发效率与生产良率。

## ✨ 核心功能 | Features

### 🚀 1. 涂布与卷材计算 (Coating & Coil)

核心工艺参数的快速求解，支持以下计算：

- **卷径计算**：基于收卷长度与厚度的实时估算。
- **卷材重量估算**：不同基材（PET/PI/铜箔等）的重量计算。
- **泵速与湿胶重**：精密涂布供液泵速与涂层湿重的双向推导。

### 💧 2. 流体力学计算 (Fluid Mechanics)

针对涂布流体特性的专业分析工具：

- **供液管路压降**：计算非牛顿流体在管路输送中的压力损失。
- **狭缝模头 (Slot Die) 压降**：模头内部流变特性的简易模拟与压降估算。

### 🔄 3. 工程单位换算 (Unit Converter)

涂布行业专用单位的一键转换：

- **粘度**：mPa·s / cP /Poise 等动态粘度换算。
- **压力**：MPa / bar / psi / kgf/cm² 等压力单位互转。
- **涂布量**：干重 (g/m²) 与 湿膜厚度 (μm) 的换算。

### 💰 4. 生产成本核算 (Cost Accounting)

_(当前状态：v2.0 算法重构中 / 预览版)_

- 精益成本核算模型。
- 辅助费率与规模效应估算。

### 🛡️ 安全与体验 (Security & UX)

- **团队访问控制**：内置轻量级口令验证机制（Access Code），保障核心工艺数据仅内部团队可见。
- **暗黑模式 (Dark Mode)**：全站适配 iOS/Android 深色模式，适应车间与实验室低光环境。

## 🛠️ 技术栈 | Tech Stack

- **框架**：微信小程序原生开发 (Native Framework)
- **语言**：WXML, WXSS, JavaScript (ES6+)
- **样式**：CSS Variables (用于动态主题切换)
- **图标**：纯文本 Emoji 与 CSS 绘图 (轻量化设计)

## 🔐 访问说明 | Access

本项目包含敏感工艺计算逻辑，已启用访问拦截。

- **默认口令**：对应流体力学临界雷诺数
- **修改方式**：在 `pages/home/index.js` 中修改 `ACCESS_CODE` 常量。

## 📝 待办事项 | Roadmap

- [x] 完成核心 UI 架构与暗黑模式适配
- [x] 上线涂布、流体、换算三大基础模块
- [x] 实装团队口令验证拦截系统
- [ ] **v2.0**: 发布生产成本核算完整版算法
- [ ] **v2.1**: 接入云开发 (Cloud Base)，实现云端历史记录同步

## 📄 版权说明 | License

Copyright © 2026 CoatingMaster Pro. All Rights Reserved.
本项目为内部工程工具，未经授权严禁复制、分发或用于商业用途。

---

_Powered by echoamireux_
