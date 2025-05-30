import { $Container } from "elexis";
import { Booru } from "../../structure/Booru";
import { numberFormat } from "../../structure/Util";
import { danbooru, safebooru } from "../../lib/booru";
import { $Notify } from "../$Notify";

export class $Drawer extends $Container {
    static $ele = new this();
    $filter = $('div').class('filter');
    $container = $('div').class('drawer-container')
    pointers = $.pointers($(document.body));
    protected opened = false;
    constructor() {
        super('drawer');
        this.hide(true);
        this.build();
    }

    private build() {
        this.content([
            this.$container.content([
                $('div').class('user-info').hide(true).use(($div) => [
                    Booru.events
                        .on('login', (user) => {
                            $div.content([
                                $('div').content([
                                    $('h3').class('username').content(user.name$),
                                    $('div').class('user-detail').content([
                                        $('span').class('userid').content(`ID: ${user.id}`),
                                        $('span').class('level').content(['Level: ', user.level_string$])
                                    ])
                                ]).on('click', () => $.replace('/profile')),
                                $('div').class('user-nav').content([
                                    $('icon-button').title('Uploaded Posts').icon('image').content(user.post_upload_count$.convert(numberFormat)).link(`/posts?tags=user:${user.name}`, true),
                                    $('icon-button').title('Favorites').icon('heart').content(user.favorite_count$.convert(numberFormat)).link(`/posts?tags=ordfav:${user.name}`, true),
                                    $('icon-button').title('Forum Posts').icon('document-text').content(user.forum_post_count$.convert(numberFormat)).hide(true),
                                ])
                            ]).hide(false);
                        })
                        .on('logout', () => {
                            $div.clear().hide(true);
                        })
                ]),
                $('div').class('nav').content([
                    $('icon-button').icon('log-in-outline').content('Login').link('/login', true)
                        .use(($div => Booru.events.on('login', () => $div.hide(true)).on('logout', () => $div.hide(false)))),
                    $('icon-button').icon('log-out-outline').content('Logout').use($button => {
                        let clicked = false
                        $button.on('click', () => {
                            if (clicked) { Booru.used.logout(); $Notify.push('Logged Out.'); return }
                            clicked = true;
                            $Notify.push('Click button again to confirm logout.')
                            setTimeout(() => { clicked = false }, 3000);
                        })
                    }).hide(true)
                        .use(($div => Booru.events.on('login', () => $div.hide(false)).on('logout', () => $div.hide(true)))),
                    
                    $('icon-button').icon('swap-horizontal').class('switch').content('Switch Booru')
                        .on('click', () => {
                            if (Booru.used === danbooru) Booru.set(safebooru);
                            else Booru.set(danbooru);
                            this.close();
                        }),
                    
                    $('ra').content($('icon-button').icon('logo-github').class('switch').content('GitHub Repository')).href('https://github.com/defaultkavy/danbooru-viewer')
                ])
            ]),
            this.$filter.on('click', () => $.back())
        ])

        this.pointers.on('move', pointer => {
            if ($(':slide-viewer')?.contains(pointer.$target)) return;
            pointer.$target.parent
            if (pointer.type !== 'pen' && pointer.type !== 'touch') return;
            if (pointer.move_y > 4 || pointer.move_y < -4) return;
            if (pointer.move_x <= -7) { pointer.delete(); this.open(); }
            if (pointer.move_x >= 7) { pointer.delete(); this.close(); }
        })
    }

    open() { if (location.hash !== '#drawer') $.open(`#drawer`); return this; }
    close() { if (location.hash === '#drawer') $.back(); return this; }

    private activate() {
        this.opened = true;
        this.hide(false);
        this.$container.animate({
            transform: [`translateX(100%)`, `translateX(0%)`]
        }, {
            fill: 'both',
            duration: 300,
            easing: 'ease'
        })
        this.$filter.animate({
            opacity: [0, 1]
        }, {
            fill: 'both',
            duration: 300,
            easing: 'ease'
        })
    }

    private inactivate() {
        this.opened = false
        this.$container.animate({
            transform: [`translateX(0%)`, `translateX(100%)`]
        }, {
            fill: 'both',
            duration: 300,
            easing: 'ease',
            onfinish: () => this.hide(!this.opened)
        })
        this.$filter.animate({
            opacity: [1, 0]
        }, {
            fill: 'both',
            duration: 300,
            easing: 'ease'
        })
    }

    checkURL(beforeURL: URL | undefined, afterURL: URL) {
        if (beforeURL?.hash === '#drawer') this.inactivate();
        if (afterURL.hash === '#drawer') this.activate();
    }
}