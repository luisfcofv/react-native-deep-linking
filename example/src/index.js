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

    DeepLinking.addRoute('/test/:id', (response) => {
      // example://test/23
      console.log(response.id); // 23
    });

    DeepLinking.addRoute('/test/:session/details', (response) => {
      // example://test/100/details
      console.log(response.session); // 100
    });
    
    Linking.openURL('example://test');
    Linking.openURL('example://test/23');
    Linking.openURL('example://test/100/details');
  }

  componentWillUnmount() {
    Linking.removeEventListener('url', DeepLinking.handleUrl);
  }

  render() {
    return <View/>;
  }
}

AppRegistry.registerComponent('example', () => App);