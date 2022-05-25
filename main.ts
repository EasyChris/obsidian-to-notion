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

interface MyPluginSettings {
	notionAPI: string;
	databaseID: string;
	bannerUrl: string;
	proxy: string;
	langConfig: any;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	notionAPI: "",
	databaseID: "",
	bannerUrl: "",
	proxy: "",
	langConfig: NoticeMConfig( window.localStorage.getItem('language') || 'en')
};

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;
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
		// Perform additional things with the ribbon
		ribbonIconEl.addClass("my-plugin-ribbon-class");

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
				const { nowFile, fileData,fullPath } =
					await this.getNowFileMarkdwonContent(this.app);
				const { basename } = nowFile;
				if (fileData) {
					const upload = new Upload2Notion(this);
					const res = await upload.syncMarkdownToNotion(basename,fileData, fullPath)
					console.log(res)
					if(res.status === 200){
						new Notice(`${this.settings.langConfig["sync-success"]}${basename}`)
					}else {
						new Notice(`${this.settings.langConfig["sync-fail"]}${basename}`)
					}
				}
	}

	async getNowFileMarkdwonContent(app: App) {
		const nowFile = app.workspace.getActiveFile();
		if (nowFile) {
			const filePath: string = nowFile.path;
			// @ts-ignore
			const basePath: string = nowFile.vault.adapter.basePath;
			const fullPath = normalizePath(join(basePath, filePath));
			console.log("fullpath", fullPath);
			const fileData = fs.readFileSync(fullPath, "utf8");
			return {
				fileData,
				nowFile,
				fullPath,
			};
		} else {
			new Notice(this.settings.langConfig["open-file"]);
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

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.setText("Woah!");
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		containerEl.createEl("h2", {
			text: "Settings for obsidian to notion plugin.",
		});

		new Setting(containerEl)
			.setName("Notion API Token")
			.setDesc("It's a secret")
			.addText((text) =>
				text
					.setPlaceholder("Enter your Notion API Token")
					.setValue(this.plugin.settings.notionAPI)
					.onChange(async (value) => {
						console.log("Secret: " + value);
						this.plugin.settings.notionAPI = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Database ID")
			.setDesc("It's a secret")
			.addText((text) =>
				text
					.setPlaceholder("Enter your Database ID")
					.setValue(this.plugin.settings.databaseID)
					.onChange(async (value) => {
						console.log("Secret: " + value);
						this.plugin.settings.databaseID = value;
						await this.plugin.saveSettings();
					})
			);
			
			new Setting(containerEl)
			.setName("Banner Url")
			.setDesc("page banner url")
			.addText((text) =>
				text
					.setPlaceholder("Enter banner pic url: ")
					.setValue(this.plugin.settings.bannerUrl)
					.onChange(async (value) => {
						console.log("Secret: " + value);
						this.plugin.settings.bannerUrl = value;
						await this.plugin.saveSettings();
					})
			);

	}
}
