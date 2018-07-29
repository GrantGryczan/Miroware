const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({
	alpha: true,
	preserveDrawingBuffer: true
});
renderer.setSize(512, 512);
const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1024);
//scene.background = new THREE.Color(0x202020);
camera.position.set(20, 0, 0);
camera.lookAt(scene.position);
const light = new THREE.HemisphereLight(0xffffff, 0x000000, 1);
scene.add(light);
const all = new THREE.Group();
all.rotation.set(0.88888888, 0.88888888, 0.88888888);
const group = new THREE.Group();
const geometry = new THREE.BoxGeometry(8, 8, 8);
const material = new THREE.MeshLambertMaterial({
	color: 0xff0000
});
const cube = new THREE.Mesh(geometry, material);
group.add(cube);
all.add(group);
scene.add(all);
/*
const ribbon = new THREE.MeshLambertMaterial({
	color: 0x00ff00
});
const ribbon1 = new THREE.Mesh(new THREE.BoxGeometry(8.25, 8.25, 2), ribbon);
const ribbon2 = new THREE.Mesh(new THREE.BoxGeometry(8.25, 2, 8.25), ribbon);
cube.add(ribbon1);
cube.add(ribbon2);
*/
let frame = 0;
const render = index => {
	group.rotation.x = 2 * Math.PI * index / 256;
	renderer.render(scene, camera);
};
const animate = () => {
	render(frame = (frame + 1) % 64);
	setTimeout(animate, 40);
};
const download = max => {
	max = typeof max === "number" ? max : 64;
	const link = document.createElement("a");
	for(let i = 0; i < max; i++) {
		render(i);
		link.href = renderer.domElement.toDataURL();
		link.download = `cube${i}`;
		link.click();
	}
}
document.querySelector("#wrapper").appendChild(renderer.domElement);
animate();
