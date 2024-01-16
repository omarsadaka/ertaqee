import React, { Component } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

class AppTextInput extends Component {
  multiline = false;
  render() {
    return (
      <View style={styles.InputView}>
        <TextInput
          pointerEvents="none"
          multiline={this.multiline}
          onBlur={() => (this.multiline = true)}
          onFocus={() => (multiline = false)}
          placeholder={'asd asd asd'}
          placeholderTextColor={'gray'}
          style={[this.props.InputStyleNewAccount]}
        />
      </View>
    );
  }
}
export { AppTextInput };

const styles = StyleSheet.create({
  InputView: {
    borderColor: 'silver',
    marginTop: hp('2%'),
    opacity: 0.7,
    backgroundColor: 'white',
    alignItems: 'center',
    borderRadius: wp('2%'),
    borderWidth: wp('0.3%'),
    flexDirection: 'row',
    width: wp('90%'),
    height: hp('7%'),
  },
});
