import type { $Page } from "@elexis.js/router";
import { $DetailPanel } from "../component/DetailPanel/$DetailPanel";
import { $PostGrid } from "../component/PostGrid/$PostGrid";
import { $PostTile } from "../component/PostTile/$PostTile";
import { Booru } from "../structure/Booru";
import { LocalSettings } from "../structure/LocalSettings";

export const $root_posts_route = $('route').path(['/', '/posts']).builder(({$page, query}) => {
    const { $postGrid, $detail } = $postsPageComponents($page, query);
    return $page.id('posts').content([ $postGrid, $detail ]);
})

export const $posts_route = $('route').path('/posts?tags').builder(({$page, query}) => {
    const { $postGrid, $detail } = $postsPageComponents($page, query)
    return $page.id('posts').content([
    $('header').content([
        $('h2').content('Posts'),
        $('div').class('tags').self($div => {
        query.tags.split('+').forEach(tag => {
            $div.insert($('a').class('tag').content(decodeURIComponent(tag)).href(`posts?tags=${tag}`))
        })
        })
    ]),
    $('div').class('no-post').hide(true).self($div => {
        $div.on('startLoad', () => $div.hide(true))
        $postGrid.self(() => {
        $postGrid.posts.events
            .on('noPost', () => $div.hide(false).content('No Posts'))
            .on('post_error', message => $div.hide(false).content(message))
        })
    }),
    $postGrid,
    $detail
    ])
})

function $postsPageComponents($page: $Page, query: {tags?: string}) {
    const $postGrid = new $PostGrid(query);
    const $previewPanel = new $DetailPanel({preview: true, tagsType: 'name_only'}).hide(LocalSettings.previewPanelEnable$.convert(bool => !bool)).position($page);
    detailPanelCheck();
    LocalSettings.previewPanelEnable$.on('update', detailPanelCheck);
    Booru.events.on('set', () => $previewPanel.update(null));
    function detailPanelCheck() { LocalSettings.previewPanelEnable$.value ? $postGrid.addClass('detail-panel-enabled') : $postGrid.removeClass('detail-panel-enabled') }
    $postGrid.$focus
        .on('focus', ({$focused: $target}) => {if ($target.inDOM() && $target instanceof $PostTile) $previewPanel.update($target.post) })
        .on('blur', () => $previewPanel.update(null))
    return { $postGrid, $detail: $previewPanel };
}