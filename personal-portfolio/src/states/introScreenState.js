import { State, StateMode } from './state.js';
import { ResourceLoaders } from '../resourceLoaders.js';
import { SceneManager } from '../sceneManager.js';
import { ParticleSystem } from '../particles/particleSystem.js';
import { EaseInOut, QuadraticBounce } from '../math/easing.js';

import * as THREE from 'three';
import { clamp } from 'three/src/math/MathUtils.js';
import { StateManager } from './stateManager.js';
import { TransitionFromIntroState } from './transitionFromIntro.js';
import { cornellLidFragShader, cornellLidVertexShader } from '../../data/shaders/cornellLidShader.js';

export class IntroScreenState extends State {
    constructor() {
        super(StateMode.INTRO_SCREEN);
        
        this.rotatingNodes = new Array();
        this.interactableNodes = new Array();
        this.rotation = new THREE.Vector3();

        this.rotationPhase = 0;
        this.rotationFrequency = 0.5;

        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        this.texturesArray = new Array();
        this.textureArrayIndex = 0;
        this.lidTextureTransitionVal = 0.0;
        this.lidScaleTimer = 0.0;

        this.boxParticles = new ParticleSystem("boxParticles", 10000);

        this.cornellLidMaterial = new THREE.ShaderMaterial({
            vertexShader: cornellLidVertexShader,
            fragmentShader: cornellLidFragShader,
            uniforms: {
              envMap: { value: null },
              texture1: { value: null },
              texture2: { value: null },
              mixRatio: { value: 0.0 },
              time: { value: 0.0 },
              refractionRatio: { value: 0.98 },
              fresnelPower: { value: 5.0 },
              glossiness: { value: 8.0 },
              emissiveColor: { value: new THREE.Color(0x444444) } // Example emissive color
            },
            transparent: false,
        });
    }

    initialize() {
        this._loadModels();
        this._createCommonShapes();
        this._addLighting();
    }

    update(deltaTime, camera) {
        this.__updateRotatingNodes(deltaTime);
        this.__updateRaycasterIntersections(camera);
        this.__updateCornellLid(deltaTime);
    }

    onMouseClick(event, camera) {
        if (this.intersects.length > 0) {
            this.__startTransition();
        }
    }

    onMouseMove(event, camera) {
        // Mouse pos to NDC (-1,+1)
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        camera.position.x += (-15 + this.mouse.x * 1.5 - camera.position.x) * 0.05;
        camera.position.y += (this.mouse.y * 1.5 - camera.position.y) * 0.05;

        camera.lookAt(new THREE.Vector3(-15, 0, 0));
    }
    
    _loadModels() {
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
            (model) => {this.__addNodeToRotatingList(model);});
    }

    _createCommonShapes() {
        const testTexture = ResourceLoaders.TextureLoader().load('test.png');
        const icosaGeo = new THREE.SphereGeometry(10, 4, 2);
        const icosaMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, map: testTexture });
        const icosaMesh = new THREE.Mesh(icosaGeo, icosaMaterial);
        icosaMesh.castShadow = true;
        icosaMesh.receiveShadow = true;
        //SceneManager.getInstance().addNode("icosaMesh", icosaMesh);

        const cornellLidGeo = new THREE.BoxGeometry(20.5, 20.5, 20.5);
        
        ResourceLoaders.LoadTexture('Projects_CPURaytracer.png', (texture) => {
            this.cornellLidMaterial.uniforms.texture1.value = texture;
            this.cornellLidMaterial.needsUpdate = true;
            this.texturesArray.push(texture);
        });

        ResourceLoaders.LoadTexture('AI_CircuitGenerator.jpg', (texture) => {
            this.cornellLidMaterial.uniforms.texture2.value = texture;
            this.cornellLidMaterial.needsUpdate = true;
            this.texturesArray.push(texture);
        });
        
        ResourceLoaders.LoadTexture('Projects_DeferredShading.jpg', (texture) => {
            this.cornellLidMaterial.uniforms.texture2.value = texture;
            this.cornellLidMaterial.needsUpdate = true;
            this.texturesArray.push(texture);
        });
        
        ResourceLoaders.LoadTexture('Projects_HyperTwist0.png', (texture) => {
            this.cornellLidMaterial.uniforms.texture2.value = texture;
            this.cornellLidMaterial.needsUpdate = true;
            this.texturesArray.push(texture);
        });
        
        ResourceLoaders.LoadTexture('Crab Nebula/hdr.png', (texture) => {
            texture.mapping = THREE.EquirectangularReflectionMapping;
            SceneManager.getInstance().getScene().background = texture;
            SceneManager.getInstance().getScene().environment = texture;
            this.cornellLidMaterial.uniforms.envMap.value = texture.clone();
            this.cornellLidMaterial.needsUpdate = true;
        });
        
        const cornellLidMesh = new THREE.Mesh(cornellLidGeo, this.cornellLidMaterial);
        this.__addNodeToRotatingList(cornellLidMesh);
        this.interactableNodes.push(cornellLidMesh);
        SceneManager.getInstance().addNode("cornellLid", cornellLidMesh);
    }
    
    _addLighting() {
        const pointLight = new THREE.PointLight(0xFFFFDD, 250, 2000);
        pointLight.position.set(0, 9, 0);
        pointLight.castShadow = true;
        SceneManager.getInstance().addNode("pointLight", pointLight);
        
        const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
        directionalLight.position.set(50, 50, 50);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 1024;
        directionalLight.shadow.mapSize.height = 1024;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 500;
        SceneManager.getInstance().addNode("directionalLight", directionalLight);
    }

    __addNodeToRotatingList(node) {
        this.rotatingNodes.push(node);
    }

    __updateRotatingNodes(deltaTime) {
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

    __updateRaycasterIntersections(camera) {
        this.raycaster.setFromCamera(this.mouse, camera);

        this.intersects = this.raycaster.intersectObjects(this.rotatingNodes);
        // This only updates when moving the cursor :/
        if (this.intersects.length > 0) {

            document.body.style.cursor = 'pointer';
        } else {
            document.body.style.cursor = 'auto';
        }
    }

    __updateCornellLid(deltaTime) {
        if (this.intersects.length > 0) {
            this.lidScaleTimer += deltaTime * 2;
        }
        else {
            this.lidScaleTimer -= deltaTime * 2;
        }
        this.lidScaleTimer = clamp(this.lidScaleTimer, 0.0, 1.0);

        const easeVal = EaseInOut(1, 1.2, this.lidScaleTimer);
        this.interactableNodes.forEach((node) => {
            node.scale.x = easeVal;
            node.scale.y = easeVal;
            node.scale.z = easeVal;
        });

        this.__updateCornellLidTexture(deltaTime);
    }

    __updateCornellLidTexture(deltaTime) {
        //this.cornellLidMaterial.uniforms.value = texture;

        this.lidTextureTransitionVal += deltaTime / 5.0;
        if (this.lidTextureTransitionVal >= 1.0)
        {
            this.lidTextureTransitionVal = 0.0;
            this.textureArrayIndex++;

            if (this.textureArrayIndex == this.texturesArray.length - 1) {
                this.textureArrayIndex = 0;
            }
        }
        
        this.cornellLidMaterial.uniforms.texture1.value = this.texturesArray[this.textureArrayIndex];
        this.cornellLidMaterial.uniforms.texture2.value = this.texturesArray[this.textureArrayIndex + 1];
        this.cornellLidMaterial.uniforms.mixRatio.value = this.lidTextureTransitionVal;
        this.cornellLidMaterial.needsUpdate = true;
    }

    __startTransition() {
        let introNameText = document.querySelector("#intro-name");
        let introRoleText = document.querySelector("#intro-role");

        introNameText.style.transition = "transform 1s ease-in, opacity 0.5s ease-out";
        introRoleText.style.transition = "transform 1s ease-out, opacity 0.5s ease-out";
        introNameText.classList.add("hidden");
        introRoleText.classList.add("hidden");

        document.body.style.cursor = 'auto';
        this.boxParticles.activated = false;

        StateManager.getInstance().changeState(new TransitionFromIntroState());
    }
}
