/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  AsyncStorage
} from 'react-native';
import Login from './src/pages/Login';
import AppFlux from './Router';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import appReducers from './src/redux/reducer/index';
import thunk from 'redux-thunk';
import { MessageBar } from 'react-native-messages';
import OneSignal from 'react-native-onesignal';
import { Actions} from 'react-native-router-flux';

const store = createStore(
    appReducers,
    window.__REDUX_DEVTOOLS_EXTENSION_ && window.__REDUX_DEVTOOLS_EXTENSION_(),
    applyMiddleware(thunk)
);

// const instructions = Platform.select({
//   ios: 'Press Cmd+R to reload,\n' +
//     'Cmd+D or shake for dev menu',
//   android: 'Double tap R on your keyboard to reload,\n' +
//     'Shake or press menu button for dev menu',
// });

export default class App extends Component<{}> {
  constructor(properties) {
    super(properties);
   
    // OneSignal.init("872eae43-21c1-44f7-80c9-ab594b66bbb6");
    // // OneSignal.init("89f9890c-2d89-4769-adcc-68469fed5ba4");
    // OneSignal.addEventListener('received', this.onReceived.bind(this));
    // OneSignal.addEventListener('opened', this.onOpened.bind(this));
    // OneSignal.addEventListener('ids', this.onIds.bind(this));
    // OneSignal.configure();
    // OneSignal.inFocusDisplaying(2);
  }

  componentDidMount() {
    OneSignal.addEventListener('opened', this.onOpened);
  }
  componentWillMount() {
    OneSignal.init('872eae43-21c1-44f7-80c9-ab594b66bbb6');

    OneSignal.addEventListener('received', this.onReceived.bind(this));
    OneSignal.addEventListener('opened', this.onOpened.bind(this));
    OneSignal.addEventListener('ids', this.onIds.bind(this));
    OneSignal.configure();
    OneSignal.inFocusDisplaying(2);
}



  componentWillUnmount() {
    OneSignal.removeEventListener('received', this.onReceived);
    OneSignal.removeEventListener('opened', this.onOpened);
    OneSignal.removeEventListener('ids', this.onIds);
  }

  onReceived(notification) {
    console.log("Notification received: ", notification);
  }

  // onOpened(openResult) {
  //   console.log('Message: ', openResult.notification.payload.body);
  //   console.log('Data: ', openResult.notification.payload.additionalData);
  //   console.log('isActive: ', openResult.notification.isAppInFocus);
  //   console.log('openResult: ', openResult);
  // }


  onOpened = ({ notification }) => {
    console.log('Tri da chon thong bao', notification.payload.additionalData.IdXeplich);
    Actions.ReceiveAssignment({textidxeplich: notification.payload.additionalData.IdXeplich});
  }
  
  onIds(device) {
    console.log('Device info: ', device);
  console.log('player id: ', device.userId);
   
   AsyncStorage.setItem('UserLogin_PlayerId', device.userId);
  }

  render() {
    return (
      <Provider store={store}>
        <View style={styles.container}>
          <AppFlux />
        </View>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#428BCA',
    paddingTop: 0,
    flex: 1
  }
})
