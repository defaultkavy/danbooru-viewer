import { AnimatedViewer } from "./AnimatedViewer.js";
import { ImageViewer } from "./ImageViewer.js";
import { Loader } from "./Loader.js";
import { Page } from "./Page.js";
import { VideoPlayer } from "./VideoPlayer.js";
export class PostPage extends Page {
    constructor(_page, client) {
        super(_page, document.createElement('booru-post'), client);
        this.opened = false;
        this.viewer = new ImageViewer();
        this.player = new VideoPlayer();
        this.anViewer = new AnimatedViewer();
        this.highresCached = [];
        this.viewer.canvas.addEventListener('mouseup', this.click.bind(this));
        this.node.addEventListener('wheel', this.highres.bind(this), { passive: false });
        this.loadFn = this.load.bind(this);
    }
    init() {
        if (this.opacityAn)
            this.opacityAn.pause();
        this.client.footer.push('');
        if (this.loader)
            this.loader.abort();
    }
    open(post) {
        this.init();
        this.opened = true;
        this.lastLoad = this.post;
        this.post = post;
        this.client.app.append(this.node);
        if (this.viewTimer)
            clearTimeout(this.viewTimer);
        if (post.ext === 'jpg' || post.ext === 'png') {
            this.anViewer.img.remove();
            this.player.node.remove();
            this.node.append(this.viewer.canvas);
            this.opening = this.viewer;
            this.viewer.load(post.large_file_url);
            if (this.highresCached.includes(this.post.file_url))
                this.highres();
            this.viewTimer = setTimeout(() => {
                this.highres();
            }, 3000);
        }
        else if (post.ext === 'gif' || post.ext === 'apng') {
            this.player.node.remove();
            this.viewer.canvas.remove();
            this.node.append(this.anViewer.img);
            this.opening = this.anViewer;
            this.anViewer.load(post.file_url);
        }
        else {
            this.anViewer.img.remove();
            this.viewer.canvas.remove();
            this.node.append(this.player.node);
            if (this.post.ext === 'zip')
                this.player.load(post.large_file_url);
            else
                this.player.load(post.file_url);
            this.opening = this.player;
        }
    }
    close() {
        if (this.loader)
            this.loader.abort();
        if (this.viewTimer)
            clearTimeout(this.viewTimer);
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
    click(e) {
        switch (e.button) {
            case 1:
                if (!this.post)
                    return;
                open(this.post.file_url, 'blank');
                return;
                break;
            case 2:
                window.history.back();
                break;
        }
    }
    highres() {
        if (!this.post)
            return;
        if (!(this.opening instanceof ImageViewer))
            return;
        if (this.lastLoad === this.post)
            return;
        if (this.img)
            this.img.removeEventListener('load', this.loadFn);
        this.lastLoad = this.post;
        this.client.footer.push(`Starting to load full image...`);
        this.loader = new Loader(this.post.file_url, (url) => {
            this.img = new Image();
            this.img.src = url;
            this.img.addEventListener('load', this.loadFn);
            this.client.footer.push(`Loaded full image.`);
            if (this.post)
                this.highresCached.push(this.post.file_url);
        });
        this.loader.onloadprogress(() => {
            if (this.loader)
                this.client.footer.push(`Load full image (${Math.round(this.loader.percentage)}%)`);
        });
        this.loader.onabort(() => {
            this.client.footer.push(`Load image cancel.`);
        });
    }
}
//# sourceMappingURL=PostPage.js.map