import { EaseIn, EaseOut, EaseInOut, Lerp } from '../math/easing.js';
import { ResourceLoaders } from '../resourceLoaders.js';
import { SceneManager } from '../sceneManager.js';
import { State, StateMode } from './state.js';

import * as THREE from 'three';

export class MainMenuState extends State {
    constructor() {
        super(StateMode.MAIN_MENU);

        this._SceneMgr = SceneManager.getInstance();

        this.timerToMoveCamera = 0.0;
        this.cameraTargetPos = new THREE.Vector3();
        
        this.cornellBox = this._SceneMgr.getNode("cornellBox");
        this.cornellBoxScale = this.cornellBox.scale;

        this.__createPedestals();
    }

    update(deltaTime, camera) {
        if (this.timerToMoveCamera < 1.0) {
            this.timerToMoveCamera += deltaTime / 2.0;
            camera.position.y = EaseInOut(0.0, -4.0, this.timerToMoveCamera);
            camera.position.z = EaseInOut(27.5, 17.0, this.timerToMoveCamera);
            this.cameraTargetPos.y = EaseInOut(0.0, -4.0, this.timerToMoveCamera);
            camera.lookAt(this.cameraTargetPos);
            
            this.cornellBox.scale.x = EaseOut(10, 12.5, this.timerToMoveCamera);
        }
    }

    __createPedestals() {
        
        const pedestal0Geo = new THREE.BoxGeometry(5.0, 10.0, 5.0);
        pedestal0Geo.position = new THREE.Vector3(-2.0, -10.0, 0.0);
        pedestal0Geo.rotateY(1);
        const pedestal0Mat = new THREE.MeshBasicMaterial();
        const pedestal0Mesh = new THREE.Mesh(pedestal0Geo, pedestal0Mat);
        //this._SceneMgr.addNode("pedestal0", pedestal0Mesh);

        const loadModel = (path, name, pos, size, onLoadCallback) => {
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
                onLoadCallback(model);
                return model;
                }, undefined, (error) => {
                console.error(error);
            });
        }
        
        const cornellPos = new THREE.Vector3(0, -10, 0);
        const cornellSize = new THREE.Vector3(0.2, 0.2, 0.2);
        loadModel(
            "Laptop/scene.gltf", 
            "Laptop", 
            cornellPos, 
            cornellSize, 
            (model) => { model.rotateY(-1); });
            
        loadModel(
            "StandfordBunny/scene.gltf", 
            "StandfordBunny", 
            cornellPos, 
            cornellSize, 
            (model) => { model.rotateY(-1); });
            
        loadModel(
            "Envelope/envelope_model.glb", 
            "Laptop", 
            cornellPos, 
            cornellSize, 
            (model) => { model.rotateY(-1); });
    }
}