BEM({
    block: 'attach',
    tag: 'label',
    content: [
        {
            elem: 'control',
            tag: 'input'
        },
        ..._renderChildren()
    ]
})
