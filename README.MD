# Overview

This repo is example how to use segment analytics with fivetran without segment.

For testing purpose we created Fivetran Segment connector with the following endpoint: https://events.fivetran.com/webhooks/1k56c2c4xlti6/segment

All events will be synced with this connector. 

Also, we built analytics.js from this repo: https://github.com/segmentio/analytics.js and put it to  https://static.fivetran.com/scripts/analytics.js.

# How to use

## With `yarn`

You should perform the following commands:
 - `yarn config set workspaces-experimental true`
 - `yarn install`
- To run react demo use the following command: `yarn workspace react start`
- To run simple demo: `yarn workspace simple start`

## With `npm`

To run demo, go the `./demo/<demo name>` folder, then run the following commands: 
    - `npm install`
    - `npm start`
