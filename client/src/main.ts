import 'elexis';
import '@elexis.js/layout';
import '@elexis.js/focus';
import '@elexis.js/router';
import '@elexis.js/css';
import '@elexis.js/idb';
import './style';
import './lib/registerTagName';
import './lib/booru';
import { $Router } from '@elexis.js/router';
import { $Searchbar } from './component/Searchbar/$Searchbar';
import { $Drawer } from './component/Drawer/$Drawer';
import { $NavigationBar } from './component/$NavigationBar';
import { $posts_route, $root_posts_route } from './route/$posts_route';
import { $Notify } from './component/$Notify';
import $post_route from './route/$post_route';
import $login_route from './route/$login_route';
import { $user_route } from './route/$user_route';
import { pageTransitionHandler } from './lib/pageTransition';
import { $DetailPanel } from './component/DetailPanel/$DetailPanel';
import { $Input } from 'elexis';
// render
$(document.body).content([
  $NavigationBar.$ele,
  $Searchbar.$ele,
  $Drawer.$ele,
  $Notify.$ele,
  // Base Router
  $('router').base('/')
  .on('beforeSwitch', pageTransitionHandler)
  .map([
    $root_posts_route,
    $posts_route,
    $post_route,
    $login_route,
    $user_route
  ]),
  $DetailPanel.$container
])

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
    e.preventDefault(); $DetailPanel.toogle();
  })