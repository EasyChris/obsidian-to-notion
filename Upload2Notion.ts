import { App, requestUrl } from "obsidian";
import { Client } from "@notionhq/client";
import { markdownToBlocks, markdownToRichText } from "@tryfabric/martian";
import * as fs from "fs";
import * as yamlFrontMatter from "yaml-front-matter";
import * as yaml from "yaml"
import MyPlugin from "main";

export class Upload2Notion {
	app: MyPlugin;
	notion: Client;
	agent: any;
	constructor(app: MyPlugin) {
		this.app = app;
	}

	async createPage(title:string, childArr: any) {
		const bodyString = {
			"parent": { "database_id": this.app.settings.databaseID },
			properties: {
				Name: {
					title: [
						{
							text: {
								content: title,
							},
						},
					],
				},
			},
			children: childArr,
		}
		const response = await requestUrl({
			url: `https://api.notion.com/v1/pages`,
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'User-Agent': 'obsidian.md',
				'Authorization': 'Bearer ' + this.app.settings.notionAPI,
				'Notion-Version': '2021-08-16',
			},
			body: JSON.stringify(bodyString),
		})
		return response;
	}

	async syncMarkdownToNotion(title:string, markdown: string, fullPath:string): Promise<any> {
		const file2md = markdownToBlocks(markdown);
		const res = await this.createPage(title, file2md);
		if (res.status === 200) {
			this.updateYamlInfo(markdown, fullPath, res)
		}
		return res
	}

	async updateYamlInfo(yamlContent: string, fullPath: string, res: any) {
		const yamlObj:any = yamlFrontMatter.loadFront(yamlContent);
		const {url} = res.json
		yamlObj.shareUrl = url;
		const __content = yamlObj.__content;
		delete yamlObj.__content
		const yamlhead = yaml.stringify(yamlObj)

		const content = '---\n' +yamlhead +'\n---\n' + __content;

		//write content fo file
		fs.writeFileSync(fullPath, content);
		return res
	}
}
