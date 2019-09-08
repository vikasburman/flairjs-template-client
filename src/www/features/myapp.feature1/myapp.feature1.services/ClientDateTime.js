/**
 * @name ClientDateTime
 * @description ClientDateTime
 */
$$('static');
Class('', function() {
    $$('cache', 10000);
    this.now = async () => {
        return Date.now();
    };
});
