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

class CodeActivation extends React.Component {
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
          <Text style={styles.TxtStyle}>
            تم ارسال كود التحقق للايميل المسجل التالي
          </Text>
          <Text style={styles.TxtStyle}>xxxxqee@gmail.com</Text>
          <Text style={styles.TxtStyle}>أو للجوال المسجل التالي</Text>
          <Text style={styles.TxtStyle}>xxxxxx7888</Text>
          <TextInput
            maxLength={20}
            placeholder={'كود الفحص '}
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

export { CodeActivation };
const styles = StyleSheet.create({
  TxtStyle: {
    fontSize: hp('2.1%'),
    textAlign: 'center',
    width: wp('90%'),
    color: '#25252A',
  },
  InputStyleNewAccount: {
    backgroundColor: 'white',
    elevation: 2,
    marginTop: hp('4%'),
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
