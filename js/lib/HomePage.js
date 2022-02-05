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
export class HomePage extends Page {
    constructor(client) {
        super(document.createElement('booru-home'), client);
        this.grid = new Grid(client.booru.posts.array, document.createElement('booru-grid'), this, this.client);
        this.detail = new Detail(this, client);
        this.update_interval = 10000;
        this.update_count = 0; // auto update images count
        this.page_count = 1;
        this.latestPost = undefined;
        this.buffering = false; // image loading
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            this.client.app.append(this.node);
            this.node.appendChild(this.grid.node);
            yield this.getImages();
            // Generate grid
            this.update();
            this.setAutoUpdate();
            window.addEventListener('scroll', (ev) => __awaiter(this, void 0, void 0, function* () {
                const y = window.scrollY;
                // Auto load images when scoll to btm
                //console.log(y, document.body.offsetHeight - window.innerHeight - 1000)
                if (y > document.body.offsetHeight - window.innerHeight * 2) {
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
            }));
        });
    }
    update(times = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            const posts = yield this.client.booru.posts.index(times);
            const newestPost = this.client.booru.posts.array.pop();
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
            this.latestPost = this.client.booru.posts.latest;
            this.grid.update(this.client.booru.posts.array, true);
        });
    }
    getImages() {
        return __awaiter(this, void 0, void 0, function* () {
            this.buffering = true;
            // Get newest booru images
            yield this.client.booru.posts.index(this.page_count);
            this.page_count += 2;
            this.latestPost = this.client.booru.posts.latest;
            this.grid.update(this.client.booru.posts.array);
            this.buffering = false;
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
}
//# sourceMappingURL=HomePage.js.map