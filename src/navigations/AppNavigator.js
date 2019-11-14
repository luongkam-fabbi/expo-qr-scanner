import {
  createAppContainer,
  createSwitchNavigator,
} from 'react-navigation';
  
import HomeTabNavigator from './HomeTabNavigator';

const HOME = "home";

export default createAppContainer(
  createSwitchNavigator({
    // Login: LoginTabNavigator,
    HOME: HomeTabNavigator,
  }, {
    initialRouteName: HOME,
  })
);