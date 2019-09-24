/**
 * @name DateTimeService
 * @description DateTimeService
 */
$$('static');
Class('', function() {
    $$('cache', 10000);
    this.now = async (type = 'ms') => {
        // pure client way of keeping data logic separate 
        // on an app that connects to server it can fetch data from server
        // as shown below
        let result = '';
        switch (type) {
            case 'ms': result = Date.now().toString(); break;
            case 'iso': result = new Date().toISOString(); break;
            case 'utc': result = new Date().toUTCString(); break;
            default: result = new Date().toJSON().toString(); break;
        }
        return result;
    };

    // $$('cache', 10000);
    // $$('fetch', 'app-server', 'get-json', '/now/:format');
    // this.now = async (api, format = 'ms') => {
    //     let apiArgs = {
    //         format: format
    //     };
    //     let result = await api(apiArgs);
    //     return result || 'Could not connect to server.';
    // };
});
