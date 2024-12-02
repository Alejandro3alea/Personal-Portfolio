
export const StateMode = {
    INTRO_SCREEN: "introScreen",
    TRANSITION_FROM_INTRO: "transitionFromIntro",
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

    initialize() {}
    update(deltaTime, camera) {}
    shutdown() {}

    // Events
    onMouseClick(event, camera) {}
    onMouseMove(event, camera) {}
}