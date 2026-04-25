# 后端架构与接口规范（Spring Boot）

## 技术栈
- Spring Boot 3.x、Spring Web、Spring Validation
- Spring Security（JWT 认证，角色控制）
- Spring Data JPA 或 MyBatis（参数化查询）
- Lombok、MapStruct（DTO 映射）
- Swagger/OpenAPI（见 docs/api/openapi.yaml）
- 可选：Redis 缓存、异步任务（热门排行刷新）

## 架构原则
- 离线优先：前端以本地为主，后端提供增量同步与查询
- 领域建模：Route / Booking / Post / Comment / Points 与前端字段一致（时间统一毫秒时间戳）
- 分层清晰：Controller（REST）→ Service（业务）→ Repository（数据）
- 安全：JWT、角色授权、请求参数校验、统一异常处理与脱敏日志

## 接口规范
- OpenAPI 规范文件：docs/api/openapi.yaml
- 认证：Authorization: Bearer <token>（HttpOnly Cookie 亦可）
- 分页：page/size，默认 page=0、size=20
- 错误：统一返回错误码与 message（400/401/403/404/409/422/500）

## 核心模型
- Route：id、name、category、viewCount、lat、lng、coverUrl
- Booking：id、routeId、routeName、status、rating、date、sourceType、sourceId
- Post：id、type、content、images[]、location{latitude,longitude,name}、date、likes
- Comment：id、postId、content、authorInfo{nickName,avatarUrl}、ts
- Points：total、history[{ts, delta, reason}]

## 同步策略
- 客户端离线存数据，本地事件（post.created/updated/deleted、booking.*、points.changed）按需调用后端
- 合并策略：时间戳优先或版本号（If-Match），避免覆盖冲突
- 失败重试：网络重试与幂等键（如 postId / bookingId），保障服务端幂等

## 性能与缓存
- 列表与统计可缓存（TTL），热门排行支持异步刷新或定时任务
- 慎用 N+1 查询；GraphQL/批量查询可作为未来增强

## 运维与日志
- 访问日志脱敏（隐藏 token、隐私字段）
- 错误日志包含 traceId；关键操作审计（删除、积分变动）

## TODO（落地清单）
- 实体/DTO/Repository/Service/Controller 按 OpenAPI 对齐
- 统一异常与校验（@ControllerAdvice + @Valid）
- 集成 Swagger UI，用于联调与文档浏览
