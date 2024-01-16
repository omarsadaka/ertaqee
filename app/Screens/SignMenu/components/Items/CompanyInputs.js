import React, { Component } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  I18nManager,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import RNLocation from 'react-native-location';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { PERMISSIONS, request } from 'react-native-permissions';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
// import RNSettings from 'react-native-settings';
import UserProfile from '../../../../UserProfile';
import { RadioButton } from '../../../common';
import ModalPicker from '../../../common/ModalPicker';
import strings from '../../../strings';
import AcceptTerms from '../AcceptTerms';
import ModalTakePhoto from '../ModalTakePhoto';
let CurrentRegion = '';
// import ImagePicker from 'react-native-image-picker';
import Geocoder from 'react-native-geocoder';
import * as ImagePicker from 'react-native-image-picker';
import Icon2 from 'react-native-vector-icons/FontAwesome5';
import fonts from '../../../../fonts';
import ModalViewTerms from '../ModalViewTerms';
import DocumentPicker from 'react-native-document-picker';
var {width, height} = Dimensions.get('window');
var GOOGLE_API_KEY = 'AIzaSyCz98PqCQhxZZS_KQQCNP2Rlobttqqrb_8';

class CompanyInputs extends Component {
  InputsObj = {};

  constructor(props) {
    super(props);
    this.PickLoc = this.PickLoc.bind(this);
    this.state = {
      username: '',
      first_name: '',
      sec_name: '',
      family_name: '',
      email: '',
      password: '',
      password_confirmation: '',
      phone: '',
      gender: 'male',
      country_id: '',
      city_id: '',
      workplace: '',
      employer: '',
      employeeLevel: '',
      id_number: '',
      CountriesData: [],
      CitiesData: [],
      role_id: '3',
      company_activity: '',
      company_trade_name: '',
      address: '',
      UpdateObj: null,
      multiline: true,
      checked: false,
      ShowMap: false,
      Lat: '',
      Lon: '',
      region: {
        latitudeDelta: 0.001,
        longitudeDelta: 0.001,
      },
      countryName: '',
      cityName: '',
      companySizesData: [],
      facility_size_id: '',
      typeImage: '',
      showEye: false,
      showEyeConfirm: false,
      commercial_register: '',
      addressDetails: '',
      showTerms: false,
      cv_name:''
    };
  }

  componentDidMount() {
    console.log('UserInputs');
    this.InputsObj['role_id'] = '3';
    try {
      let RoleId = UserProfile.getInstance().clientObj.user.role_id[0];
      if (RoleId)
        this.SetStateBasedOnPropsObj(UserProfile.getInstance().clientObj.user);
    } catch (Error) {}
    this.SetCountriesData(UserProfile.getInstance().clientObj.user?.country_id);
    this.GetCompanySizeData();
  }

  SetStateBasedOnPropsObj(UserObj) {
    this.InputsObj['UpdateObj'] = UserObj;
    this.setState({
      UpdateObj: UserObj,
      countryName: UserObj.country,
      cityName: UserObj.city,
    });
    this.InputsObj['user_id'] = UserObj.id;
    this.InputsObj['username'] = UserObj.username;
    this.InputsObj['first_name'] = UserObj.first_name;
    this.InputsObj['sec_name'] = UserObj.sec_name;
    this.InputsObj['family_name'] = UserObj.last_name;
    this.InputsObj['email'] = UserObj.email ? UserObj.email : '';
    // this.InputsObj['password'] = UserProfile.getInstance().UserCreds.password;
    // this.InputsObj[
    //   'password_confirmation'
    // ] = UserProfile.getInstance().UserCreds.password;
    this.InputsObj['phone'] = UserObj.phone
      ? UserObj.phone
      : UserObj.mobile
      ? UserObj.mobile
      : '';
    this.InputsObj['gender'] = UserObj.gender;
    this.setState({gender: UserObj.gender ? UserObj.gender : 'male'});
    this.InputsObj['workplace'] = UserObj.workplace;
    this.InputsObj['employer'] = UserObj.employer;
    this.InputsObj['id_number'] = UserObj.id_number;
    this.InputsObj['company_activity'] = UserObj.company_activity;
    this.InputsObj['company_name'] = UserObj.company_name;
    this.InputsObj['company_trade_name'] = UserObj.company_trade_name;
    this.InputsObj['facility_size_id'] = UserObj.facility_size_id
      ? UserObj.facility_size_id
      : '';
    this.InputsObj['address'] = UserObj.address;
    if (UserObj.commercial_register) {
      if (UserObj.commercial_register.path) {
        this.setState({
          commercial_register: {uri: UserObj.commercial_register.path},
        });
      } else {
        this.setState({
          commercial_register: {uri: UserObj.commercial_register},
        });
      }
    }
    this.setState({
      country_id: UserObj.country_id,
      city_id: UserObj.city_id,
      username: UserObj.username,
      first_name: UserObj.first_name,
      sec_name: UserObj.sec_name,
      family_name: UserObj.last_name,
      email: UserObj.email,
      phone: UserObj.phone ? UserObj.phone : UserObj.mobile,
      id_number: UserObj.id_number,
      address: UserObj.address,
      company_name: UserObj.company_name,
      company_trade_name: UserObj.company_trade_name,
      facility_size_id: UserObj.facility_size_id,
      company_activity: UserObj.company_activity,
    });
  }

  SetCountriesData(countryId) {
    let IsAr = UserProfile.getInstance().Lang === 'ar';
    const data = [];
    var arr = this.props.CountriesData;
    console.log('arr', JSON.stringify(arr));
    for (let index = 0; index < arr.length; index++) {
      const obj = {
        id: arr[index].id,
        name: IsAr ? arr[index].title_ar : arr[index].title_en,
      };
      data.push(obj);
    }
    this.setState({
      CountriesData: data,
      // country_id: this.props.CountriesData[1].id,
    });
    // this.InputsObj['country_id'] = this.props.CountriesData[0].id;
    this.GetCitiesData(countryId ?? this.props.CountriesData[0].id);
  }

  GetCitiesData(Country) {
    // this.setState({CitiesData: ''});
    fetch('https://www.demo.ertaqee.com/api/v1/cities/' + Country, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Accept-Language': UserProfile.getInstance().Lang,
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        const data = [];
        var arr = responseJson.data;
        if (arr.length > 0) {
          console.log('Here arr' + JSON.stringify(arr));
          for (let index = 0; index < arr.length; index++) {
            const obj = {
              id: arr[index].id,
              name: arr[index].title,
            };
            data.push(obj);
          }
          this.setState({
            CitiesData: data,
            // city_id: responseJson.data[0].id,
          });
          // this.InputsObj['city_id'] = responseJson.data[0].id;
          console.log('Here this.InputsObj:' + this.InputsObj['city_id']);
        } else {
          Alert.alert('', strings.noCities, [
            {
              text: strings.cancel,
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {text: strings.ok, onPress: () => console.log('OK Pressed')},
          ]);
        }
      })
      .catch(error => {
        console.log('123123error:' + error);
      });
  }

  GetCompanySizeData() {
    let IsAr = UserProfile.getInstance().Lang === 'ar';
    fetch('https://www.demo.ertaqee.com/api/v1/facility_sizes', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        const data = [];
        var arr = responseJson.data;
        console.log('Here GetCompanySizeData' + JSON.stringify(arr));
        for (let index = 0; index < arr.length; index++) {
          const obj = {
            id: arr[index].id,
            name: IsAr ? arr[index].title_ar : arr[index].title_en,
          };
          data.push(obj);
        }
        this.setState({
          companySizesData: data,
        });
      })
      .catch(error => {
        console.log('123123error:' + error);
      });
  }

  SelectThisCountry(itemValue) {
    this.setState({country_id: itemValue});
    this.InputsObj['country_id'] = itemValue;
    this.GetCitiesData(itemValue);
  }

  LoginTxt() {
    if (this.state.loading)
      return <ActivityIndicator size="large" color="white" />;
    return <Text style={styles.NextTxt}>{strings.done}</Text>;
  }

  IsThereAnyInputEmpty(Data) {
    console.log(
      '🚀 ~ file: CompanyInputs.js:271 ~ CompanyInputs ~ IsThereAnyInputEmpty ~ Data:',
      Data,
    );
    if (this.state.UpdateObj) {
      try {
        return (
          Data.username.length === 0 ||
          Data.first_name.length === 0 ||
          Data.family_name.length === 0 ||
          Data.email.length === 0 ||
          Data.phone.length === 0 ||
          Data.company_name.length === 0
        );
      } catch {
        return true;
      }
    } else {
      try {
        return (
          Data.username.length === 0 ||
          Data.first_name.length === 0 ||
          Data.family_name.length === 0 ||
          Data.password.length === 0 ||
          Data.password_confirmation.length === 0 ||
          Data.email.length === 0 ||
          Data.phone.length === 0 ||
          Data.company_name.length === 0
        );
      } catch {
        return true;
      }
    }
  }

  onSubmit(Data) {
    if (this.IsThereAnyInputEmpty(Data)) {
      Alert.alert('', strings.feildsWithStarRequierd, [
        {
          text: strings.cancel,
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: strings.ok, onPress: () => console.log('OK Pressed')},
      ]);
      return;
    }
    if (!this.state.checked) {
      Alert.alert(strings.termsAndCond, strings.accept_terms, [
        {
          text: strings.cancel,
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: strings.ok, onPress: () => console.log('OK Pressed')},
      ]);
      return;
    }
    delete Data.UpdateObj;
    this.props.SignUpPost(Data);
  }

  PickLocation() {
    this.PickLoc();
  }
  PickLoc() {
    RNLocation.requestPermission({
      ios: 'whenInUse',
      android: {
        detail: 'coarse',
      },
    }).then(granted => {
      if (granted) {
        this.GetLocation();
      }
    });
  }
  async GetLocation() {
    // RNSettings.getSetting(RNSettings.LOCATION_SETTING).then((result) => {
    //   if (result == RNSettings.ENABLED) {
    //     this.GetLocationNow();
    //   } else {
    //     this.GoToLocationAlert();
    //     console.log('Here');
    //   }
    // });
    const enabled = RNLocation.checkPermission({
      ios: 'whenInUse', // or 'always'
      android: {
        detail: 'coarse', // or 'fine'
      },
    });
    if (enabled) {
      this.GetLocationNow();
    } else {
      this.GoToLocationAlert();
      console.log('Here');
    }
  }
  GetLocationNow() {
    console.log(
      'UserProfile.getInstance().Lat:' + UserProfile.getInstance().Lat,
    );
    // if (UserProfile.getInstance().Lat.length > 2) {
    //   console.log('ShowMap');
    //   this.setState({ShowMap: true});
    //   return;
    // }
    this.setState({loading: true});
    RNLocation.configure({distanceFilter: 0});
    RNLocation.getLatestLocation({timeout: 7000}).then(latestLocation => {
      try {
        this.setState({loading: false});
        if (latestLocation.longitude) {
          UserProfile.getInstance().Lat = latestLocation.latitude;
          UserProfile.getInstance().Lon = latestLocation.longitude;
          console.log('ShowMap');
          this.setState({
            ShowMap: true,
            Lat: latestLocation?.latitude,
            Lon: latestLocation?.longitude,
          });
        }
        // else {
        //   this.GoToLocationAlert();
        // }
      } catch (error) {
        // this.GoToLocationAlert();
        console.log('Error:' + error);
        alert(error);
      }
    });
  }
  GoToLocationAlert() {
    Alert.alert(
      strings.alert,
      strings.activateYourLocationPlease,
      [
        {
          text: strings.no,
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: strings.yes,
          onPress: () => {
            // RNSettings.openSetting(
            //   RNSettings.ACTION_LOCATION_SOURCE_SETTINGS,
            // ).then((result) => {
            //   if (result === RNSettings.ENABLED) {
            //     // this.GetLocationNow();
            //   }
            // });
          },
        },
      ],
      {cancelable: true},
    );
  }
  onRegionChange(region) {
    CurrentRegion = region;
  }

  PickThisLoc() {
    console.log('PickThisLoc');
    console.log(JSON.stringify(CurrentRegion));
    this.setState({Lat: CurrentRegion.latitude, Lon: CurrentRegion.longitude});
    const obj = {
      lat: CurrentRegion.latitude,
      lng: CurrentRegion.longitude,
    };
    this.reverseGeoLocation(obj);
    this.setState({ShowMap: false});
  }

  reverseGeoLocation = location => {
    const GeocoderOptions = {
      apiKey: GOOGLE_API_KEY,
      locale: I18nManager.isRTL ? 'ar' : 'en',
      fallbackToGoogle: true,
      maxResults: 1,
    };
    Geocoder.geocodePosition(location, GeocoderOptions)
      .then(res => {
        // setAddressDetails(res[0].formattedAddress + ', ' + res[0].adminArea);
        alert('ddd')
        this.setState({
          addressDetails: res[0].formattedAddress + ', ' + res[0].adminArea,
        });
        var add = res[0].formattedAddress;
        var value = add.split(',');
        var count = value.length;
        var city = value[count - 3];
        console.log('city', city);
        // setCityName(city);
      })
      .catch(err => {
        console.log('error address from map', err);
      });
  };

  MapView() {
    if (this.state.ShowMap)
      return (
        <View
          style={{
            alignItems: 'center',
            width: wp('90%'),
            height: hp('90%'),
            position: 'absolute',
            bottom: hp('0%'),
          }}>
          <MapView
            provider={PROVIDER_GOOGLE}
            zoomControlEnabled
            zoomEnabled
            zoomTapEnabled
            showsUserLocation={false}
            showsMyLocationButton={false}
            style={styles.map}
            initialRegion={{
              latitude: this.state.Lat
                ? Number(this.state.Lat)
                : Number(UserProfile.getInstance().Lat),
              longitude: this.state.Lon
                ? Number(this.state.Lon)
                : Number(UserProfile.getInstance().Lon),
              latitudeDelta: 0.0075,
              longitudeDelta: 0.0075,
            }}
            onPress={e =>
              this.setState({
                Lat: e.nativeEvent.coordinate.latitude,
                Lon: e.nativeEvent.coordinate.longitude,
              })
            }
            onRegionChangeComplete={e => {
              this.setState({Lat: e.latitude, Lon: e.longitude});
              this.onRegionChange(e);
            }}>
            <Marker
              draggable
              coordinate={{
                latitude: this.state.Lat
                  ? Number(this.state.Lat)
                  : Number(UserProfile.getInstance().Lat),
                longitude: this.state.Lon
                  ? Number(this.state.Lon)
                  : Number(UserProfile.getInstance().Lon),
                latitudeDelta: 0.0075,
                longitudeDelta: 0.0075,
              }}
              style={{justifyContent: 'center', alignItems: 'center'}}
              tracksViewChanges={true}></Marker>
          </MapView>
          {/* <Icon
            name="location-on"
            size={50}
            style={{marginTop: hp('35%')}}
            color={'red'}
          /> */}
          <TouchableOpacity
            onPress={() => this.PickThisLoc()}
            style={styles.pickLocationBtn}>
            <Text style={styles.NextTxt}>{strings.select}</Text>
          </TouchableOpacity>
        </View>
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

            this.setState({[this.state.typeImage]: data});
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

  async PickMultipleFiles() {
    try {
      const results = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.images],
        allowMultiSelection: true,
      });
      console.log(
        '🚀 ~ file: HallInputs.js:604 ~ HallInputs ~ PickMultipleFiles ~ results:',
        results,
      );
      this.setState({cv_name: results?.name});
      let data = {
        uri: results.uri,
        type: results.type,
        name: 'fileName',
      };
      this.setState({[this.state.typeImage]: data});
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  }
  render() {
    const {UpdateObj, multiline} = this.state;
    const {InputsObj} = this;

    return (
      <View
        style={{
          flex: 1,
          alignContent: 'center',
          alignSelf: 'center',
          alignItems: 'center',
          marginHorizontal: 20,
          width: wp('90%'),
        }}>
        <Text style={styles.label}>{strings.userName}</Text>
        <View style={styles.InputView}>
          <TextInput
            multiline={multiline}
            onChangeText={text => {
              this.setState({username: text});
              InputsObj['username'] = text;
            }}
            placeholder={strings.userName + ' *'}
            value={this.state.username}
            style={[styles.InputStyleNewAccount]}
          />
        </View>
        <Text style={styles.label}>{strings.first_name}</Text>
        <View style={styles.InputView}>
          <TextInput
            multiline={multiline}
            onChangeText={text => {
              this.setState({first_name: text});
              InputsObj['first_name'] = text;
            }}
            placeholder={strings.first_name + ' *'}
            value={this.state.first_name}
            style={[styles.InputStyleNewAccount]}
          />
        </View>
        <Text style={styles.label}>{strings.second_name}</Text>
        <View style={styles.InputView}>
          <TextInput
            multiline={multiline}
            onChangeText={text => {
              this.setState({sec_name: text});
              InputsObj['sec_name'] = text;
            }}
            placeholder={strings.second_name}
            value={this.state.sec_name}
            style={[styles.InputStyleNewAccount]}
          />
        </View>
        <Text style={styles.label}>{strings.family_name}</Text>
        <View style={styles.InputView}>
          <TextInput
            multiline={multiline}
            onChangeText={text => {
              this.setState({family_name: text});
              InputsObj['family_name'] = text;
            }}
            placeholder={strings.family_name + ' *'}
            value={this.state.family_name}
            style={[styles.InputStyleNewAccount]}
          />
        </View>

        {!UpdateObj && (
          <>
            <Text style={styles.label}>{strings.password}</Text>
            <View style={styles.InputView}>
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
                  onChangeText={text => (InputsObj['password'] = text)}
                  placeholder={' * ' + strings.password}
                  placeholderTextColor={'gray'}
                  style={[styles.InputStyle1, {paddingHorizontal: wp('2%')}]}
                  secureTextEntry={!this.state.showEye}
                  ref={input => {
                    this.secondTextInput = input;
                  }}
                />
                <Icon2
                  name={this.state.showEye ? 'eye' : 'eye-slash'}
                  size={hp('2%')}
                  color={!this.state.showEye ? 'black' : '#39A1F7'}
                  onPress={() => {
                    this.setState({showEye: !this.state.showEye});
                  }}
                />
              </View>
            </View>
          </>
        )}
        {!UpdateObj && (
          <>
            <Text style={styles.label}>{strings.passwordConfirmation}</Text>
            <View style={styles.InputView}>
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
                  // pointerEvents="none"
                  onChangeText={text =>
                    (InputsObj['password_confirmation'] = text)
                  }
                  placeholder={' * ' + strings.passwordConfirmation}
                  placeholderTextColor={'gray'}
                  style={[styles.InputStyle1]}
                  secureTextEntry={!this.state.showEyeConfirm}
                />
                <Icon2
                  name={this.state.showEyeConfirm ? 'eye' : 'eye-slash'}
                  size={hp('2%')}
                  color={!this.state.showEyeConfirm ? 'black' : '#39A1F7'}
                  onPress={() => {
                    this.setState({showEyeConfirm: !this.state.showEyeConfirm});
                  }}
                />
              </View>
            </View>
          </>
        )}
        <Text style={styles.label}>{strings.email}</Text>
        <View style={styles.InputView}>
          <TextInput
            multiline={multiline}
            keyboardType="email-address"
            onChangeText={text => {
              this.setState({email: text});
              InputsObj['email'] = text;
            }}
            placeholder={strings.email + ' *'}
            value={this.state.email}
            style={[styles.InputStyleNewAccount]}
          />
        </View>
        <Text style={styles.label}>{strings.phoneNumber}</Text>
        <View style={styles.InputView}>
          <TextInput
            multiline={multiline}
            keyboardType="phone-pad"
            onChangeText={text => {
              this.setState({phone: text});
              InputsObj['phone'] = text;
            }}
            placeholder={' * ' + strings.phoneNumber}
            value={this.state.phone}
            style={[styles.InputStyleNewAccount]}
          />
        </View>

        <Text style={styles.label}>{strings.id_number}</Text>
        <View style={styles.InputView}>
          <TextInput
            pointerEvents="none"
            multiline={multiline}
            onBlur={() => this.setState({multiline: true})}
            onFocus={() => this.setState({multiline: false})}
            onChangeText={text => {
              this.setState({id_number: text});
              InputsObj['id_number'] = text;
            }}
            placeholder={strings.id_number}
            value={this.state.id_number}
            placeholderTextColor={'gray'}
            style={[styles.InputStyleNewAccount]}
          />
        </View>

        <Text style={styles.label}>{strings.gender}</Text>
        <View style={[styles.InputView, {borderWidth: 0}]}>
          <TouchableOpacity
            onPress={() => this.setState({gender: 'male'})}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginHorizontal: wp('1%'),
            }}>
            <RadioButton
              selected={this.state.gender == 'male'}
              color={'#39A1F7'}
            />
            <Text style={styles.RestoreByPhoneOrEmail}> {strings.male}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.setState({gender: 'female'})}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginHorizontal: wp('1%'),
            }}>
            <RadioButton
              selected={this.state.gender == 'female'}
              color={'#39A1F7'}
            />
            <Text style={styles.RestoreByPhoneOrEmail}> {strings.female}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.setState({gender: 'bestnottodisclose'})}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginHorizontal: wp('1%'),
            }}>
            <RadioButton
              selected={this.state.gender == 'bestnottodisclose'}
              color={'#39A1F7'}
            />
            <Text style={styles.RestoreByPhoneOrEmail}>
              {' '}
              {strings.bestnottodisclose}
            </Text>
          </TouchableOpacity>
        </View>

        {/* {this.CountriesPicker()}
        {this.CitiesPicker()} */}
        <Text style={[styles.label]}>{strings.country}</Text>

        <View
          style={{
            height: wp('14%'),
            alignSelf: 'stretch',
          }}>
          <ModalPicker
            hasBorder={true}
            data={this.state.CountriesData}
            hint={
              this.state.countryName
                ? this.state.countryName
                : strings.choose_country
            }
            defaultColor={'silver'}
            onSelect={(index, value) => {
              InputsObj['country_id'] = value.id;
              this.setState({country_id: value.id});
              this.setState({cityName: ''});
              this.setState({CitiesData: ''});
              this.GetCitiesData(value.id);
            }}
          />
        </View>
        <Text style={[styles.label]}>{strings.city}</Text>
        {this.state.CitiesData ? (
          <View
            style={{
              height: wp('14%'),
              alignSelf: 'stretch',
            }}>
            <ModalPicker
              hasBorder={true}
              data={this.state.CitiesData}
              hint={
                this.state.cityName ? this.state.cityName : strings.choose_city
              }
              defaultColor={'silver'}
              onSelect={(index, value) => {
                InputsObj['city_id'] = value.id;
                this.setState({city_id: value.id});
              }}
            />
          </View>
        ) : null}

        <Text style={[styles.label, {marginTop: hp('0.8%')}]}>
          {strings.address}
        </Text>
        <View style={styles.InputView}>
          <TextInput
            multiline={multiline}
            onChangeText={text => {
              this.setState({address: text});
              InputsObj['address'] = text;
            }}
            value={this.state.address}
            placeholder={strings.address}
            style={[styles.InputStyleNewAccount]}
          />
        </View>
        <Text style={styles.label}>{strings.build_name}</Text>
        <View style={styles.InputView}>
          <TextInput
            multiline={multiline}
            onChangeText={text => {
              this.setState({company_name: text});
              InputsObj['company_name'] = text;
            }}
            value={this.state.company_name}
            placeholder={strings.build_name + ' *'}
            style={[styles.InputStyleNewAccount]}
          />
        </View>
        <Text style={styles.label}>{strings.tradeName}</Text>
        <View style={styles.InputView}>
          <TextInput
            multiline={multiline}
            onChangeText={text => {
              this.setState({company_trade_name: text});
              InputsObj['company_trade_name'] = text;
            }}
            value={this.state.company_trade_name}
            placeholder={strings.tradeName}
            style={[styles.InputStyleNewAccount]}
          />
        </View>
        <Text style={styles.label}>{strings.company_size}</Text>
        <View
          style={{
            height: wp('14%'),
            alignSelf: 'stretch',
            marginTop: hp('1%'),
            marginBottom: hp('1%'),
          }}>
          <ModalPicker
            hasBorder={true}
            data={this.state.companySizesData}
            hint={strings.company_size}
            defaultColor={'silver'}
            onSelect={(index, value) => {
              InputsObj['facility_size_id'] = value.id;
              this.setState({facility_size_id: value.id});
            }}
          />
        </View>
        <Text style={styles.label}>{strings.companyActivity}</Text>
        <View style={styles.InputView}>
          <TextInput
            multiline={multiline}
            onChangeText={text => {
              this.setState({company_activity: text});
              InputsObj['company_activity'] = text;
            }}
            value={this.state.company_activity}
            placeholder={strings.companyActivity}
            style={[styles.InputStyleNewAccount]}
          />
        </View>

        <Text style={styles.label}>{strings.AttachCommercialFile}</Text>
        <TouchableOpacity
            onPress={() => {
              this.PickMultipleFiles()
            }} style={{marginTop:10}}>
              <View style={[styles.InputView, {paddingHorizontal: 10}]}>
                <Text
                  style={{
                    color: '#7E7E7E',
                    fontSize: hp('1.8%'),
                    fontFamily: fonts.normal
                  }}>{this.state.cv_name? this.state.cv_name: `${strings.AttachCommercialFile}`}</Text>
              </View>
          </TouchableOpacity>
        {/* <TouchableOpacity
          onPress={() => {
            this.setState({
              typeImage: 'commercial_register',
              imageModalVisible: true,
            });
          }}>
          {this.state.commercial_register ? (
            <View
              style={[
                styles.InputView,
                {paddingHorizontal: 10, height: hp(20)},
              ]}>
              <Image
                source={this.state.commercial_register}
                style={{alignSelf: 'stretch', flex: 1}}
                resizeMode="stretch"
              />
            </View>
          ) : (
            <View style={[styles.InputView, {paddingHorizontal: 10}]}>
              <Text
                style={{
                  color: '#7E7E7E',
                  fontSize: hp('1.8%'),
                  fontFamily: fonts.normal,
                }}>{`${strings.AttachCommercialFile}`}</Text>
            </View>
          )}
        </TouchableOpacity> */}

        <Text style={styles.label}>{strings.location}</Text>
        <TouchableOpacity
          onPress={() => {
            this.PickLocation();
          }}>
          <View style={styles.InputView}>
            <Text
              style={[
                styles.NextTxt,
                {
                  color: this.state.addressDetails ? '#39A1F7' : '#7E7E7E',
                  fontSize: hp('1.8%'),
                  marginHorizontal: wp('3%'),
                  textAlign: 'left',
                },
              ]}>
              {' '}
              {this.state.addressDetails
                ? this.state.addressDetails
                : strings.pickLocation}
            </Text>
          </View>
        </TouchableOpacity>

        <AcceptTerms
          checked={this.state.checked}
          onChange={() => {
            if (this.state.checked) {
              this.setState({checked: false});
            } else {
              this.setState({checked: true});
            }
          }}
          onTermsClicked={() => {
            this.setState({showTerms: true});
          }}
        />

        <TouchableOpacity
          onPress={() => {
            this.onSubmit({
              ...InputsObj,
              gender: this.state.gender,
              city_id: this.state.city_id,
              country_id: this.state.country_id,
              address: this.state.addressDetails,
              latitude: this.state.Lat,
              longitude: this.state.Lon,
              // ...this.state.UpdateObj,
            });
            // this.props.SignUpPost(InputsObj)
          }}
          style={[styles.LoginBTNStyle, {backgroundColor: '#4D75B8'}]}>
          <Text style={styles.NextTxt}>{this.LoginTxt()}</Text>
        </TouchableOpacity>
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
        {this.MapView()}
        <ModalViewTerms
          visible={this.state.showTerms}
          changeState={() => this.setState({showTerms: false})}
        />
      </View>
    );
  }
}

export { CompanyInputs };
const styles = StyleSheet.create({
  RestoreByPhoneOrEmail: {
    // width: wp('20%'),
    marginEnd: wp('2%'),
    flexDirection: 'row',
    fontFamily: fonts.normal,
  },
  NextTxt: {fontSize: hp('2.5%'), color: 'white', fontFamily: fonts.bold},
  LoginBTNStyle: {
    marginTop: hp('3%'),
    justifyContent: 'center',
    alignItems: 'center',
    width: wp('90%'),
    height: hp('6%'),
    backgroundColor: '#483F8C',
    borderRadius: wp('1%'),
    fontFamily: fonts.normal,
  },
  pickLocationBtn: {
    // marginTop: hp('3%'),
    justifyContent: 'center',
    alignItems: 'center',
    width: wp('50%'),
    height: hp('6%'),
    backgroundColor: '#483F8C',
    borderRadius: wp('1%'),
    fontFamily: fonts.normal,
    position: 'absolute',
    bottom: 10,
  },
  ThirdMainView: {
    alignItems: 'center',
    width: wp('100%'),
    marginTop: hp('4%'),
    height: hp('8%'),
  },
  InputView: {
    borderColor: 'silver',
    // marginTop: hp('2%'),
    opacity: 0.7,
    backgroundColor: 'white',
    alignItems: 'center',
    borderRadius: wp('2%'),
    borderWidth: wp('0.3%'),
    flexDirection: 'row',
    width: wp('90%'),
    height: hp('7%'),
  },
  InputStyle: {
    textAlign: 'center',
    width: wp('17%'),
    height: hp('9%'),
    fontSize: hp('1.8%'),
    color: '#39A1F7',
    fontFamily: fonts.normal,
  },
  InputStyle1: {
    paddingStart: wp('2%'),
    textAlign: I18nManager.isRTL ? 'right' : 'left',
    width: wp('80%'),
    height: hp('7%'),
    fontSize: hp('1.7%'),
    color: '#39A1F7',
    fontFamily: fonts.normal,
  },
  InputStyleNewAccount: {
    // width: wp('85%'),
    flex: 1,
    height: hp('7%'),
    fontSize: hp('1.8%'),
    fontFamily: fonts.normal,
    color: '#39A1F7',
    textAlign: I18nManager.isRTL ? 'right' : 'left',
    paddingHorizontal: 10,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
  },
  label: {
    fontFamily: fonts.normal,
    fontSize: hp('1.8%'),
    marginBottom: hp('1%'),
    textAlign: 'left',
    marginTop: hp('1.5%'),
    alignSelf: 'flex-start',
  },
});
