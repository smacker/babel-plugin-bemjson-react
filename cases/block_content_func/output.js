'use strict';

React.createElement('div', {
    className: buildClassName({
        block: 'test'
    })
}, [1, 2].map(function (i) {
    return React.createElement('div', {
        className: buildClassName({
            block: 'test',
            elem: 'el'
        })
    }, i);
}));
