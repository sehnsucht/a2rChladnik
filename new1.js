import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/137/three.min.js";

const THREE = THREE;
const fs = require('fs');
const wav = require('wav');

// Load the audio file
const audioData = fs.readFileSync('http://a2r.twenty4seven.cc:8000/puredata.ogg');
const wavBuffer = new wav.Buffer(audioData);
const frequencies = wavBuffer.getFrequencyData();
const amplitudes = wavBuffer.getAmplitudeData();
const sortedIndices = amplitudes.slice().sort((a, b) => b - a);
const overtones = frequencies.slice(0, sortedIndices.length);

// Define the Chladni figure formula
function chladniFigure(theta, phi, m) {
  let r = 0;

  r += Math.pow(Math.sin(m[0] * phi), m[1]);
  r += Math.pow(Math.cos(m[2] * phi), m[3]);
  r += Math.pow(Math.sin(m[4] * theta), m[5]);
  r += Math.pow(Math.cos(m[6] * theta), m[7]);

  return r;
}

// Generate the Chladni figure
const theta = new Float32Array(100);
const phi = new Float32Array(50);
for (let i = 0; i < 100; i++) {
  theta[i] = i / 100 * Math.PI * 2;
}
for (let i = 0; i < 50; i++) {
  phi[i] = i / 50 * Math.PI;
}
const x = new Float32Array(100 * 50);
const y = new Float32Array(100 * 50);
const z = new Float32Array(100 * 50);
for (let i = 0; i < 100; i++) {
  for (let j = 0; j < 50; j++) {
    const point = chladniFigure(theta[i], phi[j], overtones);
    x[i * 50 + j] = point * Math.sin(phi[j]) * Math.cos(theta[i]);
    y[i * 50 + j] = point * Math.cos(phi[j]);
    z[i * 50 + j] = point * Math.sin(phi[j]) * Math.sin(theta[i]);
  }
}

// Create the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create the spheres
const spheres = [];
for (let i = 0; i < x.length; i++) {
  const geometry = new THREE.SphereGeometry(0.1);
  const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const sphere = new THREE.Mesh(geometry, material);
  sphere.position.set(x[i], y[i], z[i]);
  spheres.push(sphere);
  scene.add(sphere);
}

// Render the scene
renderer.render(scene, camera);

// Update the scene
requestAnimationFrame(() => {
  renderer.render(scene, camera);
});

