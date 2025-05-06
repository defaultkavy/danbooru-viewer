const transitionDuration = 0.3;
$.CSS({
    '$page': {
        display: 'block', 
        position: 'relative', 
        paddingBlock: '1rem', 
        paddingTop: 'var(--nav-height)',
        paddingInline: '1rem',
        boxSizing: 'border-box',

        "&.custom": {
            padding: 0
        }
    },

    '$html:active-view-transition-type(back, forward)': {
        '$::view-transition-group(nav)': { animation: 'none' },
        '$::view-transition-group(post-img)': {  },
        '$::view-transition-old(post-img)': { borderRadius: '100px' },
        '$::view-transition-new(post-img)': {  }
    },

    '$html:active-view-transition-type(back)': {
        '&::view-transition-group(root)': { backgroundColor: '#000' },
    
        '&::view-transition-old(root)': {
            animation: `${transitionDuration}s ease slide-out`,
            zIndex: 1
        },
    
        '&::view-transition-new(root)': {
            animation: `${transitionDuration}s ease intro`,
            zIndex: 0
        },
    },

    '$html:active-view-transition-type(forward)': {
        '&::view-transition-group(root)': { backgroundColor: '#000' },
        '&::view-transition-old(root)': { animation: `${transitionDuration}s ease outro` },
        '&::view-transition-new(root)': { animation: `${transitionDuration}s ease slide-in` },
    },
    
    '@keyframes outro': {
        from: { opacity: 1, transform: 'scale(1)' },
        to: { opacity: .2, transform: 'scale(.99)' }
    },
    
    '@keyframes intro': {
        from: { opacity: .2, transform: 'scale(.99)' },
        to: { opacity: 1, transform: 'scale(1)' }
    },
    '@keyframes slide-in': {
        from: { opacity: 0, transform: 'translateX(1%)' }, 
        to: { opacity: 1, transform: 'translateX(0)' }
    },
    '@keyframes slide-out': {
        from: { opacity: 1, transform: 'translateX(0)' }, 
        to: { opacity: 0, transform: 'translateX(1%)' }
    }
})