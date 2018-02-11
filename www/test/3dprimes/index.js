const renderer = new THREE.WebGLRenderer({
	antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.domElement.id = "canvas";
document.querySelector("#container").appendChild(renderer.domElement);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.001, 1000);
window.addEventListener("resize", function() {
	renderer.setSize(window.innerWidth, window.innerHeight);
	camera.aspect = window.innerWidth/window.innerHeight;
	camera.updateProjectionMatrix();
});
camera.position.set(80, 80, 80);
const controls = new THREE.OrbitControls(camera, renderer.domElement);
const hemiLight = new THREE.HemisphereLight(0x999999, 0xbfbfbf, 0.6);
scene.add(hemiLight);
const dirLight = new THREE.DirectionalLight(0xf2f2f2);
dirLight.position.set(-1, 1.75, 1);
scene.add(dirLight);
const axesHelper = new THREE.AxesHelper(10);
scene.add(axesHelper);
let num = 1;
let length = 1;
let offset = 0;
let dir = 0;
const geometry = new THREE.BoxGeometry(1, 1, 1);
const indicator = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({
	color: 0xffffff
}));
indicator.position.x = 2;
scene.add(indicator);
const cubes = [];
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const clock = new THREE.Clock();
const animate = () => {
	requestAnimationFrame(animate);
	let prime = num !== 1 && num > 0;
	for(let i = 2; i < Math.sqrt(num); i++) {
		if(num%i === 0) {
			prime = false;
			break;
		}
	}
	if(prime) {
		const cube = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({
			color: Math.random()*0xffffff
		}));
		cube.position.copy(indicator.position);
		scene.add(cube);
		cubes.push(cube);
	}
	if((offset = (offset+1)%length) === 0 && (dir = (dir+1)%4)%2 === 0) {
		length++;
	}
	switch(dir) {
		case 0:
			indicator.position.x += 2;
			break;
		case 1:
			indicator.position.y += 2;
			break;
		case 2:
			indicator.position.x -= 2;
			break;
		case 3:
			indicator.position.y -= 2;
	}
	num++;
	raycaster.setFromCamera(mouse, camera);
	const intersect = raycaster.intersectObjects(cubes)[0];
	if(intersect) {
		console.log(intersect.object);
	}
	controls.update(clock.getDelta());
	renderer.render(scene, camera);
}
requestAnimationFrame(animate);
window.addEventListener("mousemove", event => {
	mouse.x = 2*event.clientX/window.innerWidth-1;
	mouse.y = -2*event.clientY/window.innerHeight+1;
});
