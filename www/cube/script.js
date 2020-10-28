"use strict";
window.scene = new THREE.Scene();
window.renderer = new THREE.WebGLRenderer({
	alpha: true,
	preserveDrawingBuffer: true
});
renderer.setSize(512, 512);
window.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1024);
camera.position.set(20, 0, 0);
camera.lookAt(scene.position);
window.light = new THREE.HemisphereLight(0xffffff, 0x000000, 1);
scene.add(light);
window.all = new THREE.Group();
all.rotation.set(0.88888888, 0.88888888, 0.88888888);
window.group = new THREE.Group();
window.geometry = new THREE.BoxGeometry(8, 8, 8);
window.material = new THREE.MeshLambertMaterial({
	color: 0xff0000
});
window.cube = new THREE.Mesh(geometry, material);
group.add(cube);
all.add(group);
scene.add(all);
window.frame = 0;
window.frames = 64;
window.render = index => {
	group.rotation.x = 2 * Math.PI * index / 256;
	renderer.render(scene, camera);
};
window.animate = () => {
	render(frame = (frame + 1) % frames);
	setTimeout(animate, 40);
};
window.download = async max => {
	max = typeof max === "number" ? max : frames;
	const link = document.createElement("a");
	for (let i = 0; i < max; i++) {
		render(i);
		link.href = renderer.domElement.toDataURL();
		link.download = `cube${i}`;
		link.click();
		await Miro.wait(200);
	}
};
document.body.querySelector("#wrapper").appendChild(renderer.domElement);
animate();
window.addBackground = () => {
	scene.background = new THREE.Color(0x202020);
};
window.addRibbons = () => {
	window.ribbon = new THREE.MeshLambertMaterial({
		color: 0x00ff00
	});
	window.ribbon1 = new THREE.Mesh(new THREE.BoxGeometry(8.25, 8.25, 2), ribbon);
	window.ribbon2 = new THREE.Mesh(new THREE.BoxGeometry(8.25, 2, 8.25), ribbon);
	cube.add(ribbon1);
	cube.add(ribbon2);
};
window.setDistinctSides = () => {
	frames = 256;
	cube.material = [
		new THREE.MeshLambertMaterial({
			color: 0xff0000
		}),
		new THREE.MeshLambertMaterial({
			color: 0xffff00
		}),
		new THREE.MeshLambertMaterial({
			color: 0x00ff00
		}),
		new THREE.MeshLambertMaterial({
			color: 0x00ffff
		}),
		new THREE.MeshLambertMaterial({
			color: 0x0000ff
		}),
		new THREE.MeshLambertMaterial({
			color: 0xff00ff
		})
	];
};
window.getMaterialFromURL = textureURL => new THREE.MeshLambertMaterial({
	map: new THREE.TextureLoader().load(textureURL)
});
window.addTexture = textureURLOrURLs => {
	frames = 256;
	cube.material = textureURLOrURLs instanceof Array
		? textureURLOrURLs.map(getMaterialFromURL)
		: getMaterialFromURL(textureURLOrURLs);
};
