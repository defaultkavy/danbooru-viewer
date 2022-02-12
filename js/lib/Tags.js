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
                const path = `/${this.booru._tag.path}.json?search[name_space]=${nameString}&limit=999`;
                const _tags = yield this.booru.get(path);
                if (!_tags) {
                    this.client.notifier.push('Post tag load failed', 5000);
                    return null;
                }
                const tags = [];
                for (const _tag of _tags) {
                    const get = this.booru.tags.caches.get(_tag.name);
                    if (get) {
                        this.caches.set(_tag.name, get);
                        tags.push(get);
                        continue;
                    }
                    const cache = this.caches.get(_tag.name);
                    const tag = cache ? cache.refresh(_tag) : new Tag(_tag, this.booru, this.client);
                    this.caches.set(_tag.name, tag);
                    tags.push(tag);
                }
                return tags;
            });
            return tags();
        });
    }
    search(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const path = `/${this.booru._tag.path}.json?search[fuzzy_name_matches]=${name}&search[hide_empty]=true&search[order]=similarity&limit=999`;
            this.client.footer.push(`Searching ${name}...`);
            const _tags = yield this.booru.get(path);
            if (!_tags) {
                this.client.notifier.push('Search tag load failed', 5000);
                return null;
            }
            const tags = [];
            for (const _tag of _tags) {
                const get = this.booru.tags.caches.get(_tag.name);
                if (get) {
                    this.caches.set(_tag.name, get);
                    tags.push(get);
                    continue;
                }
                const cache = this.caches.get(_tag.name);
                const tag = cache ? cache.refresh(_tag) : new Tag(_tag, this.booru, this.client);
                this.caches.set(_tag.name, tag);
                if (!get)
                    this.booru.tags.caches.set(_tag.name, tag);
                tags.push(tag);
            }
            this.client.footer.push(`Searched ${name}`);
            return tags;
        });
    }
    get array() {
        return Array.from(this.caches.values());
    }
}
//# sourceMappingURL=Tags.js.map