import React from 'react';
import {
  I18nManager,
  StyleSheet, Text, TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

class ChangeEmailPass extends React.Component {
  render() {
    return (
      <View
        style={{
          alignItems: 'center',
          backgroundColor: '#F8F9F9',
          bottom: 0,
          position: 'absolute',
          width: wp('100%'),
          height: hp('91%'),
        }}>
        <View
          style={{marginTop: hp('5%'), width: wp('90%'), height: hp('91%')}}>
          <Text
            style={{fontSize: hp('2.1%'), width: wp('90%'), color: 'black'}}>
            تغير البريد الالكتروني
          </Text>
          <TextInput
            maxLength={20}
            placeholder={'تأكيد البريد الجديد '}
            placeholderTextColor={'gray'}
            style={[styles.InputStyleNewAccount]}
          />
          <TouchableOpacity style={styles.LoginBTNStyle}>
            <Text style={styles.NextTxt}>حفظ</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export { ChangeEmailPass };
const styles = StyleSheet.create({
  InputStyleNewAccount: {
    backgroundColor: 'white',
    elevation: 2,
    marginTop: hp('2%'),
    width: wp('85%'),
    height: hp('7%'),
    fontSize: hp('2%'),
    color: '#39A1F7',
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
  LoginBTNStyle: {
    marginTop: hp('3%'),
    justifyContent: 'center',
    alignItems: 'center',
    width: wp('85%'),
    height: hp('6%'),
    backgroundColor: '#4D75B8',
    borderRadius: wp('0.7%'),
  },
  NextTxt: {fontSize: hp('2%'), color: 'white'},
});
