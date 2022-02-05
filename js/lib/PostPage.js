import { ImageViewer } from "./ImageViewer.js";
import { Page } from "./Page.js";
export class PostPage extends Page {
    constructor(_page, client) {
        super(_page, document.createElement('booru-post'), client);
        this.opened = false;
        this.viewer = new ImageViewer();
        this.node.addEventListener('click', this.click.bind(this));
        this.node.addEventListener('wheel', this.scroll.bind(this), { passive: false });
        this.loadFn = this.load.bind(this);
    }
    init() {
        if (this.opacityAn)
            this.opacityAn.pause();
    }
    open(post) {
        this.init();
        this.opened = true;
        this.post = post;
        this.client.app.append(this.node);
        this.node.append(this.viewer.canvas);
        this.viewer.load(post.large_file_url);
    }
    close() {
        this.node.remove();
        this.opened = false;
    }
    unachived() {
        this.opened = true;
        this.client.app.append(this.node);
        this.node.append(this.viewer.canvas);
    }
    load() {
        if (!this.img)
            return;
        this.viewer.replace(this.img);
    }
    click() {
        //this.close()
    }
    scroll() {
        if (!this.post)
            return;
        if (this.lastLoad === this.post)
            return;
        console.debug(true);
        if (this.img)
            this.img.removeEventListener('load', this.loadFn);
        this.lastLoad = this.post;
        this.img = new Image();
        this.img.src = this.post.file_url;
        this.img.addEventListener('load', this.loadFn);
    }
}
//# sourceMappingURL=PostPage.js.map