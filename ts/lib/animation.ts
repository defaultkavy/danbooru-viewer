export function animation(prop: animation_property) {
    const animation = new Animation(prop)
    animation.init()
    return animation
}

class Animation {
    target: HTMLElement;
    easing?: Easing;
    delay?: number;
    duration: number;
    whenFinish?: () => void;
    update?: () => void;
    timer?: NodeJS.Timer;
    ticker? : NodeJS.Timer
    interval: number;
    change?: Animationable
    oldProperty: CSSStyleDeclaration;
    constructor(prop: animation_property) {
        this.target = prop.target
        this.easing = prop.easing
        this.delay = prop.delay
        this.duration = prop.duration
        this.whenFinish = prop.whenFinish
        this.update = prop.update
        this.interval = 10
        this.change = prop.change
        this.oldProperty = getComputedStyle(this.target)
    }

    init() {
        if (this.delay) {
            setTimeout(this.start.bind(this), this.delay)
        }
    }

    start() {
        this.timer = setTimeout(this.end.bind(this), this.duration)
        this.ticker = setInterval(this.tick.bind(this), this.interval)
    }

    tick() {
        if (this.update) this.update()
        this.play()
    }

    end() {
        if (this.whenFinish) this.whenFinish()
    }

    play() {
        if (!this.change) return
        if (this.change.borderWidth) {
            //this.oldProperty.borderWidth / this.change.borderWidth
        }
    }

    digit(string: string) {
        return RegExp(/\d+/, string)
    }
}

interface animation_property {
    target: HTMLElement,
    easing?: Easing,
    delay?: number,
    duration: number,
    whenFinish?: () => void,
    update?: () => void,
    change: Animationable
}

interface Easings {
    easeInElastic(a: any, b: any): any;
    easeInOutElastic(b: any, c: any): any;
    easeOutElastic(b: any, c: any): any;
    easeInBack(h: any): any;
    easeInCirc(h: any): any;
    easeInCubic(h: any): any;
    easeInExpo(h: any): any;
    easeInOutBack(h: any): any;
    easeInOutCirc(h: any): any;
    easeInOutCubic(h: any): any;
    easeInOutExpo(h: any): any
    easeInOutQuad(h: any): any;
    easeInOutQuart(h: any): any;
    easeInOutQuint(h: any): any;
    easeInOutSine(h: any): any;
    easeInQuad(h: any): any;
    easeInQuart(h: any): any;
    easeInQuint(h: any): any;
    easeInSine(h: any): any;
    easeOutBack(h: any): any;
    easeOutCirc(h: any): any;
    easeOutCubic(h: any): any;
    easeOutExpo(h: any): any;
    easeOutQuad(h: any): any;
    easeOutQuart(h: any): any;
    easeOutQuint(h: any): any;
    easeOutSine(h: any): any;
}

export type Easing =
  'easeInSine' |
  'easeOutSine' |
  'easeInOutSine' |
  'easeInCirc' |
  'easeOutCirc' |
  'easeInOutCirc' |
  'easeInElastic' |
  'easeOutElastic' |
  'easeInOutElastic' |
  'easeInBack' |
  'easeOutBack' |
  'easeInOutBack' |
  'easeInBounce' |
  'easeOutBounce' |
  'easeInOutBounce' |
  'easeInQuad' |
  'easeOutQuad' |
  'easeInOutQuad' |
  'easeInCubic' |
  'easeOutCubic' |
  'easeInOutCubic' |
  'easeInQuart' |
  'easeOutQuart' |
  'easeInOutQuart' |
  'easeInQuint' |
  'easeOutQuint' |
  'easeInOutQuint' |
  'easeInExpo' |
  'easeOutExpo' |
  'easeInOutExpo' |
  'linear' |
  [number, number, number, number];

  export interface Animationable {
    borderWidth?: number
    borderRadius?: number
    borderColor?: string
  }