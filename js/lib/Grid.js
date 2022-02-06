import anime from "../plugin/anime.js";
import { Post } from "./Post.js";
import { PostGridElement } from "./PostGridElement.js";
export class Grid {
    constructor(items, grid, page, client) {
        this.client = client;
        this.node = grid;
        this.items = items;
        this.page = page;
        this.elements = new Map();
        this.selected = [];
        this.selectedHistory = [];
        this.elementMaxWidth = 400;
        this.columns = [];
        this.scrollTop = this.page.node.scrollTop;
        this.columnCount = 0;
    }
    init(columnCount) {
        if (this.columnCount === columnCount)
            return; // improve performence
        this.columnCount = columnCount;
        if (!this.node.isConnected)
            return;
        this.scrollTop = this.page.node.scrollTop;
        Array.from(this.node.children).forEach(child => child.remove());
        this.columns = [];
        // create column
        for (let i = 0; i < columnCount; i++) {
            this.columns[i] = document.createElement('grid-column');
            this.node.appendChild(this.columns[i]);
        }
        this.refresh(true);
    }
    insert(element) {
        const columns = Array.from(this.node.children);
        // Get shortest column
        const shortest = columns.sort((a, b) => {
            const ah = a.offsetHeight;
            const bh = b.offsetHeight;
            return ah - bh;
        })[0];
        shortest.append(element.node);
    }
    /**
     * @param force prevent page scroll to top
     */
    refresh(force = false) {
        if (force)
            this.elements.forEach(ele => ele.node.remove());
        const elements = [];
        for (const item of this.items) {
            if (item instanceof Post) {
                const element = this.elements.get(item.id) ? this.elements.get(item.id) : new PostGridElement(item, this, document.createElement('grid-element'), this.client);
                if (!(element instanceof PostGridElement))
                    continue;
                element.setOrder(this.items.indexOf(item));
                if (!force && this.elements.get(item.id))
                    continue;
                this.elements.set(item.id, element);
                this.insert(element);
                elements.push(element);
            }
        }
        if (force)
            this.page.node.scrollTo(0, this.scrollTop);
        return elements;
    }
    update(items = this.items, force = false) {
        this.items = items;
        return this.refresh(force);
    }
    move(control) {
        if (this.selected[0]) {
            const lastSelected = this.selected[this.selected.length - 1];
            // Check if user selected first element
            this.unselectAll();
            if (control === 'NEXT' || control === 'PREV') {
                if (this.sort[0] === lastSelected && control === 'PREV')
                    return;
                if (this.sort[this.sort.length - 1] === lastSelected && control === 'NEXT')
                    return;
                lastSelected.unselect(false);
                const newSelect = this.sort.filter(ele => {
                    const next = ele.order === lastSelected.order + 1;
                    const prev = ele.order === lastSelected.order - 1;
                    return control === 'NEXT' ? next : prev;
                })[0];
                if (!newSelect)
                    return;
                this.focus(newSelect);
                newSelect.select();
            }
            else {
                const column = lastSelected.node.parentElement;
                if (!column)
                    throw new Error('column missing');
                const columnChildren = Array.from(column.children);
                const index = columnChildren.indexOf(lastSelected.node);
                if (control === 'UP' && index === 0)
                    return;
                if (control === 'DOWN' && index === columnChildren.length - 1)
                    return;
                lastSelected.unselect(false);
                const newSelect = this.sort.filter(ele => {
                    const up = columnChildren[index - 1];
                    const down = columnChildren[index + 1];
                    return control === 'UP' ? ele.node === up : ele.node === down;
                })[0];
                if (!newSelect)
                    return;
                this.focus(newSelect);
                newSelect.select();
            }
        }
        else {
            if (this.selectedHistory[0]) {
                const oldSeleted = this.selectedHistory[this.selectedHistory.length - 1];
                oldSeleted[oldSeleted.length - 1].select();
            }
            else
                this.sort[0].select();
        }
    }
    focus(element, force = false) {
        const btmLimit = this.node.offsetHeight - window.innerHeight;
        const checkTop = () => element.node.offsetTop - 200 < 0;
        const checkBtm = () => element.node.offsetTop - 200 > btmLimit;
        const top = checkTop() ? 0 : checkBtm() ? btmLimit : element.node.offsetTop - 200;
        const btm = element.node.offsetTop + element.node.offsetHeight;
        if (force) {
            scroll.call(this);
        }
        else {
            if (this.page.node.scrollTop > top || this.page.node.scrollTop + window.innerHeight < btm) {
                scroll.call(this);
            }
        }
        function scroll() {
            const scroll = {
                y: this.page.node.scrollTop
            };
            this.page.scrollAn = anime({
                targets: scroll,
                easing: 'easeOutQuint',
                duration: 1000,
                y: top,
                update: () => {
                    this.page.node.scrollTo(0, scroll.y);
                }
            });
        }
    }
    unselectAll() {
        const selected = [...this.selected];
        this.selectedHistory.push(selected);
        if (selected)
            for (const ele of selected) {
                ele.unselect(false);
            }
    }
    get array() {
        return Array.from(this.elements.values());
    }
    get sort() {
        return this.array.sort((a, b) => {
            return a.order - b.order;
        });
    }
}
//# sourceMappingURL=Grid.js.map