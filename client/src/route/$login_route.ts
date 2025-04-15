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
    .css({display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '5rem', position: 'relative', paddingInline: '1rem', paddingTop: 'var(--nav-height)'}).id('login')
    .content([
        $('div').css({padding: '2rem', border: '1px solid var(--secondary-color-9)', borderRadius: 'var(--border-radius-large)', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1rem', maxWidth: '400px', width: '100%', boxSizing: 'border-box'}).content([
            $('h1').css({margin: 0}).content('Login'),
            $('div').class('username').css(input_container_css).content([
                $('label').for('username').content('Username'),
                $('input').css(input_css).type('text').id('username').value(state.username$)
            ]),
            $('div').class('api-key').css(input_container_css).content([
                $('label').for('api-key').content('API Key'),
                $('input').css(input_css).type('password').id('api-key').value(state.apiKey$)
            ]).on('keydown', e => { if (e.key === 'Enter') login() }),
            $('icon-button').content('Login').on('click', login),
            $('icon-button').content('Create Account').icon('open-outline').on('click', () => $.open('https://danbooru.donmai.us/users/new', '_blank')),
        ])
    ])

    async function login() {
        await Booru.used.login(state.username$.value, state.apiKey$.value);
        if (Booru.used.user) { 
            ClientUser.storageUserData = { apiKey: state.apiKey$.value, username: state.username$.value }
            // Clear input
            state.username$.set('');
            state.apiKey$.set('');
            $.replace('/');
        };
    }
})

export default $login_route;