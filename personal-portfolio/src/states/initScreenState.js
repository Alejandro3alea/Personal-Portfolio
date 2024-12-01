import { State, StateMode } from './state.js';
import { ResourceLoaders } from '../resourceLoaders.js';
import { SceneManager } from '../sceneManager.js';
import { ParticleSystem } from '../particleSystem.js';

import * as THREE from 'three';

export class InitScreenState extends State {
    constructor() {
        super(StateMode.INIT_SCREEN);
        
        this.rotatingNodes = new Array();
        this.rotation = new THREE.Vector3();

        this.rotationPhase = 0;
        this.rotationFrequency = 0.5; // Frequency of speed oscillations

        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        this.boxParticles = new ParticleSystem("boxParticles", 10000);
    }

    initialize() {
        this.loadModels();
        this.createCommonShapes();
        this.addLighting();
    }

    update(deltaTime, camera) {
        this.updateRotatingNodes(deltaTime);
        this.updateRaycasterIntersections(camera);
        this.boxParticles.updateParticles(deltaTime);
    }

    onMouseClick(event, camera) {
        this.raycaster.setFromCamera(this.mouse, camera);

        if (this.intersects.length > 0) {
            this.intersects[0].object.material.color.set(0xff0000);
        }
    }

    onMouseMove(event, camera) {
        // Mouse pos to NDC (-1,+1)
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
    }
    
    loadModels() {
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

        const cornellPos = new THREE.Vector3(0, 0, 0);
        const cornellSize = new THREE.Vector3(10, 10, 10);
        loadModel(
            "CornellEmpty/CornellEmpty.glb", 
            "cornellBox", 
            cornellPos, 
            cornellSize, 
            (model) => {this.addNodeToRotatingList(model);});
    }

    createCommonShapes() {
        const testTexture = ResourceLoaders.TextureLoader().load('test.png');
        const icosaGeo = new THREE.SphereGeometry(10, 4, 2);
        const icosaMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, map: testTexture });
        const icosaMesh = new THREE.Mesh(icosaGeo, icosaMaterial);
        icosaMesh.castShadow = true;
        icosaMesh.receiveShadow = true;
        //this._SM.addNode("icosaMesh", icosaMesh);

        const cornellLidGeo = new THREE.BoxGeometry(20.5, 20.5, 20.5);
        const cornellLidMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, metalness: 0.7, roughness: 0.0 });
        const cornellLidMesh = new THREE.Mesh(cornellLidGeo, cornellLidMaterial);
        this.addNodeToRotatingList(cornellLidMesh);
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

    addNodeToRotatingList(node) {
        this.rotatingNodes.push(node);
    }

    updateRotatingNodes(deltaTime) {
        const rotationSpeed = {
            x: 0.3, 
            y: 0.5, 
            z: 0.2  
        };

        // Custom rotation formula computation
        this.rotationPhase += this.rotationFrequency * deltaTime;

        const dynamicSpeed = {
            x: rotationSpeed.x + 0.1 * Math.sin(this.rotationPhase),
            y: rotationSpeed.y + 0.1 * Math.cos(this.rotationPhase),
            z: rotationSpeed.z + 0.1 * Math.sin(this.rotationPhase * 1.5)
        };

        this.rotation.x += dynamicSpeed.x * deltaTime;
        this.rotation.y += dynamicSpeed.y * deltaTime;
        this.rotation.z += dynamicSpeed.z * deltaTime;

        this.rotatingNodes.forEach((node) => {
            node.rotation.x = this.rotation.x;
            node.rotation.y = this.rotation.y;
            node.rotation.z = this.rotation.z;
        });
    }

    updateRaycasterIntersections(camera) {
        this.raycaster.setFromCamera(this.mouse, camera);

        this.intersects = this.raycaster.intersectObjects(this.rotatingNodes);
        if (this.intersects.length > 0) {
            console.log(this.intersects);
            document.body.style.cursor = 'pointer';
        } else {
            document.body.style.cursor = 'auto';
        }
    }

    startTransition() {
    }
}
