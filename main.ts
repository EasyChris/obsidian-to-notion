import {
	App,
	Editor,
	MarkdownView,
	Modal,
	Notice,
	Plugin,
	PluginSettingTab,
	Setting,
	normalizePath
} from "obsidian";
import { join } from "path";
import * as fs from "fs";
import {addIcons}  from 'icon';
import { Upload2Notion } from "Upload2Notion";
import {NoticeMConfig} from "Message";


// Remember to rename these classes and interfaces!

interface PluginSettings {
	notionAPI: string;
	databaseID: string;
	bannerUrl: string;
	notionID: string;
	proxy: string;
}

const langConfig =  NoticeMConfig( window.localStorage.getItem('language') || 'en')

const DEFAULT_SETTINGS: PluginSettings = {
	notionAPI: "",
	databaseID: "",
	bannerUrl: "",
	notionID: "",
	proxy: "",
};

export default class ObsidianSyncNotionPlugin extends Plugin {
	settings: PluginSettings;
	async onload() {
		await this.loadSettings();
		addIcons();	
		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon(
			"notion-logo",
			"Share to notion",
			async (evt: MouseEvent) => {
				// Called when the user clicks the icon.
				this.upload();
			}
		);

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		// statusBarItemEl.setText("share to notion");

		this.addCommand({
			id: "share-to-notion",
			name: "share to notion",
			editorCallback: async (editor: Editor, view: MarkdownView) => {
				this.upload()
			},
		});


		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));

	}

	onunload() {}

	async upload(){
		const { notionAPI, databaseID } = this.settings;
				if (notionAPI === "" || databaseID === "") {
					new Notice(
						"Please set up the notion API and database ID in the settings tab."
					);
					return;
				}
				const { markDownData, nowFile } =
					await this.getNowFileMarkdownContent(this.app);

				
				if (markDownData) {
					const { basename } = nowFile;
					const upload = new Upload2Notion(this);
					const res = await upload.syncMarkdownToNotion(basename, markDownData,nowFile, this.app, this.settings)
					if(res.status === 200){
						new Notice(`${langConfig["sync-success"]}${basename}`)
					}else {
						new Notice(`${langConfig["sync-fail"]}${basename}`, 3000)
					}
				}
	}

	async getNowFileMarkdownContent(app: App) {
		const nowFile = app.workspace.getActiveFile();
		if (nowFile) {
			const markDownData = await nowFile.vault.read(nowFile);
			return {
				markDownData,
				nowFile,
			};
		} else {
			new Notice(langConfig["open-file"]);
			return;
		}
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: ObsidianSyncNotionPlugin;

	constructor(app: App, plugin: ObsidianSyncNotionPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		containerEl.createEl("h2", {
			text: "Settings for obsidian to notion plugin.",
		});

		const notionApiKye = new Setting(containerEl)
			.setName("Notion API Token")
			.setDesc("It's a secret")
			.addText((text) =>{
				let t = text
				.setPlaceholder("Enter your Notion API Token")
				.setValue(this.plugin.settings.notionAPI)
				.onChange(async (value) => {
					this.plugin.settings.notionAPI = value;
					await this.plugin.saveSettings();
				})
				t.inputEl.type = 'password'
				return t
			});
			

		const notionDatabaseID = new Setting(containerEl)
			.setName("Database ID")
			.setDesc("It's a secret")
			.addText((text) => {
				let t = text
				.setPlaceholder("Enter your Database ID")
				.setValue(this.plugin.settings.databaseID)
				.onChange(async (value) => {
					this.plugin.settings.databaseID = value;
					await this.plugin.saveSettings();
				})
				t.inputEl.type = 'password'
				return t
			}
				
			);

			notionDatabaseID.controlEl.querySelector('input').type='password'
			
			new Setting(containerEl)
			.setName("Banner url(optional)")
			.setDesc("page banner url(optional), default is empty, if you want to show a banner, please enter the url(like:https://raw.githubusercontent.com/EasyChris/obsidian-to-notion/ae7a9ac6cf427f3ca338a409ce6967ced9506f12/doc/2.png)")
			.addText((text) =>
				text
					.setPlaceholder("Enter banner pic url: ")
					.setValue(this.plugin.settings.bannerUrl)
					.onChange(async (value) => {
						this.plugin.settings.bannerUrl = value;
						await this.plugin.saveSettings();
					})
			);


			new Setting(containerEl)
			.setName("Notion ID(optional)")
			.setDesc("Your notion ID(optional),share link likes:https://username.notion.site/,your notion id is [username]")
			.addText((text) =>
				text
					.setPlaceholder("Enter notion ID(options) ")
					.setValue(this.plugin.settings.notionID)
					.onChange(async (value) => {
						this.plugin.settings.notionID = value;
						await this.plugin.saveSettings();
					})
			);

	}
}
