// Smoky background interactive effect using Three.js

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const smokyBackground = document.getElementById('smoky-background');
const modelContainer = document.getElementById('model-container');
console.log('modelContainer:', modelContainer);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 600 / 500, 0.1, 1000);
camera.position.z = 3; // Moved camera closer

// Add lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(600, 500);
console.log('Appending renderer.domElement to modelContainer');
modelContainer.appendChild(renderer.domElement);

const smokeTextureLoader = new THREE.TextureLoader();
const smokeTexture = smokeTextureLoader.load('smoke.png'); // You need to have a smoke.png texture in your project

const smokeMaterial = new THREE.SpriteMaterial({ map: smokeTexture, transparent: true, opacity: 0.5 });
const smokeParticles = [];

for (let i = 0; i < 50; i++) {
  const particle = new THREE.Sprite(smokeMaterial);
  particle.position.set(
    (Math.random() - 0.5) * 10,
    (Math.random() - 0.5) * 10,
    (Math.random() - 0.5) * 10
  );
  particle.scale.set(2, 2, 2);
  scene.add(particle);
  smokeParticles.push(particle);
}

// Load 3D model
const loader = new GLTFLoader();
let tshirtModel;

loader.load(
  'Tshirt.glb',
  function (gltf) {
    console.log('3D model loaded:', gltf);
    tshirtModel = gltf.scene;
    tshirtModel.scale.set(2, 2, 2);
    tshirtModel.position.set(0, -0.5, 0);
    scene.add(tshirtModel);
  },
  undefined,
  function (error) {
    console.error('An error happened loading the 3D model:', error);
  }
);

function animate() {
  requestAnimationFrame(animate);

  smokeParticles.forEach(particle => {
    particle.rotation.z += 0.01;
  });

  if (tshirtModel) {
    tshirtModel.rotation.y += 0.01; // Revolve the model
  }

  renderer.render(scene, camera);
}

// Add a simple cube to verify rendering
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
cube.position.set(0, 0, 0);
scene.add(cube);

animate();

animate();

window.addEventListener('resize', () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});
