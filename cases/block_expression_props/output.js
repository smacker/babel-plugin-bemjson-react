'use strict';

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var props = {
    a: 1
};

React.createElement('div', (0, _extends3.default)({}, props, {
    className: buildClassName({
        block: 'test'
    })
}), null);
