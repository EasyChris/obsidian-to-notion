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

	async deletePage(notionID:string){	
		const response = await requestUrl({
			url: `https://api.notion.com/v1/blocks/${notionID}`,
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + this.app.settings.notionAPI,
				'Notion-Version': '2022-02-22',
			},
			body: ''
		})
		console.log(response)
		return response;	
	}

	// 因为需要解析notion的block进行对比，非常的麻烦，
	// 暂时就直接删除，新建一个page
	async updatePage(notionID:string, title:string, childArr:any) {
		await this.deletePage(notionID)
		const res = await this.createPage(title, childArr)
		return res
	}

	async createPage(title:string, childArr: any) {
		const bodyString:any = {
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

		if(this.app.settings.bannerUrl) {
			bodyString.cover = {
				type: "external",
				external: {
					url: this.app.settings.bannerUrl
				}
			}
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
		let res:any
		const yamlObj:any = yamlFrontMatter.loadFront(markdown);
		console.log(yamlObj)
		const __content = yamlObj.__content
		const file2Block = markdownToBlocks(__content);
		const {notionID} = yamlObj;
		if(notionID){
				res = await this.updatePage(notionID, title, file2Block);
		} else {
			 	res = await this.createPage(title, file2Block);
		}
		console.log(res,'===')
		if (res.status === 200) {
			await this.updateYamlInfo(markdown, fullPath, res)
		}
		return res
	}

	async updateYamlInfo(yamlContent: string, fullPath: string, res: any) {
		const yamlObj:any = yamlFrontMatter.loadFront(yamlContent);
		const {url, id} = res.json
		yamlObj.link = url;
		await navigator.clipboard.writeText(url)
		yamlObj.notionID = id;
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
