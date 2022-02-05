import anime from "../plugin/anime.js";
import { GridElement } from "./GridElement.js";
export class PostGridElement extends GridElement {
    constructor(post, parent, element, client) {
        super({ height: post.height, width: post.width }, parent, element, client);
        this.id = post.id;
        this.post = post;
        this.img = document.createElement('img');
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
    loadImage() {
        //Array.from(this.node.children).forEach(child => this.node.removeChild(child))
        this.img.src = this.post.large_file_url;
        this.img.width = this.post.width;
        this.img.height = this.post.height;
        this.node.append(this.img);
    }
    click(e) {
        if (e.ctrlKey) {
            this.select();
        }
        else if (e.shiftKey) {
            const lastSelected = this.grid.selected[this.grid.selected.length - 1];
            this.grid.elements.get(this.id);
        }
        else {
            if (this.grid.selectedHistory[0])
                for (const ele of this.grid.selectedHistory[this.grid.selectedHistory.length - 1]) {
                    if (ele !== this)
                        ele.unselect(false);
                }
            if (!this.selected)
                this.select();
            else {
                this.client.pages.openPost(this.post);
            }
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
            window.open(`https://${this.client.booru.host}/posts/${this.post.id}`, '_blank');
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
    }
}
//# sourceMappingURL=PostGridElement.js.map