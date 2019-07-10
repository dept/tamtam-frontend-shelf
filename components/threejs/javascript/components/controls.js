import Config from '../../data/config';
import OrbitControls from 'three-orbitcontrols';

// Controls based on orbit controls
export default class Controls {
    constructor(camera, container) {
        this.threeControls = new OrbitControls(camera, container);
        this.init();
    }

    init() {
        this.threeControls.target.set(Config.controls.target.x, Config.controls.target.y, Config.controls.target.z);
        this.threeControls.autoRotate = Config.controls.autoRotate;
        this.threeControls.autoRotateSpeed = Config.controls.autoRotateSpeed;
        this.threeControls.rotateSpeed = Config.controls.rotateSpeed;
        this.threeControls.zoomSpeed = Config.controls.zoomSpeed;
        this.threeControls.minDistance = Config.controls.minDistance;
        this.threeControls.maxDistance = Config.controls.maxDistance;
        this.threeControls.minPolarAngle = Config.controls.minPolarAngle;
        this.threeControls.maxPolarAngle = Config.controls.maxPolarAngle;
        this.threeControls.enableDamping = Config.controls.enableDamping;
        this.threeControls.enableZoom = Config.controls.enableZoom;
        this.threeControls.dampingFactor = Config.controls.dampingFactor;
    }
}
