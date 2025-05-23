import { type $RouterEventMap, $Router, $RouterNavigation } from "@elexis.js/router";

export function viewTransitionHandler(e: $RouterEventMap['beforeSwitch'][0]) {
    if (document.startViewTransition) {
      e.preventDefault()
      document.startViewTransition({
        update: () => {
          e.$view.content(e.nextContent);
          e.rendered();
          e.switched();
        },
        types: [$RouterNavigation[$Router.navigation].toLowerCase()]
      } as any)
    }
    else pageTransitionHandler(e);
}

export function pageTransitionHandler(e: $RouterEventMap['beforeSwitch'][0]) {
    const DURATION = 300;
    const TX = 2;
    e.preventDefault();
    function intro() {
      $(document.documentElement).style({scrollBehavior: 'auto'});
      const transform = $.call(() => {
        switch ($Router.navigation) {
          case $RouterNavigation.Forward: return [`translateX(${TX}%)`, `translateX(0%)`];
          case $RouterNavigation.Back: return [`translateX(-${TX}%)`, `translateX(0%)`];
          default: return '';
        }
      })
      e.$view.insert(e.nextContent);
      e.rendered();
      e.nextContent.element?.animate({
        opacity: [0, 1],
        transform
      }, {
        duration: DURATION,
        easing: 'ease',
        onfinish: () => {
          e.switched();
          $(document.documentElement).style({scrollBehavior: ''});
        }
      })
    }
    function outro() {
      $(document.documentElement).class('animated').style({
        scrollBehavior: 'auto',
      });
      const transform = $.call(() => {
        switch ($Router.navigation) {
          case $RouterNavigation.Forward: return [`translateX(0%)`, `translateX(-${TX}%)`];
          case $RouterNavigation.Back: return [`translateX(0%)`, `translateX(${TX}%)`];
          default: return '';
        }
      })
      
      e.previousContent?.htmlElement?.style({
        zIndex: '0'
      }).animate({
        opacity: [1, 0],
        transform
      }, {
        duration: DURATION,
        easing: 'ease',
        onfinish: () => {
          $(document.documentElement).style({
            overflow: ''
          });
          e.previousContent?.htmlElement?.style({
            position: '',
            zIndex: ''
          }).remove();
          intro();
        }
      })
    }
  
    if (e.previousContent) outro();
    else intro();
  }