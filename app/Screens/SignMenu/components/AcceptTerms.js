/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import fonts from '../../../fonts';
import strings from '../../strings';
class AcceptTerms extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderCheckBox() {
    const {checked} = this.props;
    return (
      <TouchableOpacity
        style={{
          width: 15,
          height: 15,
          borderRadius: 1,
          borderColor: '#39A1F7',
          borderWidth: 1,
          marginTop: 7,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onPress={() => {
          this.props.onChange();
        }}>
        {checked ? (
          <View
            style={{
              width: 10,
              height: 10,
              borderRadius: 1,
              backgroundColor: '#39A1F7',
            }}></View>
        ) : (
          <View style={{display: 'none'}}></View>
        )}
      </TouchableOpacity>
    );
  }

  render() {
    const {onTermsClicked} = this.props;
    return (
      <View
        style={[
          {
            flexDirection: 'row',
            flex: 1,
            width: wp('90%'),
            alignItems: 'center',
            alignContent: 'center',
            alignContent: 'flex-start',
            marginTop: wp('4%'),
          },
        ]}>
        {this.renderCheckBox()}
        <TouchableOpacity onPress={() => onTermsClicked()}>
          <Text
            style={{
              color: '#000',
              fontSize: hp('2%'),
              marginHorizontal: 7,
              fontFamily: fonts.normal,
            }}>
            {strings.accept_terms}{' '}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default AcceptTerms;
