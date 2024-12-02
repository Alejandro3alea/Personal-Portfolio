export class ParticleSystemManager {
    static _instance;

    constructor() {
        if (ParticleSystemManager._instance) {
          return ParticleSystemManager._instance;
        }
    
        ParticleSystemManager._instance = this;
        this.particleSystems = new Map();
    }

    static getInstance() {
        if (!ParticleSystemManager._instance) {
            ParticleSystemManager._instance = new ParticleSystemManager();
        }
        return ParticleSystemManager._instance;
    }

    update(deltaTime) {
        this.particleSystems.forEach((system) => {
            system.updateParticles(deltaTime);
        });
    }

    addParticleSystem(name, particleSystem) {
        this.particleSystems.set(name, particleSystem);
        particleSystem.initializeParticles(name);
    }
}