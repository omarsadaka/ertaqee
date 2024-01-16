import React, { Component } from 'react';
import {
  ActivityIndicator,
  I18nManager,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Icon } from 'react-native-elements';
import Icon2 from 'react-native-vector-icons/FontAwesome5';
import UserProfile from '../../UserProfile';
import { RadioButton } from '../common';
import strings from '../strings';

import { Text } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import fonts from '../../fonts';

class ChangePasswords extends Component {
  constructor(props) {
    super(props);
    this.state = {
      RestoreByPhoneOrEmail: true,
      CurrentPhase: 2,
      CurrentFocusedInput: -1,
      restoreInput: '',
      loading: false,
      token: '',
      restoreEmail: '',
      password: '',
      current_password: '',
      password_confirmation: '',
      showEye: false,
      showEyeNew: false,
      showEyeConfirm: false,
    };
  }

  /*
          CurrentPhase:
          0=> ChooseHowToRestore
          1=> RestorePassword
          2=> ConfirmIdentity
          3=> EnterPassWords
        */

  ChooseHowToRestore() {
    if (this.state.CurrentPhase == 0)
      return (
        <View style={styles.MainView}>
          <View style={[styles.FirstMainView, {marginHorizontal: wp('5%')}]}>
            <Text style={styles.forgetPassword}> {strings.changePassword}</Text>
            <Text style={styles.justEnterEmailAndPass}>
              {' '}
              {strings.chooseHowToChange}
            </Text>
          </View>

          <View style={styles.SocendMainView}>
            <TouchableOpacity
              onPress={() => this.setState({RestoreByPhoneOrEmail: true})}
              style={styles.RestoreByPhoneOrEmail}>
              <RadioButton
                selected={this.state.RestoreByPhoneOrEmail}
                color={'#39A1F7'}
                style={{}}
              />
              <Text style={styles.restoreByPhone}> {strings.sendToMobile}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.setState({RestoreByPhoneOrEmail: false})}
              style={[styles.RestoreByPhoneOrEmail, {marginTop: hp('1%')}]}>
              <RadioButton
                selected={!this.state.RestoreByPhoneOrEmail}
                color={'#39A1F7'}
                style={{}}
              />
              <Text style={styles.restoreByPhone}> {strings.sendToEmail}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.ThirdMainView}>
            <TouchableOpacity
              onPress={() => this.NextOrBack(true)}
              style={styles.LoginBTNStyle}>
              <Text style={styles.NextTxt}>{strings.next}</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    return;
  }

  IsThereAnyInputEmpty() {
    // if (this.state.CurrentPhase == 1)
    //   return this.state.restoreInput.length === 0;
    // else if (this.state.CurrentPhase == 1)
    //   return (
    //     this.state.current_password.length === 0 ||
    //     this.state.password.length === 0 ||
    //     this.state.password_confirmation.length === 0
    //   );
    return (
      this.state.current_password.length === 0 ||
      this.state.password.length === 0 ||
      this.state.password_confirmation.length === 0
    );
  }

  ForgetPost() {
    if (this.IsThereAnyInputEmpty()) {
      alert(strings.entervaliddata);
      return;
    }

    if (this.state.loading) return;
    const {RestoreByPhoneOrEmail} = this.state;
    this.setState({loading: true});

    const MyFormData = new FormData();
    MyFormData.append(
      RestoreByPhoneOrEmail ? 'mobile' : 'email',
      this.state.restoreInput,
    );

    let APILink = 'https://www.demo.ertaqee.com/api/v1/password/';
    APILink += RestoreByPhoneOrEmail ? 'sms' : 'email';
    console.log('APILink:' + APILink);
    try {
      fetch(APILink, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        body: MyFormData,
      })
        .then(response => response.json())
        .then(responseJson => {
          console.log('responseJson:' + JSON.stringify(responseJson));
          this.SetData(responseJson);
        })
        .catch(error => {
          console.log('Thirderr:' + error);
          this.setState({loading: false});
          alert(strings.entervaliddata);
        });
    } catch (error) {
      console.log('FourthErr');
      this.setState({loading: false});
      alert(strings.entervaliddata);
    }
  }

  SetData(responseJson) {
    const {RestoreByPhoneOrEmail} = this.state;
    if (responseJson.success) {
      if (RestoreByPhoneOrEmail) {
        this.setState({restoreEmail: responseJson.data.email, loading: false});
        alert(strings.codeSentTo + strings.phone);
      } else {
        this.setState({restoreEmail: this.state.restoreInput, loading: false});
        alert(strings.codeSentTo + strings.email);
      }
      this.NextOrBack(true);
    } else {
      this.setState({loading: false});
      try {
        if (responseJson.message && responseJson.message.length < 200) {
          if (responseJson.message.email) {
            alert(responseJson.message.email);
            return;
          }
          if (responseJson.message.phone) {
            alert(responseJson.message.phone);
            return;
          }
          alert(responseJson.message);
          return;
        }
        if (responseJson.errors) {
          if (responseJson.errors.email) {
            alert(responseJson.errors.email[0]);
            return;
          }
          if (responseJson.errors.phone) {
            alert(responseJson.errors.phone[0]);
            return;
          }
        }
      } catch (error) {
        console.log('error:' + error);
        alert(strings.accountNotRegistered);
        return;
      }
      this.setState({loading: false});
      alert(strings.accountNotRegistered);
    }
  }

  forgetTxt() {
    if (this.state.loading)
      return <ActivityIndicator size="large" color="white" />;
    return <Text style={styles.NextTxt}>{strings.sendCode}</Text>;
  }

  RestorePassword() {
    const {RestoreByPhoneOrEmail} = this.state;
    if (this.state.CurrentPhase == 1)
      return (
        <View style={styles.MainView}>
          <View style={[styles.FirstMainView, {marginHorizontal: wp('5%')}]}>
            <Text style={styles.forgetPassword}> {strings.changePassword}</Text>
            <Text style={styles.justEnterEmailAndPass}>
              {' '}
              {RestoreByPhoneOrEmail
                ? strings.sendToMobile
                : strings.sendToEmail}
            </Text>
          </View>

          <View style={[styles.SocendMainView, {height: hp('7%')}]}>
            <View
              style={[
                styles.InputView,
                {
                  borderColor:
                    this.state.CurrentFocusedInput == 0 ? '#8BD1EF' : 'silver',
                },
              ]}>
              <TextInput
                onChangeText={text => this.setState({restoreInput: text})}
                onSubmitEditing={() => {
                  this.ForgetPost();
                }}
                onFocus={() => this.setState({CurrentFocusedInput: 0})}
                onBlur={() => this.setState({CurrentFocusedInput: -1})}
                style={[styles.InputStyle]}
              />
              <Icon
                name={this.state.RestoreByPhoneOrEmail ? 'phone' : 'email'}
                size={28}
                color={
                  this.state.CurrentFocusedInput == 0 ? '#8BD1EF' : 'silver'
                }
              />
            </View>
          </View>

          <View style={styles.ThirdMainView}>
            <TouchableOpacity
              onPress={() => this.ForgetPost()}
              style={styles.LoginBTNStyle}>
              {this.forgetTxt()}
            </TouchableOpacity>
          </View>
        </View>
      );
    return;
  }

  ConfirmIdentity() {
    if (this.state.CurrentPhase == -2)
      return (
        <View style={styles.MainView}>
          <View style={[styles.FirstMainView]}>
            <Text style={styles.forgetPassword}>
              {' '}
              {strings.confirmIdentity}
            </Text>
            <Text style={styles.justEnterEmailAndPass}>
              {' '}
              {strings.enterActivationCode}
            </Text>
          </View>

          <View
            style={[
              styles.SocendMainView,
              {
                flexDirection: 'row-reverse',
                justifyContent: 'space-between',
                alignSelf: 'center',
                width: wp('90%'),
                height: hp('7%'),
              },
            ]}>
            <View style={[styles.InputView, styles.OnSquareInput]}>
              <TextInput
                maxLength={1}
                onChangeText={text => {
                  this.setState({token: this.state.token + text});
                  this.input2.focus();
                }}
                keyboardType={'numeric'}
                style={[styles.InputStyle, styles.SquareInptTxt]}
              />
            </View>

            <View style={[styles.InputView, styles.OnSquareInput]}>
              <TextInput
                maxLength={1}
                ref={ref => {
                  this.input2 = ref;
                }}
                onChangeText={text => {
                  this.setState({token: this.state.token + text});
                  this.input3.focus();
                }}
                keyboardType={'numeric'}
                style={[styles.InputStyle, styles.SquareInptTxt]}
              />
            </View>

            <View style={[styles.InputView, styles.OnSquareInput]}>
              <TextInput
                maxLength={1}
                ref={ref => {
                  this.input3 = ref;
                }}
                onChangeText={text => {
                  this.setState({token: this.state.token + text});
                  this.input4.focus();
                }}
                keyboardType={'numeric'}
                style={[styles.InputStyle, styles.SquareInptTxt]}
              />
            </View>

            <View style={[styles.InputView, styles.OnSquareInput]}>
              <TextInput
                maxLength={1}
                ref={ref => {
                  this.input4 = ref;
                }}
                keyboardType={'numeric'}
                style={[styles.InputStyle, styles.SquareInptTxt]}
              />
            </View>
          </View>

          <View style={[styles.ThirdMainView, {marginTop: hp('8%')}]}>
            <TouchableOpacity
              onPress={() => this.NextOrBack(true)}
              style={styles.LoginBTNStyle}>
              <Text style={styles.NextTxt}>{strings.sendCode}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.FourthMainView}>
            <Text style={styles.dontHaveAnAccount}>
              {' '}
              {strings.sendCodeAgain}
            </Text>
          </View>
        </View>
      );
    return;
  }

  SubmitChangePassPost() {
    if (this.IsThereAnyInputEmpty()) {
      alert(strings.allFeildsRequeired);
      return;
    }

    if (this.state.loading) return;
    this.setState({loading: true});
    const MyFormData = new FormData();
    console.log('user token:' + UserProfile.getInstance().clientObj.token);
    MyFormData.append('current_password', this.state.current_password);
    MyFormData.append('password', this.state.password);
    MyFormData.append(
      'password_confirmation',
      this.state.password_confirmation,
    );
    MyFormData.append('token', UserProfile.getInstance().clientObj.token);

    try {
      fetch('https://www.demo.ertaqee.com/api/v1/password/update', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          // Authorization: 'Bearer ' + UserProfile.getInstance().clientObj.token
        },
        body: MyFormData,
      })
        .then(response => response.json())
        .then(responseJson => {
          console.log('MyFormData:' + JSON.stringify(responseJson));
          this.SetChangePassResp(responseJson);
        })
        .catch(error => {
          console.log('Thirderr:' + error);
          this.setState({loading: false});
          alert(strings.entervaliddata);
        });
    } catch (error) {
      console.log('FourthErr');
      this.setState({loading: false});
      alert(strings.entervaliddata);
    }
  }

  SetChangePassResp(responseJson) {
    this.setState({loading: false});
    if (responseJson.success) {
      alert('تم تغيير كلمة المرور بنجاح');
      this.props.navigation.goBack();
    } else {
      this.setState({loading: false});
      console.log('Here:' + JSON.stringify(responseJson));
      try {
        if (responseJson.errors.password) {
          alert(responseJson.errors.password[0]);
          return;
        }
        if (responseJson.errors.token) {
          alert(responseJson.errors.token[0]);
          return;
        }
      } catch {}
      try {
        if (responseJson.message.password) {
          alert(responseJson.message.password);
          return;
        }
        if (responseJson.message.token) {
          alert(responseJson.message.token);
          return;
        }
      } catch {
        alert(strings.entervaliddata);
        return;
      }
      console.log('2');
      this.setState({loading: false});
      alert(strings.entervaliddata);
    }
  }

  SaveTxt() {
    if (this.state.loading)
      return <ActivityIndicator size="large" color="white" />;
    return <Text style={styles.NextTxt}>{strings.save}</Text>;
  }

  EnterPassWords() {
    if (this.state.CurrentPhase == 2)
      return (
        <View style={styles.MainView}>
          <View style={[styles.FirstMainView, {marginHorizontal: wp('5%')}]}>
            <Text style={styles.forgetPassword}> {strings.newPassword}</Text>
            <Text style={styles.justEnterEmailAndPass}>
              {' '}
              {strings.enterNewpassword}
            </Text>
          </View>

          <View style={[styles.SocendMainView, {height: hp('25%')}]}>
            {/* <View
              style={[
                styles.InputView,
                {
                  borderColor:
                    this.state.CurrentFocusedInput == 1 ? '#8BD1EF' : 'silver',
                },
              ]}>
              <TextInput
                onChangeText={(text) => this.setState({token: text})}
                onFocus={() => this.setState({CurrentFocusedInput: 1})}
                onBlur={() => this.setState({CurrentFocusedInput: -1})}
                placeholder={strings.activationCode}
                style={[styles.InputStyle]}
              />
              <Icon
                name="vpn-key"
                size={28}
                color={
                  this.state.CurrentFocusedInput == 1 ? '#8BD1EF' : 'silver'
                }
              />
            </View> */}

            <View
              style={[
                styles.InputView,
                {
                  borderColor:
                    this.state.CurrentFocusedInput == 1 ? '#8BD1EF' : 'silver',
                  marginTop: hp('2%'),
                },
              ]}>
              <TextInput
                onChangeText={text => this.setState({current_password: text})}
                onFocus={() => this.setState({CurrentFocusedInput: 1})}
                onBlur={() => this.setState({CurrentFocusedInput: -1})}
                placeholder={strings.currentPassword}
                placeholderTextColor={'gray'}
                style={[styles.InputStyle]}
                secureTextEntry={!this.state.showEye}
              />
              {/* <Icon
                name="lock"
                size={28}
                color={
                  this.state.CurrentFocusedInput == 1 ? '#8BD1EF' : 'silver'
                }
              /> */}
              <Icon2
                name={this.state.showEye ? 'eye' : 'eye-slash'}
                size={hp('2%')}
                color={!this.state.showEye ? 'gray' : '#39A1F7'}
                style={{marginHorizontal: -5}}
                onPress={() => {
                  this.setState({showEye: !this.state.showEye});
                }}
              />
            </View>

            <View
              style={[
                styles.InputView,
                {
                  borderColor:
                    this.state.CurrentFocusedInput == 2 ? '#8BD1EF' : 'silver',
                  marginTop: hp('2%'),
                },
              ]}>
              <TextInput
                onChangeText={text => this.setState({password: text})}
                onFocus={() => this.setState({CurrentFocusedInput: 2})}
                onBlur={() => this.setState({CurrentFocusedInput: -1})}
                placeholder={strings.newPassword}
                placeholderTextColor={'gray'}
                style={[styles.InputStyle]}
                secureTextEntry={!this.state.showEyeNew}
              />
              {/* <Icon
                name="lock"
                size={28}
                color={
                  this.state.CurrentFocusedInput == 2 ? '#8BD1EF' : 'silver'
                }
              /> */}
              <Icon2
                name={this.state.showEyeNew ? 'eye' : 'eye-slash'}
                size={hp('2%')}
                color={!this.state.showEyeNew ? 'gray' : '#39A1F7'}
                style={{marginHorizontal: -5}}
                onPress={() => {
                  this.setState({showEyeNew: !this.state.showEyeNew});
                }}
              />
            </View>

            <View
              style={[
                styles.InputView,
                {
                  borderColor:
                    this.state.CurrentFocusedInput == 3 ? '#8BD1EF' : 'silver',
                  marginTop: hp('2%'),
                },
              ]}>
              <TextInput
                onChangeText={text =>
                  this.setState({password_confirmation: text})
                }
                onFocus={() => this.setState({CurrentFocusedInput: 3})}
                onBlur={() => this.setState({CurrentFocusedInput: -1})}
                placeholder={strings.rewritePass}
                placeholderTextColor={'gray'}
                style={[styles.InputStyle]}
                secureTextEntry={!this.state.showEyeConfirm}
              />
              {/* <Icon
                name="lock"
                size={28}
                color={
                  this.state.CurrentFocusedInput == 3 ? '#8BD1EF' : 'silver'
                }
              /> */}
              <Icon2
                name={this.state.showEyeConfirm ? 'eye' : 'eye-slash'}
                size={hp('2%')}
                color={!this.state.showEyeConfirm ? 'gray' : '#39A1F7'}
                style={{marginHorizontal: -5}}
                onPress={() => {
                  this.setState({showEyeConfirm: !this.state.showEyeConfirm});
                }}
              />
            </View>
          </View>

          <View style={styles.ThirdMainView}>
            <TouchableOpacity
              onPress={() => this.SubmitChangePassPost()}
              style={styles.LoginBTNStyle}>
              {this.SaveTxt()}
            </TouchableOpacity>
          </View>
        </View>
      );
    return;
  }

  NextOrBack(IsNext) {
    this.props.navigation.goBack();
    // if (IsNext && this.state.CurrentPhase < 3)
    //   this.setState({CurrentPhase: this.state.CurrentPhase + 1});
    // else if (!IsNext && this.state.CurrentPhase > 0)
    //   this.setState({CurrentPhase: this.state.CurrentPhase - 1});
    // else this.props.navigation.goBack()
  }

  render() {
    return (
      <ScrollView>
        <View style={{flex: 1}}>
          <ImageBackground
            source={require('../../res/blank.png')}
            style={{flex: 1}}>
            <Image
              style={styles.BackGroundLogo}
              source={require('../../res/backgroundlogo.png')}
            />
            <View style={styles.Header}>
              {/* {this.state.CurrentPhase >= 1 && ( */}
              <TouchableOpacity onPress={() => this.NextOrBack(false)}>
                <Image
                  style={styles.BackArrow}
                  source={require('../../res/backarrow.png')}
                />
              </TouchableOpacity>
              {/* )} */}
            </View>
            {/* {this.ChooseHowToRestore()}
            {this.RestorePassword()} */}
            {/* {this.ConfirmIdentity()} */}
            {this.EnterPassWords()}
          </ImageBackground>
        </View>
      </ScrollView>
    );
  }
}

export default ChangePasswords;
const styles = StyleSheet.create({
  SquareInptTxt: {textAlign: 'center', width: wp('15%'), fontSize: hp('5%')},
  FourthMainView: {
    justifyContent: 'center',
    flexDirection: 'row',
    width: wp('100%'),
    marginTop: hp('6%'),
    height: hp('20%'),
  },
  OnSquareInput: {
    alignItems: 'center',
    justifyContent: 'center',
    width: wp('18%'),
    height: hp('10%'),
    borderRadius: wp('1%'),
    borderColor: '#8BD1EF',
  },
  InputView: {
    alignItems: 'center',
    borderRadius: wp('3%'),
    borderWidth: wp('0.3%'),
    flexDirection: 'row',
    width: wp('90%'),
    height: hp('7%'),
  },
  NextTxt: {fontSize: hp('2%'), color: 'white', fontFamily: fonts.normal},
  Header: {width: wp('100%'), marginTop: hp('4%'), height: hp('3%')},
  ThirdMainView: {
    alignItems: 'center',
    width: wp('100%'),
    marginTop: hp('4%'),
    height: hp('6%'),
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
    marginTop: hp('12%'),
    height: hp('8%'),
  },
  justEnterEmailAndpassword: {
    marginTop: hp('1%'),
    fontSize: hp('2%'),
    color: 'silver',
    fontFamily: fonts.normal,
  },
  forgetPassword: {
    fontSize: hp('3.5%'),
    color: '#483F8C',
    fontFamily: fonts.normal,
  },
  FirstMainView: {width: wp('100%'), marginTop: hp('9%'), height: hp('11%')},
  MainView: {width: wp('100%'), height: hp('90%')},
  BackArrow: {resizeMode: 'contain', width: wp('20%'), height: hp('3.5%')},
  LoginBTNStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    width: wp('90%'),
    height: hp('6%'),
    backgroundColor: '#4D75B8',
    borderRadius: wp('2%'),
  },
  InputStyle: {
    textAlign: I18nManager.isRTL ? 'right' : 'left',
    width: wp('80%'),
    height: hp('9%'),
    fontSize: hp('2%'),
    fontFamily: fonts.normal,
    color: '#39A1F7',
  },
  BackGroundLogo: {
    position: 'absolute',
    marginLeft: wp('40%'),
    resizeMode: 'contain',
    width: wp('80%'),
    height: hp('25%'),
  },
  dontHaveAnAccount: {
    fontSize: hp('2%'),
    color: '#C2C2C2',
    fontFamily: fonts.normal,
  },
  justEnterEmailAndPass: {fontFamily: fonts.normal},
});
