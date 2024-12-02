import { State, StateMode } from './state.js';
import { ResourceLoaders } from '../resourceLoaders.js';
import { SceneManager } from '../sceneManager.js';
import { ParticleSystem } from '../particles/particleSystem.js';
import { Lerp } from '../math/easing.js';

import * as THREE from 'three';
import { StateManager } from './stateManager.js';
import { lerp } from 'three/src/math/MathUtils.js';

export class TransitionFromIntroState extends State {
    constructor() {
        super(StateMode.TRANSITION_FROM_INTRO);
        
        this.transitionTimer = 5.0;
        this.cornellBox = SceneManager.getInstance().getNode("cornellBox");
        this.cornellLid = SceneManager.getInstance().getNode("cornellLid");
        this.boxParticles = SceneManager.getInstance().getNode("boxParticles");
    }

    initialize() {
    }

    update(deltaTime, camera) {
        this.transitionTimer -= deltaTime;
        if (this.transitionTimer <= 0.0) {
            this.__endTransition();
        }

        const lerpRotation = {  x: Lerp(this.cornellBox.rotation.x, 0.0, deltaTime * 1.75),
                                y: Lerp(this.cornellBox.rotation.y, 0.0, deltaTime * 1.75),
                                z: Lerp(this.cornellBox.rotation.z, 0.0, deltaTime * 1.75) };

        this.cornellBox.rotation.x = this.cornellLid.rotation.x = lerpRotation.x;
        this.cornellBox.rotation.y = this.cornellLid.rotation.y = lerpRotation.y;
        this.cornellBox.rotation.z = this.cornellLid.rotation.z = lerpRotation.z;

        camera.position.x = Lerp(camera.position.x, 0, deltaTime * 1.75);
        camera.position.z = Lerp(camera.position.z, 27.5, deltaTime * 1.75);
        
        const updatedLidScale = Lerp(this.cornellLid.scale.x, 0.97, deltaTime * 2.0);
        this.cornellLid.scale.x = updatedLidScale;
        this.cornellLid.scale.y = updatedLidScale;
        this.cornellLid.scale.z = updatedLidScale;

        // @TODO: Maybe create a particle system manager?

    }

    __endTransition() {
        SceneManager.getInstance().deleteNode("cornellLid");
    }
}