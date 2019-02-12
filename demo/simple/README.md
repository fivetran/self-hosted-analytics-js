# How to use analytics.js without segment

## Preparation

1. Go to the segment website: https://segment.com/docs/sources/website/analytics.js/quickstart/ and copy non-minified code snippet
1. Paste this snippet into the head of your site
1. Create Segment Webhook connector in Fivetran (Should perfor 1 and 2 steps from this guide: https://fivetran.com/docs/events/segment/segment-webhooks-setup-guide)

## Modify code snippet

1. In code snippet replace this string:
    ```js
    script.src = 'https://cdn.segment.com/analytics.js/v1/' + key + '/analytics.min.js';
    ```
    to 
    ```js
    script.src = 'https://static.fivetran.com/scripts/analytics.js';
    ```
    Or you can download `analytics.js` from the [analytics github repo](https://github.com/segmentio/analytics.js?files=1) and put it to your website (in this case replace `script.src` to your path).

2. Add the following lines of code: 
    ```js
    var stubAnalytics = analytics;
    script.addEventListener('load', function() {
        window.analytics.initialize({
            'Segment.io': {
                apiKey: 'NO_KEY',
                apiHost: 'PASTE YOUR FIVETRAN WEBHOOK URL HERE'
            }
        });

        while (stubAnalytics.length > 0) {
            var item = stubAnalytics.shift();
            var method = item.shift();
            if (stubAnalytics[method]) window.analytics[method].apply(window.analytics, item);
        }
    }, false)
    ```
    After inserting script:
    ```js
    // Insert our script next to the first script element.
    var first = document.getElementsByTagName('script')[0];
    first.parentNode.insertBefore(script, first);
    analytics._loadOptions = options;
    ```
    And replace `PASTE YOUR FIVETRAN WEBHOOK URL HERE` with your Fivetran Segment webhook url.
3. Done. Now you can track anything with `analytics.js` and Fivetran. To read more, please, look at Segment Analytics docs: https://segment.com/docs/sources/website/analytics.js/
