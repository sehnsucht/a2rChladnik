import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/137/three.min.js";

const audioStream = new THREE.AudioStream();
audioStream.open(new URL("http://a2r.twenty4seven.cc:8000/puredata.ogg", document.baseURI));

const m = [0, 1, 2, 3, 4, 5, 6, 7];

const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const geometry = new THREE.SphereGeometry(100, 100, 100);
const material = new THREE.MeshBasicMaterial({ color: 0x000000 });

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

audioStream.ondataavailable = () => {
  const f = audioStream.getBands(8);

  mesh.geometry.vertices = f.map(f => new THREE.Vector3(f * Math.sin(f), f * Math.cos(f), 0));

  renderer.render(scene, camera);
};

// Add CORS headers
header('Access-Control-Allow-Origin', '*');
