const STT_HOOK = '[js-hook-scroll-to-top]';

class ScrollToTop {

    constructor() {

        this.elements = getElements();
        this._bindEvents();

    }
    
    /**
     * Bind event
     */
    _bindEvents() {

        this.elements.forEach(element => {

            element.addEventListener('click', (event) => {
                event.preventDefault();

                scrollToTop();
            });

        });

    }

}

/**
 * Gets all elements matching the STT_HOOK
 * @returns {NodeList} All matching HTMLElements
 */
function getElements() {
    return document.querySelectorAll(STT_HOOK); 
}

/**
 * Scrolls the window to the top
 */
function scrollToTop() {
    
    if ('requestAnimationFrame' in window === false) {
        window.scroll(0,0);
        return;
    } 

    const start = window.pageYOffset;
    const startTime = new Date().getTime();

    const animate = () => {
        
        const now = new Date().getTime();
        const time = Math.min(1, ((now - startTime) / 200));

        window.scroll(0, Math.ceil((time * (0 - start)) + start));    

        if (window.pageYOffset === 0) {
            return;
        }            

        requestAnimationFrame(animate);
    }

    animate();  
}

export default new ScrollToTop();