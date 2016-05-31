const crypto = require("crypto");

class Tab {
	constructor (title) {
		this.title = title || "Untitled";
		this.id = crypto.randomBytes(16).toString("hex");
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
		tabHeader.dataset.for = tab.id;
		tabHeader.addEventListener("click", this.onTabClicked.bind(this), false);
		document.querySelector("section.tabs").appendChild(tabHeader);
		if (active) {
			this.selectTab(tab.id);
		}
	}
	clearActive () {
		var activeTabs = document.querySelectorAll(".tab.active");
		for (let activeTab of activeTabs) {
			activeTab.classList.remove("active");
		}
	}
	selectTab (id) {
		var selectedTab = this.tabs.find(function (tab) {
			if (tab.id === id) return tab;
		});
		this.clearActive();
		Array.from(document.querySelectorAll("span.tab")).find(tabSpan => {
			if (tabSpan.dataset.for === id) return tabSpan;
		}).classList.add("active");
		
		var children = document.querySelectorAll("section.content > *");
		for (let child of children) {
			child.classList.add("hide");
		}
		document.getElementById(id).classList.remove("hide");
	}
	onTabClicked (event) {
		this.selectTab(event.target.dataset.for);
	}
}

module.exports.Tab = Tab;
module.exports.TabManager = TabManager;