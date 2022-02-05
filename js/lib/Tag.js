export class Tag {
    constructor(_tag, booru, client) {
        this.client = client;
        this.booru = booru;
        this.name = _tag.name;
        this.category = _tag.category;
        this.data = _tag;
    }
    refresh(_tag) {
        this.data = _tag;
        return this;
    }
}
//# sourceMappingURL=Tag.js.map