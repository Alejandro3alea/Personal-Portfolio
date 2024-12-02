import { SceneManager } from './sceneManager.js';
import { StateManager } from './states/stateManager.js';
import { ParticleSystemManager } from './particles/particleSystemManager.js';

import * as THREE from 'three';

class PortfolioApp {
  constructor() {
    this._SceneMgr = SceneManager.getInstance();
    this._StateMgr = StateManager.getInstance();
    this._PSMgr = ParticleSystemManager.getInstance();
    
    this.clock = new THREE.Clock();
    this.currentState = undefined;

    this.initializeRenderer();
    this.initializeCamera();
    this.setWindowEvents();

    this._StateMgr.initialize(this.camera);

    //this.loadSkybox();
    this.update();
  }

  initializeRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: document.querySelector('.bg'),
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

  initializeCamera() {
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.setZ(35);
    this.camera.position.setX(-15);

    this.renderer.render(this._SceneMgr.getScene(), this.camera);
  }

  loadSkybox() {
    this.textureLoader.load('Crab Nebula/hdr.png', (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      this._SceneMgr.getScene().background = texture;
      this._SceneMgr.getScene().environment = texture;
    }, undefined, (error) => {
      console.error(error);
    });
  }
  
  setWindowEvents() {
    window.addEventListener('resize', () => { 
      this.onWindowResize(); 
    }, false);
  }

  update()
  {
    requestAnimationFrame(() => this.update());

    const deltaTime = this.clock.getDelta();
    this._StateMgr.update(deltaTime);
    this._PSMgr.update(deltaTime);

    this.renderer.render(SceneManager.getInstance().getScene(), this.camera);
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('loaded');
  
  new PortfolioApp();
});