# 信笺时刻：自助生成数字祝福信

静态前端部署在帽子云；订单、图片与专属链接由 Supabase 提供。

## 页面入口

- index.html：产品介绍页，适合小红书主页或置顶评论跳转。
- create.html：模板选择和自助填写页。
- card.html?id=订单 UUID：独立祝福信页面。

当前可选模板：生日来信、写给妈妈、写给老师。新增模板时需同步更新：

1. assets/js/create.js 中的 templates。
2. supabase/schema.sql 与 create-card 函数中的模板白名单。
3. card.html 的实际展示逻辑（未来可为每种模板单独做视觉）。

## 首次配置 Supabase

1. 打开 Supabase Dashboard → SQL Editor。
2. 将 supabase/schema.sql 的全部内容粘贴并执行一次。
3. 安装 Supabase CLI，并在项目根目录登录、关联项目。
4. 部署函数：

   supabase functions deploy create-card --no-verify-jwt
   supabase functions deploy get-card --no-verify-jwt

5. Dashboard → Edge Functions，确认两个函数均为 Active。

函数使用 Supabase 自带的 SUPABASE_URL 与 SUPABASE_SERVICE_ROLE_KEY 环境变量；不要把 service role key 写入网页、GitHub 或聊天消息。

由于这是无需登录即可填写的公开产品页，函数需要允许匿名请求，因此使用了 --no-verify-jwt。上线后建议接入 Cloudflare Turnstile 或 Supabase Edge Function 限流，降低恶意批量提交的风险。

## 部署到帽子云

把整个项目部署为静态站点。小红书应挂：

https://你的帽子云域名/create.html

帽子云若使用单页重写规则，不需要配置；当前使用普通静态 HTML 文件。

## 安全与隐私边界

- 每张卡使用服务端生成的 UUID，订单数据储存在 Supabase，不会通过静态文件互相覆盖。
- 图片按订单 UUID 存储在 card-media 桶中。
- 当前图片桶为公开读取：随机 ID 降低猜测概率，但不能视为严格私密保护。
- 不要上传高度敏感照片；严格私密版应后续改用私有桶和带时效的签名 URL。
- publishable key 可放在前端；绝不能放入 service_role / secret key。
