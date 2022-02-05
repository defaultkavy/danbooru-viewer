export function animation(prop) {
    const animation = new Animation(prop);
    animation.init();
    return animation;
}
class Animation {
    constructor(prop) {
        this.target = prop.target;
        this.easing = prop.easing;
        this.delay = prop.delay;
        this.duration = prop.duration;
        this.whenFinish = prop.whenFinish;
        this.update = prop.update;
        this.interval = 10;
        this.change = prop.change;
        this.oldProperty = getComputedStyle(this.target);
    }
    init() {
        if (this.delay) {
            setTimeout(this.start.bind(this), this.delay);
        }
    }
    start() {
        this.timer = setTimeout(this.end.bind(this), this.duration);
        this.ticker = setInterval(this.tick.bind(this), this.interval);
    }
    tick() {
        if (this.update)
            this.update();
        this.play();
    }
    end() {
        if (this.whenFinish)
            this.whenFinish();
    }
    play() {
        if (!this.change)
            return;
        if (this.change.borderWidth) {
            //this.oldProperty.borderWidth / this.change.borderWidth
        }
    }
    digit(string) {
        return RegExp(/\d+/, string);
    }
}
//# sourceMappingURL=animation.js.map