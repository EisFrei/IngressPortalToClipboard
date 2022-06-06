// ==UserScript==
// @name IITC Plugin: Portal to clipboard
// @id liveInventory
// @category Info
// @version 0.0.1
// @namespace	https://github.com/EisFrei/IngressPortalToClipboard
// @downloadURL	https://github.com/EisFrei/IngressPortalToClipboard/raw/main/portalToClipboard.user.js
// @homepageURL	https://github.com/EisFrei/IngressPortalToClipboard
// @description Copy name and link of the currently selected portal to the clipboard
// @author EisFrei
// @include		https://intel.ingress.com/*
// @match		https://intel.ingress.com/*
// @grant			none
// ==/UserScript==

function wrapper(plugin_info) {
    function copyPortalInformation() {
    }

	function setup() {
		if (window.useAndroidPanes()) {
			android.addPane("plugin-portaltoclipbopard", "Portal➜Clipboard", "ic_action_paste");
			addHook("paneChanged", thisPlugin.onPaneChanged);
		} else {
			$('<a href="#">')
				.text('Portal➜Clipboard')
        .click(() => {
            if (window.selectedPortal === null) {
                return;
            }
            var portal = window.portals[window.selectedPortal];

            navigator.clipboard.writeText(`${portal.options.data.title}\nhttps://intel.ingress.com/?pll=${portal.options.data.latE6/1000000},${portal.options.data.lngE6/1000000}`);
        })
        .appendTo($('#toolbox'));
      }
	}

    function delaySetup() {
		setTimeout(setup, 1000); // delay setup and thus requesting data, or we might encounter a server error
	}
	delaySetup.info = plugin_info; //add the script info data to the function as a property

	if (window.iitcLoaded) {
		delaySetup();
	} else {
		if (!window.bootPlugins) {
			window.bootPlugins = [];
		}
		window.bootPlugins.push(delaySetup);
	}
}


(function () {
	const plugin_info = {};
	if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) {
		plugin_info.script = {
			version: GM_info.script.version,
			name: GM_info.script.name,
			description: GM_info.script.description
		};
	}
	// Greasemonkey. It will be quite hard to debug
	if (typeof unsafeWindow != 'undefined' || typeof GM_info == 'undefined' || GM_info.scriptHandler != 'Tampermonkey') {
		// inject code into site context
		const script = document.createElement('script');
		script.appendChild(document.createTextNode('(' + wrapper + ')(' + JSON.stringify(plugin_info) + ');'));
		(document.body || document.head || document.documentElement).appendChild(script);
	} else {
		// Tampermonkey, run code directly
		wrapper(plugin_info);
	}
})();
