import { $IconButton } from "../component/IconButton/$IconButton";
import { $IonIcon } from "../component/IonIcon/$IonIcon";

// declare elexis module
declare module 'elexis' {
  export namespace $ {
      export interface TagNameElementMap {
        'ion-icon': typeof $IonIcon;
        'icon-button': typeof $IconButton;
      } 
  }
}
$.registerTagName('ion-icon', $IonIcon)
$.registerTagName('icon-button', $IconButton)