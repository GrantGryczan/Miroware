"use strict";
const magical = document.body.querySelector("#magical");
let loops = 0;
setInterval(() => {
	loops++;
	let hex = Math.floor(Math.random() * 0x1000000).toString(16);
	while(hex.length < 6) {
		hex = `0${hex}`;
	}
	magical.style.color = `#${hex}`;
	magical.style.fontSize = (Math.sin(loops / 2) * 10 + 20) + "px";
	magical.style.transform = `rotate(${(loops * 8) % 360}deg)`;
}, 50);
