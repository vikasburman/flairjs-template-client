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
        return Date.now();
    };
});
