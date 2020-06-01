const versionSelect = document.body.querySelector("#versions");
const dataPacks = document.body.querySelectorAll(".dataPack");
const setVersion = () => {
	for (const dataPack of dataPacks) {
		dataPack.classList[dataPack.classList.contains(versions.value) ? "remove" : "add"]("hidden");
	}
};
setVersion();
versionSelect.addEventListener("change", setVersion);
