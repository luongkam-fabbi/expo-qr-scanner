import {
  createAppContainer,
  createSwitchNavigator,
} from 'react-navigation';
import { SC_SCANNER, SC_HOME } from "../constants/screens";
import SCScanner from '../screens/QRScanner'
import SCHome from '../screens/Home'

// import HomeTabNavigator from './HomeTabNavigator';



export default createAppContainer(
  createSwitchNavigator({
    // Login: LoginTabNavigator,
    [SC_SCANNER]: {screen: SCScanner},
    // [SC_HOME]: HomeTabNavigator,
    [SC_HOME]: { screen: SCHome },
  })
);