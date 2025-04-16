import { $Router } from "@elexis.js/router";
import { $Container } from "elexis";
import { Booru } from "../structure/Booru";
import { $Searchbar } from "./Searchbar/$Searchbar";
import { $Drawer } from "./Drawer/$Drawer";
import { LocalSettings } from "../structure/LocalSettings";
import { $DetailPanel } from "./DetailPanel/$DetailPanel";

export class $NavigationBar extends $Container {
    static $ele = new this();
    booru_href$ = $.state(location.href.replace(location.origin, Booru.used.origin));
    constructor() {
        super('nav')
        this.build();
        $Router.events.on('stateChange', () => this.booru_href$.set(location.href.replace(location.origin, Booru.used.origin)))
    }

    build() {
      this.content([
        // Title
        $('a').class('title').href('/').content([
          $('h1').class('booru-name').content(Booru.name$),
          $('h2').class('app').content([
            $('span').class('app-name').content(`Viewer`),
            $('span').class('version').content(`v${__APP_VERSION__}`)
          ])
        ]),
        // Searchbar
        $('div').class('searchbar').content(['Search in ', Booru.name$])
          .self($self => $Router.events.on('stateChange', ({beforeURL, afterURL}) => {if (beforeURL.hash === '#search') $self.hide(false); if (afterURL.hash === '#search') $self.hide(true)}))
          .on('click', () => $Searchbar.$ele.open()),
        // Buttons
        $('div').class('buttons').content([
          // Search Icon
          $('ion-icon').class('search').name('search-outline').title('Search')
            .self($self => $Router.events.on('stateChange', ({beforeURL, afterURL}) => {if (beforeURL.hash === '#search') $self.hide(false); if (afterURL.hash === '#search') $self.hide(true)}))
            .on('click', () => $Searchbar.$ele.open()),
          // Detail Panel Button
          $('ion-icon').class('detail-panel').name('reader-outline').title('Toggle Detail Panel').on('click', () => $DetailPanel.toogle()),
          // Open Booru
          $('a').content($('ion-icon').class('open').name('open-outline').title('Open in Original Site')).href(this.booru_href$).target('_blank'),
          // Copy Button
          $('ion-icon').class('copy').name('link-outline').title('Copy Page Link').hide(false)
            .on('click', (e, $copy) => {
              navigator.clipboard.writeText(`${location.origin}${location.pathname}${location.search}`)
              $copy.name('checkmark-outline');
              setTimeout(() => {
                $copy.name('link-outline')
              }, 2000);
            }),
          // Menu Button
          $('ion-icon').class('menu').name('menu-outline').title('Menu').hide(false)
            .self(($icon) => { Booru.events.on('login', () => $icon.hide(true)).on('logout', () => $icon.hide(false)) })
            .on('click', () => $Drawer.$ele.open()),
          // Account Menu
          $('div').class('account').hide(true).title('Menu')
            .self(($account) => {
              Booru.events
                .on('login', user => { $account.content(user.name$.convert(value => value.at(0)?.toUpperCase() ?? '')).hide(false); })
                .on('logout', () => $account.hide(true))
            })
            .on('click', () => $Drawer.$ele.open())
        ])
      ])
    }
}