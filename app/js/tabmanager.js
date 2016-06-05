const crypto = require("crypto");

class Tab {
	constructor (title) {
		this.title = title || "Untitled";
		this.id = crypto.randomBytes(16).toString("hex");
	}
	close () {
		// Implemented by subclasses
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
		
		// For Font Awesome close icon
		var closeIcon = document.createElement("i");
		closeIcon.classList.add("fa");
		closeIcon.classList.add("fa-times");
		tabHeader.appendChild(closeIcon);
		
		tabHeader.dataset.for = tab.id;
		tabHeader.addEventListener("click", this.onTabClicked.bind(this), false);
		document.querySelector("section.tabs").appendChild(tabHeader);
		if (active) {
			this.selectTab(tab.id);
		}
	}
	selectTab (id) {
		var selectedTab = this.tabs.find(function (tab) {
			return tab.id === id;
		});
		this.clearActive();
		Array.from(document.querySelectorAll("span.tab")).find(tabSpan => {
			return tabSpan.dataset.for === id;
		}).classList.add("active");
		
		var children = document.querySelectorAll("section.content > *");
		for (let child of children) {
			child.classList.add("hide");
		}
		document.getElementById(id).classList.remove("hide");
	}
	closeTab (id) {
		var selectedTabIndex = this.tabs.findIndex(function (tab) {
			return tab.id === id;
		});
		
		if (this.tabs.length === 1) {
			window.close();
		}
		// Select a different tab
		if (selectedTabIndex === this.tabs.length - 1) {
			// Last tab
			this.selectTab(this.tabs[this.tabs.length - 2].id);
		}
		else {
			this.selectTab(this.tabs[selectedTabIndex + 1].id);
		}
		
		// Remove tab header and content
		var tabHeader = Array.from(document.querySelectorAll("span.tab")).find(tabSpan => {
			return tabSpan.dataset.for === id;
		});
		var tabContent = document.getElementById(id);
		tabHeader.parentElement.removeChild(tabHeader);
		tabContent.parentElement.removeChild(tabContent);
		
		this.tabs[selectedTabIndex].close();
		this.tabs.splice(selectedTabIndex, 1);
	}
	clearActive () {
		var activeTabs = document.querySelectorAll(".tab.active");
		for (let activeTab of activeTabs) {
			activeTab.classList.remove("active");
		}
	}
	onTabClicked (event) {
		var tabID = event.target.dataset.for;
		if (event.which === 1) {
			if (tabID) {
				// Left click selects the tab
				this.selectTab(tabID);
			}
			else if (event.target.classList.contains("fa-times")) {
				tabID = event.target.parentElement.dataset.for;
				this.closeTab(tabID);
			}
		}
		else if (event.which === 2) {
			// Middle click closes the tab
			this.closeTab(tabID);
		}
	}
}

module.exports.Tab = Tab;
module.exports.TabManager = TabManager;