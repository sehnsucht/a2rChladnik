// Import the AudioStream class
import AudioStream from "https://cdnjs.cloudflare.com/ajax/libs/three.js/137/examples/js/loaders/AudioStream.js";

// Create an AudioStream object
const audioStream = new AudioStream();
audioStream.open(new URL("http://a2r.twenty4seven.cc:8000/puredata.ogg", document.baseURI));

// Set the parameters of the Chladni figure
const m = [0, 1, 2, 3, 4, 5, 6, 7];

// Create a scene and renderer
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a sphere geometry and material
const geometry = new THREE.SphereGeometry(100, 100, 100);
const material = new THREE.MeshBasicMaterial({ color: 0x000000 });

// Create a mesh and add it to the scene
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Update the Chladni figure at every new audio data rate
audioStream.ondataavailable = function() {
  // Calculate the radius of each point on the figure
  const r = f.map(f => Math.pow(Math.sin(m[0] * f), m[1]) + Math.pow(Math.cos(m[2] * f), m[3]) + Math.pow(Math.sin(m[4] * f), m[5]) + Math.pow(Math.cos(m[6] * f), m[7]));

  // Update the mesh's vertices
  mesh.geometry.vertices = r.map(r => new THREE.Vector3(r * Math.sin(f), r * Math.cos(f), 0));

  // Render the scene
  renderer.render(scene, camera);
};
