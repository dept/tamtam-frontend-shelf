export const getSizeAccordingToPixelRatio = size => {
    const splittedSizes = size.toString().split('x');
    const result = [];

    [].forEach.call(splittedSizes, sizing => {
        result.push(sizing * Math.round(window.devicePixelRatio || 1));
    });

    return result.join('x');
};
