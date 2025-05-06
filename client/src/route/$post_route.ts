import { Post } from "../structure/Post";
import { ArtistCommentary } from "../structure/Commentary";
import { Booru } from "../structure/Booru";
import { $DetailPanel } from "../component/DetailPanel/$DetailPanel";
import { PostManager } from "../structure/PostManager";
import { $PostViewer } from "../component/$PostViewer";
import { $Slide, $SlideViewer } from "../component/$SlideViewer";
import { LocalSettings } from "../structure/LocalSettings";
import { $getSlideViewer } from "../lib/slideViewerManager";
import { $Input } from "elexis";
import { $Router, $RouterNavigation } from "@elexis.js/router";

export const $post_route = $('route').path('/posts/:id?q').static(false).builder(({$page, params}) => {
    if (!Number(params.id)) return $page.content($('h1').content('404: POST NOT FOUND'));
    const events = $.events<{
        post_switch: [Post]
    }>();
    let currentPost: Post, posts: PostManager;

    /** post url navigation */
    function navPost(dir: 'next' | 'prev') {
        const orderList = [...posts.orderMap.values()];
        const index = orderList.indexOf(currentPost);
        if (dir === 'prev' && index === 0) return;
        const targetPost = orderList.at(dir === 'next' ? index + 1 : index - 1);
        if (!targetPost) return;
        $.replace(`/posts/${targetPost.id}${posts.tags ? `?q=${posts.tags}` : ''}`);
    }

    // keys assign
    $.keys($(window)).self($keys => $keys
        .if(e => {
            if ($(e.target) instanceof $Input) return;
            if (!$page.inDOM()) return;
            return true;
        })
        .keydown(['f', 'F'], e => {
            if (Booru.used.user?.favorites.has(currentPost.id)) currentPost.deleteFavorite();
            else currentPost.createFavorite();
        })
        .keydown(['a', 'A'], e => navPost('prev') )
        .keydown(['d', 'D'], e => { navPost('next') })
    )

    // Using path params to navigation post
    $page.on('open', async ({params, query}) => {
        posts = PostManager.get(query.q);
        currentPost = Post.get(Booru.used, +params.id);
        posts.opened = currentPost;
        posts.events.on('post_fetch', ({manager}) => addSlide(manager));
        if (!posts.orderMap.size || !posts.cache.has(currentPost)) {
            // first post
            await currentPost.ready
            posts.addPosts(currentPost);
            const ordfav_tag = posts.tag_list?.find(tag => tag.startsWith('ordfav'));
            if (ordfav_tag) {
                const username = ordfav_tag.split(':')[1];
                const fav_list = await Booru.used.fetch(`/favorites.json?search[user_name]=${username}&search[post_id]=${currentPost.id}`) as [{id: number}];
                if (fav_list[0]) {
                    posts.orderMap.set(fav_list[0].id, currentPost);
                }
            } else posts.orderMap.set(currentPost.id, currentPost);
            posts.fetchPosts('newer');
            posts.fetchPosts('older');
        } else {
            // cached post
            const ordered = [...posts.orderMap.values()];
            const index = ordered.indexOf(currentPost);
            if (!posts.finished && index === ordered.length - 1) {
                posts.fetchPosts('older');
            } else if (index === 0) {
                posts.fetchPosts('newer');
            }
        }
        addSlide(posts);
        const $slideViewer = $getSlideViewer(posts.tags);
        $slideViewer.switch(currentPost.id, $Router.navigation === $RouterNavigation.Replace);
        events.fire('post_switch', currentPost);

        function addSlide(posts: PostManager) {
            const $slideViewer = $getSlideViewer(posts.tags);
            const postList = posts.cache.array.filter(post => !$slideViewer.slideMap.has(post.id));
            $slideViewer.addSlides(postList.map(post => $($Slide).slideId(post.id).builder(() => $($PostViewer, post))));
            if (postList.length) $slideViewer.arrange([...posts.orderMap.values()].map(post => post.id));
        }
    })

    $($DetailPanel)
    .hide(LocalSettings.detailPanelEnable$.convert(bool => !bool))
    .use($detail => {
        events.on('post_switch', (post) => $detail.update(post));
        detailPanelCheck(); // initial detail panel status
        LocalSettings.detailPanelEnable$.on('update', state$ => detailPanelCheck())
        $detail.open();
        $page.on('open', () => !$detail.inDOM() && $detail.open());
        $page.on('close', () => $detail.inDOM() && $detail.close());
        function detailPanelCheck() {
            if (LocalSettings.detailPanelEnable$.value()) $page.removeStaticClass('side-panel-disable')
            else $page.addStaticClass('side-panel-disable')
        }
    })

    // Build page
    return $page.id('post')
    .css({ padding: 0, paddingTop: `var(--nav-height)`,
        "$&.side-panel-disable": {
            '$slide-viewer': { width: '100%', height: 'calc(100dvh - var(--nav-height))', borderRadius: 0, margin: 0 },
            '$div.content': { width: '100%' }
        }
    }).content([
        $('div').class('slide-viewer-container').use($div => {
            $page.on('open', () => {
                $div.content($getSlideViewer(posts.tags))
            })
        }),
        $('div').class('content')
        .css({ width: 'calc(100vw - 300px - 2rem)', display: 'flex', flexDirection: 'column', padding: '1rem', boxSizing: 'border-box' ,
            "@media (max-width: 800px)": { width: '100%' }
        })
        .content([
            $('h3').css({ paddingLeft: '1rem', marginBlock: '1rem' }).content(`Artist's Commentary`),
            $('section').class('commentary').css({ '$*': { textWrap: 'wrap', wordBreak: 'break-word' } })
            .use(async ($comentary) => {
                events.on('post_switch', async post => {
                    const commentary = (await ArtistCommentary.fetchMultiple(Booru.used, {post: {_id: post.id}})).at(0);
                    $comentary.content([
                        commentary ? [
                            commentary.original_title ? $('h3').content(commentary.original_title) : null,
                            $('pre').content(commentary.original_description)
                        ] : 'No commentary'
                    ])
                })
            })
        ]),
    ])
})

export default $post_route;