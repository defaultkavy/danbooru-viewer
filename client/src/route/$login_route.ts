import { Booru } from "../structure/Booru"
import { ClientUser } from "../structure/ClientUser";

export const $login_route = $('route').path('/login').builder(({$page}) => {
    const state = $.state({
        apiKey: '',
        username: ''
    })

    const input_container_css = $.css({display: 'flex', flexDirection: 'column', gap: '0.5rem'})
    const input_css = $.css({display: 'block'})
    return $page
    .css({display: 'flex', justify: 'center', alignItems: 'center', mT: '5rem', pos: 'relative', pX: '1rem', pT: 'var(--nav-height)'}).id('login')
    .content([
        $('div').css({p: '2rem', b: '1px solid var(--secondary-color-9)', bRadius: 'var(--border-radius-large)', display: 'flex', flexDir: 'column', justify: 'center', gap: '1rem', maxW: '400px', w: '100%', sizing: 'border-box'}).content([
            $('h1').css({margin: 0}).content('Login'),
            $('div').class('username').css(input_container_css).content([
                $('label').for('username').content('Username'),
                $('input').css(input_css).type('text').id('username').value(state.username$)
            ]),
            $('div').class('api-key').css(input_container_css).content([
                $('label').for('api-key').content('API Key'),
                $('input').css(input_css).type('password').id('api-key').value(state.apiKey$)
            ]),
            $('icon-button').content('Login').on('click', async () => { 
                await Booru.used.login(state.username$.value, state.apiKey$.value);
                if (Booru.used.user) { 
                    ClientUser.storageUserData = { apiKey: state.apiKey$.value, username: state.username$.value }
                    // Clear input
                    state.username$.set('');
                    state.apiKey$.set('');
                    $.replace('/');
                };
            }),
            $('icon-button').content('Create Account').icon('open-outline').on('click', () => $.open('https://danbooru.donmai.us/users/new', '_blank')),
        ])
    ])
})