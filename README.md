# 可定制数字生日祝福页

这是无需后端的静态单页模板，可直接部署到 GitHub Pages 或 Cloudflare Pages。

## 为一位客户制作页面

1. 复制 index.html。每个订单建议放入独立目录，例如 orders/随机订单号/index.html。
2. 修改文件顶部的 CARD_CONFIG：收件人、署名、祝福语、开启时间、照片、音乐与基础口令。
3. 将照片和音乐上传到对象存储，再填入其 HTTPS URL。不要把客户私密素材提交到公开 GitHub 仓库。
4. 用手机浏览器测试页面后部署。

## 部署

- GitHub Pages：仓库 Settings → Pages → 选择 main 分支根目录。
- Cloudflare Pages：连接 GitHub 仓库；构建命令留空，输出目录填 /。

## 隐私提示

noindex 与 accessCode 只能降低误打开和搜索收录风险；口令在前端源码中可被找到，不能作为严格隐私保护。真正私密的照片或视频应使用私有对象存储、签名 URL，以及 Cloudflare Access / Workers 等服务端鉴权方案。
