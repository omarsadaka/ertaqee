import React, { Component } from 'react';
import {
  Image,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Icon } from 'react-native-elements';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import UserProfile from '../../UserProfile';
import fonts from '../../fonts';
import strings from '../strings';

class Profile extends Component {
  UserNameAndIMG() {
    return (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: hp('5%'),
          width: wp('90%'),
          height: hp('20%'),
        }}>
        <Image
          style={styles.profileIMG}
          source={{uri: UserProfile.getInstance().clientObj.user.photo}}
        />
        <Image
          style={styles.BackArrow}
          source={require('../../res/badge.png')}
        />
        <View
          style={{
            justifyContent: 'center',
            width: wp('47%'),
            height: hp('8%'),
          }}>
          <Text
            style={{
              textAlign: 'center',
              fontSize: hp('2.5%'),
              color: '#4D75B8',
              fontFamily: fonts.normal,
            }}>
            {' '}
            {UserProfile.getInstance().clientObj.user.username}
          </Text>
          <Text
            style={{
              textAlign: 'center',
              fontSize: hp('1.5%'),
              color: 'silver',
              fontFamily: fonts.normal,
            }}>
            {' '}
            {UserProfile.getInstance().clientObj.user.email}{' '}
          </Text>
          <Text
            style={{
              textAlign: 'center',
              fontSize: hp('1.5%'),
              color: 'silver',
              fontFamily: fonts.normal,
            }}>
            {' '}
            {UserProfile.getInstance().clientObj.user.code}{' '}
          </Text>
        </View>
      </View>
    );
  }

  NavToThis(Title) {
    if (Title === strings.password)
      this.props.navigation.navigate('ChangePasswords');
    else
      this.props.navigation.navigate('SignMenu', {
        IsUpdate: true,
      });
  }

  SideItemWithArrow(Title, Desc) {
    let IsAR = UserProfile.getInstance().Lang === 'ar';
    return (
      <TouchableOpacity
        onPress={() => this.NavToThis(Title)}
        style={{
          justifyContent: 'space-between',
          flexDirection: 'row',
          alignItems: 'center',
          width: wp('90%'),
          height: hp('7%'),
        }}>
        <Text
          style={{
            flex: 1,
            fontSize: hp('2.1%'),
            color: '#25252A',
            fontFamily: fonts.normal,
            textAlign: 'left',
          }}>
          {Title}
        </Text>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'flex-end',
            flexDirection: 'row',
            // width: wp('50%'),
            height: hp('8%'),
          }}>
          <Text
            style={{
              fontSize: hp('2.1%'),
              color: 'grey',
              fontFamily: fonts.normal,
            }}>
            {Desc}
          </Text>
          <Icon
            name={IsAR ? 'keyboard-arrow-left' : 'keyboard-arrow-right'}
            size={25}
            color={'#25252A'}
          />
        </View>
      </TouchableOpacity>
    );
  }

  SideItemWithArrowIMG(Title, IMG) {
    let IsAR = UserProfile.getInstance().Lang === 'ar';
    console.log('IsAR:' + IsAR);
    return (
      <TouchableOpacity
        onPress={() => this.NavToThis(Title)}
        style={{
          justifyContent: 'space-between',
          flexDirection: 'row',
          alignItems: 'center',
          width: wp('90%'),
          height: hp('7%'),
        }}>
        <Text
          style={{
            width: wp('35%'),
            fontSize: hp('2.1%'),
            color: '#25252A',
            fontFamily: fonts.normal,
            textAlign: 'left',
          }}>
          {Title}
        </Text>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'flex-end',
            flexDirection: 'row',
            width: wp('50%'),
            height: hp('8%'),
          }}>
          <Image
            style={{width: 40, height: 40, borderRadius: 40 / 2}}
            source={IMG}
          />
          <Icon
            name={IsAR ? 'keyboard-arrow-left' : 'keyboard-arrow-right'}
            size={25}
            color={'#25252A'}
          />
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    let UserObj = UserProfile.getInstance().clientObj.user;
    console.log('UserObj', UserObj)
    let IsAR = UserProfile.getInstance().Lang === 'ar';
    return (
      <SafeAreaView style={{flex: 1}}>
        <View style={{alignItems: 'center', flex: 1}}>
          <Image
            style={styles.BackGroundLogo}
            source={require('../../res/backgroundlogo.png')}
          />
          <ImageBackground
            source={require('../../res/topbar2.png')}
            style={styles.Header}>
            <Text style={styles.MiddleTxt}>{strings.profile}</Text>
            <View
              style={{
                alignItems: 'center',
                flexDirection: 'row',
                width: wp('100%'),
                height: hp('10%'),
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: wp('100%'),
                }}>
                <TouchableOpacity
                  onPress={() => this.props.navigation.goBack()}
                  style={{marginLeft: wp('2%')}}>
                  <Icon
                    name={IsAR ? 'arrow-forward' : 'arrow-back'}
                    size={30}
                    color={'white'}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>

          <View
            style={{
              alignItems: 'center',
              backgroundColor: '#F8F9F9',
              width: wp('100%'),
              height: hp('90%'),
            }}>
            <Image
              style={styles.BackGroundLogo}
              source={require('../../res/backgroundlogo.png')}
            />
            {this.UserNameAndIMG()}
            {this.SideItemWithArrowIMG(strings.myPhoto, {uri: UserObj.photo})}
            {this.SideItemWithArrow(strings.name, UserObj.username)}
            {this.SideItemWithArrow(strings.sex, UserObj.gender)}
            {this.SideItemWithArrow(strings.country, UserObj.country)}
            {this.SideItemWithArrow(strings.city, UserObj.city)}
            {this.SideItemWithArrow(strings.email, UserObj.email)}
            {this.SideItemWithArrow(strings.phoneNumber, UserObj.mobile)}
            {this.SideItemWithArrow(strings.password, strings.ChangePassword)}
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

export default Profile;
const styles = StyleSheet.create({
  profileIMG: {width: 70, height: 70, borderRadius: 70 / 2},
  Header: {
    width: wp('100%'),
    height: hp('9%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  BackArrow: {
    position: 'absolute',
    top: hp('8%'),
    left: wp('25%'),
    resizeMode: 'contain',
    width: wp('25%'),
    height: hp('4%'),
  },
  MiddleTxt: {
    width: wp('100%'),
    alignSelf: 'center',
    textAlign: 'center',
    position: 'absolute',
    right: wp('0%'),
    left: wp('0%'),
    color: 'white',
    fontSize: wp('5%'),
    fontFamily: fonts.normal,
  },
  BackGroundLogo: {
    position: 'absolute',
    right: wp('-5%'),
    bottom: hp('5%'),
    resizeMode: 'contain',
    width: wp('75%'),
    height: hp('35%'),
  },
});
