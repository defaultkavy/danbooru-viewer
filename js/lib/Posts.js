var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Post } from "./Post.js";
export class Posts {
    constructor(booru, client) {
        this.client = client;
        this.booru = booru;
        this.caches = new Map();
    }
    get(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const newPost = () => __awaiter(this, void 0, void 0, function* () {
                const path = `/${this.booru._post.path}/${id}.json`;
                const _post = yield this.booru.get(path);
                const cache = this.caches.get(id);
                const post = cache ? cache : new Post(_post, this.booru, this.client);
                this.caches.set(id, post);
                this.sort();
                return post;
            });
            return newPost();
        });
    }
    index(page = 1, post) {
        return __awaiter(this, void 0, void 0, function* () {
            if (page < 1)
                throw new Error('page number must greater than 0');
            page = Math.floor(page);
            const path = `/${this.booru._post.path}.json?${post ? `post[${post.param}]=${post.value}&` : ''}page=${page}&limit=40`;
            if (page === 1)
                this.client.footer.push(`Getting newest information...`);
            else
                this.client.footer.push(`Getting page ${page} information...`);
            const index = yield this.booru.get(path);
            if (!index) {
                if (page === 1)
                    this.client.footer.push(`Updated.`);
                else
                    this.client.footer.push(`Lastest post.`);
                return undefined;
            }
            const posts = [];
            for (const _post of index) {
                if (this.caches.has(_post.id))
                    continue;
                const booruCache = this.booru.posts.caches.get(_post.id);
                const post = new Post(_post, this.booru, this.client);
                if (!post.id)
                    continue;
                this.client.footer.push(`Loading post: ${_post.id}...`);
                if (!booruCache)
                    this.booru.posts.caches.set(_post.id, post);
                this.caches.set(_post.id, post);
                posts.push(post);
                this.client.footer.push(`Loaded post: ${_post.id}`);
            }
            this.sort();
            //this.booru.posts.sort()
            let buffer = 0;
            for (let i = 0; i < posts.length; i++) {
                if (i % 10 === 0) {
                    yield posts[i].fetchTags().then(() => buffer = 0);
                }
                else {
                    posts[i].fetchTags().then(() => buffer += 1);
                }
                this.client.footer.push(`Loading tags (${i + 1}/${posts.length})`);
            }
            this.client.footer.push(`Loaded posts: ${posts.length}.`);
            return posts;
        });
    }
    get array() {
        return Array.from(this.caches.values());
    }
    get latest() {
        return this.array.sort((a, b) => b.id - a.id)[0];
    }
    sort() {
        const arr = this.array;
        arr.sort((a, b) => b.id - a.id);
        this.caches.clear();
        arr.forEach(post => this.caches.set(post.id, post));
    }
    // unuse
    getTags(posts) {
        return __awaiter(this, void 0, void 0, function* () {
            const _tagArray = [];
            for (const post of posts) {
                const _tags = post.data.tag_string.split(' ');
                for (const _tag of _tags) {
                    if (_tagArray.includes(_tag))
                        continue;
                    _tagArray.push(_tag);
                }
            }
            return yield this.booru.tags.get(_tagArray);
        });
    }
}
//# sourceMappingURL=Posts.js.map