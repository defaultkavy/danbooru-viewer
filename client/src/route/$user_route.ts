import { $Router } from "@elexis.js/router"
import { pageTransitionHandler } from "../lib/pageTransition"
import { Booru } from "../structure/Booru"
import { User } from "../structure/User"
import { $postsPageComponents } from "./$posts_route"
import type { $Anchor, $Container, $State } from "elexis"
import { LocalSettings } from "../structure/LocalSettings"

export const $user_route = $('route')
.path((path) => {
    if (path.match(/^\/profile/)) return {pathId: '/profile', params: {id: 'CLIENT'}}
    const match = path.match(/\/users\/([0-9]+)/)
    if (match) return {pathId: `/users/${match[1]}`, params: {id: match[1] ?? ''}}
    return false
})
.builder(({params, $page}) => {
    const user = params.id === 'CLIENT' ? Booru.used.user : Booru.used.users.get(+params.id) ?? User.partial(Booru.used, +params.id);
    // skip client user page fetch, client will be fetch on logon
    if (user.id !== 0) {
        user.fetch();
        user.fetchFavorites();
    }
    LocalSettings.previewPanelEnable$.on('update', state$ => checkDetailPanel(state$) )
    checkDetailPanel(LocalSettings.previewPanelEnable$);
    function checkDetailPanel(state$: $State<boolean>) {
        state$.value() ? $page.class('side-panel-disable') : $page.removeClass('side-panel-disable')
    }
    return $page.id('user')
    .css({ display: 'flex', justifyContent: 'center', transition: 'all 0.3s ease', width: '100%',
        '$&.side-panel-disable': { width: 'calc(100dvw - 300px - 4rem)',
            '@media (max-width: 800px)': {
                width: '100%'
            }
         }
     })
    .content([
        $('div')
        .css({maxWidth: '1200px', width: '100%'})
        .content([
            $('h1').css({marginBottom: '0.4rem'}).content(user.name$),
            // id and level
            $('div')
            .css({ display: 'flex', gap: '1rem', color: 'var(--primary-color-dark)' })
            .content([
                $('span').content(`ID: ${user.id$}`),
                $('span').content(`Level: ${user.level_string$}`),
                $('span').content(`Join Date: ${user.created_date$}`),
            ]),
            // profile items
            $('div').css({marginBlock: '4rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignContent: 'stretch' })
            .content([
                $($ProfileItem, 'Uploads', user.post_upload_count$).await(user.ready, ($a) => $a.href(`/posts?tags=user:${user.name}`)),
                $($ProfileItem, 'Favorites', user.favorite_count$.convert(fav => fav === 1000 ? '1000+' : fav)).await(user.ready, ($a) => $a.href(`/posts?tags=ordfav:${user.name}`)),
                $($ProfileItem, 'Favorite Groups', user.favorite_group_count$),
                $($ProfileItem, 'Forum Posts', user.forum_post_count$),
                $($ProfileItem, 'Post Changes', user.post_update_count$),
                $($ProfileItem, 'Note Changes', user.note_update_count$),
                $($ProfileItem, 'Artist Changes', user.artist_version_count$),
                $($ProfileItem, 'Commentary Changes', user.artist_commentary_version_count$),
                $($ProfileItem, 'Pool Changes', user.pool_version_count$),
            ]),
            // upload/favorite post tab
            $('div').class('tab-container')
            .css({
                display: 'flex',
                gap: '1rem',
                '$div': {
                    width: '100%',
                    textAlign: 'center',
                    fontSize: '1.2rem',
                    fontWeight: 900,
                    cursor: 'pointer',

                    "$&:hover": {
                        "$span": {
                            borderBottom: '0.2rem solid rgba(from var(--secondary-color-3) r g b / 1)',
                        }
                    },
                    "$span": {
                        display: 'inline-block',
                        padding: '1rem',
                        borderBottom: '0.2rem solid rgba(from var(--secondary-color-3) r g b / 0)',
                    },
                    "$&.active span": {
                        borderBottom: '0.2rem solid rgba(from var(--secondary-color-9) r g b / 1)',
                    }
                }
            })
            .content([
                $('div').content($('span').content('Upload Posts')).on('click', () => $.replace('#upload')).use($a => tabActiveCheck($a, '', '#upload')),
                $('div').content($('span').content('Favorite Posts')).on('click', () => $.replace('#favorite')).use($a => tabActiveCheck($a, `#favorite`))
            ]),
            $('router').base(`${location.pathname}`)
            .on('beforeSwitch', pageTransitionHandler)
            .map([
                $('route').path(['/', '#upload']).builder($subpage => 
                    $subpage.class('custom').content([
                        $('div').content(async () => {
                            await user.ready;
                            const {$detail, $postGrid} = $postsPageComponents({tags: `user:${user.name}`});
                            $detail.open();
                            $subpage.on('close', () => $detail.close()).on('open', () => $detail.open());
                            return [$postGrid];
                        })
                    ])
                ),
                
                $('route').path('#favorite').builder($subpage => 
                    $subpage.class('custom').content([
                        $('div').content(async () => {
                            await user.ready;
                            const {$detail, $postGrid} = $postsPageComponents({tags: `ordfav:${user.name}`});
                            $detail.open();
                            $subpage.on('close', () => $detail.close()).on('open', () => $detail.open());
                            return [$postGrid];
                        })
                    ])
                )
            ])
        ])
    ])
})

function tabActiveCheck($a: $Container, ...list: string[]) {
    $Router.events.on('stateChange', ({afterURL}) => list.includes(afterURL.hash) ? $a.class('active') : $a.removeClass('active') );
    list.includes(location.hash) ? $a.class('active') : $a.removeClass('active');
}

function $ProfileItem(title: string, value$: $State<any> | string) {
    return $('ra')
    .css({ display: 'block', minWidth: '12rem', background: `var(--secondary-color-3)`, padding: '1rem', borderRadius: `var(--border-radius-large)`, flexGrow: 1 })
    .content([
        $('div').css({ fontWeight: 900 }).content(title),
        $('div').css({ textAlign: 'right', fontSize: '1.4rem' }).content(value$)
    ])
}

// {
//     "id": 701499,
//     "name": "AkaringoP",
//     "level": 35,
//     "inviter_id": null,
//     "created_at": "2019-07-29T04:57:20.352-04:00",
//     "post_update_count": 93769,
//     "note_update_count": 1019,
//     "post_upload_count": 34559,
//     "is_deleted": false,
//     "level_string": "Contributor",
//     "is_banned": false,
//     "wiki_page_version_count": 283,
//     "artist_version_count": 1988,
//     "artist_commentary_version_count": 32212,
//     "pool_version_count": 346,
//     "forum_post_count": 176,
//     "comment_count": 311,
//     "favorite_group_count": 0,
//     "appeal_count": 20,
//     "flag_count": 21,
//     "positive_feedback_count": 1,
//     "neutral_feedback_count": 1,
//     "negative_feedback_count": 1
// }