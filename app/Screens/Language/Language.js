import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';

import React from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import UserProfile from '../../UserProfile';
import fonts from '../../fonts';

class Language extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      NoLang: false,
      Loading: true,
    };
  }

  componentDidMount() {
    this.GetUserLang();
  }

  async GetUserLang() {
    // UserProfile.getInstance().RemoveUserObj();
    // await AsyncStorage.removeItem('lang');
    // return;//T,
    await AsyncStorage.getItem('lang', (err, result) => {
      console.log(
        '🚀 ~ file: Language.js:38 ~ Language ~ awaitAsyncStorage.getItem ~ result:',
        result,
      );
      if (result !== null) {
        console.log('heeeeeeeeeeeeeeeere');
        UserProfile.getInstance().Lang = result;
        const resetAction = CommonActions.reset({
          index: 0,
          routes: [{name: 'Welcome'}],
        });
        this.props.navigation.dispatch(resetAction);
      } else {
        this.setState({Loading: false, NoLang: true});
        console.log('No Lang');
        // this.ChooseThisLang('ar');
      }
    });
  }

  ChooseThisLang(Lang) {
    console.log('ChooseThisLang:' + Lang);
    this.setState({Loading: true});
    UserProfile.getInstance().SetThisLangSelected(Lang);
  }

  render() {
    if (this.state.Loading)
      return (
        <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
          <ActivityIndicator size="large" color="#37A0F7" />
        </View>
      );
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Image
          style={styles.BackGroundLogo}
          source={require('../../res/backgroundlogo.png')}
        />
        <View
          style={{
            width: wp('70%'),
            height: hp('10%'),
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.LoginBTNStyle}
            onPress={() => this.ChooseThisLang('ar')}>
            <Text style={styles.LoadingTxt}>العربية</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.LoginBTNStyle}
            onPress={() => this.ChooseThisLang('en')}>
            <Text style={styles.LoadingTxt}>English</Text>
          </TouchableOpacity>
        </View>
        <Image
          style={styles.BackGroundLogo2}
          source={require('../../res/backgroundlogo.png')}
        />
      </View>
    );
  }
}

export default Language;
const styles = StyleSheet.create({
  LoginBTNStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    width: wp('30%'),
    height: hp('7%'),
    backgroundColor: '#407da1',
    borderRadius: wp('10%'),
  },
  BackGroundLogo: {
    position: 'absolute',
    top: hp('5%'),
    left: wp('3%'),
    resizeMode: 'contain',
    width: wp('80%'),
    height: hp('25%'),
  },
  BackGroundLogo2: {
    position: 'absolute',
    bottom: hp('-10%'),
    right: wp('-10%'),
    resizeMode: 'contain',
    width: wp('90%'),
    height: hp('50%'),
  },
  LoadingTxt: {fontSize: hp('2%'), color: 'white', fontFamily: fonts.normal},
});
