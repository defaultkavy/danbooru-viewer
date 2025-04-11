import 'elexis';
import '@elexis.js/layout';
import '@elexis.js/router';
import '@elexis.js/css';
import './style';
import './lib/registerTagName';
import './lib/booru';
import { $post_route } from './route/post/$post_route';
import { $Router, $RouterNavigationDirection, type $RouterEventMap } from '@elexis.js/router';
import { $Searchbar } from './component/Searchbar/$Searchbar';
import { $login_route } from './route/$login_route';
import { $Drawer } from './component/Drawer/$Drawer';
import { $Input } from 'elexis/lib/node/$Input';
import { LocalSettings } from './structure/LocalSettings';
import { $NavigationBar } from './component/$NavigationBar';
import { $posts_route, $root_posts_route } from './route/$posts_route';

// render
$(document.body).content([
  $NavigationBar.$ele,
  $Searchbar.$ele,
  $Drawer.$ele,
  // Base Router
  $('router').base('/').on('beforeSwitch', pageTransitionHandler).map([
    $root_posts_route,
    $posts_route,
    $post_route,
    $login_route
  ])
])

function pageTransitionHandler(e: $RouterEventMap['beforeSwitch'][0]) {
  const DURATION = 300;
  const TX = 2;
  e.preventDefault();
  function intro() {
    $(document.documentElement).style({scrollBehavior: 'auto'});
    const transform = $.call(() => {
      switch ($Router.navigationDirection) {
        case $RouterNavigationDirection.Forward: return [`translateX(${TX}%)`, `translateX(0%)`];
        case $RouterNavigationDirection.Back: return [`translateX(-${TX}%)`, `translateX(0%)`];
        case $RouterNavigationDirection.Replace: return '';
      }
    })
    e.$view.content(e.nextContent);
    e.rendered();
    e.nextContent.element?.class('animated').animate({
      opacity: [0, 1],
      transform
    }, {
      duration: DURATION,
      easing: 'ease'
    }, () => {
      e.switched();
      $(document.documentElement).style({scrollBehavior: ''});
      e.nextContent.element?.removeClass('animated')
    })
  }
  function outro() {
    $(document.documentElement).style({scrollBehavior: 'auto'});
    const transform = $.call(() => {
      switch ($Router.navigationDirection) {
        case $RouterNavigationDirection.Forward: return [`translateX(0%)`, `translateX(-${TX}%)`];
        case $RouterNavigationDirection.Back: return [`translateX(0%)`, `translateX(${TX}%)`];
        case $RouterNavigationDirection.Replace: return '';
      }
    })

    e.previousContent?.element?.class('animated').animate({
      opacity: [1, 0],
      transform
    }, {
      duration: DURATION,
      easing: 'ease'
    }, () => {
      e.previousContent?.element?.removeClass('animated');
      intro();
    })
  }

  if (e.previousContent) outro();
  else intro();
}

$Router.events.on('stateChange', ({beforeURL, afterURL}) => componentState(beforeURL, afterURL))
componentState(undefined, new URL(location.href))

function componentState(beforeURL: URL | undefined, afterURL: URL) {
  $Searchbar.$ele.checkURL(beforeURL, afterURL); 
  $Drawer.$ele.checkURL(beforeURL, afterURL)
}

$.keys($(window))
  .if(e => {
    if ($(e.target) instanceof $Input) return; 
    return true;
  })
  .keydown(['q', 'Q'], e => { e.preventDefault(); if ($Router.index !== 0) $.back(); })
  .keydown(['e', 'E'], e => { e.preventDefault(); if ($Router.forwardIndex !== 0) $.forward(); })
  .keydown('Tab', e => { 
    e.preventDefault(); 
    if ($(':page#posts')) LocalSettings.previewPanelEnable$.set(!LocalSettings.previewPanelEnable$.value);
    else if ($(':page#post')) LocalSettings.detailPanelEnable$.set(!LocalSettings.detailPanelEnable$.value);
  })