# How to use analytics.js without segment

## Initialize analytics.js

To initialize analytics.js without segment please read the [following article](../simple/README.md).

## Sync analytics.js page tracking with client-side routing (react-router v4)

1. Create browser history manually:
    ```js
    import { createBrowserHistory } from 'history';

    const history = createBrowserHistory();
    ```
2. Track page with analytics.js each time when location is changed
    ```js
    // Track client routing
    history.listen(() => window['analytics'].page());
    ```
3. Provide this `history` to router:
    ```js
    <Router history={history}>
        {/*...*/}
    </Router>
    ```
