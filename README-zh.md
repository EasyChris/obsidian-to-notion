# Obsidian to Notion
[![](https://github.com/Easychris/obsidian-to-notion/actions/workflows/CI.yml/badge.svg)](https://github.com/Easychris/obsidian-to-notion/actions/workflows/CI.yml)
[![Release Obsidian plugin](https://github.com/Easychris/obsidian-to-notion/actions/workflows/release.yml/badge.svg)](https://github.com/Easychris/obsidian-to-notion/actions/workflows/release.yml)
[![GitHub license](https://camo.githubusercontent.com/400c4e52df43f6a0ab8a89b74b1a78d1a64da56a7848b9110c9d2991bb7c3105/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f4c6963656e73652d47504c76332d626c75652e737667)](https://raw.githubusercontent.com/EasyChris/obsidian-to-notion/master/LICENSE)
[![Github all releases](https://img.shields.io/github/downloads/Easychris/obsidian-to-notion/total.svg)](https://GitHub.com/Easychris/obsidian-to-notion/releases/)
[![GitLab latest release](https://badgen.net/github/release/Easychris/obsidian-to-notion/)](https://github.com/Easychris/obsidian-to-notion/releases)

Obsidian share to Notion [English](README.md)

将obsidian文件一键分享到Notion,并在obsidian中添加Notion分享链接

![](./doc/1.gif)

# 使用方式
## 安装插件
### BRAT
插件中中心搜索 BRAT
添加 `EasyChris/obsidian-to-notion` 到 BRAT 插件安装列表中
返回插件中心启用即可
### 手动安装
```
cd YOUR_OBSIDIAN_FOLDER/.obsidian/plugins/
git clone https://github.com/EasyChris/obsidian-to-notion.git
```
### 市场下载
因为暂时还未上架，所以请通过BRAT安装

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

![](https://files.readme.io/0a267dd-share-database-with-integration.gif)

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


# 请我喝杯咖啡

[顿顿饭](https://dun.mianbaoduo.com/@easy)

# 感谢
[开发流程 | Obsidian 插件开发文档](https://luhaifeng666.github.io/obsidian-plugin-docs-zh/zh/getting-started/development-workflow.html)

[GitHub - devbean/obsidian-wordpress: An obsidian plugin for publishing docs to WordPress.](https://github.com/devbean/obsidian-wordpress)

[GitHub - obsidianmd/obsidian-api](https://github.com/obsidianmd/obsidian-api)

[GitHub - zhaohongxuan/obsidian-weread-plugin: Obsidian Weread Plugin is an plugin to sync Weread(微信读书) hightlights and annotations into your Obsidian Vault.](https://github.com/zhaohongxuan/obsidian-weread-plugin)
