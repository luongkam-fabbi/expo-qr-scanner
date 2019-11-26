import React from 'react';
import {
  ScrollView,
  View,
  TouchableOpacity,
  Text,
} from 'react-native';
import { connect } from 'react-redux';
import { SC_SCANNER, SC_HOME } from "../constants/screens";


class HomeScreen extends React.Component {
  constructor (props) {
    super (props);
  }

  gotoSC = (screenName) => (e) => {
    this.props.navigation.navigate(screenName);
  };

  render() {
    return (
      <ScrollView
        // onScroll={this.homeScrollViewOnScroll}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <TouchableOpacity
            style={
              {
                backgroundColor: 'red',
                width: 200,
                height: 50,
              }
            }
            onPress={this.gotoSC(SC_SCANNER)}
          >
            <Text>Click me</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
}

export default connect(null, null)(HomeScreen)