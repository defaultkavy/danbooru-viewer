import { Page } from "./Page.js";
export class DetailPage extends Page {
    constructor(_page, client) {
        super(_page, client);
    }
    open(post) {
        if (!this.client.app)
            throw new Error('app missing');
        this.block = document.createElement('booru-detail');
        this.client.app.appendChild(this.block);
    }
}
//# sourceMappingURL=Viewer.js.map