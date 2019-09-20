const { VueView } = await ns('flair.ui');

/**
 * @name Error404View
 * @description Default Error View
 */
Class('', VueView, function() {
    $$('override');
    this.beforeLoad = async (base, ctx, el) => { // eslint-disable-line no-unused-vars
        base(ctx, el);
        this.data.page = ctx.$path;
    };
});
