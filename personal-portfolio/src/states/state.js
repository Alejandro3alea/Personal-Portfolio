
export const StateMode = {
    INIT_SCREEN: "initScreen",
    MAIN_MENU: "mainMenu",
    ABOUT_ME: "aboutMe",
    PROJECTS: "projects",
    GAMES: "games",
    BLOG: "blog",
    CONTACT: "contact",
  };

export class State {
    constructor(mode) {
        this.mode = mode;
    }

    initialize() {
    }
    
    update(deltaTime) {
    }

    shutdown() {
        
    }
}