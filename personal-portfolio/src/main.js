import javascriptLogo from '../javascript.svg'

import { SceneManager } from './sceneManager.js';

import * as THREE from 'three';

import { InitScreenState } from './states/initScreenState.js';

class PortfolioApp {
  constructor() {
    this._SM = SceneManager.getInstance();
    this.clock = new THREE.Clock();

    this.initializeRenderer();
    this.initializeCamera();

    this.changeState(new InitScreenState());

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

    this.renderer.render(this._SM.getScene(), this.camera);
  }

  loadSkybox() {
    this.textureLoader.load('Crab Nebula/hdr.png', (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      this._SM.getScene().background = texture;
      this._SM.getScene().environment = texture;
    }, undefined, (error) => {
      console.error(error);
    });
  }

  changeState(state) {
    this.currentState = state;
    this.currentState.initialize();
  }
  
  update()
  {
    requestAnimationFrame(() => this.update());

    const deltaTime = this.clock.getDelta();
    this.currentState.update(deltaTime);

    this.renderer.render(SceneManager.getInstance().getScene(), this.camera);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('loaded');
  
  new PortfolioApp();
});