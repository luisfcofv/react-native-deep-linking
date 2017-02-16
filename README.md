<p align="center">
  <img title="react-native-deep-linking" src="logo.png" height="200">
</p>

<p align="center">
  <a href="https://travis-ci.org/luisfcofv/react-native-deep-linking"><img src="https://img.shields.io/travis/luisfcofv/react-native-deep-linking.svg" alt="CI Status" /></a>
  <a href="https://codecov.io/github/luisfcofv/react-native-deep-linking"><img src="https://img.shields.io/codecov/c/github/luisfcofv/react-native-deep-linking.svg" alt="Coverage" /></a>
  <a href="http://npm.im/react-native-deep-linking"><img src="https://img.shields.io/npm/v/react-native-deep-linking.svg" alt="Version" /></a>
  <a href="http://npm-stat.com/charts.html?package=react-native-deep-linking&from=2017-02-13"><img src="https://img.shields.io/npm/dm/react-native-deep-linking.svg" alt="Downloads" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/npm/l/react-native-deep-linking.svg" alt="License" /></a>
  <a href="https://github.com/semantic-release/semantic-release"><img src="https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg" alt="Semantic Release" /></a>
  <a href="https://greenkeeper.io/"><img src="https://badges.greenkeeper.io/luisfcofv/react-native-deep-linking.svg" alt="Greenkeeper" /></a>
</p>

## Overview

React Native route-matching library to handle deep links.

## Installation

This package is distributed via npm:

```
npm install react-native-deep-linking
```

## Usage

#### 1. Add deep link support to your app following this [guide](https://facebook.github.io/react-native/docs/linking.html).

#### 2. Import DeepLinking
```javascript
import DeepLinking from 'react-native-deep-linking';
```

#### 3. Register schemes
```javascript
DeepLinking.addScheme('example://');
```

#### 4. Add event listener
```javascript
import { Linking } from 'react-native';
...
Linking.addEventListener('url', DeepLinking.handleUrl);
```

#### 5. Register routes
```javascript
DeepLinking.addRoute('/test/:id', (response) => {
  // example://test/23
  console.log(response.id); // 23
});
```

## Example

```javascript
import React, { Component } from 'react';
import { AppRegistry, View, Linking } from 'react-native';

import DeepLinking from 'react-native-deep-linking';

export default class App extends Component {
  componentDidMount() {
    DeepLinking.addScheme('example://');
    Linking.addEventListener('url', DeepLinking.handleUrl);

    DeepLinking.addRoute('/test', () => {
      // example://test
      console.log('It matched');
    });

    DeepLinking.addRoute('/test/:id', ({ id }) => {
      // example://test/23
      console.log(id); // `23`
    });

    DeepLinking.addRoute('/test/:session/details', ({ session }) => {
      // example://test/100/details
      console.log(session); // `100`
    });
  
    Linking.openURL('example://test');
    Linking.openURL('example://test/23');
    Linking.openURL('example://test/100/details');
  }

  componentWillUnmount() {
    Linking.removeEventListener('url', DeepLinking.handleUrl);
  }

  render() {
    return <View />;
  }
}

AppRegistry.registerComponent('example', () => App);
```

## Routes

The format of a deep link URL is the following: `<scheme>://<host>/<path-component>`

Example `facebook://profile`
```javascript
// The following route matches the URL.
DeepLinking.addRoute('/profile', ({ scheme, path }) => {
  console.log(scheme); // `facebook://`
  console.log(path); // `/profile`
});

// The following route does NOT match the URL.
DeepLinking.addRoute('profile', () => { ... });
```

Example `facebook://profile/33138223345`
```javascript
// The following route matches the URL.
DeepLinking.addRoute('/profile/:id', ({ scheme, path, id }) => {
  console.log(scheme); // `facebook://`
  console.log(path); // `/profile/33138223345`
  console.log(id); // `33138223345`
});
```

Example `facebook://profile/12/posts/403`
```javascript
// The following route matches the URL.
DeepLinking.addRoute('profile/:id/posts/:postId', ({ scheme, path, id, postId }) => {
  console.log(scheme); // `facebook://`
  console.log(path); // `/profile/12/posts/403`
  console.log(id); // `12`
  console.log(postId); // `403`
});
```

### Regex Routes

Need something more powerful? You can add your own regex.

Example `facebook://profile/123/details`
```javascript
const regex = /\/profile\/(.*)\/details/g;
DeepLinking.addRoute(regex, ({ scheme, path, match }) => {
  console.log(scheme); // `facebook://`
  console.log(path); // `/profile/33138223345/details`
  console.log(match); // `[ "/profile/123/details", "123" ]`
});
```

## Contributing

Read up on our guidelines for [contributing](CONTRIBUTING.md).

## License

DeepLinking is licensed under the [MIT License](LICENSE).
