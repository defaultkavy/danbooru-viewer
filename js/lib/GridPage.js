var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Detail } from "./Detail.js";
import { Grid } from "./Grid.js";
import { Page } from "./Page.js";
import { Posts } from "./Posts.js";
export class GridPage extends Page {
    constructor(_gridPage, client) {
        super(_gridPage, document.createElement('booru-page'), client);
        this.search = _gridPage.search;
        this.posts = new Posts(this.client.booru, this.client);
        this.elements = this.posts.array;
        this.grid = new Grid(this.elements, document.createElement('booru-grid'), this, this.client);
        this.detail = new Detail(this, client);
        this.update_interval = 10000;
        this.update_count = 0; // auto update images count
        this.page_count = 1;
        this.latestPost = undefined;
        this.buffering = false; // image loading
        this.scrollFn = this.scroll.bind(this);
        window.addEventListener('resize', this.resize.bind(this));
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            this.node.appendChild(this.grid.node);
            this.resize();
            yield this.getImages();
            // Generate grid
            this.setAutoUpdate();
            window.addEventListener('scroll', this.scrollFn);
        });
    }
    close() {
        this.unsetAutoUpdate();
        window.removeEventListener('scroll', this.scrollFn);
        this.node.remove();
    }
    update(times = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            const posts = yield this.posts.index(times, this.search);
            if (!posts)
                return this.client.notifier.push('update posts failed.', 3000);
            const newestPost = this.posts.array.pop();
            if (!this.latestPost || !newestPost)
                throw new Error("update posts failed");
            posts.forEach(post => {
                this.update_count + 1;
                if (this.update_count >= 40) {
                    this.update_count = 0;
                    this.page_count + 1;
                }
            });
            if (newestPost.id - this.latestPost.id >= 40) {
                this.update(times + 1);
                return;
            }
            this.latestPost = this.posts.latest;
            this.grid.update(this.posts.array, true);
            this.client.footer.updateCounter(this);
        });
    }
    getImages() {
        return __awaiter(this, void 0, void 0, function* () {
            this.buffering = true;
            // Get newest booru images
            yield this.posts.index(this.page_count, this.search);
            this.page_count += 2;
            this.latestPost = this.posts.latest;
            this.grid.update(this.posts.array).forEach(ele => ele.onselect = this.eleOnselect.bind(this));
            this.buffering = false;
            this.client.footer.updateCounter(this);
        });
    }
    setAutoUpdate() {
        // Update every interval
        if (this.update_ticker)
            return; // prevent scrolling re-trigger
        this.update_ticker = setInterval(this.update.bind(this), this.update_interval);
    }
    unsetAutoUpdate() {
        if (!this.update_ticker)
            return;
        clearInterval(this.update_ticker);
        this.update_ticker = undefined;
    }
    scroll() {
        return __awaiter(this, void 0, void 0, function* () {
            const y = window.scrollY;
            // Auto load images when scoll to btm
            if (y > this.grid.node.clientHeight - window.innerHeight * 2) {
                if (!this.buffering)
                    yield this.getImages();
            }
            // disable auto update images
            if (y > 0) {
                this.unsetAutoUpdate();
            }
            if (y === 0) {
                this.setAutoUpdate();
            }
        });
    }
    resize() {
        const elementMax = this.node.getBoundingClientRect().width < 500 ? 200 : 300;
        const columnsCount = Math.round(this.node.getBoundingClientRect().width / elementMax);
        this.grid.init(columnsCount);
    }
    eleOnselect() {
        this.client.footer.updateCounter(this);
        this.client.footer.updateDlButton(this);
        this.client.footer.updateDimension(this);
    }
}
//# sourceMappingURL=GridPage.js.map