import { Booru } from "../structure/Booru";
import { User } from "../structure/User";
import type { $PostViewer } from "./$PostViewer";
import { $VideoController } from "./$VideoController";

export function $PostViewerPanel($viewer: $PostViewer) {
    return $('div').class('viewer-panel')
    .css({ position: 'absolute', bottom: 0, width: '100%', zIndex: 1 })
    .hide(false)
    .content($viewerPanel => {
        $viewer.events.on('viewerPanel_hide', () => $viewerPanel.hide(true))
            .on('viewerPanel_show', () => $viewerPanel.hide(false))
            .on('viewerPanel_switch', () => { $viewerPanel.hide(!$viewerPanel.hide()) })
        return [
            // button container
            $('div').class('panel')
            .css({ width: '100%', display: 'flex', justifyContent: 'center', flexDirection: 'column', padding: '1rem', gap: '1rem', boxSizing: 'border-box' })
            .content([
                // if post is video, show video controller component
                $viewer.post.isVideo ? $($VideoController, $viewer.$video, $viewer, $viewer.post) : null,
                // buttons
                $('div').class('buttons')
                .css({ width: '100%', display: 'flex', justifyContent: 'center', gap: '2rem' })
                .content([
                    $('ion-icon').title('Favorite').name('heart-outline').use($heart => {
                        if (Booru.used.user) $heart.hide(false);
                        else $heart.hide(true);
                        Booru.events.on('login', () => $heart.hide(false))
                        User.events.on('favoriteUpdate', (user) => {
                            if (user.favorites.has($viewer.post.id)) $heart.name('heart');
                            else $heart.name('heart-outline');
                        })
                        if (Booru.used.user?.favorites.has($viewer.post.id)) $heart.name('heart');
                        $heart.on('click', () => {
                            if (Booru.used.user?.favorites.has($viewer.post.id)) $viewer.post.deleteFavorite();
                            else $viewer.post.createFavorite();
                        })
                    }),
                    $('ion-icon').title('Original Size').name('resize-outline').use($original => {
                        $original.on('click', () => { $viewer.events.fire('original_size'); $original.disable(true); })
                        if (!$viewer.post.isLargeFile || $viewer.post.isVideo) $original.hide(true);
                    })
                ])
            ]),
            // overlay on viewer
            $('div').class('overlay')
            .css({position: 'absolute', bottom: 0, width: '100%', height: '200%', zIndex: -1, 
                background: `linear-gradient(180deg, 
                    color-mix(in srgb, var(--secondary-color-1) 0%, transparent) 0%, 
                    color-mix(in srgb, var(--secondary-color-0) 70%, transparent) 100%
            );`})
        ]
    })
}