var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Tags } from "./Tags.js";
export class Post {
    constructor(post, booru, client) {
        this.client = client;
        this.booru = booru;
        this.id = post.id;
        this.data = post;
        this.height = post[booru._post.height];
        this.width = post[booru._post.width];
        this.file_url = post[booru._post.file_url];
        this.large_file_url = post[booru._post.large_file_url];
        this.preview_file_url = post[booru._post.preview_file_url];
        this.tags = new Tags(booru, client);
        this.source = post[booru._post.source];
        this.ext = post[booru._post.ext];
    }
    fetch() {
        this.booru.posts.get(this.id);
    }
    fetchTags() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.tags.get(this.tagsArray);
        });
    }
    get tagsArray() {
        return this.data[this.booru._post.tags].split(' ');
    }
    get ratio() {
        return this.width / this.height;
    }
    get isLandscape() {
        return this.ratio > 1 ? true : false;
    }
}
//# sourceMappingURL=Post.js.map