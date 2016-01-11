var props = {b: 2};

BEM({
    block: 'test',
    props: {
        a: 1,
        ...props
    }
});
