import { State, StateMode } from './state.js';
import { ResourceLoaders } from '../resourceLoaders.js';

import * as THREE from 'three';
import { SceneManager } from '../sceneManager.js';

export class InitScreenState extends State {
    constructor() {
        super(StateMode.INIT_SCREEN);
        
        this.rotatingObjects = new Array();
    }

    initialize() {
        this.loadModels();
        this.createCommonShapes();
        this.addLighting();
    }

    update(deltaTime) {

    }
    
    loadModels() {
        const loadModel = (path, name, pos, size) => {
        ResourceLoaders.GLTFLoader().load(path, 
            (gltf) => {
            gltf.scene.position.set(pos.x, pos.y, pos.z);
            gltf.scene.scale.set(size.x, size.y, size.z);
            const model = gltf.scene;
            model.traverse((child) => {
                if (child.isMesh)
                child.receiveShadow = true;
            });

            SceneManager.getInstance().addNode(name, model);
            return model;
            }, undefined, (error) => {
            console.error(error);
        });
        }

        const cornellPos = new THREE.Vector3(0, -10, 0);
        const cornellSize = new THREE.Vector3(10, 10, 10);
        loadModel('CornellEmpty/CornellEmpty.glb', "cornellBox", cornellPos, cornellSize);
    }

    createCommonShapes() {
        const testTexture = ResourceLoaders.TextureLoader().load('test.png');
        const icosaGeo = new THREE.SphereGeometry(10, 4, 2);
        const icosaMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, map: testTexture });
        const icosaMesh = new THREE.Mesh(icosaGeo, icosaMaterial);
        icosaMesh.castShadow = true;
        icosaMesh.receiveShadow = true;
        //this._SM.addNode("icosaMesh", icosaMesh);

        const cornellLidGeo = new THREE.BoxGeometry(21, 21, 21);
        const cornellLidMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, metalness: 0.7, roughness: 0.0 });
        const cornellLidMesh = new THREE.Mesh(cornellLidGeo, cornellLidMaterial);
        SceneManager.getInstance().addNode("cornellLid", cornellLidMesh);
    }
    
    addLighting() {
        const pointLight = new THREE.PointLight(0xFFFFDD, 250, 2000);
        pointLight.position.set(0, 9, 0);
        pointLight.castShadow = true;
        SceneManager.getInstance().addNode("pointLight", pointLight);
        
        const bgLight = new THREE.AmbientLight(0xFFFFFF);
        SceneManager.getInstance().addNode("bgLight", bgLight);
    }
}