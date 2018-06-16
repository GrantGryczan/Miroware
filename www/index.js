(function() {
	window.addEventListener("load", function() {
		let cards = document.querySelectorAll(".mdc-card");
		let mouseOverCard = function() {
			this.classList.add("mdc-elevation--z8");
		};
		let mouseOutCard = function() {
			this.classList.remove("mdc-elevation--z8");
		};
		let closeCard = function(card) {
			setTimeout(function() {
				if(!card.classList.contains("open")) {
					card.classList.remove("closing");
				}
			}, 280);
			card.classList.remove("mdc-elevation--z16");
		};
		let toggleCard = function(card) {
			for(let i = 0; i < cards.length; i++) {
				if(cards[i] !== card && cards[i].classList.contains("open")) {
					cards[i].classList.remove("open");
					closeCard(cards[i]);
				}
			}
			if(card.classList.toggle("open")) {
				card.classList.add("closing");
				card.classList.add("mdc-elevation--z16");
			} else {
				closeCard(card);
			}
		};
		let clickCard = function(evt) {
			if(evt.target.tagName !== "A") {
				toggleCard(this);
			}
		};
		let focusButton = function() {
			this.parentNode.parentNode.scrollTop = 0;
			if(!this.parentNode.parentNode.classList.contains("open")) {
				toggleCard(this.parentNode.parentNode);
			}
		};
		let doubleClickCard = function() {
			toggleCard(this);
			location.href = this._link.href;
		};
		for(let i = 0; i < cards.length; i++) {
			cards[i]._link = cards[i].querySelector("a");
			cards[i].addEventListener("mouseover", mouseOverCard);
			cards[i].addEventListener("mouseout", mouseOutCard);
			cards[i].addEventListener("click", clickCard);
			cards[i].addEventListener("dblclick", doubleClickCard);
			cards[i]._link.addEventListener("focus", focusButton);
			(function(i) {
				cards[i].classList.remove("open");
				setTimeout(function() {
					cards[i].classList.add("smooth");
					for(let j = 0; j < cards[i].children.length; j++) {
						cards[i].children[j].classList.add("smooth");
					}
					cards[i].classList.remove("invisible");
				}, 50 * (i + 1));
			})(i);
		}
	});
})();
