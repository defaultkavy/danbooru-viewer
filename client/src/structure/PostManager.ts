import { $EventManager } from "elexis";
import { Post } from "./Post";
import { Booru } from "./Booru";

export class PostManager {
    static managers = new Map<string | undefined, PostManager>();
    orderMap = new Map<id, Post>();
    cache = new Set<Post>();
    limit = 100;
    tags?: string;
    finished = false;
    events = new $EventManager<PostManagerEventMap>();
    constructor(tags?: string) {
        this.tags = tags;
        PostManager.managers.set(this.tags, this);
        Booru.events.on('set', () => {
            this.clear();
            if (this.finished) { 
                this.finished = false;
            } 
        })
    }

    static get(tags: string | undefined) {
        const manager = this.managers.get(tags) ?? new PostManager(tags);
        this.managers.set(manager.tags, manager);
        return manager;
    }

    clear() {
        this.orderMap.clear();
        this.cache.clear();
    }

    addPosts(posts: OrArray<Post>) {
        posts = $.orArrayResolve(posts);
        for (const post of posts) {
            if (!post.file_url) continue;
            if (this.cache.has(post)) continue;
            this.cache.add(post);
        }
        return this;
    }
    
    async fetchPosts(direction: 'newer' | 'older'): Promise<Post[]> {
        const generalTags: string[] = [];
        const orderTags: string[] = [];
        let limit: number = this.limit;
        let posts: Post[] = [];
        for (const tag of this.tag_list) {
            if (tag.startsWith('ordfav:')) orderTags.push(tag);
            else if (tag.startsWith('order:')) orderTags.push(tag);
            else if (tag.startsWith('limit:')) limit = Number(tag.split(':')[1]);
            else generalTags.push(tag);
        }
        if (orderTags.length) {
            if (orderTags.length > 1) {
                this.events.fire('post_error', `Error: These query can't be used together [${orderTags}].`)
                return [];
            }
            const orderTag = orderTags[0];
            if (orderTag.startsWith('ordfav:')) {
                const username = orderTag.split(':')[1];
                const match_tags = generalTags.length ? `&search[post_tags_match]=${generalTags.toString().replaceAll(',', '+')}` : '';
                const beforeAfter = this.orderKeyList.length ? direction === 'newer' ? `&search[id]=>${this.orderKeyList.at(0)}` : `&search[id]=<${this.orderKeyList.at(-1)}` : undefined;
                const favoritesDataList = await Booru.used.fetch<FavoritesData[]>(`/favorites.json?search[user_name]=${username}${beforeAfter ?? ''}${match_tags}&limit=${limit}`);
                posts = await Post.fetchMultiple(Booru.used, {tags: `id:${favoritesDataList.map(data => data.post_id).toString()}`}, limit);
                const newPostOrderMap = new Map();
                for (const fav of favoritesDataList) {
                    const post = posts.find(post => post.id === fav.post_id);
                    if (!post) continue;
                    if (!post.file_url) continue;
                    newPostOrderMap.set(fav.id, post);
                }
                this.orderMap = new Map(direction === 'newer' ? [...newPostOrderMap, ...this.orderMap] : [...this.orderMap, ...newPostOrderMap]);
                this.events.fire('post_fetch', {manager: this, postList: posts});
            }

            if (orderTag.startsWith('order:')) {
                const page = this.orderKeyList.length ? direction === 'newer' ? 1 : (this.orderMap.size / limit) + 1 : undefined;
                posts = await Post.fetchMultiple(Booru.used, {tags: this.tags}, limit, page);
                const newPostOrderMap = new Map(posts.filter(post => post.file_url).map(post => [post.id, post]));
                newPostOrderMap.forEach((post, id) => { if (this.orderMap.has(id)) newPostOrderMap.delete(id) });
                this.orderMap = new Map(direction === 'newer' ? [...newPostOrderMap, ...this.orderMap] : [...this.orderMap, ...newPostOrderMap])
                this.events.fire('post_fetch', {manager: this, postList: posts});
            }
        } else {
            const beforeAfter = this.orderKeyList.length ? direction === 'newer' ? `a${this.orderKeyList.at(0)}` : `b${this.orderKeyList.at(-1)}` : undefined;
            posts = await Post.fetchMultiple(Booru.used, {tags: this.tags}, limit, beforeAfter);
            const newPostOrderMap = new Map(posts.filter(post => post.file_url).map(post => [post.id, post]));
            this.orderMap = new Map(direction === 'newer' ? [...newPostOrderMap, ...this.orderMap] : [...this.orderMap, ...newPostOrderMap])
        }
        if (!posts.length && direction === 'older') {
            this.finished = true;
            if (!this.cache.size) this.events.fire('noPost');
            else this.events.fire('endPost')
        }

        this.events.fire('post_fetch', {manager: this, postList: posts});
        this.addPosts(posts);
        return posts
    }

    get orderKeyList() { return [...this.orderMap.keys()]}
    get tag_list() { return this.tags ? decodeURIComponent(this.tags).split('+') : [] }
}

interface PostManagerEventMap {
    startLoad: [];
    noPost: [];
    endPost: [];
    post_error: [message: string];
    post_fetch: [{manager: PostManager, postList: Post[]}];
}

interface FavoritesData {
    id: id;
    post_id: id;
    user_id: id;
}