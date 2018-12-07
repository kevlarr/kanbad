export default {
    /**
     * Returns the current hash path of the window
     */
    currentLocation(): String {
        return window.location.hash.replace(/^#\//, '');
    },

    /**
     * Updates the window location to specified path
     */
    transitionTo(path: String) {
        window.location.hash = `#/${path}`;
    }
};
