import { timingSafeEqual } from "crypto";
import {
	App,
	EditableFileView,
	requestUrl,
	Editor,
	MarkdownView,
	Modal,
	Notice,
	Plugin,
	PluginSettingTab,
	Setting,
} from "obsidian";
import { join } from "path";
import * as fs from "fs";
import { Upload2Notion } from "Upload2Notion";
// import {Upload2Notion} from "./Upload2Notion";

// Remember to rename these classes and interfaces!

interface MyPluginSettings {
	notionAPI: string;
	databaseID: string;
	proxy: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	notionAPI: "",
	databaseID: "",
	proxy: "",
};

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon(
			"dice",
			"share to notion",
			async (evt: MouseEvent) => {
				// Called when the user clicks the icon.
				const { notionAPI, databaseID } = this.settings;
				if (notionAPI === "" || databaseID === "") {
					new Notice(
						"Please set up the notion API and database ID in the settings tab."
					);
					return;
				}
				const { nowFile, fileData } =
					await this.getNowFileMarkdwonContent(this.app);
				const { basename } = nowFile;
				console.log(nowFile, "nowfile");
				if (fileData) {
					const upload = new Upload2Notion(this);
					await upload.syncMarkdownToNotion(basename,fileData);
				}
			}
		);
		// Perform additional things with the ribbon
		ribbonIconEl.addClass("my-plugin-ribbon-class");

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText("This is made for love");

		this.addCommand({
			id: "share-to-notion",
			name: "share to notion",
			editorCallback: async (editor: Editor, view: MarkdownView) => {
				console.log(view.data);
			},
		});

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: "open-sample-modal-simple",
			name: "Open sample modal (simple)",
			callback: () => {
				new SampleModal(this.app).open();
			},
		});
		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: "sample-editor-command",
			name: "Sample editor command",
			editorCallback: (editor: Editor, view: MarkdownView) => {
				console.log(editor.getSelection());
				editor.replaceSelection("Sample Editor Command");
			},
		});
		// This adds a complex command that can check whether the current state of the app allows execution of the command
		this.addCommand({
			id: "open-sample-modal-complex",
			name: "Open sample modal (complex)",
			checkCallback: (checking: boolean) => {
				// Conditions to check
				const markdownView =
					this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					// If checking is true, we're simply "checking" if the command can be run.
					// If checking is false, then we want to actually perform the operation.
					if (!checking) {
						new SampleModal(this.app).open();
					}

					// This command will only show up in Command Palette when the check function returns true
					return true;
				}
			},
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, "click", (evt: MouseEvent) => {
			// console.log("click", evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(
			window.setInterval(() => console.log("setInterval"), 5 * 60 * 1000)
		);
	}

	onunload() {}

	async getNowFileMarkdwonContent(app: App) {
		const nowFile = app.workspace.getActiveFile();
		if (nowFile) {
			const filePath: string = nowFile.path;
			const basePath: string = nowFile.vault.adapter.basePath;
			const fullPath = join(basePath, filePath);
			console.log("fullpath", fullPath);
			const fileData = fs.readFileSync(fullPath, "utf8");
			return {
				fileData,
				nowFile,
			};
		} else {
			new Notice("请打开需要同步的文件");
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
			.setName("Proxy")
			.setDesc("like `http:127.0.0.1:8888`")
			.addText((text) =>
				text
					.setPlaceholder("Enter proxy config defalut is null")
					.setValue(this.plugin.settings.proxy)
					.onChange(async (value) => {
						console.log("Secret: " + value);
						this.plugin.settings.proxy = value;
						await this.plugin.saveSettings();
					})
			);
	}
}
