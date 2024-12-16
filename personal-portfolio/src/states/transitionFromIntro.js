import { State, StateMode } from './state.js';
import { SceneManager } from '../sceneManager.js';
import { Lerp } from '../math/easing.js';
import { StateManager } from './stateManager.js';
import { MainMenuState } from './mainMenuState.js';

import * as THREE from 'three';

export class TransitionFromIntroState extends State {
    constructor() {
        super(StateMode.TRANSITION_FROM_INTRO);
        
        this.transitionTimer = 5.0;
        this.cornellBox = SceneManager.getInstance().getNode("cornellBox");
        this.cornellLid = SceneManager.getInstance().getNode("cornellLid");
        this.boxParticles = SceneManager.getInstance().getNode("boxParticles");
        
        this.closestRotation = { x: this.__getClosestRotation(this.cornellBox.rotation.x),
                                 y: this.__getClosestRotation(this.cornellBox.rotation.y),
                                 z: this.__getClosestRotation(this.cornellBox.rotation.z) };

        this.cameraTargetPos = new THREE.Vector3(-15, 0, 0);
    }

    update(deltaTime, camera) {
        this.transitionTimer -= deltaTime;
        if (this.transitionTimer <= 0.0) {
            this.__endTransition();
        }

        const lerpRotation = { x: Lerp(this.cornellBox.rotation.x, this.closestRotation.x, deltaTime * 1.75),
                               y: Lerp(this.cornellBox.rotation.y, this.closestRotation.y, deltaTime * 1.75),
                               z: Lerp(this.cornellBox.rotation.z, this.closestRotation.z, deltaTime * 1.75) };

        this.cornellBox.rotation.x = this.cornellLid.rotation.x = lerpRotation.x;
        this.cornellBox.rotation.y = this.cornellLid.rotation.y = lerpRotation.y;
        this.cornellBox.rotation.z = this.cornellLid.rotation.z = lerpRotation.z;

        camera.position.x = Lerp(camera.position.x, 0, deltaTime * 1.75);
        camera.position.y = Lerp(camera.position.y, 0, deltaTime * 1.75);
        camera.position.z = Lerp(camera.position.z, 27.5, deltaTime * 1.75);
        
        this.cameraTargetPos.x = Lerp(this.cameraTargetPos.x, 0, deltaTime);
        camera.lookAt(this.cameraTargetPos);
        
        const updatedLidScale = Lerp(this.cornellLid.scale.x, 0.97, deltaTime * 2.0);
        this.cornellLid.scale.x = updatedLidScale;
        this.cornellLid.scale.y = updatedLidScale;
        this.cornellLid.scale.z = updatedLidScale;
    }

    __endTransition() {
        SceneManager.getInstance().deleteNode("cornellLid");
        SceneManager.getInstance().deleteNode("boxParticles")

        setTimeout(() => {
            StateManager.getInstance().changeState(new MainMenuState());
        }, 1000);
    }

    __getClosestRotation(radians) {
        const fullRotation = 2.0 * Math.PI;
        const remainder = radians % fullRotation;
        const min = radians - remainder;
        return (remainder <= 0.5) ? min : min + fullRotation;
    }
}