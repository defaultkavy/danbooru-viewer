export class Page {
    constructor(_page, node, client) {
        this.client = client;
        this.node = node;
        this.url = _page.url;
        this.title = _page.title;
        this.scrollTop = 0;
        this.node.addEventListener('scroll', () => {
            this.scrollTop = this.node.scrollTop;
        });
    }
    close() {
        this.node.remove();
    }
    unachived() {
        this.client.app.append(this.node);
    }
}
//# sourceMappingURL=Page.js.map