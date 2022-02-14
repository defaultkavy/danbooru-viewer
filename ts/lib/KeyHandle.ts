import Client from "./Client.js";
import { GridPage } from "./GridPage.js";
import { OptionsPage } from "./OptionsPage.js";
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
        if (e.key === 'Tab' || e.key === '`') e.preventDefault()
        if (page instanceof GridPage) {
            const grid = this.grid
            if (!grid) return
            const postElement = grid.selected[0] 
            // Normal 
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
    
                case 'Enter':
                case ' ':
                    if (grid.selected[0]) e.preventDefault()
                    
                    // Open source in new tab
                    if (postElement instanceof PostGridElement) {
                        if (e.shiftKey && e.ctrlKey) {
                            if (e.key === ' ') open(postElement.post.file_url, 'blank')
                            return
                        }
                        else if (e.shiftKey) {
                            if (e.key === ' ') open(postElement.post.source, '_blank')
                            return
                        } else if (e.ctrlKey) {
                            if (e.key === ' ') open(`https://${postElement.post.booru.host}/${postElement.post.booru._post.origin}/${postElement.post.id}`, '_blank')
                            return
                        } else {
                            this.client.pages.openPost(postElement.post)
                        }
                    }
                break
    
                case 'Escape':
                    if (grid.selected[0]) {
                        const selected = [...grid.selected]
                        for (const ele of selected) {
                            ele.unselect(false)
                        }
                    } else {
                        if (this.client.pages.history[1]) window.history.back()
                    }
                    if (grid.page instanceof GridPage) grid.page.detail.close(true)
                break

                case 'Tab':
                    if (grid.selected[0] && grid.selected.length === 1 && grid.page instanceof GridPage) {
                        if (grid.page.detail.slided === window.innerHeight / 2) grid.page.detail.slide(120)
                        else grid.page.detail.slide(window.innerHeight / 2)
                    }
                break

                case '`':
                    this.client.pages.openOptions()
                break

                case 'f':
                    if (grid.selected[0]) this.client.db.fav(grid.selected[0].postOnly(grid.selected)[0].post)
                break;
            }
        } else if (page instanceof PostPage) {
            const grid = this.grid
            if (!grid) return
            if (e.shiftKey) {
                switch (e.key) {
                    case 'ArrowLeft':
                    case "W":
                        page.viewer.move('UP')
                    break;
                    case 'ArrowRight':
                    case "S":
                        page.viewer.move('DOWN')
                    break;
                    case 'ArrowLeft':
                    case "A":
                        page.viewer.move('LEFT')
                    break;
                    case 'ArrowRight':
                    case "D":
                        page.viewer.move('RIGHT')
                    break;
                }

                return
            }
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

                case 'w':
                    page.highres()
                    page.viewer.zoom(1.2, false)
                break;

                case 's':
                    page.viewer.zoom(0.8, false)
                break;

                case 'r':
                    page.viewer.imageInit()
                break;
                
                case 'Escape':
                    window.history.back()
                break
    
                case 'Enter':
                case ' ':
                    if (grid.selected[0]) e.preventDefault()
                    // Open source in new tab
                    if (e.shiftKey && e.ctrlKey) {
                        if (page.post) open(page.post.file_url, 'blank')
                        return
                    }
                    else if (e.shiftKey) {
                        if (page.post) open(page.post.source, '_blank')
                        return
                    } else if (e.ctrlKey) {
                        if (page.post) open(`https://${page.post.booru.host}/${page.post.booru._post.origin}/${page.post.id}`, '_blank')
                        return
                    }
                    window.history.back()
                break

                case '`':
                    window.history.back()
                break
            }
        }
        if (page instanceof OptionsPage) {
            switch (e.key) {
                case '`':
                case 'Escape':
                    e.preventDefault()
                    window.history.back()
                break;

                case 'Enter':
                    e.preventDefault()
                    if (page.search.tagPanel.tags[0]) this.client.pages.openTag(page.search.tagPanel.tags[0].name)
                break;
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