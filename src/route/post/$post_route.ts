import { Post } from "../../structure/Post";
import { ArtistCommentary } from "../../structure/Commentary";
import { Booru } from "../../structure/Booru";
import { $Input } from "elexis/lib/node/$Input";
import { $DetailPanel } from "../../component/DetailPanel/$DetailPanel";
import { PostManager } from "../../structure/PostManager";
import { $PostViewer } from "../../component/PostViewer/$PostViewer";
import { $Slide, $SlideViewer } from "../../component/$SlideViewer";
import { $Video } from "elexis";
import { LocalSettings } from "../../structure/LocalSettings";

export const $post_route = $('route').path('/posts/:id?q').static(false).builder(({$page, params}) => {
    if (!Number(params.id)) return $page.content($('h1').content('404: POST NOT FOUND'));
    const events = $.events<{
        post_switch: [Post]
    }>();
    let post: Post, posts: PostManager;
    $.keys($(window)).self($keys => $keys
        .if(e => {
            if ($(e.target) instanceof $Input) return;
            if (!$page.inDOM()) return;
            return true;
        })
        .keydown(['f', 'F'], e => {
            if (Booru.used.user?.favorites.has(post.id)) post.deleteFavorite();
            else post.createFavorite();
        })
        .keydown(['a', 'A'], e => navPost('prev') )
        .keydown(['d', 'D'], e => { navPost('next') })
    )
    const $slideViewerMap = new Map<string | undefined, $SlideViewer>();
    $page.on('open', async ({params, query}) => {
        posts = PostManager.get(query.q);
        post = Post.get(Booru.used, +params.id);
        posts.events.on('post_fetch', slideViewerHandler);
        if (!posts.orderMap.size || !posts.cache.has(post)) {
            await post.ready
            posts.addPosts(post);
            const ordfav_tag = posts.tag_list?.find(tag => tag.startsWith('ordfav'));
            if (ordfav_tag) {
                const username = ordfav_tag.split(':')[1];
                const fav_list = await Booru.used.fetch(`/favorites.json?search[user_name]=${username}&search[post_id]=${post.id}`) as [{id: number}];
                if (fav_list[0]) {
                    posts.orderMap.set(fav_list[0].id, post);
                }
            } else posts.orderMap.set(post.id, post);
            posts.fetchPosts('newer');
            posts.fetchPosts('older');
        } else {
            const ordered = [...posts.orderMap.values()];
            const index = ordered.indexOf(post);
            if (!posts.finished && index === ordered.length - 1) {
                posts.fetchPosts('older');
            } else if (index === 0) {
                posts.fetchPosts('newer');
            }
        }
        slideViewerHandler({manager: posts});
        const $slideViewer = $getSlideViewer(posts.tags);
        $slideViewer.switch(post.id);
        events.fire('post_switch', post);
    })

    function slideViewerHandler(params: {manager: PostManager}) {
        const { manager: posts } = params;
        const $slideViewer = $getSlideViewer(posts.tags);
        const postList = posts.cache.array.filter(post => !$slideViewer.slideMap.has(post.id));
        $slideViewer.addSlides(postList.map(post => new $Slide().slideId(post.id).builder(() => new $PostViewer(post))));
        if (postList.length) $slideViewer.arrange([...posts.orderMap.values()].map(post => post.id));
    }

    /** create slide viewer or get from cached */
    function $getSlideViewer(q: string | undefined) {
        const $slideViewer = $slideViewerMap.get(q) ?? 
            new $SlideViewer()
                .pointerException((pointer) => {
                    if ($slideViewer.currentSlide?.$('::.progressbar-container').find($div => $div.contains(pointer.$target))) return false;
                    if (pointer.type === 'mouse') return false;
                    return true;
                })
                .on('switch', ({nextSlide: $target}) => {
                    $.replace(`/posts/${$target.slideId()}${q ? `?q=${q}` : ''}`);
                }).on('beforeSwitch', ({prevSlide, nextSlide}) => {
                    const $prevVideo = prevSlide?.$<$Video>(':video');
                    if ($prevVideo?.isPlaying) $prevVideo.pause();
                    const $nextVideo = nextSlide.$<$Video>(':video');
                    if ($nextVideo?.isPlaying === false) $nextVideo.play();
                })
        $slideViewerMap.set(q, $slideViewer);
        return $slideViewer;
    }

    function navPost(dir: 'next' | 'prev') {
        const orderList = [...posts.orderMap.values()];
        const index = orderList.indexOf(post);
        if (dir === 'prev' && index === 0) return;
        const targetPost = orderList.at(dir === 'next' ? index + 1 : index - 1);
        if (!targetPost) return;
        $.replace(`/posts/${targetPost.id}${posts.tags ? `?q=${posts.tags}` : ''}`);
    }

    return $page.id('post').content([
        $('div').class('slide-viewer-container').self($div => {
            $page.on('open', () => {
                $div.content($getSlideViewer(posts.tags))
            })
        }),
        $('div').class('content').content([
            $('h3').content(`Artist's Commentary`),
            $('section').class('commentary').self(async ($comentary) => {
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
        new $DetailPanel().hide(LocalSettings.detailPanelEnable$.convert(bool => !bool)).position($page).self($detail => {
            events.on('post_switch', (post) => $detail.update(post));
            detailPanelCheck(); // initial detail panel status
            LocalSettings.detailPanelEnable$.on('update', ({state$}) => detailPanelCheck())
            function detailPanelCheck() {
                if (LocalSettings.detailPanelEnable$.value) $page.removeStaticClass('side-panel-disable')
                else $page.addStaticClass('side-panel-disable')
            }
        })
    ])
})