# Overview

This repo is example how to self-host analytics.js. We built analytics.js from https://github.com/fivetran/analytics.js and are hosting it at https://static.fivetran.com/scripts/analytics.js.

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
