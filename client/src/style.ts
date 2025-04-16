$.CSS({
    '$page': {
        display: 'block', 
        position: 'relative', 
        paddingBlock: '1rem', 
        paddingTop: 'var(--nav-height)',
        paddingInline: '1rem',
        boxSizing: 'border-box',

        "$&.custom": {
            padding: 0
        }
    }
})