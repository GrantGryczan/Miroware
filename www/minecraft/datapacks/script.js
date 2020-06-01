const versionSelect = document.body.querySelector("#versionSelect");
const dataPacks = document.body.querySelectorAll(".dataPack");
versionSelect.addEventListener("change", () => {
	for (const dataPack of dataPacks) {
		dataPack.classList[dataPack.classList.contains(versionSelect.value) ? "remove" : "add"]("hidden");
	}
});
