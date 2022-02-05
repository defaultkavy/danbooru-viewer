import Client from "./Client.js";
import { GridPage } from "./GridPage.js";
import { PostGridElement } from "./PostGridElement.js";
import { PostPage } from "./PostPage.js";

export class KeyHandle {
    client: Client;
    constructor(client: Client) {
        this.client = client
    }

    init() {
        window.addEventListener('keydown', this.keyup.bind(this))
    }

    private keyup(e: KeyboardEvent) {
        const page = this.client.pages.history[this.client.pages.history.length - 1]
        if (page instanceof GridPage) {
            const grid = this.grid
            if (!grid) return
            switch (e.key) {
                case 'ArrowLeft':
                case 'a':
                    grid.move('PREV')
                break
    
                case 'ArrowRight':
                case 'd':
                    grid.move('NEXT')
                break
    
                case 'ArrowUp':
                case 'w':
                    if (this.client.pages.postPage.opened) return
                    grid.move('UP')
                break
                
                case 'ArrowDown':
                case 's':
                    if (this.client.pages.postPage.opened) return
                    grid.move('DOWN')
                break
    
                case ' ':
                    if (grid.selected[0]) e.preventDefault()
                    if (grid.selected[0] instanceof PostGridElement) this.client.pages.openPost(grid.selected[0].post)
                break
    
                case 'Escape':
                    if (grid.selected[0]) {
                        for (const ele of grid.selectedHistory[grid.selectedHistory.length - 1]) {
                            ele.unselect(false)
                        }
                    } else {
                        if (this.client.pages.history[1]) window.history.back()
                    }
                    if (grid.page instanceof GridPage) grid.page.detail.close()
                break
            }
        } else if (page instanceof PostPage) {
            const grid = this.grid
            if (!grid) return
            switch (e.key) {
                case 'ArrowLeft':
                case 'a':
                    grid.move('PREV')
                    if (this.client.pages.postPage.opened && grid.selected[0] instanceof PostGridElement) this.client.pages.postPage.open(grid.selected[0].post)
                break
                case 'ArrowRight':
                case 'd':
                    grid.move('NEXT')
                    if (this.client.pages.postPage.opened && grid.selected[0] instanceof PostGridElement) this.client.pages.postPage.open(grid.selected[0].post)
                break
                
                case 'Escape':
                    window.history.back()
                break
    
                case ' ':
                    if (grid.selected[0]) e.preventDefault()
                    window.history.back()
                break
            }
        }
    }

    private get grid() {
        
        const page = this.client.pages.history[this.client.pages.history.length - 1]
        if (page instanceof GridPage) {
            return page.grid
        } else if (page instanceof PostPage) {
            const lastPage = this.client.pages.history[this.client.pages.history.length - 2]
            if (lastPage && lastPage instanceof GridPage) {
                return lastPage.grid
            } else return undefined
        } else return undefined
    }
}