import { Notify } from "./Notify.js";
export class Notifier {
    constructor(client) {
        this.client = client;
        this.node = document.createElement('booru-notify');
        this.caches = new Map;
        this.client.app.append(this.node);
    }
    push(content, duration) {
        const notify = new Notify({ content: content, duration: duration }, this.client);
    }
}
//# sourceMappingURL=Notifier.js.map