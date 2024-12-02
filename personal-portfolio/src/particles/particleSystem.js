import { SceneManager } from "../sceneManager.js";
import * as THREE from 'three';
import { ParticleSystemManager } from "./particleSystemManager.js";

export class ParticleSystem {
    constructor(name, particleCount) {
        this.particleCount = particleCount;
        this.boxSize = 5;
        this.particles = new THREE.BufferGeometry();
        this.positions = new Float32Array(this.particleCount * 3);
        this.opacities = new Float32Array(this.particleCount);
        this.velocities = new Array(this.particleCount);
        this.lifetimes = new Float32Array(this.particleCount);
        this.activated = true;

        ParticleSystemManager.getInstance().addParticleSystem(name, this);
    }

    initializeParticles(name) {
        for (let i = 0; i < this.particleCount; i++) {
            this.resetParticle(i);
        }

        this.particles.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));

        // Opacity is not working :(
        this.particles.setAttribute('opacity', new THREE.BufferAttribute(this.opacities, 1));

        const particleMaterial = new THREE.PointsMaterial({
        size: 0.2,
        color: 0xffffff,
        transparent: true,
        opacity: 0.8,
        transparent: true,
        depthWrite: false, 
        blending: THREE.AdditiveBlending,
        });

        const particleSystem = new THREE.Points(this.particles, particleMaterial);
        SceneManager.getInstance().addNode(name, particleSystem);
    }

    updateParticles(deltaTime) {
        for (let i = 0; i < this.particleCount; i++) {

            this.lifetimes[i] -= deltaTime;
            if (this.lifetimes[i] <= 0.0) {
                this.resetParticle(i);
            }

            this.opacities[i] = Math.max(this.lifetimes[i], 0.0) / 4.0;

            this.positions[i * 3] += this.velocities[i].x * deltaTime;
            this.positions[i * 3 + 1] += this.velocities[i].y * deltaTime;
            this.positions[i * 3 + 2] += this.velocities[i].z * deltaTime;
        }

        this.particles.attributes.position.needsUpdate = true;
        this.particles.attributes.opacity.needsUpdate = true;
    }

    resetParticle(index) {
        if (this.activated) {
            this.positions[index * 3] = (Math.random() - 0.5) * this.boxSize + 5;
            this.positions[index * 3 + 1] = (Math.random() - 0.5) * this.boxSize;
            this.positions[index * 3 + 2] = (Math.random() - 0.5) * this.boxSize - 5;
        }
        else {
            const OOB = 100000.0;
            this.positions[index * 3] = OOB;
            this.positions[index * 3 + 1] = OOB;
            this.positions[index * 3 + 2] = OOB;
        }


        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 + 2.5;
        this.velocities[index] = {  x: Math.cos(angle) * speed, 
                                    y: Math.sin(angle) * speed, 
                                    z: (Math.random() - 0.5) * 0.01 };
    
        this.opacities[index] = 1.0;
        this.lifetimes[index] = Math.random() * 3 + 1;
    }
}