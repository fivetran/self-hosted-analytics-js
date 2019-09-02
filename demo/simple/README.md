# How to self-host analytics.js

To run this demo, do `npm install && npm run-script start`.

## Preparation

1. Copy this snippet into the head of your site:

```html
  <script type="text/javascript">
    (function () {

      // Create a queue, but don't obliterate an existing one!
      var analytics = window.analytics = window.analytics || [];

      // If the real analytics.js is already on the page return.
      if (analytics.initialize) return;

      // If the snippet was invoked already show an error.
      if (analytics.invoked) {
        if (window.console && console.error) {
          console.error('Segment snippet included twice.');
        }
        return;
      }

      // Invoked flag, to make sure the snippet
      // is never invoked twice.
      analytics.invoked = true;

      // A list of the methods in Analytics.js to stub.
      analytics.methods = [
        'trackSubmit',
        'trackClick',
        'trackLink',
        'trackForm',
        'pageview',
        'identify',
        'reset',
        'group',
        'track',
        'ready',
        'alias',
        'debug',
        'page',
        'once',
        'off',
        'on'
      ];

      // Define a factory to create stubs. These are placeholders
      // for methods in Analytics.js so that you never have to wait
      // for it to load to actually record data. The `method` is
      // stored as the first argument, so we can replay the data.
      analytics.factory = function (method) {
        return function () {
          var args = Array.prototype.slice.call(arguments);
          args.unshift(method);
          analytics.push(args);
          return analytics;
        };
      };

      // For each of our methods, generate a queueing stub.
      for (var i = 0; i < analytics.methods.length; i++) {
        var key = analytics.methods[i];
        analytics[key] = analytics.factory(key);
      }

      // Define a method to load Analytics.js from our CDN,
      // and that will be sure to only ever load it once.
      analytics.load = function (key, options) {
        // Create an async script element based on your key.
        var stubAnalytics = analytics;
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.src = 'https://static.fivetran.com/scripts/analytics.js';

        // Insert our script next to the first script element.
        var first = document.getElementsByTagName('script')[0];
        first.parentNode.insertBefore(script, first);
        analytics._loadOptions = options;

        script.addEventListener('load', function () {
          window.analytics.initialize({
            'Segment.io': {
              apiKey: 'NO_KEY',
              // View this endpoint at https://pipedream.com/r/enxqu2io6sdml
              apiHost: 'enxqu2io6sdml.x.pipedream.net'
            }
          });

          while (stubAnalytics.length > 0) {
            var item = stubAnalytics.shift();
            var method = item.shift();
            if (stubAnalytics[method]) window.analytics[method].apply(window.analytics, item);
          }
        }, false)
      };

      // Add a version to keep track of what's in the wild.
      analytics.SNIPPET_VERSION = '4.1.0';

      // Load Analytics.js with your key, which will automatically
      // load the tools you've enabled for your account. Boosh!
      analytics.load();

      // Make the first page call to load the integrations. If
      // you'd like to manually name or tag the page, edit or
      // move this call however you'd like.
      analytics.page();
    })();

  </script>
```

3. Replace `NO_KEY` with your own key, and replace `enxqu2io6sdml.x.pipedream.net` with your own collector. If you want to use Fivetran to collect your Segment events, follow steps 1 and 2 from this guide: https://fivetran.com/docs/events/segment/segment-webhooks-setup-guide.

4. Optionally, replace https://static.fivetran.com/scripts/analytics.js with your own self-hosted copy of https://github.com/fivetran/analytics.js

5. To learn about tracking additional events, see https://segment.com/docs/sources/website/analytics.js/
