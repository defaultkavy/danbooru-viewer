import { $Container } from "elexis";

export class $Notify extends $Container {
    static $ele = $($Notify);
    constructor() {
        super('div');
        this.build();
    }

    build() {
        this.class('notify')
        .css({ position: 'fixed', top: 0, right: 0, paddingInline: '1rem', zIndex: 400, pointerEvents: 'none' })
    }

    static push(message: string) {
        const $notification = $(this.$Notification, message);
        this.$ele
        .insert($notification, 0)
        .animate({
            transform: [`translateY(-${$notification.offsetHeight + $.rem(0.4)}px)`, 'translateY(0)']
        }, {
            duration: 300,
            fill: 'both',
            composite: 'add',
            easing: 'ease'
        })
    }

    static $Notification(message: string) {
        return $('div').class('notification-box').content([
            $('span').class('notification')
            .css({ display: 'inline-block', float: 'right', backgroundColor: 'var(--secondary-color-1)', padding: '0.4rem 0.6rem', borderRadius: 'var(--border-radius-small)', marginBlock: '0.4rem', opacity: 1, boxShadow: '0 0 10px #00000090' })
            .content(message)
        ])
        .animate({
            transform: ['translateY(500%)', 'translateY(calc(var(--nav-height) + 1rem))']
        }, {
            duration: 300,
            fill: 'both',
            composite: 'add',
            easing: 'ease'
        })
        .animate({
            opacity: [1, 0],
            // transform: ['translateY(calc(var(--nav-height) + 1rem))', 'translateY(100%)'],
        }, {
            delay: 3000,
            duration: 300,
            composite: 'replace',
            easing: 'ease',
            onfinish($span) { $span.remove(); }
        })
    }
}