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
          if (t.isObjectProperty(prop) || t.isSpreadProperty(prop)) {
            return prop;
          }

          throw Error('Wrong type of property');
        });
    }

    return newProps;
  }

  function getClassName(block, bemProps) {
    if (!block) {
      return t.stringLiteral('');
    }

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

  function getChildren(block, content, state) {
    if (!content) {
      return t.NullLiteral();
    }

    if (t.isStringLiteral(content)) {
      return content;
    }

    if (t.isObjectExpression(content)) {
      return createElement(content.properties, block, state);
    }

    if (t.isArrayExpression(content)) {
      return content.elements.map((elem) => {
        return getChildren(block, elem, state);
      });
    }

    return content;
  }

  function createElement(bemProps, parentBlock, state) {
    let tag = getValueFromObject(bemProps, 'tag') || t.stringLiteral('div');
    let block = getValueFromObject(bemProps, 'block') || parentBlock;
    let children = getChildren(block, getValueFromObject(bemProps, 'content'), state);

    if (!Array.isArray(children)) {
      children = [children];
    }

    return t.CallExpression(state.callee, [
      tag,
      t.ObjectExpression([
        ...copyProps(bemProps),
        t.ObjectProperty(t.Identifier('className'), getClassName(block, bemProps))
      ]),
      ...children
    ]);
  }

  return {
    visitor: {
      Program(path, state) {
        let id = state.opts.pragma || 'React.createElement';

        state.set(
          'jsxIdentifier',
          id.split('.')
            .map((name) => t.identifier(name))
            .reduce(function (object, property) {
              return t.memberExpression(object, property);
            })
        );
      },

      CallExpression(path, file) {
        const node = path.node;
        const scope = path.scope;
        const state = {callee: file.get('jsxIdentifier')};

        if (node.callee.name !== 'BEM') {
          return;
        }

        if (node.arguments.length !== 1) {
          throw Error('should be only one argument');
        }

        const arg = node.arguments[0];

        if (arg.type != 'ObjectExpression') {
          return;
        }

        let block = getValueFromObject(arg.properties, 'block');
        if (block) {
          scope.setData('bemBlock', block);
        } else {
          block = scope.getData('bemBlock');
        }

        const ast = createElement(arg.properties, block, state);

        path.replaceWith(ast);
      }
    }
  };
};
