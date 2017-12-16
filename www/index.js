(function() {
	window.addEventListener("load", function() {
		var cards = document.querySelectorAll(".mdc-card");
		var mouseOverCard = function() {
			this.classList.add("mdc-elevation--z8");
		};
		var mouseOutCard = function() {
			this.classList.remove("mdc-elevation--z8");
		};
		var closeCard = function(card) {
			setTimeout(function() {
				if(!card.classList.contains("open")) {
					card.classList.remove("closing");
				}
			}, 280);
			card.classList.remove("mdc-elevation--z16");
		};
		var toggleCard = function(card) {
			for(var i = 0; i < cards.length; i++) {
				if(cards[i] != card && cards[i].classList.contains("open")) {
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
		var clickCard = function(evt) {
			if(evt.target.tagName != "A") {
				toggleCard(this);
			}
		};
		var focusButton = function() {
			this.parentNode.parentNode.scrollTop = 0;
			if(!this.parentNode.parentNode.classList.contains("open")) {
				toggleCard(this.parentNode.parentNode);
			}
		};
		var doubleClickCard = function() {
			toggleCard(this);
			location.href = this._link.href;
		};
		for(var i = 0; i < cards.length; i++) {
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
					for(var j = 0; j < cards[i].children.length; j++) {
						cards[i].children[j].classList.add("smooth");
					}
					cards[i].classList.remove("invisible");
				}, 50*(i+1));
			})(i);
		}
	});
})();
