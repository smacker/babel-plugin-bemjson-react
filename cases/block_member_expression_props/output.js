'use strict';

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var data = {
    props: { a: 1 }
};

React.createElement('div', (0, _extends3.default)({}, data.props, {
    className: BEM.buildClassName({
        block: 'test'
    })
}), null);
