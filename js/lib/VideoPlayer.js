export class VideoPlayer {
    constructor() {
        this.node = document.createElement('video');
        this.node.autoplay = true;
        this.node.loop = true;
    }
    load(url) {
        this.node.src = url;
    }
}
//# sourceMappingURL=VideoPlayer.js.map