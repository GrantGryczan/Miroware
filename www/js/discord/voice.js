(() => {
	console.log("Discord voice notification extension by Grant Gryczan\nhttps://miroware.io/");
	if(global.notifExtActive) {
		new Notification("Error: Voice notifications already active");
		return;
	} else {
		global.notifExtActive = true;
	}
	const byContent = elem => elem.textContent;
	const byIcon = elem => elem.firstChild.style.backgroundImage.split('"')[1];
	const stored = {};
	let parentFound = false;
	const options = {
		silent: true
	};
	setInterval(() => {
		const parent = document.querySelector("[class^='wrapperConnectedVoice'] + div");
		if(parent) {
			if(!parentFound) {
				parentFound = true;
				new Notification("Voice notifications connected", options);
			}
			const names = Array.prototype.map.call(parent.querySelectorAll("[class^='name']"), byContent);
			const icons = Array.prototype.map.call(parent.querySelectorAll("[class^='avatarContainer']"), byIcon);
			for(const name of Object.keys(stored)) {
				const nameIndex = names.indexOf(name);
				if(nameIndex === -1) {
					new Notification(`- ${name}`, {
						silent: true,
						icon: stored[name]
					});
					delete stored[name];
				} else {
					names.splice(nameIndex, 1);
					icons.splice(nameIndex, 1);
				}
			}
			for(let i = 0; i < names.length; i++) {
				stored[names[i]] = icons[i];
				new Notification(`+ ${names[i]}`, {
					silent: true,
					icon: stored[names[i]]
				});
			}
		} else if(parentFound) {
			parentFound = false;
			new Notification("Voice notifications disconnected", options);
		}
	}, 1000);
})();
