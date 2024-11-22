import './style.css'
import javascriptLogo from './javascript.svg'

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

const gltfLoader = new GLTFLoader();
const textureLoader = new THREE.TextureLoader();
const hdriLoader = new RGBELoader();

gltfLoader.setPath('data/models/');
textureLoader.setPath('data/textures/');
hdriLoader.setPath('data/hdri/');

function loadModels()
{
  const loadModel = (path, pos, size) => {
    gltfLoader.load(path, (gltf) => {
      gltf.scene.position.set(pos.x, pos.y, pos.z);
      gltf.scene.scale.set(size.x, size.y, size.z);
      const model = gltf.scene;
      let i = 0;
      model.traverse((child) => {
        if (child.isMesh) {
          const material = child.material;
          console.log(child);
          child.receiveShadow = true;
          if (i > 5 && material.isMeshStandardMaterial) {
            material.metalness = 0.0;  // Fully metallic
            material.roughness = 0.0; // Smooth surface
          }
          else
          {
            material.metalness = 0.7;  // Fully metallic
            material.roughness = 0.0; // Smooth surface
          }
          i++;
        }
      });

      scene.add(gltf.scene);
    }, undefined, (error) => {
      console.error(error);
    });
  }

  const origin = new THREE.Vector3();

  const sponzaSize = new THREE.Vector3(10, 10, 10);
  loadModel('Cornell/cornell.gltf', origin, sponzaSize);
}

function loadSkybox()
{
  /*hdriLoader.load('clear_sunset_sky_dome_2k.hdr', (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = texture;
    scene.environment = texture;
  }, undefined, (error) => {
    console.error(error);
  });*/
  textureLoader.load('Crab Nebula/hdr.png', (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = texture;
    scene.environment = texture;
  }, undefined, (error) => {
    console.error(error);
  });
}

function animate()
{
  requestAnimationFrame(animate);

  icosaMesh.rotateX(0.01);
  icosaMesh.rotateY(0.005);
  icosaMesh.rotateZ(0.01);

  controls.update();

  renderer.render(scene, camera);
}

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.setZ(30);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
  antialias: true
})

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.8;

renderer.render(scene, camera);

const testTexture = textureLoader.load('test.png');
const icosaGeo = new THREE.SphereGeometry(10, 4, 2);
const icosaMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, map: testTexture });
const icosaMesh = new THREE.Mesh(icosaGeo, icosaMaterial);
icosaMesh.castShadow = true;
icosaMesh.receiveShadow = true;
scene.add(icosaMesh);

const pointLight = new THREE.PointLight(0xFFFFDD, 250, 2000);
pointLight.position.set(0, 19, 0);
pointLight.castShadow = true;
scene.add(pointLight);

const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(lightHelper, gridHelper);

const controls = new OrbitControls(camera, renderer.domElement);

loadSkybox();
loadModels();
animate();