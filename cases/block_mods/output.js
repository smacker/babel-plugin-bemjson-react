'use strict';

React.createElement('div', {
    className: BEM.buildClassName({
        block: 'test',
        mods: {
            mod1: 'bla'
        }
    })
}, null);
