// Provides simple static functions that are used multiple times in the app
export default class Helpers {
    static logProgress() {
        return function (xhr) {
            if (xhr.lengthComputable) {
                const percentComplete = xhr.loaded / xhr.total * 100;

                console.log(Math.round(percentComplete) + '% downloaded');
            }
        }
    }

    static logError() {
        return function (xhr) {
            console.error(xhr);
        }
    }

    static handleColorChange(color) {
        return (value) => {
            if (typeof value === 'string') {
                value = value.replace('#', '0x');
            }

            color.setHex(value);
        };
    }

    static update(mesh) {
        this.needsUpdate(mesh.material, mesh.geometry);
    }

    static needsUpdate(material, geometry) {
        return function () {
            material.shading = +material.shading; //Ensure number
            material.vertexColors = +material.vertexColors; //Ensure number
            material.side = +material.side; //Ensure number
            material.needsUpdate = true;
            geometry.verticesNeedUpdate = true;
            geometry.normalsNeedUpdate = true;
            geometry.colorsNeedUpdate = true;
        };
    }

    static updateTexture(material, materialKey, textures) {
        return function (key) {
            material[materialKey] = textures[key];
            material.needsUpdate = true;
        };
    }
}
