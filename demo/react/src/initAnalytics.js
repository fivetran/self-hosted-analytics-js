export const initAnalytics = (fivetranSegmentWebhookHost: string) => {
    window['analytics'] || (window['analytics'] = []);
    window['analytics'].methods = ['identify', 'track', 'trackLink', 'trackForm', 'trackClick', 'trackSubmit', 'page', 'pageview', 'ab', 'alias', 'ready', 'group', 'on', 'once', 'off'];
    window['analytics'].factory = function(method) {
        return function() {
            var args = Array.prototype.slice.call(arguments);
            args.unshift(method);
            window['analytics'].push(args);
            return window['analytics'];
        };
    };
    for (let i = 0; i < window['analytics'].methods.length; i++) {
        const method = window['analytics'].methods[i];
        window['analytics'][method] = window['analytics'].factory(method);
    }

    // Load analytics async
    window['analytics'].load = function(callback) {
        if (document.getElementById('analytics-js')) return;

        // We make a copy if our dummy object
        window.a = window['analytics'];
        const script = document.createElement('script');
        script.async = true;
        script.id = 'analytics-js';
        script.type = 'text/javascript';
        // script.src = ('https:' === document.location.protocol ? 'https://' : 'http://') + 'path/to/your/analytics.js';
        script.src = 'https://static.fivetran.com/scripts/analytics.js';
        script.addEventListener('load', function(e) {
            if (typeof callback === 'function') {
                callback(e);
            }
        }, false);

        const first = document.getElementsByTagName('script')[0];
        first.parentNode.insertBefore(script, first);
    };

    window['analytics'].load(function() {
        // On load init our integrations
        window['analytics'].initialize({
                'Segment.io': {
                    apiKey: 'NO_KEY',
                    apiHost: fivetranSegmentWebhookHost
                }
        });
        // Now copy whatever we applied to our dummy object to the real analytics
        while (window.a.length > 0) {
            var item = window.a.shift();
            var method = item.shift();
            if (window['analytics'][method])
                window['analytics'][method].apply(window['analytics'], item);
        }
    });

    window['analytics'].page();
}
