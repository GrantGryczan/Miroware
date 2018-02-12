this.title = "3D Primes";
this.description = "This test graphs prime numbers on a 3D scale.";
this.tags = ["3D", "3-D", "three", "dimension", "dimensional", "math", "prime", "primes", "number", "numbers", "graph", "chart"];
this.value = (await load("/load/head", this)).value;
this.value += html`
		<link rel="stylesheet" href="/css/three.css">`;
this.value += (await load("/load/body", this)).value;
this.value += html`
			<div id="snackbar" class="mdc-snackbar">
				<div class="mdc-snackbar__text"></div>
				<div class="mdc-snackbar__action-wrapper">
					<button type="button" class="mdc-snackbar__action-button"></button>
				</div>
			</div>`;
this.value += (await load("/load/belt", this)).value;
this.value += html`
		<script src="/load/deliver?https:%2F%2Fraw.githubusercontent.com/mrdoob/three.js/master/build/three.min.js"></script>
		<script src="/load/deliver?https:%2F%2Fraw.githubusercontent.com/mrdoob/three.js/master/examples/js/controls/OrbitControls.js"></script>
		<script src="index.js"></script>`;
this.value += (await load("/load/foot", this)).value;
this.exit();
