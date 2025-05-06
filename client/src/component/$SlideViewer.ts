import { $Container, $Element, $Node, $Pointer, $PointerDirection, $PointerManager, type $ContainerContentType, type $ContainerEventMap, type $EventMap } from "elexis";

export class $SlideViewer extends $Container<HTMLElement, $SlideViewerEventMap> {
    pointers = new $PointerManager(this);
    $container = $('div').class('slide-container')
    slideMap = new Map<string | number, $Slide>();
    slideId: null | string | number = null;
    #pointerException?: (pointer: $Pointer, e: PointerEvent) => boolean;
    constructor() {
        super('slide-viewer');
        this.style({position: 'relative'});
        this.__build__();
        new ResizeObserver(() => {
            if (!this.inDOM()) return;
            this.__render__();
            this.trigger('resize');
        }).observe(this.dom);
    }

    protected __build__() {
        this.content([ this.$container ]);
        this.$container.style({position: 'relative', height: '100%'})
        let containerStartLeft = 0, containerLeft = 0;
        this.pointers.on('down', ($pointer, e) => {
            if (this.#pointerException) {
                if (!this.#pointerException($pointer, e)) return $pointer.delete();
            }
            containerStartLeft = this.$container.offsetLeft;
        })
        this.pointers.on('move', ($pointer, e) => {
            // threshold before start move
            if ($pointer.move_x > -20 && $pointer.move_x < 20) return;
            e.preventDefault();
            containerLeft = containerStartLeft + $pointer.move_x + ($pointer.move_x > 0 ? -20 : 20);
            if (containerLeft > containerStartLeft && this.slideList.at(0)?.slideId() === this.slideId) return;
            if (containerLeft < containerStartLeft && this.slideList.at(-1)?.slideId() === this.slideId) return;
            this.events.fire('slideMove', this.currentSlide);
            this.$container.style({left: `${containerLeft}px`});
        })
        this.pointers.on('up', ($pointer) => {
            const width = this.dom.getBoundingClientRect().width;
            const containerMove = containerStartLeft - this.$container.offsetLeft;
            if ($pointer.move_x === 0) return;
            if ($pointer.move_x < 0 && $pointer.movement_x < -2 || containerMove > width / 2) this.next();
            else if ($pointer.move_x > 0 && $pointer.movement_x > 2 || containerMove + width < width / 2) this.prev();
            else {
                containerLeft = containerStartLeft;
                this.__slideAnimate__().then(() => {
                    this.events.fire('slideBack', this.currentSlide)
                })
            }
        })
    }

    addSlides(slides: OrMatrix<$Slide>) {
        slides = $.orArrayResolve(slides);
        if (!slides.length) return;
        for (const $slide of slides) {
            if ($slide instanceof Array) this.addSlides($slide);
            else {
                this.slideMap.set($slide.slideId(), $slide);
                this.$container.insert($slide)
            }
        }
        this.__render__();
        return this;
    }

    arrange(list: (string | number)[]) {
        const newOrderedMap = new Map<string | number, $Slide>();
        list.forEach(id => {
            const $slide = this.slideMap.get(id);
            if (!$slide) return;
            newOrderedMap.set(id, $slide);
        })
        this.slideMap = newOrderedMap;
        this.__render__();
        return this;
    }

    switch(id: string | number | undefined, animation = true) {
        if (id === undefined) return this;
        const $prevSlide = this.currentSlide;
        const $nextSlide = this.slideMap.get(id);
        if (!$nextSlide) throw 'target undefined';
        if ($nextSlide.slideId() === this.slideId) return this;
        this.events.fire('beforeSwitch', {$prevSlide: this.currentSlide, $nextSlide})
        this.slideId = id;
        this.events.fire('switch', {$prevSlide, $nextSlide})
        this.__slideAnimate__(animation ? 300 : 0).then(() => {
            this.events.fire('afterSwitch', {$prevSlide, $nextSlide})
        });
        return this;
    }

    protected async __slideAnimate__(duration = 300) {
        return new Promise<void>(resolve => {
            const currentIndex = this.currentSlide ? this.slideList.indexOf(this.currentSlide) : undefined;
            if (currentIndex === undefined) return;
            const ease = Math.abs(this.getPositionLeft(currentIndex) - this.$container.offsetLeft) === this.dom.clientWidth;
            this.$container.animate({
                left: `-${this.getPositionLeft(currentIndex)}px`,
            }, {
                duration: duration,
                easing: ease ? 'ease' : 'ease-out',
                onfinish: () => {
                this.$container.style({left: `-${this.getPositionLeft(currentIndex)}px`})
                this.__render__(false);
                resolve();}
            })
        })
    }

    protected __navigation__(dir: 'next' | 'prev') {
        const currentSlide = this.currentSlide;
        const slideList = this.slideList;
        const currentIndex = currentSlide ? slideList.indexOf(currentSlide) : undefined;
        if (currentIndex === undefined) { this.switch(slideList.at(0)?.slideId()); return this }
        const targetIndex = $.call(() => {
            switch (dir) {
                case 'next': return currentIndex === slideList.length ? currentIndex : currentIndex + 1
                case 'prev': return currentIndex === 0 ? currentIndex : currentIndex -1
            }
        })
        const $targetSlide = this.slideList.at(targetIndex);
        this.switch($targetSlide?.slideId());
        return this;
    }

    next() { return this.__navigation__('next') }
    prev() { return this.__navigation__('prev') }

    get currentSlide() { return this.slideId ? this.slideMap.get(this.slideId) : undefined; }
    get slideIdList() { return Array.from(this.slideMap.keys()); }
    get slideList() { return Array.from(this.slideMap.values()); }

    protected getPositionLeft(index: number) { return index * this.dom.clientWidth }

    protected __render__(positioning = true) {
        let i = 0;
        this.slideMap.forEach($slide => {
            $slide.hide(true, false);
            $slide.style({top: '0', left: `${this.getPositionLeft(i)}px`});
            i++;
        })
        if (!this.currentSlide) return;
        const currentIndex = this.slideList.indexOf(this.currentSlide);
        this.currentSlide.build().hide(false, false);
        if (currentIndex !== 0) this.slideList.at(currentIndex - 1)?.build().hide(false, false);
        if (currentIndex !== this.slideList.length - 1) this.slideList.at(currentIndex + 1)?.build().hide(false, false);
        this.$container.children.render();
        if (positioning) this.$container.style({left: `-${this.getPositionLeft(currentIndex)}px`})
    }

    pointerException(resolver: (pointer: $Pointer, e: PointerEvent) => boolean) {
        this.#pointerException = resolver;
        return this;
    }

}

export interface $SlideViewerEventMap extends $ContainerEventMap {
    switch: [{$prevSlide?: $Slide, $nextSlide: $Slide}];
    beforeSwitch: [{$prevSlide?: $Slide, $nextSlide: $Slide}];
    afterSwitch: [{$prevSlide?: $Slide, $nextSlide: $Slide}];
    /** Slide is moving */
    slideMove: [$Slide | undefined];
    /** Slide return to origin position */
    slideBack: [$Slide | undefined]
}

export class $Slide extends $Container {
    #builder?: () => OrMatrix<$ContainerContentType>;
    builded = false;
    #slideId?: string | number;
    constructor() {
        super('slide');
        this.style({width: '100%', height: '100%', display: 'block', position: 'absolute'})
    }

    builder(builder: () => OrMatrix<$ContainerContentType>) {
        this.#builder = builder;
        return this;
    }

    build() {
        if (!this.builded && this.#builder) { 
            this.content(this.#builder());
            this.builded = true;
        }
        return this;
    }

    slideId(): string | number;
    slideId(slideId: string | number): this;
    slideId(slideId?: string | number) { return $.fluent(this, arguments, () => this.#slideId, () => this.#slideId = slideId) }
}