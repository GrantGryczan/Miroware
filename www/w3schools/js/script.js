"use strict";
const iframe = document.body.querySelector("iframe");
let moving = false;
document.addEventListener("mousemove", () => {
	moving = true;
});
setInterval(() => {
	if(moving) {
		iframe.classList.remove("hidden");
		moving = false;
	} else {
		iframe.classList.add("hidden");
	}
}, 200);
