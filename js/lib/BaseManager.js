export class BaseManager {
    constructor(booru, client) {
        this.client = client;
        this.booru = booru;
        this.caches = new Map();
    }
    get array() {
        return Array.from(this.client.booru.posts.caches.values());
    }
}
//# sourceMappingURL=BaseManager.js.map