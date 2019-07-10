import * as THREE from 'three';
import Config from '../../data/config';

const CLASS_CANVAS = 'threejs__canvas';

// Main webGL renderer class
export default class Renderer {
    constructor(scene, container) {

        // Properties
        this.scene = scene;
        this.container = container;
        this.canvasElement = container.querySelector('canvas') || undefined;

        // Create WebGL renderer and set its antialias and canvas element if it exists in the DOM
        this.threeRenderer = new THREE.WebGLRenderer({
            antialias: true,
            canvas: this.canvasElement,
        });

        // If no canvas element is available in the DOM, use the renderer's default and append it to the DOM with additional class.
        if (!this.canvasElement) {
            this.threeRenderer.domElement.classList.add(CLASS_CANVAS);
            container.appendChild(this.threeRenderer.domElement);
        }

        // Set clear color to fog to enable fog or to hex color for no fog
        this.threeRenderer.setClearColor(scene.fog.color);
        this.threeRenderer.setPixelRatio(window.devicePixelRatio); // For retina

        // Shadow map options
        this.threeRenderer.shadowMap.enabled = true;
        this.threeRenderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // Get anisotropy for textures
        Config.maxAnisotropy = this.threeRenderer.capabilities.getMaxAnisotropy();

        // Initial size update set to canvas container
        this.updateSize();

        // Bind event listeners
        this.bindEvents();
    }

    /**
     * Bind all events
     */
    bindEvents() {
        document.addEventListener('DOMContentLoaded', () => this.updateSize(), false);
        window.addEventListener('resize', () => this.updateSize(), false);
    }

    /**
     * Update size of WebGL renderer on the canvas element
     */
    updateSize() {
        this.threeRenderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
    }

    /**
     * Render the scene to canvas target
     * @param scene - Scene to be rendered on canvas
     * @param camera - Camera to be used in scene
     */
    render(scene, camera) {
        this.threeRenderer.render(scene, camera);
    }
}
