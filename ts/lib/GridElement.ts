import anime from "../plugin/anime.js";
import { removeArrayItem } from "../plugin/extension.js";
import Client from "./Client.js";
import { Grid } from "./Grid.js";
import { GridPage } from "./GridPage.js";
import { PostGridElement } from "./PostGridElement.js";

export class GridElement {
    client: Client;
    node: HTMLElement;
    height: number;
    width: number;
    grid: Grid;
    ratio: number;
    order: number;
    borderAn?: anime.AnimeInstance;
    selected: boolean;
    #onselect?: () => any
    constructor(_ele: _GridElement, grid: Grid, element: HTMLElement, client: Client) {
        this.client = client
        this.node = element
        this.order = 0
        this.grid = grid
        this.height = _ele.height
        this.width = _ele.width
        this.ratio = _ele.width / _ele.height
        this.selected = false
    }

    setOrder(order: number) {
        this.order = order
        this.node.dataset.order = `${order}`
    }

    select() {
        this.grid.selected.push(this)
        this.grid.selectedHistory.push([...this.grid.selected])
        this.selected = true
        if (this.borderAn) this.borderAn.pause()
        this.borderAn = anime({
            targets: this.node,
            easing: 'easeOutQuint',
            duration: 200,
            backgroundColor: '#44e3f8',
            borderColor: '#44e3f8',
            borderWidth: 5
        })

        if (this instanceof PostGridElement) {
            if (this.grid.page instanceof GridPage) {
                this.grid.page.detail.open(this.postOnly(this.grid.selectedHistory[this.grid.selectedHistory.length - 1]))
            }
        }

        if (this.#onselect) this.#onselect()
    }

    unselect(record: boolean = true) {
        removeArrayItem(this.grid.selected, this)
        this.selected = false
        if (record) this.grid.selectedHistory.push([...this.grid.selected])
        if (this.borderAn) this.borderAn.pause()
        this.borderAn = anime({
            targets: this.node,
            easing: 'easeOutQuint',
            duration: 100,
            backgroundColor: '#505050',
            borderColor: '#505050',
            borderWidth: 0
        })
    }

    postOnly(elements: GridElement[]): PostGridElement[] {
        return elements.filter(ele => ele instanceof PostGridElement) as PostGridElement[]
    }

    set onselect(fn: () => any) {
        this.#onselect = fn
    }
}

export interface _GridElement {
    height: number
    width: number
}