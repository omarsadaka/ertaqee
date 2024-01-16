import React, { Component } from 'react';
import {
  I18nManager,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { Icon } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import strings from '../strings';

class Subs extends Component {
  InputFeild(PlaceHolder) {
    return (
      <View style={[styles.InputView, {opacity: 1, borderColor: '#F8F9F9'}]}>
        <TextInput
          placeholder={PlaceHolder}
          placeholderTextColor={'gray'}
          maxLength={20}
          style={[styles.InputStyleLarge]}
        />
      </View>
    );
  }
  SubItem(GradientColor, Title, SubTitle, IMG, Price) {
    return (
      <TouchableOpacity>
        <LinearGradient
          colors={GradientColor}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={styles.linearGradient}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              width: wp('45%'),
              height: hp('15%'),
            }}>
            <View
              style={{
                width: wp('30%'),
                justifyContent: 'center',
                alignItems: 'center',
                height: hp('4.5%'),
                borderRadius: wp('5%'),
                backgroundColor: '#FFFFFF',
              }}>
              <Text style={{fontSize: hp('2%'), color: '#710FC0'}}>
                {Title}
              </Text>
            </View>
            <Text
              style={{
                marginTop: hp('1%'),
                fontSize: hp('1.5%'),
                color: 'white',
              }}>
              {SubTitle}
            </Text>
          </View>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              width: wp('45%'),
              height: hp('15%'),
            }}>
            <Image
              style={{
                resizeMode: 'contain',
                height: hp('5%'),
                width: wp('10%'),
              }}
              source={IMG}
            />
            <Text
              style={{
                marginTop: hp('1%'),
                fontSize: hp('2.5%'),
                fontWeight: 'bold',
                color: 'white',
              }}>
              {Price}
            </Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <ScrollView>
        <View style={{alignItems: 'center', height: hp('100%')}}>
          <Image
            style={styles.BackGroundLogo}
            source={require('../../res/backgroundlogo.png')}
          />
          <ImageBackground
            source={require('../../res/topbar2.png')}
            style={styles.Header}>
            <View
              style={{
                alignItems: 'center',
                flexDirection: 'row',
                width: wp('95%'),
                height: hp('10%'),
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: wp('85%'),
                }}>
                <TouchableOpacity
                  onPress={() => this.props.navigation.goBack()}>
                  <Icon
                    name={I18nManager.isRTL ? 'arrow-forward' : 'arrow-back'}
                    size={30}
                    color={'white'}
                  />
                </TouchableOpacity>
                <Text style={styles.MiddleTxt}>{strings.subs}</Text>
              </View>
            </View>
          </ImageBackground>
          <View style={{width: wp('95%'), height: hp('30%')}}>
            <Text
              style={{
                marginTop: hp('2%'),
                fontSize: hp('2.5%'),
                color: '#25252A',
              }}>
              {' '}
              {strings.choose}
            </Text>
            {this.SubItem(
              ['#ED01FE', '#6A0FBD'],
              strings.annually,
              strings.getmonthForFree,
              require('../../res/gold.png'),
              '980' + strings.SAR,
            )}
          </View>
          <View style={{width: wp('95%'), height: hp('40%')}}>
            <Text
              style={{
                marginTop: hp('2%'),
                fontSize: hp('2.5%'),
                color: '#25252A',
              }}>
              {' '}
              {strings.otherPacks}
            </Text>
            {this.SubItem(
              ['#FED350', '#FF7001'],
              strings.monthly,
              strings.getWeekForFree,
              require('../../res/silver.png'),
              '240' + strings.SAR,
            )}
            {this.SubItem(
              ['#F68DC9', '#F93C7B'],
              strings.weekly,
              strings.getDayForFree,
              require('../../res/bronze.png'),
              '75' + strings.SAR,
            )}
          </View>
        </View>
      </ScrollView>
    );
  }
}

export default Subs;
const styles = StyleSheet.create({
  linearGradient: {
    flexDirection: 'row',
    marginTop: hp('2%'),
    alignSelf: 'center',
    width: wp('90%'),
    height: hp('15%'),
    borderRadius: wp('4%'),
  },
  restoreByPhone: {fontSize: hp('2%'), color: '#483F8C'},
  RestoreByPhoneOrEmail: {
    width: wp('80%'),
    height: hp('4%'),
    flexDirection: 'row',
  },
  SocendMainView: {
    alignItems: 'center',
    width: wp('100%'),
    marginTop: hp('3%'),
    height: hp('8%'),
  },
  InputView: {
    borderColor: '#F8F9F9',
    marginTop: hp('2%'),
    alignSelf: 'center',
    backgroundColor: 'white',
    alignItems: 'center',
    borderRadius: wp('2%'),
    borderWidth: wp('0.3%'),
    flexDirection: 'row',
    width: wp('85%'),
    height: hp('7%'),
  },
  BackGroundLogo: {
    position: 'absolute',
    right: wp('-7%'),
    bottom: hp('1%'),
    resizeMode: 'contain',
    width: wp('65%'),
    height: hp('25%'),
  },
  LoginBTNStyle: {
    marginTop: hp('3%'),
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: wp('85%'),
    height: hp('6.5%'),
    backgroundColor: '#4D75B8',
    borderRadius: wp('2%'),
  },
  BackArrow: {
    tintColor: 'black',
    resizeMode: 'contain',
    width: wp('4%'),
    height: hp('3.5%'),
  },
  MiddleTxt: {color: 'white', fontSize: wp('5%'), marginLeft: wp('20%')},
  FloatingBTN: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    width: 70,
    height: 70,
    borderRadius: 35,
    position: 'absolute',
    bottom: 90,
    right: 30,
  },
  NextTxt: {fontSize: hp('2%'), color: 'white'},
  InputStyle: {
    borderColor: 'silver',
    margin: 2,
    borderColor: 'silver',
    borderWidth: wp('0.1%'),
    borderRadius: wp('1%'),
    width: wp('90%'),
    marginTop: hp('2%'),
    height: hp('8%'),
    fontSize: hp('2%'),
  },
  footer: {
    width: wp('100%'),
    alignItems: 'center',
    position: 'absolute',
    height: hp('100%'),
  },
  Header: {
    width: wp('100%'),
    height: hp('10%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {fontSize: hp('2%'), color: 'white'},
  InputStyleLarge: {
    width: wp('85%'),
    height: hp('8%'),
    fontSize: hp('2%'),
    color: '#39A1F7',
  },
});
