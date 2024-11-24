import './style.css'
import javascriptLogo from './javascript.svg'

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

class PortfolioApp {
  constructor() {
    this.initializeRenderer();
    this.initializeLoaders();
    this.newScene();

    this.addLighting();
    this.loadSkybox();
    this.loadModels();
    this.createCommonShapes();
    //this.renderDebugInfo();
    this.animate();
  }

  initializeRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: document.querySelector('#bg'),
      antialias: true
    });

    // Params
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.8;
  }

  initializeLoaders() {
    this.gltfLoader = new GLTFLoader();
    this.textureLoader = new THREE.TextureLoader();
    this.hdriLoader = new RGBELoader();

    this.gltfLoader.setPath('data/models/');
    this.textureLoader.setPath('data/textures/');
    this.hdriLoader.setPath('data/hdri/');
  }

  newScene() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.setZ(30);

    this.renderer.render(this.scene, this.camera);
  }


  addLighting() {
    const pointLight = new THREE.PointLight(0xFFFFDD, 250, 2000);
    pointLight.position.set(0, 9, 0);
    pointLight.castShadow = true;
    this.scene.add(pointLight);
  }

  loadSkybox() {
    this.textureLoader.load('Crab Nebula/hdr.png', (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      this.scene.background = texture;
      this.scene.environment = texture;
    }, undefined, (error) => {
      console.error(error);
    });
  }

  loadModels() {
    const loadModel = (path, pos, size) => {
      this.gltfLoader.load(path, 
        (gltf) => {
          gltf.scene.position.set(pos.x, pos.y, pos.z);
          gltf.scene.scale.set(size.x, size.y, size.z);
          const model = gltf.scene;
          model.traverse((child) => {
            if (child.isMesh)
              child.receiveShadow = true;
          });
        
        this.scene.add(model);
        return model;

        }, undefined, (error) => {
        console.error(error);
      });
    }

    const sponzaPos = new THREE.Vector3(0, -10, 0);
    const sponzaSize = new THREE.Vector3(10, 10, 10);
    loadModel('CornellEmpty/CornellEmpty.glb', origin, sponzaSize);
  }

  createCommonShapes() {
    const testTexture = this.textureLoader.load('test.png');
    const icosaGeo = new THREE.SphereGeometry(10, 4, 2);
    const icosaMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, map: testTexture });
    const icosaMesh = new THREE.Mesh(icosaGeo, icosaMaterial);
    icosaMesh.castShadow = true;
    icosaMesh.receiveShadow = true;
    this.scene.add(icosaMesh);

    const cornellLidGeo = new THREE.BoxGeometry(21, 21, 21);
    const cornellLidMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, metalness: 0.7, roughness: 0.0 });
    const cornellLidMesh = new THREE.Mesh(cornellLidGeo, cornellLidMaterial);
    this.scene.add(cornellLidMesh);
  }

  renderDebugInfo() {
    const lightHelper = new THREE.PointLightHelper(pointLight);
    const gridHelper = new THREE.GridHelper(200, 50);
    this.scene.add(lightHelper, gridHelper);

    const controls = new OrbitControls(this.camera, this.renderer.domElement);
  }
  
  animate()
  {
    requestAnimationFrame(() => this.animate());

    //controls.update();

    this.renderer.render(this.scene, this.camera);
  }
}

new PortfolioApp();