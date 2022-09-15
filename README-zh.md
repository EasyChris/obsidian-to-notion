# Obsidian to Notion
[![](https://github.com/Easychris/obsidian-to-notion/actions/workflows/CI.yml/badge.svg)](https://github.com/Easychris/obsidian-to-notion/actions/workflows/CI.yml)
[![Release Obsidian plugin](https://github.com/Easychris/obsidian-to-notion/actions/workflows/release.yml/badge.svg)](https://github.com/Easychris/obsidian-to-notion/actions/workflows/release.yml)
[![GitHub license](https://camo.githubusercontent.com/400c4e52df43f6a0ab8a89b74b1a78d1a64da56a7848b9110c9d2991bb7c3105/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f4c6963656e73652d47504c76332d626c75652e737667)](https://raw.githubusercontent.com/EasyChris/obsidian-to-notion/master/LICENSE)
[![Github all releases](https://img.shields.io/github/downloads/Easychris/obsidian-to-notion/total.svg)](https://GitHub.com/Easychris/obsidian-to-notion/releases/)
[![GitLab latest release](https://badgen.net/github/release/Easychris/obsidian-to-notion/)](https://github.com/Easychris/obsidian-to-notion/releases)

Obsidian share to Notion [English](README.md)

将obsidian文件一键分享到Notion,并在obsidian中添加Notion分享链接

如果能对你有所帮助，欢迎给一个star支持。

![](./doc/1.gif)

# 使用方式
## 安装插件

### 市场下载
插件市场搜索 noiton 即可下载

![](https://afox-1256168983.cos.ap-shanghai.myqcloud.com/20220628214145.png)
### BRAT
插件中中心搜索 BRAT
添加 `EasyChris/obsidian-to-notion` 到 BRAT 插件安装列表中
返回插件中心启用即可
### 手动安装
```
cd YOUR_OBSIDIAN_FOLDER/.obsidian/plugins/
git clone https://github.com/EasyChris/obsidian-to-notion.git
```


## 申请 Notion API
官方参考文档：[https://developers.notion.com/docs](https://developers.notion.com/docs)
### 第 1 步：创建integration。
转到 [https://www.notion.com/my-integrations](https://www.notion.com/my-integrations)
创建完成之后，复制`secrets toekn`
![](https://files.readme.io/2ec137d-093ad49-create-integration.gif)

### 第2步：与你的集成共享一个数据库
新建一个的page（权限为公开）
在page中新建一个数据库 -> 需要`full page database`
![](./doc/3.gif)

将`integration`添加到你的新建的数据库中

![](./doc/6.gif)

#### 注意

数据库的第一个自定义名称必须是 "Name"，否则同步会失败。

![](https://afox-1256168983.cos.ap-shanghai.myqcloud.com/20220618102029.png)




### 第三步：复制database ID

```
https://www.notion.so/myworkspace/a8aec43384f447ed84390e8e42c2e089?v=...
                                  |--------- Database ID --------|

```



## 打开插件配置
将得到的 `NOTION_API_KEY` 和 `DATABASE_ID`填入配置当中
![](./doc/2.png)

## 上传文件内容到notion
点击上传notion的按钮
![](./doc/4.png)
上传成功之后会自动生成一个分享链接
![](./doc/5.png)


## 页面 Banner 链接[可选]
默认可以不填写
横幅URL必须是图像URL，例如：https：//i.imgur.com/xxx.jpg

## Notion ID [可选]
Notion ID是你想分享文件的页面ID。
如果你不写它，notion将分享到默认的链接，如：https://www.notion.so/myworkspace/a8aec43384f447ed84390，访问这个页面将重定向到你的网站页面。
如果你写了Notion ID，它将分享到页面链接如：https://your_user_name.notion.site/myworkspace/a8aec43384f447ed84390。不需要重定向网址。

## 同步图片

使用 [Obsidian Image Auto Upload Plugin](https://github.com/renmu123/obsidian-image-auto-upload-plugin) 插件，配置你自己的 cos 或者 oss，将图片存储到你自己的云存储，然后在 obsidian 中使用图片链接即可。该插件会自动帮你上传图片，并替换成链接。

# 请我喝杯咖啡

[顿顿饭](https://dun.mianbaoduo.com/@easy)

# 感谢
[开发流程 | Obsidian 插件开发文档](https://luhaifeng666.github.io/obsidian-plugin-docs-zh/zh/getting-started/development-workflow.html)

[GitHub - devbean/obsidian-wordpress: An obsidian plugin for publishing docs to WordPress.](https://github.com/devbean/obsidian-wordpress)

[GitHub - obsidianmd/obsidian-api](https://github.com/obsidianmd/obsidian-api)

[GitHub - zhaohongxuan/obsidian-weread-plugin: Obsidian Weread Plugin is an plugin to sync Weread(微信读书) hightlights and annotations into your Obsidian Vault.](https://github.com/zhaohongxuan/obsidian-weread-plugin)
