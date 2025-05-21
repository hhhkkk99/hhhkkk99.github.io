// hw09.js

import * as THREE from 'three';  
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { initStats, initRenderer, initCamera, initOrbitControls, addDefaultCubeAndSphere, addGroundPlane } from './util.js';

const scene = new THREE.Scene();
const renderer = initRenderer();
const stats = initStats();

let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.x = 120;
camera.position.y = 60;
camera.position.z = 180;
camera.lookAt(scene.position);
scene.add(camera);

let orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true;


const sunGeometry = new THREE.SphereGeometry(10);
const sunMaterial = new THREE.MeshLambertMaterial({
  color: 0xffff00,
  emissive: 0xffff00,
  emissiveIntensity: 5
});
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
sun.position.x = 0;
sun.position.y = 0;
sun.position.z = 0;
scene.add(sun);

const textureLoader = new THREE.TextureLoader();

let mercuryGeometry = new THREE.SphereGeometry(1.5);
const mercuryTexture = textureLoader.load('Mercury.jpg');
const mercuryMaterial = new THREE.MeshStandardMaterial({
  map: mercuryTexture,
  roughness: 0.8,
  metalness: 0.2
});
const mercury = new THREE.Mesh(mercuryGeometry, mercuryMaterial);
scene.add(mercury);
const mercuryOrbitRad = 20;
let mercuryAngle = 0;

let venusGeometry = new THREE.SphereGeometry(3);
const venusTexture = textureLoader.load('Venus.jpg');
const venusMaterial = new THREE.MeshStandardMaterial({
  map: venusTexture,
  roughness: 0.8,
  metalness: 0.2
});
const venus = new THREE.Mesh(venusGeometry, venusMaterial);
scene.add(venus);
const venusOrbitRad = 35;
let venusAngle = 0;

let earthGeometry = new THREE.SphereGeometry(3.5);
const earthTexture = textureLoader.load('Earth.jpg');
const earthMaterial = new THREE.MeshStandardMaterial({
  map: earthTexture,
  roughness: 0.8,
  metalness: 0.2
});
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earth);
const earthOrbitRad = 50;
let earthAngle = 0;

let marsGeometry = new THREE.SphereGeometry(2.5);
const marsTexture = textureLoader.load('Mars.jpg');
const marsMaterial = new THREE.MeshStandardMaterial({
  map: marsTexture,
  roughness: 0.8,
  metalness: 0.2
});
const mars = new THREE.Mesh(marsGeometry, marsMaterial);
scene.add(mars);
const marsOrbitRad = 65;
let marsAngle = 0;

const ambiColor = "#1c1c1c";
const ambientLight = new THREE.AmbientLight(ambiColor);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
dirLight.position.set(100, 200, 200);
scene.add(dirLight);

const gui = new GUI();
const folder1 = gui.addFolder('Camera');
const folder1Params = {
    perspective: "Perspective",
    switchCamera: function () {
        if (camera instanceof THREE.PerspectiveCamera) {
            scene.remove(camera);
            camera = null; 
            camera = new THREE.OrthographicCamera(window.innerWidth / -16, 
                window.innerWidth / 16, window.innerHeight / 16, window.innerHeight / -16, -200, 500);
            camera.position.x = 120;
            camera.position.y = 60;
            camera.position.z = 180;
            camera.lookAt(scene.position);
            orbitControls.dispose(); 
            orbitControls = null;
            orbitControls = new OrbitControls(camera, renderer.domElement);
            orbitControls.enableDamping = true;
            folder1Params.perspective = "Orthographic";
        } else {
            scene.remove(camera);
            camera = null; 
            camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.x = 120;
            camera.position.y = 60;
            camera.position.z = 180;
            camera.lookAt(scene.position);
            orbitControls.dispose();
            orbitControls = null;
            orbitControls = new OrbitControls(camera, renderer.domElement);
            orbitControls.enableDamping = true;
            folder1Params.perspective = "Perspective";
        }
    }    
  };
  folder1.add(folder1Params, 'switchCamera').name('Switch Camera Type');
  folder1.add(folder1Params, 'perspective').name('Current Camera').listen();

  const folder2 = gui.addFolder('Mercury');
  const folder2Params = {
    rotationSpeed: 0.02,
    orbitSpeed: 0.02
  };
  folder2.add(folder2Params, 'rotationSpeed', 0, 0.1).name('Rotation Speed');
  folder2.add(folder2Params, 'orbitSpeed', 0, 0.1).name('Orbit Speed');

  const folder3 = gui.addFolder('Venus');
  const folder3Params = {
    rotationSpeed: 0.015,
    orbitSpeed: 0.015
  };
  folder3.add(folder3Params, 'rotationSpeed', 0, 0.1).name('Rotation Speed');
  folder3.add(folder3Params, 'orbitSpeed', 0, 0.1).name('Orbit Speed');

  const folder4 = gui.addFolder('Earth');
  const folder4Params = {
    rotationSpeed: 0.01,
    orbitSpeed: 0.01
  };
  folder4.add(folder4Params, 'rotationSpeed', 0, 0.1).name('Rotation Speed');
  folder4.add(folder4Params, 'orbitSpeed', 0, 0.1).name('Orbit Speed');

  const folder5 = gui.addFolder('Mars');
  const folder5Params = {
    rotationSpeed: 0.008,
    orbitSpeed: 0.008
  };
  folder5.add(folder5Params, 'rotationSpeed', 0, 0.1).name('Rotation Speed');
  folder5.add(folder5Params, 'orbitSpeed', 0, 0.1).name('Orbit Speed');

  function render() {
  stats.update();
  orbitControls.update();

  mercuryAngle += folder2Params.orbitSpeed;
  mercury.position.x = mercuryOrbitRad * Math.cos(mercuryAngle);
  mercury.position.y = 0;
  mercury.position.z = mercuryOrbitRad * Math.sin(mercuryAngle);

  venusAngle += folder3Params.orbitSpeed;
  venus.position.x = venusOrbitRad * Math.cos(venusAngle);
  venus.position.y = 0;
  venus.position.z = venusOrbitRad * Math.sin(venusAngle);

  earthAngle += folder4Params.orbitSpeed;
  earth.position.x = earthOrbitRad * Math.cos(earthAngle);
  earth.position.y = 0;
  earth.position.z = earthOrbitRad * Math.sin(earthAngle);

  marsAngle += folder5Params.orbitSpeed;
  mars.position.x = marsOrbitRad * Math.cos(marsAngle);
  mars.position.y = 0;
  mars.position.z = marsOrbitRad * Math.sin(marsAngle)

  mercury.rotation.y += folder2Params.rotationSpeed;
  venus.rotation.y += folder3Params.rotationSpeed;
  earth.rotation.y += folder4Params.rotationSpeed;
  mars.rotation.y += folder5Params.rotationSpeed;
 
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}
  
  render();

