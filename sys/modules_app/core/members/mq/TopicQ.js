define([
    use('[Base]'),
    use('amqp')
], (Base, amqp) => {
    /**
     * @class app.core.mq.TopicQ
     * @classdesc app.core.mq.TopicQ
     * @desc Message queue that works on a topic based routing.
     */
    return Class('app.core.mq.TopicQ', Base, function(attr) {
        attr('override');
        attr('sealed');
        this.func('constructor', (base, topicName, options) => {
            base();

            // topic name
            this.topicName = topicName;
                        
            // options is a collective object having options for connection and amqp implementation
            // options and implOptions are: https://www.npmjs.com/package/amqp#connection-options-and-url
            this.options = options;
            if (this.options.implOptions) {
                this.implOptions = this.options.implOptions;
                delete this.options.implOptions;
            }
        });

        this.func('dispose', () => {
            this.disconnect();
        });

        attr('private');
        this.prop('options');

        attr('private');
        this.prop('implOptions');

        attr('readonly');
        this.prop('topicName');

        let _conn = null,
            _exch = null;
        attr('private');
        attr('async');
        this.func('conn', (resolve, reject) => {
            if (_exch === null) {
                if (this.implOptions) {
                    _conn = amqp.createConnection(this.options, this.implOptions);
                } else {
                    _conn = amqp.createConnection(this.options);
                }

                // setup
                _conn.on('error', reject);
                _conn.on('ready', () => {
                    // https://www.npmjs.com/package/amqp#connectionexchangename-options-opencallback
                    // options chosen for topic messaging
                    _exch = _conn.exchange(this.topicName, {
                        type: 'topic',
                        confirm: true
                    });
                    resolve();
                });
                _conn.connect(); // initiate connection
            } else {
                resolve();
            }
        });

        this.func('message', (type, data) => {
            // https://www.npmjs.com/package/amqp#exchangepublishroutingkey-message-options-callback
            let msg = {};
            msg.data = data;
            msg.options = {
                messageId: new Base()._.id,
                type: type,
                timestamp: Date.now(),
                mandatory: true,
                immediate: false,
                deliveryMode: 1,
                priority: 5,
                appId: (App ? App.info.id : '')
            };
            msg.setHeader = (key, value) => {
                msg.options.headers = msg.options.headers || {};
                msg.options.headers[key] = value;
            };
            msg.setPriority = (level) => { msg.priority = level; }
            msg.setContentType = (type, encoding) => {
                msg.options.contentType = type;
                if (encoding) {
                    msg.options.contentEncoding = encoding;
                }
            };
            return msg;
        });

        attr('async');
        this.func('publish', (resolve, reject, msg, subTopic) => {
            this.conn().then(() => {
                let topic = this.topicName;
                if (subTopic) { topic += '.' + subTopic; }
                _exch.publish(topic, msg.data, msg.options, (success) => {
                    if (success) {
                        resolve();
                    } else {
                        reject();
                    }
                });
            }).catch(reject);
        });

        attr('async');
        this.func('subscribe', (resolve, reject, qName, topicPatternSuffix, asyncFn) => {
            this.conn().then(() => {
                _conn.queue(qName, (mq) => {
                    let fn = asyncFn,
                        topicPattern = this.topicName + (topicPatternSuffix ? '.' + topicPatternSuffix : '');
                    mq.bind(_exch, topicPattern);
                    mq.subscribe({ ack: true }, (message, headers, deliveryInfo, messageObject) => {
                        fn(message.data).then(() => {
                            mq.shift();
                        }).catch(() => {
                            mq.shift(true, true);
                        });                    
                    }).addCallback((e) => { resolve(e.consumerTag); });
                });
            }).catch(reject);
        });

        this.func('unsubscribe', (qName, handle) => {
            this.conn().then(() => {
                _conn.queue(qName, (mq) => {
                    mq.unsubscribe(handle);
                });
            }).catch(reject);
        });

        this.func('disconnect', () => {
            if (_exch !== null) {
                // destroy exchange
                try {
                    _exch.destroy(true);
                    _conn.disconnect();
                    _exch = null;
                    _conn = null;
                } catch (err) {
                    // ignore as exchange could not be destroyed
                }
            }
        });
    });
});