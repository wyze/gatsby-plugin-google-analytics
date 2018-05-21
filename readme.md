# @wyze/gatsby-plugin-google-analytics

[![Build Status][travis-image]][travis-url]
[![npm][npm-image]][npm-url]
[![Codecov.io][codecov-image]][codecov-url]

> A Gatsby plugin to add Google Analytics.

## Installation

### Yarn

```
$ yarn add --dev @wyze/gatsby-plugin-google-analytics
```

### npm

```
$ npm install --save-dev @wyze/gatsby-plugin-google-analytics
```

## Usage

```js
// gatsby-config.js

module.exports = {
  // ...
  plugins: [
    {
      resolve: '@wyze/gatsby-plugin-google-analytics',
      options: {
        gaPlugins: {
          config: [
            {
              name: 'eventTracker',
              options: {
                events: [ 'click', 'contextmenu' ],
                hitFilter: [
                  '@@/ga-function',
                  [ 'model', 'element', 'event', `model.set('eventAction', event.type, true)` ],
                ],
              },
            },
            'outboundLinkTracker',
          ],
          sources: 'js/autotrack.custom.js',
        }
        trackingId: 'UA-123456-1',
      },
    },
  ]
}
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| anonymize | boolean | true | Anonymize information sent to GA. |
| gaPlugins | object | | Specify Google Analytic plugins. |
| **gaPlugins.config** | (object \| string)[] | | Configuration for additional scripts that were included. |
| **gaPlugins.config[].name** | string | | Plugin name to require. |
| **gaPlugins.config[].options** | object | | Options to pass to plugin. |
| **gaPlugins.sources** | string[] | | Additional scripts to include. |
| respectDNT | boolean | true | Respect user's `Do Not Track` setting. |
| **trackingId** | string | | Tracking code from Google Analytics. |

*Note:* Bold denotes required fields.

### Function as a gaPlugin option

Some plugins for Google Analytics allow you to specify a function to override certain functionality. Unfortunalty Gatsby calls `JSON.stringify` on plugin options before passing them into the plugin. This plugin uses special syntax to work around that limitation and pass a function to the Google Analytics plugin.

See the example for [`eventTracker`](https://github.com/googleanalytics/autotrack/blob/master/docs/common-options.md#eventtracker-1) and we will replicate the plugin options below.

```js
module.exports = {
  // ...
  gaPlugins: {
    config: [
      {
        name: 'eventTracker',
        options: {
          events: [ 'click', 'auxclick', 'contextmenu' ],
          // Key here is specifying an array with a special key
          hitFilter: [
            '@@/ga-function',
            [ 'model', 'element', 'event', `model.set('eventAction', event.type, true)` ],
          ],
        },
      },
    ],
  },
}
```

In order to transform a key to a function, we specify it as an array. The first item **must** be `@@/ga-function`, with the second item being arguments to the [`Function`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) constructor. All of the items in the array minus the last item, will be the arguments of the function. The last item in the array will be the function body.

## Change Log

> [Full Change Log](changelog.md)

### [v1.0.1](https://github.com/wyze/gatsby-plugin-google-analytics/releases/tag/v1.0.1) (2018-05-21)

* [[`d0faa6a9dd`](https://github.com/wyze/gatsby-plugin-google-analytics/commit/d0faa6a9dd)] - Add main entry point to package.json (Neil Kistner)

## License

MIT © [Neil Kistner](//neilkistner.com)

[travis-image]: https://img.shields.io/travis/wyze/gatsby-plugin-google-analytics.svg?style=flat-square
[travis-url]: https://travis-ci.org/wyze/gatsby-plugin-google-analytics

[npm-image]: https://img.shields.io/npm/v/@wyze/gatsby-plugin-google-analytics.svg?style=flat-square
[npm-url]: https://npmjs.com/package/@wyze/gatsby-plugin-google-analytics

[codecov-image]: https://img.shields.io/codecov/c/github/wyze/gatsby-plugin-google-analytics.svg?style=flat-square
[codecov-url]: https://codecov.io/github/wyze/gatsby-plugin-google-analytics
