---
title: 'Github with 443 errors'
author: 'Ski Lee'
description: "Even use Vpn, still get 443 errors."
image:
  url: "@postImages/4.jpg"
  alt: "The man's hand holding a laptop"
pubDate: 2024-08-13
isPublished: true
tags: ["github", "clash","error","git"]
---

## Github with 443 errors

### 1. Problem

使用了`Clash`作为代理，（即使是全局代理），但是使用`git clone`、`git push`、`git pull`仍然碰到443错误。

### 2. Solution

这是因为`git`没有走全局代理的端口，需要在`git`中设置`vpn`代理的端口，`Clash`默认代理的端口是`7890`。

在`bash`中输入以下命令：

```bash
git config --global http.proxy http://127.0.0.1:7890 
git config --global https.proxy http://127.0.0.1:7890
# 我的clash在7890上系统代理
```

使用 V2ray 的情况：

```bash
git config --global http.proxy http://127.0.0.1:10808 
git config --global https.proxy http://127.0.0.1:10808
# 我的v2ray在10808上系统代理
```
