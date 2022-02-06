var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Tag } from "./Tag.js";
export class Tags {
    constructor(booru, client) {
        this.client = client;
        this.booru = booru;
        this.caches = new Map();
    }
    get(names) {
        return __awaiter(this, void 0, void 0, function* () {
            let nameString = '';
            names.forEach(name => nameString += `${name} `);
            const tags = () => __awaiter(this, void 0, void 0, function* () {
                const path = `/tags.json?search[name_space]=${nameString}&limit=999`;
                const _tags = yield this.booru.get(path);
                if (!_tags) {
                    this.client.notifier.push('Post tag load failed', 5000);
                    return null;
                }
                const tags = [];
                for (const _tag of _tags) {
                    const cache = this.caches.get(_tag.id);
                    const tag = cache ? cache.refresh(_tag) : new Tag(_tag, this.booru, this.client);
                    this.caches.set(_tag.name, tag);
                    tags.push(tag);
                }
                return tags;
            });
            return tags();
        });
    }
    index(page = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            if (page < 1)
                throw new Error('page number must greater than 0');
            page = Math.floor(page);
            const path = `/tags.json?page=${page}`;
            const index = yield this.booru.get(path);
            const tags = [];
            for (const _tag of index) {
                const post = new Tag(_tag, this.booru, this.client);
                //if (!post.id) continue
                this.caches.set(_tag.id, post);
                tags.push(post);
            }
            return tags;
        });
    }
}
//# sourceMappingURL=Tags.js.map