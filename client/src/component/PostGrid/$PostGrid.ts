import { $Layout, type $LayoutEventMap } from "@elexis.js/layout";
import { Booru } from "../../structure/Booru";
import { Post } from "../../structure/Post";
import { $PostTile } from "../PostTile/$PostTile";
import { $Input } from "elexis/lib/node/$Input";
import { PostManager } from "../../structure/PostManager";
import { $Container } from "elexis";

interface $PostGridOptions {
    tags?: string
}
export class $PostGrid extends $Layout {
    $postMap = new Map<Post, $PostTile>();
    tags?: string;
    $focus = $.focus();
    posts: PostManager;
    constructor(options?: $PostGridOptions) {
        super();
        this.tags = options?.tags;
        this.posts = PostManager.get(this.tags);
        this.addStaticClass('post-grid');
        this.type('waterfall').gap(10);
        this.init();
    }

    protected async init() {
        this.posts.events.on('post_fetch', (posts) => { this.renderPosts() })
        
        const timer = setInterval(async () => { 
            if (this.posts.tag_list.includes('order:random')) return clearInterval(timer);
            if (this.inDOM() && document.documentElement.scrollTop === 0) await this.posts.fetchPosts('newer'); 
        }, 10000);
        Booru.events.on('set', () => {
            this.removeAll();
            this.loader();
        })
        this.on('resize', () => this.resize())
        // this.on('afterRender', () => {
        //     this.$focus.currentLayer?.focus(this.$focus.currentLayer.currentFocus);
        // })
        this.loader();
        this.$focus.layer(100).loop(false).scrollThreshold($.rem(2) + 60);

        $.keys($(window))
            .if(e => {
                if (!this.inDOM()) return;
                if ($(e.target) instanceof $Input) return; 
                return true;
            })
            .keydown(['w', 'W'], e => { e.preventDefault(); this.$focus.up(); })
            .keydown(['s', 'S'], e => { e.preventDefault(); this.$focus.down(); })
            .keydown(['d', 'D'], e => { e.preventDefault(); this.$focus.right(); })
            .keydown(['a', 'A'], e => { e.preventDefault(); this.$focus.left(); })
            .keydown([' ', 'Enter'], e => {
                e.preventDefault();
                const focused = this.$focus.currentLayer?.currentFocus;
                if (focused instanceof $PostTile) $.open(focused.url);
            })
            .keydown(['Escape'], e => { e.preventDefault(); this.$focus.blur(); })
    }

    protected async loader() {
        if (!this.inDOM()) return setTimeout(() => this.loader(), 100);;
        while (this.inDOM() && document.documentElement.scrollHeight <= innerHeight * 2) {
            const posts = await this.posts.fetchPosts('older');
            if (!posts.length) return;
        }
        if (document.documentElement.scrollTop + innerHeight > document.documentElement.scrollHeight - innerHeight * 2) {
            const posts = await this.posts.fetchPosts('older');
            if (!posts.length) return;
        }
        setTimeout(() => this.loader(), 100);
    }

    protected resize() {
        const col = Math.round(this.dom.clientWidth / 300);
        this.column(col >= 2 ? col : 2);
    }

    /* Grid items update display */
    renderPosts() {
        this.$focus.layer(100).elementSet.clear();
        const $postList = [...this.posts.orderMap.values()].map(post => {
            const $post = this.$postMap.get(post) ?? new $PostTile(this, post).on('$focus', (e, $post) => this.$focus.layer(100).focus($post));
            this.$postMap.set(post, $post)
            return $post.self(this.$focus.layer(100).add)
        });
        this.content($postList).render();
        return this;
    }

    removeAll() {
        this.$postMap.clear();
        this.$focus.layer(100).removeAll();
        this.animate({opacity: [1, 0]}, {duration: 300, easing: 'ease'}, () => this.clear().render())
        return this;
    }

}