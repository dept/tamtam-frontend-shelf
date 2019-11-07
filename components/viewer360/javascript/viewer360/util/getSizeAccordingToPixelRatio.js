export const getSizeAccordingToPixelRatio = size => {
    const splittedSizes = size.toString().split('x');
    const result = [];

    splittedSizes.map(sizing => {
        result.push(sizing * Math.round(window.devicePixelRatio || 1));
    });

    return result.join('x');
};
