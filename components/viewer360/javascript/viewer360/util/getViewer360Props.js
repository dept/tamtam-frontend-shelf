export const getViewer360Props = element => ({
    folder: element.dataset.folder || '/',
    filename: element.dataset.filename || 'image-{index}.jpg',
    amount: parseInt(element.dataset.amount || 36, 10),
    speed: parseInt(element.dataset.speed || 80, 10),
    dragSpeed: parseInt(element.dataset.dragSpeed || 150, 10),
    keys: !!element.dataset.keys,
    autoplay: !!element.dataset.autoplay,
    autoplayReverse: !!element.dataset.autoplayReverse,
    ratio: parseFloat(element.dataset.ratio || 0) || false,
    responsive: !!element.dataset.responsive,
    lazyload: !!element.dataset.lazyload,
    lazySelector: element.dataset.lazyloadSelector || 'lazyload',
    spinReverse: !!element.dataset.spinReverse,
    controlReverse: !!element.dataset.controlReverse,
    stopAtEdges: !!element.dataset.stopAtEdges
});
