const versionSelect = document.body.querySelector("#versions");
const dataPacks = document.body.querySelectorAll(".dataPack");
const setVersion = () => {
	for (const dataPack of dataPacks) {
		dataPack.classList[dataPack.classList.contains(versions.value) ? "remove" : "add"]("hidden");
	}
};
setVersion();
versionSelect.addEventListener("change", setVersion);
const clickShowMore = function() {
	more.parentNode.replaceChild(this, this._more);
};
for (const more of document.body.querySelectorAll(".more")) {
	const showMore = html`
		<a href="javascript:;">Show More</a>
	`;
	showMore.addEventListener("click", clickShowMore);
	more.parentNode.replaceChild(showMore._more = more, showMore);
}
