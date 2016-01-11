'use strict';

React.createElement('div', {
    className: BEM.buildClassName({
        block: 'test'
    })
}, React.createElement('div', {
    className: BEM.buildClassName({
        block: 'test',
        elem: 'el'
    })
}, null), React.createElement('div', {
    className: BEM.buildClassName({
        block: 'test',
        elem: 'other'
    })
}, null));
