export const NoticeMsg: {[key: string]:any} = {
  "en": {
    "notion-logo": "Share to notion",
    "sync-success": "Sync to notion success: \n",
    "sync-fail": "Sync to notion fail: \n",
    "open-notion": "Please open the file that needs to be synchronized",
    "config-secrets-notion-api": "Please set up the notion API in the settings tab.",
    "config-secrets-database-id": "Please set up the database id in the settings tab.",
    "set-tags-fail": "Set tags fail,please check the frontmatter of the file or close the tag switch in the settings tab.",
  },
  "zh": {
    "notion-logo": "分享到Notion",
    "sync-success": "同步到Notion成功:\n",
    "sync-fail": "同步到Notion失败: \n",
    "open-file": "请打开需要同步的文件",
    "set-tags-fail": "设置标签失败,请检查文件的frontmatter,或者在插件设置中关闭设置tags开关",
  },
}


export const NoticeMConfig = (lang:any) :any => {
  return NoticeMsg[lang]
}