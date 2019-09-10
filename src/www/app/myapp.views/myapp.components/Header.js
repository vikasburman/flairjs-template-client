const { VueComponent } = await ns('flair.ui');

/**
 * @name Header
 * @description Common header component
 */
Class('', VueComponent, function() {
    this.html = './views/header.html';
    this.data = {
        title: flair.info.title
    };
});
