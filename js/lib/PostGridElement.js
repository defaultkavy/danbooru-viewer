import anime from "../plugin/anime.js";
import { GridElement } from "./GridElement.js";
export class PostGridElement extends GridElement {
    constructor(post, parent, element, client) {
        super({ height: post.height, width: post.width }, parent, element, client);
        this.id = post.id;
        this.post = post;
        this.img = document.createElement('img');
        this.video = document.createElement('video');
        this.durationCounter = document.createElement('video-duration');
        this.p = document.createElement('p');
        this.mouseleaveFn = this.mouseleave.bind(this);
        this.mouseupFn = this.mouseup.bind(this);
        this.node.addEventListener('mouseenter', this.mouseenter.bind(this));
        this.node.addEventListener('touchstart', this.mouseenter.bind(this), { passive: false });
        this.node.addEventListener('click', this.click.bind(this));
        this.node.addEventListener('mousedown', this.mousedown.bind(this));
        this.loadImage();
    }
    block() {
        this.img.style.opacity = '0';
        this.p.innerText = `${this.order} - ${this.id}`;
        this.node.append(this.p);
    }
    play() {
        if (this.post.ext !== 'mp4' && this.post.ext !== 'zip' && this.post.ext !== 'webm')
            return;
        if (this.video.readyState >= 3)
            return this.video.play();
        this.video.ontimeupdate = () => {
            this.durationCounter.innerText = this.duration();
        };
        this.video.onplaying = () => {
            if (this.video.readyState < 2)
                return;
            this.img.remove();
        };
        this.node.style.height = `${this.img.clientHeight}px`;
        this.video.autoplay = true;
        this.video.muted = true;
        this.video.loop = true;
        this.video.src = this.post.large_file_url;
        this.node.append(this.video);
    }
    pause() {
        if (this.video.played)
            this.video.pause();
    }
    unmute() {
        if (this.video.played)
            this.video.muted = false;
    }
    duration() {
        const remain = this.video.duration - this.video.currentTime;
        const h = Math.floor(remain / 3600);
        const m = Math.floor(remain % 3600 / 60);
        const s = Math.floor(remain % 3600 % 60);
        const dh = h === 0 ? undefined : h < 10 ? `0${h}` : `${h}`;
        const dm = m < 10 ? `0${m}` : `${m}`;
        const ds = s < 10 ? `0${s}` : `${s}`;
        return `${dh ? dh + ':' : ''}` + dm + ':' + ds;
    }
    loadImage() {
        if (this.post.ext === 'mp4' || this.post.ext === 'zip' || this.post.ext === 'webm' || this.post.ext === 'gif') {
            this.durationCounter.innerText = this.post.ext;
            this.node.append(this.durationCounter);
        }
        const checkExt = this.post.large_file_url.endsWith('mp4') || this.post.large_file_url.endsWith('webm');
        this.img.src = checkExt ? this.post.preview_file_url : this.post.large_file_url;
        this.img.width = this.post.width;
        this.img.height = this.post.height;
        this.img.loading = 'lazy';
        this.node.append(this.img);
    }
    click(e) {
        if (e.ctrlKey) {
            this.select(false);
        }
        else if (e.shiftKey) {
            const lastSelected = this.grid.selected[this.grid.selected.length - 1];
            this.grid.elements.get(this.id);
        }
        else {
            const history = this.grid.selectedHistory;
            //if (this.selected && history[history.length - 1] && history[history.length - 1].length === 1) 
            if (!this.selected) {
                this.grid.unselectAll();
                this.select();
                this.play();
            }
            else
                this.client.pages.openPost(this.post);
        }
    }
    mousedown(e) {
        if (this.scaleAn)
            this.scaleAn.pause();
        this.scaleAn = anime({
            targets: this.node,
            easing: 'easeOutQuint',
            duration: 500,
            scale: 1.025
        });
        this.node.addEventListener('mouseup', this.mouseupFn);
        if (e.button === 1) {
            e.preventDefault();
        }
    }
    mouseup(e) {
        if (this.scaleAn)
            this.scaleAn.pause();
        this.scaleAn = anime({
            targets: this.node,
            easing: 'easeOutQuint',
            duration: 500,
            scale: 1.05
        });
        if (e.button === 1) {
            window.open(`https://${this.post.booru.host}/${this.post.booru._post.origin}/${this.post.id}`, '_blank');
            return false;
        }
        this.node.removeEventListener('mouseup', this.mouseupFn);
    }
    mouseenter() {
        if (this.scaleAn)
            this.scaleAn.pause();
        this.scaleAn = anime({
            targets: this.node,
            easing: 'easeOutQuint',
            duration: 800,
            scale: 1.05
        });
        this.node.addEventListener('mouseleave', this.mouseleaveFn);
        this.node.addEventListener('touchend', this.mouseleaveFn);
        this.play();
    }
    mouseleave() {
        if (this.scaleAn)
            this.scaleAn.pause();
        this.scaleAn = anime({
            targets: this.node,
            easing: 'easeOutQuint',
            duration: 500,
            scale: 1.0,
        });
        this.node.removeEventListener('mouseleave', this.mouseleaveFn);
        this.node.removeEventListener('touchend', this.mouseleaveFn);
        this.pause();
    }
}
//# sourceMappingURL=PostGridElement.js.map