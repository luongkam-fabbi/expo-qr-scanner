import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import { AppLoading } from 'expo';
import * as Font from 'expo-font';
import * as Icon from '@expo/vector-icons';
import { Provider } from 'react-redux';
import { createLogger } from 'redux-logger';
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import AppNavigator from './src/navigations/AppNavigator';
import reducer from './src/reducers';
import rootSaga from './src/sagas';
import Home from './src/screens/Home'
import QRScanner from './src/screens/QRScanner'

const styles = StyleSheet.create({
  animationContainer: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    zIndex: 999,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  buttonContainer: {
    paddingTop: 20,
  },
});

export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
    lottieView: true,
  };

  constructor (props) {
    super(props);

    let middlewares = [];

    const sagaMiddleware = createSagaMiddleware();
    middlewares.push(sagaMiddleware);

    // if (__DEV__) {
    //   const logger = createLogger();
    //   middlewares.push(logger);
    // }

    this.store = createStore(
      reducer,
      applyMiddleware(...middlewares),
    );

    sagaMiddleware.run(rootSaga);
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Font.loadAsync({
        ...Icon.Ionicons.font,
        // 'Arial': require('./assets/fonts/Arial.ttf'),
        // 'Arial-Bold': require('./assets/fonts/Arial-Bold.ttf'),
        // 'hirakakupro-w3': require('./assets/fonts/hirakakupro-w3.otf'),
        // 'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
        // 'Roboto': require("native-base/Fonts/Roboto.ttf"),
        // 'Roboto_medium': require("native-base/Fonts/Roboto_medium.ttf"),
      }),
    ]);
  };

  _handleLoadingError = error => {
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true }, () => {
      // this.animation.play();
    });
  };

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
        <>
          <View style={[]}>
            <Provider store={this.store}>
              <QRScanner />
            </Provider>
          </View>
        </>
      );
    }
  }
}