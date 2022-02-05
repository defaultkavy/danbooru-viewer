import Client from "./Client.js";
import { Notify } from "./Notify.js";

export class Notifier {
    client: Client;
    node: HTMLElement;
    caches: Map<string, Notify>
    constructor(client: Client) {
        this.client = client
        this.node = document.createElement('booru-notify')
        this.caches = new Map

        this.client.app.append(this.node)
    }

    push(content: string, duration?: number) {
        const notify = new Notify({content: content, duration: duration}, this.client)
        
    }
}

export interface _Notify {
    content: string
    duration?: number
}