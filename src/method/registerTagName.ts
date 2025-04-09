import { $RouterAnchor } from "@elexis.js/router";
import { $IconButton } from "../component/IconButton/$IconButton";
import { $IonIcon } from "../component/IonIcon/$IonIcon";

// declare elexis module
declare module 'elexis' {
  export namespace $ {
      export interface TagNameElementMap {
        'ion-icon': typeof $IonIcon;
        'icon-button': typeof $IconButton;
        'a': typeof $RouterAnchor;
      } 
  }
}
$.registerTagName('ion-icon', $IonIcon)
$.registerTagName('icon-button', $IconButton)
$.registerTagName('a', $RouterAnchor)