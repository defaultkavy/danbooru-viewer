import anime from "../plugin/anime.js";
export class Notify {
    constructor(_notify, client) {
        this.client = client;
        this.node = document.createElement('this.node-element');
        this.content = _notify.content;
        this.duration = _notify.duration;
    }
    init() {
        this.node.style.marginTop = `-${this.node.offsetHeight + 80}px`;
        this.node.innerText = this.content;
        this.node.append(this.node);
        if (this.duration) {
            setInterval(() => {
                this.node.remove();
                this.client.notifier.caches.delete(this.content);
            }, this.duration);
        }
        anime({
            targets: this.node,
            easing: 'easeOutQuint',
            duration: 1000,
            marginTop: 20
        });
    }
}
//# sourceMappingURL=Notify.js.map