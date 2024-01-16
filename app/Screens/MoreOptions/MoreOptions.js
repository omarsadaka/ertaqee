import React, { Component } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Icon } from 'react-native-elements';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import RNRestart from 'react-native-restart';
import UserProfile from '../../UserProfile';
import fonts from '../../fonts';
import strings from '../strings';

class MoreOptions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      CurrentMenu: -1,
      IsAsk: false,
      loading: false,
    };
  }

  componentWillMount() {
    try {
      let ParamsData = this.props.route.params;
      if (ParamsData)
        this.setState({
          IsAsk: ParamsData.IsAsk,
        });
    } catch {}
  }

  Share = () => {
    const shareOptions = {
      title: strings.share,
      message: strings.ertaqeeapp,
      url: 'http://play.google.com/store/apps/details?id=com.fudex.ertaqee',
    };
    Share.open(shareOptions);
  };

  share = async () => {
    const options = {
      message: `${strings.share} ${`\n\n`} ${
        strings.ertaqeeapp
      } ${`\n\n`} ${'http://play.google.com/store/apps/details?id=com.fudex.ertaqee'}`,
    };
    const response = await Share.share(options);
  };

  deleteAccount = () => {
    fetch(
      'https://www.demo.ertaqee.com/api/v1/profile/deleteAccount/' +
        UserProfile.getInstance().clientObj.user.id,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: UserProfile.getInstance().clientObj.token,
        }),
      },
    )
      .then(response => response.json())
      .then(responseJson => {
        console.log('deleteAccount:' + JSON.stringify(responseJson));
        if (responseJson.success) {
          alert(strings.deleteAccountDone);
          UserProfile.getInstance().RemoveUserObj();
          RNRestart.Restart();
        }
      })
      .catch(error => {
        console.log('deleteAccount error:' + error);
      });
  };

  NavOrSetThisState = MenuNo => {
    if (MenuNo === 1) {
      this.props.navigation.navigate('ContactUs');
    } else if (MenuNo === 2) {
      this.props.navigation.navigate('About');
    } else if (MenuNo === 3) {
      this.share();
    } else if (MenuNo === 4) {
      this.props.navigation.navigate('TOS');
    } else if (MenuNo === 5) {
      this.props.navigation.navigate('PrivacyPolicy');
    } else if (MenuNo === 6) {
      this.setState({loading: true});
      UserProfile.getInstance().RemoveUserObj();
      RNRestart.Restart();
    } else if (MenuNo === 7) {
      Alert.alert(strings.deleteAccount, strings.deleteAccountConfirm, [
        {
          text: strings.cancel,
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: strings.ok, onPress: () => this.deleteAccount()},
      ]);
    }
  };

  SideItemWithArrow = (Title, IMG, MenuNo) => {
    let IsAr = UserProfile.getInstance().Lang === 'ar';
    return (
      <TouchableOpacity
        onPress={() => this.NavOrSetThisState(MenuNo)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: hp('0.25%'),
          width: wp('90%'),
          height: hp('7%'),
        }}>
        <Image
          style={{resizeMode: 'contain', width: wp('5%'), height: hp('70%')}}
          source={IMG}
        />
        <Text
          style={{
            fontSize: hp('2%'),
            width: wp('75%'),
            color: '#25252A',
            textAlign: 'left',
            fontFamily: fonts.normal,
          }}>
          {' '}
          {Title}
        </Text>
        <Icon
          name={IsAr ? 'keyboard-arrow-left' : 'keyboard-arrow-right'}
          size={33}
          color={'#25252A'}
        />
      </TouchableOpacity>
    );
  };

  SideItemWithArrowIcon = (Title, IconName, MenuNo) => {
    let IsAr = UserProfile.getInstance().Lang === 'ar';
    return (
      <TouchableOpacity
        onPress={() => this.NavOrSetThisState(MenuNo)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: hp('0.25%'),
          width: wp('102%'),
          height: hp('7%'),
        }}>
        <Icon
          name="security"
          style={{width: wp('6%'), marginLeft: wp('6%')}}
          size={28}
          color={'silver'}
        />
        <Text
          style={{
            fontSize: hp('2%'),
            width: wp('74%'),
            color: '#25252A',
            textAlign: 'left',
            fontFamily: fonts.normal,
          }}>
          {' '}
          {Title}
        </Text>
        <Icon
          name={IsAr ? 'keyboard-arrow-left' : 'keyboard-arrow-right'}
          size={33}
          color={'#25252A'}
        />
      </TouchableOpacity>
    );
  };

  GetCurrentTitle = () => {
    return strings.moreOptions;
  };

  render() {
    let userRole = UserProfile.getInstance().clientObj.user.role[0];
    if (this.state.loading)
      return (
        <View style={styles.Loader}>
          <ActivityIndicator size="large" color="#37A0F7" />
        </View>
      );

    let IsAr = UserProfile.getInstance().Lang === 'ar';
    return (
      <SafeAreaView>
        <ImageBackground
          source={require('../../res/topbar2.png')}
          style={styles.Header}>
          <Text style={styles.MiddleTxt}>{this.GetCurrentTitle()}</Text>
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
                onPress={() => {
                  this.props.navigation.goBack();
                }}
                style={{
                  marginLeft: wp('2%'),
                  padding: 8,
                }}>
                <Icon
                  name={IsAr ? 'arrow-forward' : 'arrow-back'}
                  size={30}
                  color={'white'}
                />
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>

        <ScrollView>
          <View
            style={{
              alignItems: 'center',
              backgroundColor: '#F8F9F9',
              width: wp('100%'),
              height: hp('90%'),
            }}>
            <View
              style={{
                alignItems: 'center',
                marginTop: hp('3%'),
                width: wp('90%'),
                height: hp('70%'),
              }}>
              {this.SideItemWithArrow(
                strings.contactUs,
                require('../../res/phone.png'),
                1,
              )}
              {this.SideItemWithArrow(
                strings.aboutApp,
                require('../../res/warning.png'),
                2,
              )}
              {this.SideItemWithArrow(
                strings.share,
                require('../../res/share.png'),
                3,
              )}
              {this.SideItemWithArrow(
                strings.termsAndCond,
                require('../../res/tos.png'),
                4,
              )}
              {this.SideItemWithArrowIcon(strings.privacyPolicy, 'security', 5)}
              {userRole !== 'Guest'
                ? this.SideItemWithArrow(
                    strings.deleteAccount,
                    require('../../res/delete.png'),
                    7,
                  )
                : null}
              {this.SideItemWithArrow(
                userRole === 'Guest' ? strings.login : strings.logout,
                require('../../res/key.png'),
                6,
              )}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export default MoreOptions;
const styles = StyleSheet.create({
  Loader: {justifyContent: 'center', alignItems: 'center', flex: 1},
  Header: {
    width: wp('100%'),
    height: hp('10%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  BackArrow: {
    position: 'absolute',
    bottom: 0,
    left: wp('-8%'),
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
    right: wp('-7%'),
    bottom: hp('5%'),
    resizeMode: 'contain',
    width: wp('65%'),
    height: hp('25%'),
  },
});
