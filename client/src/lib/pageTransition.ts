import { type $RouterEventMap, $Router, $RouterNavigationDirection } from "@elexis.js/router";

export function pageTransitionHandler(e: $RouterEventMap['beforeSwitch'][0]) {
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
        easing: 'ease',
        onfinish: () => {
          e.switched();
          $(document.documentElement).style({scrollBehavior: ''});
          e.nextContent.element?.removeClass('animated')
        }
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
        easing: 'ease',
        onfinish: () => {
          e.previousContent?.element?.removeClass('animated');
          intro();
        }
      })
    }
  
    if (e.previousContent) outro();
    else intro();
  }