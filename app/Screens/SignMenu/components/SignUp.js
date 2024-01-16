import React, { Component } from 'react';
import {
  ActivityIndicator,
  Alert,
  I18nManager,
  Image,
  ImageBackground,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Icon } from 'react-native-elements';
import * as ImagePicker from 'react-native-image-picker';
import { PERMISSIONS, request } from 'react-native-permissions';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import UserProfile from '../../../UserProfile';
import fonts from '../../../fonts';
import { ReloadScreen } from '../../common';
import strings from '../../strings';
import {
  CompanyInputs,
  EndUserInputs,
  HallProviderInputs,
  TrainerInputs,
  TrainingCentersInputs,
} from './Items';
import ModalActivation from './ModalActivation';
import ModalTakePhoto from './ModalTakePhoto';
import { CommonActions } from '@react-navigation/native';

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.ReloadBTN = this.ReloadBTN.bind(this);
    this.SignUpPost = this.SignUpPost.bind(this);
    this.state = {
      CurrentPhase: 0,
      CurrentFocusedInput: -1,
      CurrentChoosedType: 0,
      CurrentFocusedInputNewAccount: -1,
      CountriesData: '',
      loading: false,
      ShowReloadBTN: false,
      CountriesAPILoading: true,
      IsUpdate: false,
      confirmMobile: false,
      data: {},
      currentMobile: '',
      visibleModalActivation: false,
      imageModalVisible: false,
      typeImage: '',
      userImage: '',
      email: '',
    };
  }

  componentWillMount() {
    this.GetCountriesData();
    try {
      let RoleId = UserProfile.getInstance().clientObj.user.role_id[0];
      console.log(
        '🚀 ~ file: SignUp.js:66 ~ SignUp ~ componentWillMount ~ RoleId:',
        RoleId,
      );
      console.log('UserData:' + RoleId);
      if (RoleId) {
        console.log('user ', UserProfile.getInstance().clientObj.user);
        this.setState({IsUpdate: true, CurrentChoosedType: RoleId - 2});
        this.setState({
          userImage: UserProfile.getInstance().clientObj.user.photo,
        });
        if (UserProfile.getInstance().clientObj.user.mobile) {
          this.setState({
            currentMobile: UserProfile.getInstance().clientObj.user.mobile,
            confirmMobile: true,
          });
        }
        this.NextOrBack(true);
      }
    } catch (Error) {
      console.log(
        '🚀 ~ file: SignUp.js:82 ~ SignUp ~ componentWillMount ~ Error:',
        Error,
      );
    }
  }

  componentDidMount() {
    this.GetCountriesData();
  }

  ShowReloadBTN() {
    alert(strings.noDataToShow);
    this.setState({ShowReloadBTN: true, loading: false});
  }

  ReloadBTN() {
    console.log('ReloadBTN');
    this.setState({Data: '', CountriesAPILoading: true, ShowReloadBTN: false});
    this.GetCountriesData();
  }

  async GetCountriesData() {
    try {
      const response = await fetch('https://www.demo.ertaqee.com/api/v1/countries');
      console.log(
        '🚀 ~ file: SignUp.js:134 ~ SignUp ~ GetCountriesData ~ response:',
        response,
      );
      const json = await response.json();
      console.log(
        '🚀 ~ file: SignUp.js:135 ~ SignUp ~ GetCountriesData ~ json:',
        json,
      );
      if (json)
        this.setState({
          CountriesData: json.data,
          CountriesAPILoading: false,
          ShowReloadBTN: false,
        });
    } catch (error) {
      console.log(
        '🚀 ~ file: SignUp.js:138 ~ SignUp ~ GetCountriesData ~ error:',
        error,
      );
    } finally {
      console.log(
        '🚀 ~ file: SignUp.js:140 ~ SignUp ~ GetCountriesData ~ finally:',
      );
    }
  }

  SetTintColor = function (MyTypeNo) {
    if (this.state.CurrentChoosedType == MyTypeNo)
      return {
        opacity: 1,
      };
    return {
      opacity: 0.5,
    };
  };

  AcountTypeItem(TypeNo, Acounttitle, IMGSource) {
    return (
      // <ImageBackground
      //   source={IMGSource}
      //   imageStyle={[this.SetTintColor(TypeNo), {resizeMode: 'contain'}]}
      //   style={styles.ChooseTypeStyle}>
      <TouchableOpacity
        onPress={() => this.setState({CurrentChoosedType: TypeNo})}
        style={[
          styles.ChooseTypeBTN,
          {
            borderWidth: 1,
            borderColor: '#FFF',
            borderRadius: 10,
            padding: 10,
            backgroundColor:
              this.state.CurrentChoosedType == TypeNo ? 'white' : 'transparent',
          },
        ]}>
        <View
          style={{
            position: 'absolute',
            left: -12,
            top: wp('7%'),
            height: 22,
            width: 22,
            borderRadius: 22 / 2,
            borderWidth: 1,
            borderColor: '#FFF',
            backgroundColor:
              this.state.CurrentChoosedType == TypeNo ? 'white' : 'transparent',
          }}
        />
        <Text
          style={[
            styles.signAs,
            {
              color:
                this.state.CurrentChoosedType === TypeNo ? '#647BB5' : 'white',
            },
          ]}>
          {strings.signAs}
        </Text>
        <Text
          style={[
            styles.signAs,
            {
              fontSize: hp('2%'),
              color:
                this.state.CurrentChoosedType === TypeNo ? '#647BB5' : 'white',
            },
          ]}>
          {Acounttitle}
        </Text>
      </TouchableOpacity>
      //  </ImageBackground>
    );
  }

  ChooseAccountType() {
    if (this.state.CurrentPhase == 0)
      return (
        <View style={{alignItems: 'flex-start'}}>
          <TouchableOpacity
            onPress={() => {
              this.props.SwitchScreen();
            }}>
            <Icon
              name="arrow-forward"
              size={28}
              color="#FFF"
              style={{
                transform: [{rotateY: I18nManager.isRTL ? '0deg' : '180deg'}],
                margin: hp('3%'),
                marginTop: hp('7%'),
              }}
            />
          </TouchableOpacity>

          <View style={[styles.MainView, {marginTop: hp(1)}]}>
            <View style={styles.FirstMainView}>
              <Text style={styles.forgetPassword}>
                {' '}
                {strings.welcomeAboard}
              </Text>
              <Text style={styles.justEnterEmailAndPass}>
                {' '}
                {strings.chooseAcountType}
              </Text>
            </View>

            <View style={[styles.Phase1View2]}>
              {this.AcountTypeItem(
                0,
                strings.user,
                require('../../../res/acounttype1.png'),
              )}
              {this.AcountTypeItem(
                1,
                strings.organization,
                require('../../../res/acounttype2.png'),
              )}
              {this.AcountTypeItem(
                2,
                strings.trainingcenter,
                require('../../../res/acounttype3.png'),
              )}
              {this.AcountTypeItem(
                4,
                strings.coach,
                require('../../../res/acounttype4.png'),
              )}
              {this.AcountTypeItem(
                3,
                strings.hallProvider,
                require('../../../res/acounttype5.png'),
              )}
            </View>

            <View style={styles.ThirdMainView}>
              <TouchableOpacity
                onPress={() => this.NextOrBack(true)}
                style={styles.LoginBTNStyle}>
                <Text style={styles.NextTxt}>{strings.next}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    return;
  }

  EnterPhoneForCode() {
    if (this.state.CurrentPhase == 1)
      return (
        <View style={styles.MainView}>
          <View style={styles.FirstMainView}>
            <Text style={[styles.forgetPassword]}>
              {' '}
              {strings.welcomeAboard}
            </Text>
            <Text style={styles.justEnterEmailAndPass}>
              {' '}
              {strings.addNumberToreceiveActivate}
            </Text>
          </View>

          <View
            style={[
              styles.SocendMainView,
              {marginTop: hp('12%'), height: hp('7%')},
            ]}>
            <View
              style={[
                styles.InputView,
                {
                  opacity: 1,
                  borderColor:
                    this.state.CurrentFocusedInput == 0 ? '#8BD1EF' : 'white',
                },
              ]}>
              <TextInput
                maxLength={20}
                onFocus={() => this.setState({CurrentFocusedInput: 0})}
                onBlur={() => this.setState({CurrentFocusedInput: -1})}
                style={[styles.InputStyleLarge]}
                placeholderTextColor={'gray'}
              />
            </View>
          </View>

          <View style={styles.ThirdMainView}>
            <TouchableOpacity
              onPress={() => this.NextOrBack(true)}
              style={styles.LoginBTNStyle}>
              <Text style={styles.NextTxt}>{strings.sendCode}</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    return;
  }

  ConfirmIdentity() {
    if (this.state.CurrentPhase == 2)
      return (
        <View style={styles.MainView}>
          <View style={styles.FirstMainView}>
            <Text style={styles.forgetPassword}>
              {' '}
              {strings.confirmIdentity}
            </Text>
            <Text style={styles.justEnterEmailAndPass}>
              {' '}
              {strings.enterNumberThatSendToYou}
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
                keyboardType={'numeric'}
                placeholder="1"
                placeholderTextColor={'gray'}
                style={[styles.InputStyle, {fontSize: hp('5%')}]}
              />
            </View>

            <View style={[styles.InputView, styles.OnSquareInput]}>
              <TextInput
                maxLength={1}
                keyboardType={'numeric'}
                placeholderTextColor={'gray'}
                style={[styles.InputStyle, {fontSize: hp('5%')}]}
              />
            </View>

            <View style={[styles.InputView, styles.OnSquareInput]}>
              <TextInput
                maxLength={1}
                keyboardType={'numeric'}
                placeholderTextColor={'gray'}
                style={[styles.InputStyle, {fontSize: hp('5%')}]}
              />
            </View>

            <View style={[styles.InputView, styles.OnSquareInput]}>
              <TextInput
                maxLength={1}
                keyboardType={'numeric'}
                placeholderTextColor={'gray'}
                style={[styles.InputStyle, {fontSize: hp('5%')}]}
              />
            </View>
          </View>

          <View style={[styles.ThirdMainView, {marginTop: hp('6%')}]}>
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

  GetHeight() {
    let CurrentChoosedType = this.state.CurrentChoosedType;
    if (CurrentChoosedType == 0) return '140%';
    else if (CurrentChoosedType == 1) return '175%';
    else if (CurrentChoosedType == 2) return '175%';
    else if (CurrentChoosedType == 3) return '175%';
    else if (CurrentChoosedType == 4) return '120%';
  }

  IsThereAnyInputEmpty(Data) {
    try {
      return (
        Data.username.length === 0 ||
        Data.first_name.length === 0 ||
        Data.family_name.length === 0 ||
        Data.email.length === 0 ||
        Data.phone.length === 0 ||
        Data.country_id.length === 0 ||
        Data.city_id.length === 0
      );
    } catch {
      return true;
    }
  }

  ToSignMenu() {
    const resetAction = CommonActions.reset({
      index: 0,
      routes: [{name: 'SignMenu'}],
    });
    console.log('resetAction', resetAction);
    this.props.navigation.dispatch(resetAction);
    // this.props.navigation.navigate('SignMenu')
  }

  signUpAfterConfirm(Data1) {
    let Data = Data1 ? Data1 : this.state.data;
    console.log(
      '🚀 ~ file: SignUp.js:441 ~ SignUp ~ signUpAfterConfirm ~ Data:',
      Data,
    );
    if (this.state.IsUpdate) {
      Data = {...Data};
    } else {
      Data = {...Data}; //accept terms of conditoin
    }

    console.log('omar data aaaaa', Data);
    this.setState({loading: true, email: Data.email});
    const SignUpFormData = new FormData();
    Object.keys(Data).forEach(key => {
      if (Data[key]) {
        if (key === 'username') {
          SignUpFormData.append('name', Data[key]);
        } else if (key === 'phone') {
          SignUpFormData.append('mobile', Data[key]);
        } else if (key === 'trainertype') {
          SignUpFormData.append('trainer_type', Data[key]);
        } else if (key === 'trainers') {
          for (var i = 0; i < Data.trainers.length; i++) {
            SignUpFormData.append(`trainers[${i}]`, Data.trainers[i]);
          }
        } else {
          SignUpFormData.append(key, Data[key]);
        }
      }
    });
    // SignUpFormData.append('first_name', Data.first_name);
    // SignUpFormData.append('family_name', Data.family_name);
    // SignUpFormData.append('name', Data.username);
    // SignUpFormData.append('mobile', Data.phone);
    console.log('this.state.typeImage', this.state.typeImage);
    SignUpFormData.append('lang', UserProfile.getInstance().Lang);
    if (this.state.IsUpdate) {
      if (this.state.typeImage)
        SignUpFormData.append('photo', this.state.typeImage);
    }
    if (!this.state.IsUpdate) {
      SignUpFormData.append('agree', true);
    }
    // console.log('MYState.IsUpdate:' + MYState.IsUpdate);
    // if (!MYState.IsUpdate) {
    //   console.log('MYState.IsUpdate');
    //   SignUpFormData.append('password', Data.password);
    //   SignUpFormData.append(
    //     'password_confirmation',
    //     Data.password_confirmation,
    //   );
    // }
    // SignUpFormData.append('email', Data.email);
    // SignUpFormData.append('id_number', Data.id_number);
    // SignUpFormData.append('country_id', Data.country_id);
    // SignUpFormData.append('city_id', Data.city_id);
    // SignUpFormData.append('role_id', Data.role_id);
    // SignUpFormData.append('trainer_type', 'trainer');
    // SignUpFormData.append('gender', Data.gender);
    // if (Data.role_id == 3 || Data.role_id == 5) {
    //   console.log('company_activity');
    //   SignUpFormData.append('company_activity', Data.company_activity);
    //   SignUpFormData.append('company_trade_name', Data.company_trade_name);
    //   SignUpFormData.append('address', Data.address);
    // } else if (Data.role_id == 4) {
    //   console.log('center_activity');
    //   SignUpFormData.append('center_activity', Data.center_activity);
    //   SignUpFormData.append('center_trade_name', Data.center_trade_name);
    //   SignUpFormData.append('address', Data.address);
    // } else if (Data.role_id == 6) {
    //   console.log('trainer');
    //   SignUpFormData.append('trainer_type', Data.trainertype);
    // }

    let APIWord = 'register';
    if (this.state.IsUpdate) {
      APIWord = 'profile/update';
      SignUpFormData.append('token', UserProfile.getInstance().clientObj.token);
    }
    console.log('SignUpFormData ', SignUpFormData);
    console.log('APIWord:' + APIWord);
    try {
      fetch('https://www.demo.ertaqee.com/api/v1/' + APIWord, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-Language': UserProfile.getInstance().Lang,
          Authorization: this.state.IsUpdate
            ? 'Bearer ' + UserProfile.getInstance().clientObj.token
            : '',
        },
        body: SignUpFormData,
      }).then(response => {
        console.log(response);
        response
          .json()
          .then(responseJson => {
            console.log('SignUp responseJson:' + JSON.stringify(responseJson));
            if (responseJson.confirm_type === 'email') {
              Alert.alert(strings.app, responseJson.message, [
                {
                  text: strings.cancel,
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
                {
                  text: strings.confirm,
                  onPress: () =>
                    this.setState({visibleModalActivationEmail: true}),
                },
              ]);
            }else{
              alert(strings.successProcess)
              this.ToSignMenu()
            }
            this.setState({loading: false});
          })
          .catch(error => {
            console.log('Thirderr:' + error);
            this.setState({loading: false});
            // alert(strings.somthingWentWrong);
            Alert.alert(strings.alert, strings.somthingWentWrong, [
              {
                text: strings.cancel,
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              {text: strings.ok, onPress: () => console.log('OK Pressed')},
            ]);
          });
      });
    } catch (error) {
      console.log('FourthErr');
      this.setState({loading: false});
      alert(strings.somthingWentWrong);
    }
  }

  handelError(responseJson) {
    this.setState({loading: false});
    console.log(' handelError Here:' + JSON.stringify(responseJson));
    try {
      if (responseJson.errors.name) {
        alert(responseJson.errors.name[0]);
        return;
      }
      if (responseJson.errors.email) {
        alert(responseJson.errors.email[0]);
        return;
      }
      if (responseJson.errors.phone) {
        alert(responseJson.errors.phone[0]);
        return;
      }
      if (responseJson.errors.mobile) {
        alert(responseJson.errors.mobile[0]);
        return;
      }
      if (responseJson.errors.password) {
        alert(responseJson.errors.password[0]);
        return;
      }

      if (responseJson.errors.id_number) {
        alert(responseJson.errors.id_number[0]);
        return;
      }

      if (responseJson.errors.country_id) {
        alert(responseJson.errors.country_id[0]);
        return;
      }

      if (responseJson.errors.city_id) {
        alert(responseJson.errors.city_id[0]);
        return;
      }

      if (responseJson.errors.role_id) {
        alert(responseJson.errors.role_id[0]);
        return;
      }

      if (responseJson.errors.first_name) {
        alert(responseJson.errors.first_name[0]);
        return;
      }

      if (responseJson.errors.company_trade_name) {
        alert(responseJson.errors.company_trade_name[0]);
        return;
      }
      if (responseJson.errors.agree) {
        alert(responseJson.errors.agree[0]);
        return;
      } else {
        alert(responseJson.message);
        return;
      }
    } catch {
      // alert(strings.somthingWentWrong);
      Alert.alert(
        strings.alert,
        responseJson.message ?? strings.somthingWentWrong,
        [
          {
            text: strings.cancel,
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {text: strings.ok, onPress: () => console.log('OK Pressed')},
        ],
      );
    }
  }

  SignUpPost(Data) {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    console.log('Data: ', Data);
    let MYState = this.state;
    // if (this.IsThereAnyInputEmpty(Data)) {
    //   alert('الحقول * مطلوبة');
    //   return;
    // }

    if (Data.password != Data.password_confirmation) {
      alert(strings.password_not_match);
      return;
    }

    if (reg.test(Data.email) === false) {
      alert(strings.email_not_valid);
      return;
    }

    this.setState({data: Data});
    if (this.state.loading) return;
    if (this.state.confirmMobile && this.state.currentMobile === Data.phone) {
      this.signUpAfterConfirm(Data);
    } else {
      this.setState({confirmMobile: false});
      this.setState({loading: true});
      const SignUpFormData = new FormData();
      Object.keys(Data).forEach(key => {
        if (Data[key]) {
          if (key === 'username') {
            SignUpFormData.append('name', Data[key]);
          } else if (key === 'phone') {
            SignUpFormData.append('mobile', Data[key]);
          } else if (key === 'trainertype') {
            SignUpFormData.append('trainer_type', Data[key]);
          } else if (key === 'trainers') {
            for (var i = 0; i < Data.trainers.length; i++) {
              SignUpFormData.append(`trainers[${i}]`, Data.trainers[i]);
            }
          } else if (key === 'checked') {
            SignUpFormData.append('agree', Data[key]);
          } else {
            SignUpFormData.append(key, Data[key]);
          }
        }
      });
      SignUpFormData.append('mobile', Data.phone);
      SignUpFormData.append('from_api', '1');
      SignUpFormData.append('agree', true);

      console.log(
        '🚀 ~ file: SignUp.js:590 ~ SignUp ~ SignUpPost ~ SignUpFormData:',
        SignUpFormData,
      );
      try {
        fetch('https://www.demo.ertaqee.com/api/v1/send_mobile_confirm_token', {
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
              console.log(
                'SignUp responseJson1:' + JSON.stringify(responseJson),
              );
              if (responseJson.success) {
                this.setState({visibleModalActivation: true, loading: false});
              } else {
                this.handelError(responseJson);
              }
            })
            .catch(error => {
              console.log('Thirderr1:' + JSON.stringify(error));
              this.setState({loading: false});
            });
        });
      } catch (error) {
        console.log('FourthErr1', JSON.stringify(error));
        this.setState({loading: false});
      }
    }
  }

  onSubmitCode(code) {
    this.setState({loading: true});
    const SignUpFormData = new FormData();
    SignUpFormData.append('mobile', this.state.data.phone);
    SignUpFormData.append('token', code);
    console.log('SignUpFormData ', SignUpFormData);
    SignUpFormData.append('from_api', '1');
    try {
      fetch('https://www.demo.ertaqee.com/api/v1/check_mobile_confirm_token', {
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
                confirmMobile: true,
                currentMobile: this.state.data.phone,
                visibleModalActivation: false,
              });
              this.signUpAfterConfirm();
            } else {
              this.setState({
                loading: false,
              });
              alert(strings.enterCodeCorrect);
            }
          })
          .catch(error => {
            console.log('Thirderr1:' + JSON.stringify(error));
            this.setState({loading: false});
          });
      });
    } catch (error) {
      console.log('FourthErr1', JSON.stringify(error));
      this.setState({loading: false});
    }
  }

  onSubmitCodeEmail(code) {
    this.setState({loading: true});
    const SignUpFormData = new FormData();
    SignUpFormData.append('email', this.state.email);
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
                visibleModalActivationEmail: false,
              });
              this.SetUserData(responseJson);
              // Alert.alert(strings.signIn, responseJson.message, [
              //   {
              //     text: strings.cancel,
              //     onPress: () => console.log('Cancel Pressed'),
              //     style: 'cancel',
              //   },
              //   {
              //     text: strings.ok,
              //     onPress: () => this.SetUserData(responseJson),
              //   },
              // ]);

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

  SetUserData(responseJson) {
    console.log('responseJson.data ', responseJson.data);
    if (responseJson.success) {
      if (this.state.IsUpdate) {
        // alert(
        //   responseJson.message ? responseJson.message : strings.successProcess,
        // );
        Alert.alert(strings.alert, strings.successProcess, [
          {
            text: strings.cancel,
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {text: strings.ok, onPress: () => console.log('OK Pressed')},
        ]);
        console.log(
          '🚀 ~ file: SignUp.js:780 ~ SignUp ~ SetUserData ~ responseJson.data:',
          responseJson.data,
        );
        UserProfile.getInstance().clientObj.user = responseJson.data;
        UserProfile.getInstance().SaveUserCreds();
        // this.props.navigation.goBack();
        this.props.navigation.navigate('Home');
        return;
      }
      // UserProfile.getInstance().clientObj = responseJson.data;
      // UserProfile.getInstance().UserCreds.email = Data.email;
      // UserProfile.getInstance().UserCreds.password = Data.password;
      // UserProfile.getInstance().SaveUserCreds();
      alert(responseJson.message ? responseJson.message : strings.confirmPhase);
      this.props.SwitchScreen();
    } else {
      this.setState({loading: false});
      console.log('Here error:' + JSON.stringify(responseJson));
      try {
        if (responseJson.errors.name) {
          alert(responseJson.errors.name[0]);
          return;
        }
        if (responseJson.errors.email) {
          alert(responseJson.errors.email[0]);
          return;
        }
        if (responseJson.errors.phone) {
          alert(responseJson.errors.phone[0]);
          return;
        }
        if (responseJson.errors.mobile) {
          alert(responseJson.errors.mobile[0]);
          return;
        }
        if (responseJson.errors.password) {
          alert(responseJson.errors.password[0]);
          return;
        }

        if (responseJson.errors.id_number) {
          alert(responseJson.errors.id_number[0]);
          return;
        }

        if (responseJson.errors.country_id) {
          alert(responseJson.errors.country_id[0]);
          return;
        }

        if (responseJson.errors.city_id) {
          alert(responseJson.errors.city_id[0]);
          return;
        }

        if (responseJson.errors.role_id) {
          alert(responseJson.errors.role_id[0]);
          return;
        }

        if (responseJson.errors.first_name) {
          alert(responseJson.errors.first_name[0]);
          return;
        }

        if (responseJson.errors.company_trade_name) {
          alert(responseJson.errors.company_trade_name[0]);
          return;
        }
        if (responseJson.errors.agree) {
          alert(responseJson.errors.agree[0]);
          return;
        } else {
          alert(responseJson.message);
          return;
        }
      } catch {
        // alert(strings.somthingWentWrong);
        Alert.alert(
          strings.alert,
          responseJson.message ?? strings.somthingWentWrong,
          [
            {
              text: strings.cancel,
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {text: strings.ok, onPress: () => console.log('OK Pressed')},
          ],
        );
      }
      console.log('2');
      this.setState({loading: false});
      // alert(JSON.stringify(responseJson.message));
    }
  }

  SetInputsBasedOnAccountType() {
    let CurrentChoosedType = this.state.CurrentChoosedType;
    console.log('CurrentChoosedType:' + CurrentChoosedType);
    if (CurrentChoosedType === 0) {
      return (
        <EndUserInputs
          loading={this.state.loading}
          SignUpPost={this.SignUpPost}
          CountriesData={this.state.CountriesData}
          UpdateObj={this.state.IsUpdate}
        />
      );
    } else if (CurrentChoosedType === 1) {
      return (
        <CompanyInputs
          loading={this.state.loading}
          SignUpPost={this.SignUpPost}
          CountriesData={this.state.CountriesData}
          UpdateObj={this.state.IsUpdate}
        />
      );
    } else if (CurrentChoosedType === 2)
      return (
        <TrainingCentersInputs
          loading={this.state.loading}
          SignUpPost={this.SignUpPost}
          CountriesData={this.state.CountriesData}
          UpdateObj={this.state.IsUpdate}
        />
      );
    else if (CurrentChoosedType === 4)
      return (
        <TrainerInputs
          loading={this.state.loading}
          SignUpPost={this.SignUpPost}
          CountriesData={this.state.CountriesData}
          UpdateObj={this.state.IsUpdate}
        />
      );
    else if (CurrentChoosedType === 3)
      return (
        <HallProviderInputs
          loading={this.state.loading}
          SignUpPost={this.SignUpPost}
          CountriesData={this.state.CountriesData}
          UpdateObj={this.state.IsUpdate}
        />
      );
  }

  choicePicker = func => {
    let permission =
      Platform.OS === 'ios'
        ? func === 'launchImageLibrary'
          ? PERMISSIONS.IOS.PHOTO_LIBRARY
          : PERMISSIONS.IOS.CAMERA
        : PERMISSIONS.ANDROID.CAMERA;
    console.log('permission', permission);
    request(permission).then(result => {
      console.log('result', result);
      // switch (result) {
      //   case RESULTS.GRANTED:
      ImagePicker[func](
        {
          mediaType: 'photo',
          quality: 0.6,
          maxWidth: 1024,
          maxHeight: 1024,
        },
        response1 => {
          // assets[0]
          if (!response1.didCancel) {
            let data = {
              uri: response1.assets[0].uri,
              type: response1.assets[0].type
                ? response1.assets[0].type
                : 'image/png',
              name: 'fileName',
            };

            this.setState({typeImage: data});
            this.setState({userImage: response1.assets[0].uri});
          } else if (response1.didCancel) {
            console.log('didCancel');
          } else {
            console.log('error');
          }
        },
      );
      //     break;
      //   default: {
      //     Platform.OS === 'ios'
      //       ? Linking.openURL('app-settings://Photos')
      //       : this.choicePicker(func);
      //   }
      // }
    });
  };

  EnterNewAccountData() {
    if (this.state.CurrentPhase == 1)
      return (
        <ScrollView
          // keyboardShouldPersistTaps="always"
          automaticallyAdjustKeyboardInsets
          style={[styles.MainView]}>
          <Image
            style={styles.BackGroundLogoErtaqe}
            source={require('../../../res/backgroundlogo.png')}
          />
          <View style={styles.Header}>
            {this.state.CurrentPhase == 1 && (
              <TouchableOpacity
                onPress={() => {
                  this.state.IsUpdate
                    ? this.props.navigation.goBack()
                    : this.NextOrBack(false);
                }}>
                <Icon
                  name="arrow-forward"
                  size={28}
                  color="#483F8C"
                  style={{
                    transform: [
                      {rotateY: I18nManager.isRTL ? '0deg' : '180deg'},
                    ],
                  }}
                />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.FirstMainView}>
            <Text style={[styles.forgetPassword, {color: '#483F8C'}]}>
              {' '}
              {this.state.IsUpdate ? strings.updateProfile : strings.newSign}
            </Text>
            <Text style={styles.justEnterEmailAndPass}>
              {' '}
              {this.state.IsUpdate
                ? strings.addYourNewInfoToUpdate
                : strings.enterYourDetails}
            </Text>
          </View>

          {this.state.IsUpdate ? (
            <View style={styles.imgContainer}>
              <TouchableOpacity
                onPress={() => this.setState({imageModalVisible: true})}>
                <Image
                  style={styles.image}
                  source={{uri: this.state.userImage}}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            </View>
          ) : null}

          {/* <View
            style={{
              alignItems: 'center',
              width: wp('100%'),
              justifyContent: 'space-between',
              marginVertical: hp('2%'),
              paddingBottom: hp('2%'),
            }}> */}
          {this.SetInputsBasedOnAccountType()}
          {/* </View> */}
        </ScrollView>
      );
    return;
  }

  NextOrBack(IsNext) {
    if (IsNext && this.state.CurrentPhase < 3)
      this.setState({CurrentPhase: this.state.CurrentPhase + 1});
    else if (!IsNext && this.state.CurrentPhase > 0)
      this.setState({CurrentPhase: this.state.CurrentPhase - 1});
  }

  render() {
    if (this.state.CountriesAPILoading)
      return (
        <View style={styles.LoaderStyle}>
          <ActivityIndicator size="large" color="#37A0F7" />
        </View>
      );
    return (
      // <SafeAreaView style={{flex:1,backgroundColor:'transparent'}} >
      <View style={{flex: 1, alignItems: 'center'}}>
        <ReloadScreen
          ShowReloadBTN={this.state.ShowReloadBTN}
          ReloadBTN={this.ReloadBTN}
        />
        <ImageBackground
          source={
            this.state.CurrentPhase == 1
              ? require('../../../res/blank.png')
              : require('../../../res/signupBackground.png')
          }
          style={{flex: 1, paddingHorizontal: 20}}>
          {this.state.CurrentPhase == 3 ? (
            <Image
              style={styles.BackGroundLogo}
              source={require('../../../res/backgroundlogo.png')}
            />
          ) : (
            <View />
          )}
          {this.state.CurrentPhase != 1 ? ( //show only in أهلا فيك معانا شاشة
            <Image
              style={styles.BackGroundLogoErtaqe}
              source={require('../../../res/backgroundlogo.png')}
            />
          ) : null}

          {this.ChooseAccountType()}
          {/*
                {this.EnterPhoneForCode()}
                {this.ConfirmIdentity()}
              */}
          {this.EnterNewAccountData()}

          <ModalActivation
            visible={this.state.visibleModalActivation}
            changeState={() => {
              this.setState({visibleModalActivation: false});
            }}
            onDone={code => {
              // this.setState({visibleModalActivation: false});
              this.onSubmitCode(code);
            }}
          />
          <ModalActivation
            visible={this.state.visibleModalActivationEmail}
            changeState={() => {
              this.setState({visibleModalActivationEmail: false});
            }}
            onDone={code => {
              this.onSubmitCodeEmail(code);
            }}
            type={'email'}
          />
        </ImageBackground>

        <ModalTakePhoto
          visible={this.state.imageModalVisible}
          changeState={value => {
            this.setState({imageModalVisible: false});
          }}
          onDone={func => {
            this.setState({imageModalVisible: false});
            setTimeout(() => {
              this.choicePicker(func);
            }, 500);
          }}
        />
      </View>
      // </SafeAreaView>
    );
  }
}

export { SignUp };
const styles = StyleSheet.create({
  LoaderStyle: {justifyContent: 'center', alignItems: 'center', flex: 1},
  ChooseTypeBTN: {
    height: hp('9%'),
    borderRadius: wp('1%'),
    paddingTop: wp('2%'),
    marginLeft: wp(I18nManager.isRTL ? '2.85%' : '-2.85%'),
    width: wp('86.85%'),
    fontFamily: fonts.bold,
  },
  signAs: {
    fontSize: hp('1.5%'),
    color: 'white',
    fontFamily: fonts.bold,
    marginLeft: hp('2%'),
    textAlign: Platform.OS == 'android' ? null : 'left',
  },
  ChooseTypeStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: wp('3%'),
    width: wp('90%'),
    height: hp('10%'),
    fontFamily: fonts.bold,
  },
  FourthMainView: {
    justifyContent: 'center',
    flexDirection: 'row',
    width: wp('100%'),
    marginTop: hp('6%'),
    height: hp('5%'),
  },
  OnSquareInput: {
    opacity: 1,
    width: wp('18%'),
    height: hp('10%'),
    borderRadius: wp('1%'),
    borderColor: '#8BD1EF',
  },
  InputView: {
    opacity: 0.7,
    backgroundColor: 'white',
    alignItems: 'center',
    borderRadius: wp('2%'),
    borderWidth: wp('0.3%'),
    flexDirection: 'row',
    width: wp('90%'),
    height: hp('7%'),
  },
  NextTxt: {fontSize: hp('2%'), color: 'white', fontFamily: fonts.bold},
  Header: {
    flexDirection: 'row',
    alignSelf: 'center',
    width: wp('90%'),
    marginTop: hp('7%'),
    height: hp('3%'),
  },
  ThirdMainView: {
    alignItems: 'center',
    width: wp('100%'),
    marginVertical: hp('4%'),
    height: hp('8%'),
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
    height: hp('10%'),
  },
  justEnterEmailAndPass: {
    marginTop: hp('1%'),
    fontSize: hp('1.8%'),
    color: 'silver',
    textAlign: 'left',
    fontFamily: fonts.bold,
  },
  forgetPassword: {
    fontSize: hp('3%'),
    color: 'white',
    textAlign: 'left',
    // marginHorizontal: wp('3%'),
    fontFamily: fonts.bold,
  },
  FirstMainView: {
    width: wp('100%'),
    marginTop: hp('4%'),
    height: hp('11%'),
    marginHorizontal: wp('3%'),
  },
  MainView: {width: wp('100%'), height: hp('90%')},
  BackArrow: {
    resizeMode: 'contain',
    width: wp('25%'),
    height: hp('4%'),
    position: 'absolute',
    top: hp('4%'),
  },
  LoginBTNStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    width: wp('90%'),
    height: hp('6%'),
    backgroundColor: '#483F8C',
    borderRadius: wp('2%'),
    fontFamily: fonts.bold,
    marginBottom: 10,
  },
  InputStyleLarge: {
    textAlign: 'center',
    width: wp('90%'),
    height: hp('8%'),
    fontSize: hp('2%'),
    fontFamily: fonts.normal,
    color: '#39A1F7',
  },
  InputStyle: {
    textAlign: 'center',
    width: wp('17%'),
    height: hp('9%'),
    fontSize: hp('2%'),
    fontFamily: fonts.normal,
    color: '#39A1F7',
  },
  InputStyleNewAccount: {
    width: wp('85%'),
    height: hp('7%'),
    fontSize: hp('2%'),
    fontFamily: fonts.normal,
    color: '#39A1F7',
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
  BackGroundLogo: {
    position: 'absolute',
    marginLeft: wp('40%'),
    resizeMode: 'contain',
    width: wp('80%'),
    height: hp('25%'),
  },
  BackGroundLogoErtaqe: {
    position: 'absolute',
    // left:0,
    top: 0,
    right: -5,
    // marginLeft: wp('40%'),
    resizeMode: 'cover',
    width: wp('60%'),
    height: hp('25%'),
    // backgroundColor:'red'
  },
  dontHaveAnAccount: {
    fontSize: hp('2%'),
    color: 'white',
    fontFamily: fonts.bold,
  },
  Phase1View2: {
    justifyContent: 'space-between',
    alignSelf: 'center',
    alignItems: 'center',
    width: wp('90%'),
    marginTop: hp('3%'),
    height: hp('55%'),
  },
  imgContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    width: 110,
    height: 100,
    borderRadius: 10,
    backgroundColor: '#FFF',
    elevation: 2,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 90 / 2,
  },
});
