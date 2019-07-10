import Keyboard from '../../utils/keyboard';
import Config from '../../data/config';

import RafThrottle from '@utilities/raf-throttle';

// Manages all input interactions
export default class Interaction {
    constructor(renderer, scene, camera, controls) {
        // Properties
        this.renderer = renderer;
        this.scene = scene;
        this.camera = camera;
        this.controls = controls;

        this.timeout = null;

        // Instantiate keyboard helper
        this.keyboard = new Keyboard();

        // Listeners
        // Mouse events
        RafThrottle.set([
            {
                element: this.renderer.domElement,
                event: 'mousemove',
                namespace: 'canvasMouseMove',
                fn: event => this.onMouseMove(event),
                delay: 10,
            }
        ]);
        this.renderer.domElement.addEventListener('mouseleave', (event) => Interaction.onMouseLeave(event), false);
        this.renderer.domElement.addEventListener('mouseover', (event) => Interaction.onMouseOver(event), false);

        // Keyboard events
        this.keyboard.domElement.addEventListener('keydown', (event) => {
            // Only once
            if (event.repeat) {
                return;
            }

            if (Keyboard.eventMatches(event, 'escape')) {
                console.log('Escape pressed');
            }
        });
    }

    static onMouseOver(event) {
        event.preventDefault();

        Config.isMouseOver = true;
    }

    static onMouseLeave(event) {
        event.preventDefault();

        Config.isMouseOver = false;
    }

    onMouseMove(event) {
        event.preventDefault();

        if (this.timeout !== undefined) clearTimeout(this.timeout);
        this.timeout = setTimeout(() => Config.isMouseMoving = false, 200);

        Config.isMouseMoving = true;
    }
}
