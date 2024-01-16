import { CommonActions } from '@react-navigation/native';
import React from 'react';
import {
  ActivityIndicator,
  Alert,
  I18nManager,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Icon1 from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/FontAwesome5';

import UserProfile from '../../../UserProfile';
import fonts from '../../../fonts';
import strings from '../../strings';
import ModalActivation from './ModalActivation';

class SignIn extends React.Component {
  //T,Input1,Input2
  constructor(props) {
    super(props);
    this.state = {
      FirstInputFocused: false,
      SocendInputFocused: false,
      Input1: '',
      Input2: '',
      loading: false,
      showEye: false,
      Firstloading: false,
      visibleModalActivation: false,
    };
  }

  componentWillMount() {
    let UserCreds = UserProfile.getInstance().UserCreds;
    console.log('UserCreds omar', UserCreds);
    if (UserCreds.email.length > 2)
      this.setState({
        Firstloading: true,
        Input1: UserCreds.email,
        Input2: UserCreds.password,
      });
    else this.setState({Firstloading: false});
  }

  componentDidMount() {
    console.log(
      'UserProfile.getInstance().Lang:' + UserProfile.getInstance().Lang,
    );
    if (this.state.Input1.length > 2) this.LoginPost();
  }

  LoginTxt() {
    if (this.state.loading)
      return <ActivityIndicator size="large" color="white" />;
    return <Text style={styles.LoadingTxt}>{strings.signIn}</Text>;
  }

  IsThereAnyInputEmpty() {
    return this.state.Input1.length === 0 || this.state.Input2.length === 0;
  }

  LoginPost() {
    if (this.IsThereAnyInputEmpty()) {
      Alert.alert(strings.signIn, strings.entervaliddata, [
        {
          text: strings.cancel,
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: strings.ok, onPress: () => console.log('OK Pressed')},
      ]);
      return;
    }
    if (this.state.loading) return;
    this.setState({loading: true});

    const SignUpFormData = new FormData();
    SignUpFormData.append('identity', this.state.Input1);
    SignUpFormData.append('password', this.state.Input2);
    SignUpFormData.append('lang', UserProfile.getInstance().Lang);

    try {
      fetch('https://www.demo.ertaqee.com/api/v1/login', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-Language': UserProfile.getInstance().Lang,
        },
        body: SignUpFormData,
      }).then(response => {
        response
          .json()
          .then(responseJson => {
            console.log(
              '🚀 ~ file: SignIn.js:103 ~ SignIn ~ LoginPost ~ responseJson:',
              responseJson,
            );
            this.SetUserData(responseJson);
          })
          .catch(error => {
            console.log(
              '🚀 ~ file: SignIn.js:107 ~ SignIn ~ LoginPost ~ error:',
              error,
            );
            // alert(strings.allFeildsRequeired);
            this.setState({loading: false, Firstloading: false});
          });
      });
    } catch (error) {
      console.log('FourthErr');
      this.setState({loading: false, Firstloading: false});
      Alert.alert(strings.signIn, strings.entervaliddata, [
        {
          text: strings.cancel,
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: strings.ok, onPress: () => console.log('OK Pressed')},
      ]);
    }
  }

  SetUserData(responseJson) {
    console.log(
      '🚀 ~ file: SignIn.js:127 ~ SignIn ~ SetUserData ~ responseJson:',
      responseJson,
    );
    if (responseJson.success === true || responseJson.success === 'true') {
      UserProfile.getInstance().clientObj = responseJson.data;
      UserProfile.getInstance().UserCreds.email = this.state.Input1;
      UserProfile.getInstance().UserCreds.password = this.state.Input2;
      UserProfile.getInstance().SaveUserCreds();
      console.log(
        'UserProfile.getInstance().clientObj:' +
          JSON.stringify(UserProfile.getInstance().clientObj),
      );
      console.log('responseJson.success:' + JSON.stringify(responseJson));
      if (responseJson.message !== 'authorised') {
        if (responseJson.confirm_type === 'email') {
          Alert.alert(strings.app, responseJson.message, [
            {
              text: strings.cancel,
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {
              text: strings.confirm,
              onPress: () => this.setState({visibleModalActivation: true}),
            },
          ]);
        } else {
          Alert.alert(strings.app, responseJson.message, [
            {
              text: strings.cancel,
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {
              text: strings.confirm,
              onPress: () => this.setState({visibleModalActivation: true}),
            },
          ]);
        }
      }
      this.props.SetUserToken();
    } else {
      this.setState({loading: false});
      console.log('🚀 ~ file: SignIn.js:177 ~ SignIn ~ SetUserData ~ loading:');
      console.log('Here:' + JSON.stringify(responseJson));
      try {
        if (responseJson.errors.identity) {
          Alert.alert(strings.signIn, responseJson.errors.identity[0], [
            {
              text: strings.cancel,
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {text: strings.ok, onPress: () => console.log('OK Pressed')},
          ]);
          // alert(responseJson.errors.identity[0]);
          return;
        }
        if (responseJson.errors.password) {
          Alert.alert(strings.signIn, responseJson.errors.password[0], [
            {
              text: strings.cancel,
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {text: strings.ok, onPress: () => console.log('OK Pressed')},
          ]);
          // alert(responseJson.errors.password[0]);
          return;
        }
      } catch {
        console.log(
          '🚀 ~ file: SignIn.js:206 ~ SignIn ~ SetUserData ~ responseJson:',
          responseJson,
        );
        if (responseJson.confirm_type === 'email') {
          Alert.alert(strings.app, responseJson.message, [
            {
              text: strings.cancel,
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {
              text: strings.confirm,
              onPress: () => this.setState({visibleModalActivation: true}),
            },
          ]);
        } else
          Alert.alert(
            strings.signIn,
            responseJson.message ?? strings.entervaliddata,
            [
              {
                text: strings.cancel,
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              {text: strings.ok, onPress: () => console.log('OK Pressed')},
            ],
          );
        return;
      }
      console.log('2');
      this.setState({loading: false});

      // alert(JSON.stringify(responseJson));
    }
  }

  GoHome() {
    const user = {
      user: {
        languages_ids: null,
        skills_ids: null,
        find_job: 0,
        certs: null,
        cv: null,
        id: 13,
        code: null,
        username: '',
        mobile: null,
        full_name: null,
        first_name: null,
        last_name: null,
        phone: null,
        id_number: null,
        city: null,
        country: null,
        address: '',
        photo: null,
        email: null,
        is_verified: null,
        is_active: true,
        gender: null,
        employer: null,
        workplace: null,
        job_title: null,
        role_id: [-1],
        role: ['Guest'],
        joind_at: null,
        bank_accounts: [],
        average_rate: null,
        credences: [],
        educations: [],
        experiences: [],
        commercial_register: null,
        chamber_of_commerce: null,
        tax_record: null,
        facility_photo_3: null,
        facility_photo_2: null,
        facility_photo_1: null,
      },
      token: null,
      expires: null,
    };
    UserProfile.getInstance().clientObj = user;
    const resetAction = CommonActions.reset({
      index: 0,
      routes: [{name: 'Introduction'}],
    });
    this.props.navigation.dispatch(resetAction);
  }

  onSubmitCode(code) {
    this.setState({loading: true});
    const SignUpFormData = new FormData();
    SignUpFormData.append('email', this.state.Input1);
    SignUpFormData.append('code', code);
    console.log('SignUpFormData ', SignUpFormData);
    try {
      fetch('https://www.demo.ertaqee.com/api/v1/verifyAccount', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-Language': UserProfile.getInstance().Lang,
        },
        body: SignUpFormData,
      }).then(response => {
        console.log(response);
        response
          .json()
          .then(responseJson => {
            console.log('SignUp responseJson1:' + JSON.stringify(responseJson));
            if (responseJson.success) {
              this.setState({
                loading: false,
                visibleModalActivation: false,
              });
              Alert.alert(strings.signIn, responseJson.message, [
                {
                  text: strings.cancel,
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
                {text: strings.ok, onPress: () => console.log('OK Pressed')},
              ]);
              // alert(responseJson.message);
            } else {
              this.setState({
                loading: false,
              });
              Alert.alert(strings.signIn, strings.enterCodeCorrect, [
                {
                  text: strings.cancel,
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
                {text: strings.ok, onPress: () => console.log('OK Pressed')},
              ]);
              // alert(strings.enterCodeCorrect);
            }
          })
          .catch(error => {
            console.log(
              '🚀 ~ file: SignIn.js:315 ~ SignIn ~ onSubmitCode ~ error:',
              error,
            );
            console.log('Thirderr1:' + JSON.stringify(error));
            this.setState({loading: false});
          });
      });
    } catch (error) {
      console.log('FourthErr1', JSON.stringify(error));
      this.setState({loading: false});
    }
  }

  render() {
    if (this.state.Firstloading)
      return (
        <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
          <ActivityIndicator size="large" color="#37A0F7" />
        </View>
      );
    return (
      <ScrollView>
        <View style={styles.MainView}>
          <Icon1
            name="language"
            size={30}
            style={{
              position: 'absolute',
              padding: 10,
              top: 40,
              right: 30,
              zIndex: 10000,
            }}
            color={'#5B739F'}
            onPress={() => this.props.navigation.navigate('ChangeLanguage')}
          />
          <Image
            style={styles.BackGroundLogo}
            source={require('../../../res/backgroundlogo.png')}
          />

          <View style={styles.HiAgainView}>
            <Text style={styles.HiAgainTxt}> {strings.hiAgain}</Text>
            <Text style={styles.EnterMainTxt}> {strings.enterUsername}</Text>
          </View>

          <View style={styles.UserName}>
            <Text style={styles.label}>{strings.email}</Text>
            <TextInput
              blurOnSubmit={false}
              onChangeText={text => this.setState({Input1: text})}
              onSubmitEditing={() => {
                this.secondTextInput.focus();
              }}
              keyboardType="email-address"
              placeholder={strings.email}
              placeholderTextColor={'gray'}
              onFocus={() => {
                this.setState({
                  FirstInputFocused: !this.state.FirstInputFocused,
                });
              }}
              style={[
                styles.InputStyle,
                {
                  borderColor: this.state.FirstInputFocused
                    ? '#8BD1EF'
                    : 'silver',
                },
              ]}
            />

            <View style={{marginTop: hp('2%')}} />
            <Text style={styles.label}>{strings.password}</Text>
            <View
              style={[
                styles.InputStyle,
                {
                  borderColor: this.state.SocendInputFocused
                    ? '#8BD1EF'
                    : 'silver',
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  alignContent: 'space-between',
                },
              ]}>
              <TextInput
                blurOnSubmit={true}
                onChangeText={text => this.setState({Input2: text})}
                placeholder={strings.password}
                placeholderTextColor={'gray'}
                onFocus={() => {
                  this.setState({
                    SocendInputFocused: !this.state.SocendInputFocused,
                  });
                }}
                secureTextEntry={!this.state.showEye}
                onSubmitEditing={() => {
                  this.LoginPost();
                }}
                ref={input => {
                  this.secondTextInput = input;
                }}
                style={[
                  styles.InputStyle1,
                  // {
                  //   borderColor: this.state.SocendInputFocused
                  //     ? '#8BD1EF'
                  //     : 'silver',
                  // },
                ]}
              />
              <Icon
                name={this.state.showEye ? 'eye' : 'eye-slash'}
                size={hp('2%')}
                color={!this.state.showEye ? 'black' : '#39A1F7'}
                onPress={() => {
                  this.setState({showEye: !this.state.showEye});
                }}
              />
            </View>
          </View>

          <View style={styles.SocendMainView}>
            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.LoginBTNStyle}
              onPress={() => this.LoginPost()}>
              {this.LoginTxt()}
            </TouchableOpacity>
          </View>

          <View style={styles.ThirdMainView}>
            <TouchableOpacity
              style={{alignItems: 'center', fontSize: hp('3%')}}
              onPress={() => this.props.navigation.navigate('ForgetPasswords')}>
              <Text style={styles.ForgetPassTxt}>
                {' '}
                {strings.forgetPassword}
              </Text>
            </TouchableOpacity>

            <View style={styles.FourthMainView}>
              <Text style={styles.dontHaveAnAccount}>
                {' '}
                {strings.dontHaveAnAccount}
              </Text>
              <TouchableOpacity
                onPress={() => this.props.SwitchScreen()}
                style={styles.ForgetPass}>
                <Text style={styles.signupNow}> {strings.signupNow}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={{alignItems: 'center', fontSize: hp('3%')}}
            onPress={() => this.GoHome()}>
            <Text style={styles.signupNow}> {strings.skipLogin}</Text>
          </TouchableOpacity>

          <ModalActivation
            visible={this.state.visibleModalActivation}
            changeState={() => {
              this.setState({visibleModalActivation: false});
            }}
            onDone={code => {
              this.onSubmitCode(code);
            }}
            type={'email'}
          />
        </View>
      </ScrollView>
    );
  }
}

export { SignIn };
const styles = StyleSheet.create({
  LoginBTNStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    width: wp('90%'),
    height: hp('6%'),
    backgroundColor: '#4D75B8',
    borderRadius: wp('3%'),
  },
  InputStyle: {
    borderRadius: wp('3%'),
    borderWidth: wp('0.5%'),
    paddingStart: wp('2%'),
    textAlign: I18nManager.isRTL ? 'right' : 'left',
    width: wp('90%'),
    height: hp('7%'),
    fontSize: hp('1.7%'),
    color: '#39A1F7',
    fontFamily: fonts.bold,
  },
  InputStyle1: {
    paddingStart: wp('2%'),
    textAlign: I18nManager.isRTL ? 'right' : 'left',
    width: wp('80%'),
    height: hp('7%'),
    fontSize: hp('1.7%'),
    color: '#39A1F7',
    fontFamily: fonts.bold,
  },
  BackGroundLogo: {
    position: 'absolute',
    marginLeft: wp('40%'),
    resizeMode: 'contain',
    width: wp('80%'),
    height: hp('25%'),
  },
  LoadingTxt: {fontSize: hp('2.5%'), color: 'white', fontFamily: fonts.normal},
  MainView: {flex: 1, alignItems: 'center'},
  HiAgainView: {width: wp('100%'), marginTop: hp('15%'), height: hp('11%')},
  HiAgainTxt: {
    fontSize: hp('4%'),
    textAlign: 'left',
    marginStart: wp('2%'),
    color: '#483F8C',
    fontFamily: fonts.bold,
  },
  EnterMainTxt: {
    marginTop: hp('1%'),
    fontSize: hp('1.8%'),
    color: 'silver',
    textAlign: 'left',
    marginStart: wp('3%'),
    fontFamily: fonts.bold,
  },
  UserName: {
    alignItems: 'center',
    width: wp('100%'),
    marginTop: hp('10%'),
  },
  SocendMainView: {
    alignItems: 'center',
    width: wp('100%'),
    marginTop: hp('4%'),
    height: hp('7%'),
  },
  ThirdMainView: {width: wp('100%'), marginTop: hp('6%'), height: hp('10%')},
  Forgetpassword: {alignItems: 'center', height: hp('4%')},
  ForgetPassTxt: {
    fontSize: hp('1.8%'),
    color: '#8BD1EF',
    fontFamily: fonts.bold,
  },
  FourthMainView: {
    justifyContent: 'center',
    flexDirection: 'row',
    width: wp('100%'),
    marginTop: hp('2%'),
    height: hp('20%'),
    fontFamily: fonts.bold,
  },
  dontHaveAnAccount: {
    fontSize: hp('1.8%'),
    color: '#29235C',
    fontFamily: fonts.bold,
  },
  signupNow: {
    fontSize: hp('1.8%'),
    color: '#4D75B8',

    textDecorationLine: 'underline',
    fontFamily: fonts.bold,
  },
  label: {
    fontFamily: fonts.normal,
    fontSize: hp('1.8%'),
    width: '90%',
    textAlign: 'left',
    color: 'black',
  },
});
