'use strict';

React.createElement('label', {
    className: BEM.buildClassName({
        block: 'attach'
    })
}, React.createElement('input', {
    className: BEM.buildClassName({
        block: 'attach',
        elem: 'control'
    })
}, null), _renderChildren());
