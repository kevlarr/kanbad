export default {
    /**
     * Returns the current hash path of the window
     */
    currentLocation(): string {
        return window.location.hash.replace(/^#\//, '');
    },

    /**
     * Updates the window location to specified path
     */
    updateLocation(path: string) {
        window.location.hash = `#/${path}`;
    }
};
