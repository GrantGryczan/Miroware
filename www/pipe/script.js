"use strict";
document.querySelector("#go").addEventListener("click", () => {
	if(Miro.in) {
		location.href = "@me/";
	} else {
		new Miro.Dialog("Error", "You must be logged in to use Pipe.", ["Log in", "Cancel"]).then(value => {
			if(value === 0) {
				Miro.logIn("/pipe/@me/");
			}
		});
	}
});
