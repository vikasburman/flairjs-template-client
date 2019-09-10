const { VueView } = await ns('flair.ui');

/**
 * @name Error404View
 * @description Default Error View
 */
Class('', VueView, function() {
    this.i18n = 'titles, strings';
    this.title = "@titles.notfound | Not Found";
    this.html = './views/404.html';

    $$('override');
    this.beforeLoad = async (base, ctx, el) => { // eslint-disable-line no-unused-vars
        base(ctx, el);
        this.data.page = ctx.$path;
    };
});
