/**
 * @name DateTimeService
 * @description DateTimeService
 */
$$('static');
Class('', function() {
    $$('cache', 10000);
    this.now = async () => {
        // pure client way of keeping data logic separate 
        // on an app that connects to server it can fetch data from server
        // as shown below
        return Date.now();
    };

    // $$('cache', 10000);
    // $$('fetch', 'app-server', 'get-json', '/now');
    // this.now = async (api) => {
    //     let result = await api();
    //     return result || 'Could not connect to server.';
    // };
});
