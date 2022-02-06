export class VideoPlayer {
    constructor() {
        this.node = document.createElement('video');
        this.node.autoplay = true;
    }
    load(url) {
        this.node.src = url;
    }
}
//# sourceMappingURL=VideoPlayer.js.map