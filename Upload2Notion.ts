import { App, requestUrl } from "obsidian";
import { Client } from "@notionhq/client";
import { markdownToBlocks, markdownToRichText } from "@tryfabric/martian";
import * as fs from "fs";
import { HttpsProxyAgent } from "https-proxy-agent";
import MyPlugin from "main";

interface settings {
	notionAPI: string; 
	databaseID: string;
	proxy: string;
}

interface IApp {
	app: App;
	manifest: any;
	settings: settings;
}

export class Upload2Notion {
	app: MyPlugin;
	notion: Client;
	agent: any;
	constructor(app: MyPlugin) {
		this.app = app;
		console.log(app);
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
		console.log(bodyString)
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
		console.log('POST response', response);	
		return response;
	}

	async syncMarkdownToNotion(title:string, markdown: string): Promise<any> {
		const file2md = markdownToBlocks(markdown);
		console.log(file2md)
		const res = await this.createPage(title, file2md);
		return res
	}
}
