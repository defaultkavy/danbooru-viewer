import { Booru } from "./Booru.js";
import { Db } from "./Db.js";
import { Footer } from "./Footer.js";
import { KeyHandle } from "./KeyHandle.js";
import { Mouse } from "./Mouse.js";
import { Notifier } from "./Notifier.js";
import { Pages } from "./Pages.js";
const dan = {
    host: 'danbooru.donmai.us',
    post: {
        ext: 'file_ext',
        file_url: 'file_url',
        preview_file_url: 'preview_file_url',
        height: 'image_height',
        width: 'image_width',
        large_file_url: 'large_file_url',
        path: 'posts',
        source: 'source',
        tags: 'tag_string',
        origin: 'posts'
    },
    tag: {
        category: 'category',
        name: 'name',
        path: 'tags'
    }
};
const sfwdan = {
    host: 'safebooru.donmai.us',
    post: {
        ext: 'file_ext',
        file_url: 'file_url',
        preview_file_url: 'preview_file_url',
        height: 'image_height',
        width: 'image_width',
        large_file_url: 'large_file_url',
        path: 'posts',
        source: 'source',
        tags: 'tag_string',
        origin: 'posts'
    },
    tag: {
        category: 'category',
        name: 'name',
        path: 'tags'
    }
};
const sakuga = {
    host: 'www.sakugabooru.com',
    post: {
        ext: 'file_ext',
        file_url: 'file_url',
        preview_file_url: 'preview_url',
        height: 'jpeg_height',
        width: 'jpeg_width',
        large_file_url: 'preview_url',
        path: 'post',
        source: 'source',
        tags: 'tags',
        origin: 'post/show'
    },
    tag: {
        category: 'category',
        name: 'name',
        path: 'tag'
    }
};
export default class Client {
    constructor() {
        this.app = document.querySelector('app');
        this.booru = new Booru(this.booruChoose(), this);
        this.pages = new Pages(this);
        this.footer = new Footer(this);
        this.key = new KeyHandle(this);
        this.notifier = new Notifier(this);
        this.mouse = new Mouse();
        this.db = new Db(this);
        this.init();
        document.oncontextmenu = (e) => e.preventDefault();
    }
    init() {
        this.app.append(this.pages.homePage.node);
        this.pages.homePage.load();
        this.footer.updateLocation();
        this.key.init();
        this.pages.locationCheck();
    }
    booruChoose() {
        if (window.location.hash === '#sakuga') {
            return sakuga;
        }
        if (window.location.hash === '#danbooru') {
            return dan;
        }
        return sfwdan;
    }
}
//# sourceMappingURL=Client.js.map