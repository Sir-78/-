# 宁高旅小程序开发文档

本文档记录了宁高旅小程序的主要开发信息，包括项目结构、核心功能、技术栈和环境配置等。

## 1. 项目概述

宁高旅是一款提供本地旅游相关服务的小程序。

## 2. 项目结构

```
├── app.js                    # 小程序入口文件
├── app.json                  # 小程序全局配置文件
├── cloudfunctions/           # 云函数目录
│   ├── getBookings/         # 获取预订信息云函数
│   ├── getPosts/            # 获取帖子信息云函数
│   ├── getUserInfo/         # 获取用户信息云函数
│   └── login/               # 用户登录云函数
├── images/                   # 图片资源目录
│   ├── default-avatar.png   # 默认头像
│   └── tabbar/             # 底部导航栏图标
└── pages/                    # 页面目录
    ├── booking/            # 预订页面
    ├── community/          # 社区页面
    ├── index/              # 首页
    ├── post/               # 发帖页面
    ├── profile/            # 个人中心页面
    ├── route-overview/     # 路线概览页面
    ├── routeDetail/        # 路线详情页面
    └── statistics/         # 统计页面
```

## 3. 核心功能

### 3.1 页面功能

- **首页（index）**: 展示主要功能入口和推荐内容
- **路线相关**:
  - 路线概览（route-overview）: 展示所有可用路线
  - 路线详情（routeDetail）: 显示具体路线的详细信息
- **社区功能**:
  - 社区页面（community）: 用户交流平台
  - 发帖功能（post）: 允许用户发布内容
- **预订功能（booking）**: 提供预订服务
- **数据统计（statistics）**: 展示各类统计数据
- **个人中心（profile）**: 用户个人信息及设置管理

### 3.2 云函数

- **getBookings**: 获取用户预订信息
- **getPosts**: 获取社区帖子内容
- **getUserInfo**: 获取用户个人信息
- **login**: 处理用户登录逻辑
- **createPost**: 创建新的帖子

## 4. 技术栈

- **前端**: 微信小程序原生开发
- **后端**: Spring Boot（支持离线优先的增量同步）
- **小程序基础库版本**: 3.7.12
- **AppID**: wx4a4c6c07108a43cf

### 3.3 数据库集合

- **posts**: 存储用户发布的帖子信息。
  - `_id`: String (自动生成，主键)
  - `_openid`: String (发帖用户的 OpenID)
  - `authorInfo`: Object (发帖用户信息)
    - `nickName`: String (用户昵称)
    - `avatarUrl`: String (用户头像 URL)
  - `content`: String (帖子文字内容)
  - `images`: Array (帖子图片，存储云文件 ID)
  - `location`: Object (地理位置信息，可选)
    - `latitude`: Number
    - `longitude`: Number
    - `name`: String (位置名称)
  - `date`: Date (发帖时间)
  - `likes`: Number (点赞数)
  - `comments`: Array (评论列表，后续可扩展)

## 5. 云开发环境配置

- **环境ID**: `cloud1-4gbqo5yb0b5cb502`

- **云函数根目录**: `cloudfunctions/` (根据 `project.config.json` 配置)
- **部署方式**: 云函数需要在微信开发者工具中单独部署到云端。
- **权限设置**: 云函数的调用权限需要在微信小程序管理后台进行配置，通常设置为“所有用户可调用”或“仅管理员可调用”等，具体取决于函数功能。
- **数据库**: 云开发提供云数据库，数据表的创建和权限管理也需要在微信小程序管理后台进行。

## 7. 后端与接口文档（Spring Boot）
- 接口规范（OpenAPI）：[docs/api/openapi.yaml](docs/api/openapi.yaml)
- 架构与实现建议：[/docs/backend.md](docs/backend.md)

## 6. 开发记录

- **2024-07-26**: 
    - 初始化开发文档 `DEVELOPMENT_DOCUMENT.md`。
    - 根据 `project.config.json` 填充了小程序 AppID 和基础库版本。
    - 分析项目目录结构，并更新了文档中的项目结构和核心功能描述。
    - 补充了云开发环境配置的基本信息。
    - 新增后端接口规范与架构文档链接，准备迁移到 Spring Boot 后端。
