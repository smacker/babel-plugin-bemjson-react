import template from 'babel-template';
import * as babylon from 'babylon';

const buildCreateElement = template('React.createElement(TAG, PROPS, CHILDREN)');

module.exports = function ({ types: t }) {
  function getValueFromObject(obj, keyName, defaultValue) {
    let result = defaultValue;

    obj.forEach(function (prop) {
      const key = prop.key;

      if (key.type === 'Identifier' && key.name === keyName) {
        result = prop.value;
      }
    });

    return result;
  }

  function copyProps(bemProps) {
    const oldProps = getValueFromObject(bemProps, 'props');
    let newProps = [];

    if (oldProps) {
      newProps = oldProps.properties
        .map(function(prop) {
          return t.ObjectProperty(prop.key, prop.value);
        });
    }

    return newProps;
  }

  function getClassName(block, bemProps) {
    let classNameArguments = [t.ObjectProperty(t.Identifier('block'), block)];

    let elem = getValueFromObject(bemProps, 'elem');
    if (elem) {
      classNameArguments.push(t.ObjectProperty(t.Identifier('elem'), elem));
    }

    let mods = getValueFromObject(bemProps, 'mods');
    if (mods) {
      classNameArguments.push(t.ObjectProperty(t.Identifier('mods'), mods));
    }

    return t.CallExpression(
      t.Identifier('buildClassName'),
      [t.ObjectExpression(classNameArguments)]
    );
  }

  function getChildren(block, bemProps) {
    let content = getValueFromObject(bemProps, 'content');

    if (!content) {
      return t.NullLiteral();
    }

    if (t.isStringLiteral(content)) {
      return content;
    }

    if (t.isObjectExpression(content)) {
      return createElement(content.properties, block);
    }

    return content;
  }

  function createElement(bemProps, parentBlock) {
    let tag = getValueFromObject(bemProps, 'tag') || t.stringLiteral('div');
    let block = getValueFromObject(bemProps, 'block') || parentBlock;

    if (!block) {
      throw Error('no block');
    }

    return buildCreateElement({
      TAG: tag,
      PROPS: t.ObjectExpression([
        ...copyProps(bemProps),
        t.ObjectProperty(t.Identifier('className'), getClassName(block, bemProps))
      ]),
      CHILDREN: getChildren(block, bemProps)
    });
  }

  return {
    visitor: {
      CallExpression(path) {
        const node = path.node;
        const scope = path.scope;

        if (node.callee.name !== 'BEM') {
          return;
        }

        if (node.arguments.length !== 1) {
          throw Error('should be only one argument');
        }

        const arg = node.arguments[0];

        if (arg.type != 'ObjectExpression') {
          throw Error('should be object');
        }

        let block = getValueFromObject(arg.properties, 'block');
        if (block) {
          scope.setData('bemBlock', block);
        } else {
          block = scope.getData('bemBlock');
        }

        const ast = createElement(arg.properties, block);

        path.replaceWith(ast);
      }
    }
  };
};
