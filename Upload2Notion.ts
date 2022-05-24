import { requestUrl } from "obsidian";
import { Client } from "@notionhq/client";
import { markdownToBlocks,  } from "@tryfabric/martian";
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
			parent: { 
				database_id: this.app.settings.databaseID 
			},
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
				// 'User-Agent': 'obsidian.md',
				'Authorization': 'Bearer ' + this.app.settings.notionAPI,
				'Notion-Version': '2021-08-16',
			},
			body: JSON.stringify(bodyString),
		})
		return response;
	}

	async syncMarkdownToNotion(title:string, markdown: string, fullPath:string): Promise<any> {
		const yamlObj:any = yamlFrontMatter.loadFront(markdown);
		const __content = yamlObj.__content
		const file2md = markdownToBlocks(__content);
		const res = await this.createPage(title, file2md);
		if (res.status === 200) {
			this.updateYamlInfo(markdown, fullPath, res)
		}
		return res
	}

	async updateYamlInfo(yamlContent: string, fullPath: string, res: any) {
		const yamlObj:any = yamlFrontMatter.loadFront(yamlContent);
		const {url} = res.json
		yamlObj.link = url;
		const __content = yamlObj.__content;
		delete yamlObj.__content
		const yamlhead = yaml.stringify(yamlObj)
		//  if yamlhead hava last \n  remove it
		const yamlhead_remove_n = yamlhead.replace(/\n$/, '')
		// if __content have start \n remove it
		const __content_remove_n = __content.replace(/^\n/, '')
		const content = '---\n' +yamlhead_remove_n +'\n---\n' + __content_remove_n;

		//write content fo file
		fs.writeFileSync(fullPath, content);
		return res
	}
}
