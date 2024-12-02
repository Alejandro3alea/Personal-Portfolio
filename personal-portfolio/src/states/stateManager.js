import { IntroScreenState } from "./introScreenState";

export class StateManager {
    static _instance;

    constructor() {
        if (StateManager._instance) {
          return StateManager._instance;
        }
    
        StateManager._instance = this;
        this.currentState = this.changeState(new IntroScreenState());
    }

    static getInstance() {
        if (!StateManager._instance) {
            StateManager._instance = new StateManager();
        }
        return StateManager._instance;
    }

    initialize(camera) {
        this.camera = camera;
        this.__setWindowEvents();
    }

    update(deltaTime) {
        this.currentState.update(deltaTime, this.camera);
    }

    changeState(state) {
        if (this.currentState != undefined) {
            this.currentState.shutdown();
        }
        this.currentState = state;
        this.currentState.initialize();
        return state;
    }
    
    __setWindowEvents() {
        window.addEventListener('click', (event) => { 
            this.currentState.onMouseClick(event, this.camera); 
        }, false);
    
        window.addEventListener('mousemove', (event) => { 
            this.currentState.onMouseMove(event, this.camera); 
        }, false);
    }
}