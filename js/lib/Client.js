import { Booru } from "./Booru.js";
import { Footer } from "./Footer.js";
import { KeyHandle } from "./KeyHandle.js";
import { Mouse } from "./Mouse.js";
import { Notifier } from "./Notifier.js";
import { Pages } from "./Pages.js";
export default class Client {
    constructor() {
        //window.history.pushState(null, '', `/`)
        this.app = document.querySelector('app');
        this.footer = new Footer(this);
        this.booru = new Booru({ host: 'danbooru.donmai.us' }, this);
        this.pages = new Pages(this);
        this.key = new KeyHandle(this);
        this.notifier = new Notifier(this);
        this.mouse = new Mouse();
        this.mouseX = 0;
        this.mouseY = 0;
        this.init();
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.x;
            this.mouseY = e.y;
        });
        document.oncontextmenu = (e) => e.preventDefault();
    }
    init() {
        this.app.append(this.pages.homePage.node);
        this.pages.homePage.load();
        this.footer.updateLocation();
        this.key.init();
    }
}
//# sourceMappingURL=Client.js.map