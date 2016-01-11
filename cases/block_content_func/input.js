BEM({
    block: 'test',
    content: [1, 2].map(function (i) {
        return BEM({
            elem: 'el',
            content: i
        });
    })
});
