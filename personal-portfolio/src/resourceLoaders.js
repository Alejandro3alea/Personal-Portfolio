import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

export class ResourceLoaders {
    static _instance;

    constructor() {
        if (ResourceLoaders._instance) {
          return ResourceLoaders._instance;
        }
    
        ResourceLoaders._instance = this;
        this.initializeLoaders();
    }

    static getInstance() {
        if (!ResourceLoaders._instance) {
            ResourceLoaders._instance = new ResourceLoaders();
        }
        return ResourceLoaders._instance;
    }

    static GLTFLoader() {
        return ResourceLoaders.getInstance().gltfLoader;
    }

    static TextureLoader() {
        return ResourceLoaders.getInstance().textureLoader;
    }

    static HDRILoader() {
        return ResourceLoaders.getInstance().hdriLoader;
    }

    initializeLoaders() {
        this.gltfLoader = new GLTFLoader();
        this.textureLoader = new THREE.TextureLoader();
        this.hdriLoader = new RGBELoader();

        this.gltfLoader.setPath('data/models/');
        this.textureLoader.setPath('data/textures/');
        this.hdriLoader.setPath('data/hdri/');
    }
}