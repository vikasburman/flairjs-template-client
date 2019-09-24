const { VueView } = await ns('flair.ui');
const ClientDateTime = await include('myapp.services.ClientDateTime');

/**
 * @name HomeView
 * @description Default Home View
 */
Class('', VueView, function() {
    $$('override');
    this.preloadData = async (base, ctx) => { // eslint-disable-line no-unused-vars
        base(ctx);
        
        this.data.now = await ClientDateTime.now();
    };
});
