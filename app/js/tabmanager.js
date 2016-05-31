const crypto = require("crypto");

class Tab {
	constructor (title) {
		this.title = title || "Untitled";
		this.id = crypto.randomBytes(16).toString("hex");
	}
	setActive () {
		var children = document.querySelectorAll("section.content > *");
		for (let child of children) {
			child.classList.add("hide");
		}
		document.getElementById(this.id).classList.remove("hide");
	}
}

class TabManager {
	constructor () {
		this.tabs = [];
	}
	addTab (tab, active = true) {
		this.tabs.push(tab);
		
		var tabHeader = document.createElement("span");
		tabHeader.textContent = tab.title;
		tabHeader.classList.add("tab");
		if (active) {
			this.clearActive();
			tabHeader.classList.add("active");
		}
		tabHeader.dataset.for = tab.id;
		tabHeader.addEventListener("click", this.onTabClicked.bind(this), false);
		document.querySelector("section.tabs").appendChild(tabHeader);
	}
	clearActive () {
		var activeTabs = document.querySelectorAll(".tab.active");
		for (let activeTab of activeTabs) {
			activeTab.classList.remove("active");
		}
	}
	onTabClicked (event) {
		var clickedTab = this.tabs.find(function (tab) {
			if (tab.id === event.target.dataset.for) {
				return tab;
			}
		});
		this.clearActive();
		event.target.classList.add("active");
		clickedTab.setActive();
	}
}

module.exports.Tab = Tab;
module.exports.TabManager = TabManager;