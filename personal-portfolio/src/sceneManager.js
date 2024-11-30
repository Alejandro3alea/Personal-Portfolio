import * as THREE from 'three';
import { remove } from 'three/examples/jsm/libs/tween.module.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

export class SceneManager {
    static _instance;

    constructor() {
        if (SceneManager._instance) {
          return SceneManager._instance;
        }
    
        SceneManager._instance = this;
        this.scene = new THREE.Scene();
    }

    static getInstance() {
        if (!SceneManager._instance) {
            SceneManager._instance = new SceneManager();
        }
        return SceneManager._instance;
    }

    getScene() {
        return this.scene;
    }

    newScene() {
        this.scene.clear();
    }

    addNode(name, node) {
        node.name = name;
        this.scene.add(node);
    }

    deleteNode(name) {
        const nodeToDelete = this.scene.getObjectByName(name);
        this.scene.remove(nodeToDelete);
    }
}