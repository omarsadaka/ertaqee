import Geocoder from 'react-native-geocoder';
import React, { Component } from 'react';
import {
  ActivityIndicator,
  Alert,
  I18nManager,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image
} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import RNLocation from 'react-native-location';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { PERMISSIONS, request } from 'react-native-permissions';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Icon2 from 'react-native-vector-icons/FontAwesome5';
import UserProfile from '../../../../UserProfile';
import fonts from '../../../../fonts';
import { RadioButton } from '../../../common';
import ModalPicker from '../../../common/ModalPicker';
import strings from '../../../strings';
import AcceptTerms from '../AcceptTerms';
import ModalTakePhoto from '../ModalTakePhoto';
import ModalViewTerms from '../ModalViewTerms';

let CurrentRegion = '';
var GOOGLE_API_KEY = 'AIzaSyCz98PqCQhxZZS_KQQCNP2Rlobttqqrb_8';
class HallProviderInputs extends Component {
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
      role_id: '5',
      company_activity: '',
      company_trade_name: '',
      address: '',
      UpdateObj: null,
      multiline: true,
      tax_record: '',
      commercial_register: '',
      chamber_of_commerce: '',
      imageModalVisible: false,
      typeImage: '',
      MoreFile: [{about: '', image: ''}],
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
      HallsData: [],
      hall_provider_type_id: '',
      hall_provider_type: '',
      showEye: false,
      showEyeConfirm: false,
      addressDetails: '',
      showTerms: false,
    };
  }

  componentDidMount() {
    console.log('UserInputs');
    this.InputsObj['role_id'] = '5';
    try {
      let RoleId = UserProfile.getInstance().clientObj.user.role_id[0];
      if (RoleId)
        this.SetStateBasedOnPropsObj(UserProfile.getInstance().clientObj.user);
    } catch (Error) {}
    this.SetCountriesData(UserProfile.getInstance().clientObj.user?.country_id);
    this.GetHallProviversData();
  }

  SetStateBasedOnPropsObj(UserObj) {
    console.log("🚀 ~ file: HallProviderInputs.js:102 ~ HallProviderInputs ~ SetStateBasedOnPropsObj ~ UserObj:", UserObj)
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
    this.InputsObj['id_number'] = UserObj.id_number;
    this.InputsObj['address'] = UserObj.address;
    this.InputsObj['latitude'] = UserObj.latitude;
    this.InputsObj['longitude'] = UserObj.longitude;
    this.InputsObj['hall_provider_type_id'] = UserObj.hall_provider_type_id;
    this.InputsObj['company_trade_name'] = UserObj.company_trade_name;
    this.InputsObj['commercial_register_about'] =
      UserObj.commercial_register_about;
    this.InputsObj['tax_record_about'] = UserObj.tax_record_about;
    this.InputsObj['chamber_of_commerce_about'] =
      UserObj.chamber_of_commerce_about;
    if (UserObj.tax_record) {
      if (UserObj.tax_record.path) {
        this.setState({tax_record: {uri: UserObj.tax_record.path}});
      } else {
        this.setState({tax_record: {uri: UserObj.tax_record}});
      }
    }
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
    if (UserObj.chamber_of_commerce) {
      if (UserObj.chamber_of_commerce.path) {
        this.setState({
          chamber_of_commerce: {uri: UserObj.chamber_of_commerce.path},
        });
      } else {
        this.setState({
          chamber_of_commerce: {uri: UserObj.chamber_of_commerce},
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
      company_trade_name: UserObj.company_trade_name,
      hall_provider_type_id: UserObj.hall_provider_type_id,
      hall_provider_type: UserObj.hall_provider_type,
      address: UserObj.address,
      addressDetails: UserObj.address,
      latitude: UserObj.latitude,
      longitude: UserObj.longitude,
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
    // this.InputsObj['country_id'] = this.props.CountriesData[1].id;
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

  GetHallProviversData() {
    let IsAr = UserProfile.getInstance().Lang === 'ar';
    fetch('https://www.demo.ertaqee.com/api/v1/halls_provider_types', {
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
        console.log('Here GetHallProviversData' + JSON.stringify(arr));
        for (let index = 0; index < arr.length; index++) {
          const obj = {
            id: arr[index].id,
            name: IsAr ? arr[index].title_ar : arr[index].title_en,
          };
          data.push(obj);
        }
        this.setState({
          HallsData: data,
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
    if (this.props.loading)
      return <ActivityIndicator size="large" color="white" />;
    return <Text style={styles.NextTxt}>{strings.done}</Text>;
  }

  IsThereAnyInputEmpty(Data) {
    console.log(
      '🚀 ~ file: HallProviderInputs.js:287 ~ HallProviderInputs ~ IsThereAnyInputEmpty ~ Data:',
      Data,
    );
    console.log(Data);
    if (this.state.UpdateObj) {
      try {
        return (
          Data.username.length === 0 ||
          Data.first_name.length === 0 ||
          Data.family_name.length === 0 ||
          Data.email.length === 0 ||
          Data.phone.length === 0 ||
          Data.country_id.length === 0 ||
          Data.city_id.length === 0 ||
          Data.address.length === 0 ||
          Data.hall_provider_type_id.length === 0 ||
          Data.company_trade_name.length === 0
          // Data.id_number.length === 0 ||
          // Data.company_name.length === 0 ||
          // Data.company_trade_name.length === 0||
          // Data.address.length === 0 ||
          // Data.tax_record_about.length === 0 ||
          // Data.commercial_register_about.length === 0 ||
          // Data.chamber_of_commerce_about.length === 0 ||
          // !this.state.tax_record ||
          // !this.state.commercial_register ||
          // !this.state.chamber_of_commerce
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
          Data.country_id.length === 0 ||
          Data.city_id.length === 0 ||
          Data.address.length === 0 ||
          Data.hall_provider_type_id.length === 0 ||
          Data.company_trade_name.length === 0
        );
      } catch {
        return true;
      }
    }
  }

  onSubmit(Data) {
    console.log(Data);
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
    if (this.state.MoreFile && this.state.MoreFile.length !== 0) {
      let MoreFile = [];
      let flag = false;
      this.state.MoreFile.map(item => {
        let more = '';
        if (!item.about && !item.image) {
        } else if (item.about && item.image) {
          more = item;
        } else {
          flag = true;
        }
        if (more) {
          MoreFile.push(more);
        }
      });
      if (flag) {
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
      }
      if (MoreFile.length !== 0) {
        Data.attachment_desc = 'legal_papers';
        MoreFile.map((item, index) => {
          Data[`attachment[${index}][about]`] = item.about;
          Data[`attachment[${index}][image]`] = item.image;
        });
      }
    }

    delete Data.UpdateObj;
    if (this.state.tax_record && this.state.tax_record.type) {
      Data.tax_record = this.state.tax_record;
    }
    if (this.state.commercial_register && this.state.commercial_register.type) {
      Data.commercial_register = this.state.commercial_register;
    }
    if (this.state.chamber_of_commerce && this.state.chamber_of_commerce.type) {
      Data.chamber_of_commerce = this.state.chamber_of_commerce;
    }
    this.props.SignUpPost(Data);
  }

  choicePicker = func => {
    let permission =
      Platform.OS === 'ios'
        ? func === 'launchImageLibrary'
          ? PERMISSIONS.IOS.PHOTO_LIBRARY
          : PERMISSIONS.IOS.CAMERA
        : PERMISSIONS.ANDROID.CAMERA;
    request(permission).then(result => {
      // switch (result) {
      //   case RESULTS.GRANTED:
      ImagePicker[func](
        {mediaType: 'photo', quality: 0.6, maxWidth: 1024, maxHeight: 1024},
        response1 => {
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
          } else {
          }
        },
      );
      //     break;
      //   default: {
      //     Platform.OS === 'ios'
      //       ? Linking.openURL('app-settings://Photos')
      //       : choicePicker(func);
      //   }
      // }
    });
  };

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
      console.log(
        '🚀 ~ file: TrainingCentersInputs.js:604 ~ TrainingCentersInputs ~ PickLoc ~ granted:',
        granted,
      );
      if (granted) {
        this.GetLocation();
      }
    });
  }
  async GetLocation() {
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
    if (UserProfile.getInstance().Lat.length > 2) {
      console.log('ShowMap');
      this.setState({ShowMap: true});
      return;
    }
    this.setState({loading: true});
    RNLocation.configure({distanceFilter: 0});
    RNLocation.getLatestLocation({timeout: 7000}).then(latestLocation => {
      console.log(
        '🚀 ~ file: TrainingCentersInputs.js:639 ~ TrainingCentersInputs ~ RNLocation.getLatestLocation ~ latestLocation:',
        latestLocation,
      );
      try {
        this.setState({loading: false});
        if (latestLocation?.longitude) {
          CurrentRegion = latestLocation;

          UserProfile.getInstance().Lat = latestLocation?.latitude;
          UserProfile.getInstance().Lon = latestLocation?.longitude;

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
        console.log(
          '🚀 ~ file: TrainingCentersInputs.js:652 ~ TrainingCentersInputs ~ RNLocation.getLatestLocation ~ error:',
          error,
        );
        // this.GoToLocationAlert();
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
            // ).then(result => {
            //   if (result === RNSettings.ENABLED) {
            //     this.GetLocationNow();
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
    console.log(
      '🚀 ~ file: TrainingCentersInputs.js:696 ~ TrainingCentersInputs ~ PickThisLoc ~ CurrentRegion:',
      CurrentRegion,
    );
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
        this.setState({
          addressDetails: res[0].formattedAddress + ', ' + res[0].adminArea,
          latitude: location.lat,
          longitude: location.lng,
        });
        this.InputsObj['address'] =
          res[0].formattedAddress + ', ' + res[0].adminArea;
        this.InputsObj['latitude'] = location.lat;
        this.InputsObj['longitude'] = location.lng;
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
    console.log(
      '🚀 ~ file: TrainerInputs.js:682 ~ MapView ~ MapView:',
      this.state.Lat,
      this.state.Lon,
    );

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
              <TextInput
                onChangeText={text => (InputsObj['password'] = text)}
                placeholder={' * ' + strings.password}
                placeholderTextColor={'gray'}
                style={[styles.InputStyleNewAccount]}
                secureTextEntry={!this.state.showEye}
              />
              <Icon2
                name={this.state.showEye ? 'eye' : 'eye-slash'}
                size={hp('2%')}
                color={!this.state.showEye ? 'gray' : '#39A1F7'}
                style={{marginHorizontal: 10}}
                onPress={() => {
                  this.setState({showEye: !this.state.showEye});
                }}
              />
            </View>
          </>
        )}
        {!UpdateObj && (
          <>
            <Text style={styles.label}>{strings.passwordConfirmation}</Text>
            <View style={styles.InputView}>
              <TextInput
                onChangeText={text =>
                  (InputsObj['password_confirmation'] = text)
                }
                placeholder={' * ' + strings.passwordConfirmation}
                placeholderTextColor={'gray'}
                style={[styles.InputStyleNewAccount]}
                secureTextEntry={!this.state.showEyeConfirm}
              />
              <Icon2
                name={this.state.showEyeConfirm ? 'eye' : 'eye-slash'}
                size={hp('2%')}
                color={!this.state.showEyeConfirm ? 'gray' : '#39A1F7'}
                style={{marginHorizontal: 10}}
                onPress={() => {
                  this.setState({showEyeConfirm: !this.state.showEyeConfirm});
                }}
              />
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
            placeholder={
              InputsObj.UpdateObj
                ? InputsObj.UpdateObj.id_number
                : strings.id_number
            }
            value={this.state.id_number}
            placeholderTextColor={'gray'}
            style={[styles.InputStyleNewAccount]}
          />
        </View>

        <Text style={styles.label}>{strings.gender}</Text>
        <View style={[styles.InputView, {borderWidth: 0}]}>
          <TouchableOpacity
            onPress={() => this.setState({gender: 'male'})}
            style={styles.RestoreByPhoneOrEmail}>
            <RadioButton
              selected={this.state.gender == 'male'}
              color={'#39A1F7'}
            />
            <Text style={styles.restoreByPhone}> {strings.male}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.setState({gender: 'female'})}
            style={styles.RestoreByPhoneOrEmail}>
            <RadioButton
              selected={this.state.gender == 'female'}
              color={'#39A1F7'}
            />
            <Text style={styles.restoreByPhone}> {strings.female}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.setState({gender: 'bestnottodisclose'})}
            style={styles.RestoreByPhoneOrEmail}>
            <RadioButton
              selected={this.state.gender == 'bestnottodisclose'}
              color={'#39A1F7'}
            />
            <Text style={styles.restoreByPhone}>
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
                : strings.choose_country + ' *'
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
                this.state.cityName
                  ? this.state.cityName
                  : strings.choose_city + ' *'
              }
              defaultColor={'silver'}
              onSelect={(index, value) => {
                InputsObj['city_id'] = value.id;
                this.setState({city_id: value.id});
              }}
            />
          </View>
        ) : null}

        <Text style={[styles.label, {marginTop: hp('1%')}]}>
          {strings.build_name}
        </Text>
        <View style={styles.InputView}>
          <TextInput
            multiline={multiline}
            onChangeText={text => {
              InputsObj['company_trade_name'] = text;
              this.setState({company_trade_name: text});
            }}
            placeholder={strings.build_name + ' *'}
            value={this.state.company_trade_name}
            style={[styles.InputStyleNewAccount]}
          />
        </View>

        <Text style={styles.label}>{strings.hall_type}</Text>
        <View
          style={{
            height: wp('13%'),
            alignSelf: 'stretch',
          }}>
          <ModalPicker
            hasBorder={true}
            data={this.state.HallsData}
            hint={
              this.state.hall_provider_type
                ? this.state.hall_provider_type
                : strings.hall_type + ' *'
            }
            defaultColor={'silver'}
            onSelect={(index, value) => {
              InputsObj['hall_provider_type_id'] = value.id;
              this.setState({hall_provider_type_id: value.id});
            }}
          />
        </View>

        {/* <View style={styles.InputView}>
            <TextInput
              pointerEvents="none"
              multiline={multiline}
              onBlur={() => this.setState({multiline: true})}
              onFocus={() => this.setState({multiline: false})}
              onChangeText={(text) => (InputsObj['address'] = text)}
              placeholder={
                InputsObj.UpdateObj && InputsObj.UpdateObj.address
                  ? InputsObj.UpdateObj.address
                  : strings.address + ' *'
              }
              placeholderTextColor={
                InputsObj.UpdateObj && InputsObj.UpdateObj.address
                  ? 'black'
                  : undefined
              }
              style={[styles.InputStyleNewAccount]}
            />
          </View>
       
          <View style={styles.InputView}>
            <TextInput
              pointerEvents="none"
              multiline={multiline}
              onBlur={() => this.setState({multiline: true})}
              onFocus={() => this.setState({multiline: false})}
              onChangeText={(text) => (InputsObj['company_trade_name'] = text)}
              placeholder={
                InputsObj.UpdateObj && InputsObj.UpdateObj.company_trade_name
                  ? InputsObj.UpdateObj.company_trade_name
                  : `${strings.tradeName}*`
              }
              placeholderTextColor={
                InputsObj.UpdateObj && InputsObj.UpdateObj.company_trade_name
                  ? 'black'
                  : undefined
              }
              style={[styles.InputStyleNewAccount]}
            />
          </View>
       
          <View style={styles.InputView}>
            <TextInput
              pointerEvents="none"
              multiline={multiline}
              onBlur={() => this.setState({multiline: true})}
              onFocus={() => this.setState({multiline: false})}
              onChangeText={(text) =>
                (InputsObj['commercial_register_about'] = text)
              }
              placeholder={
                InputsObj.UpdateObj &&
                InputsObj.UpdateObj.commercial_register_about
                  ? InputsObj.UpdateObj.commercial_register_about
                  : `${strings.CommercialRegistrationNo}*`
              }
              placeholderTextColor={
                InputsObj.UpdateObj &&
                InputsObj.UpdateObj.commercial_register_about
                  ? 'black'
                  : undefined
              }
              style={[styles.InputStyleNewAccount]}
            />
          </View>
        
          <TouchableOpacity
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
                  }}>{`${strings.AttachChamberFile}*`}</Text>
              </View>
            )}
          </TouchableOpacity>
        
          <View style={styles.InputView}>
            <TextInput
              pointerEvents="none"
              multiline={multiline}
              onBlur={() => this.setState({multiline: true})}
              onFocus={() => this.setState({multiline: false})}
              onChangeText={(text) => (InputsObj['tax_record_about'] = text)}
              placeholder={
                InputsObj.UpdateObj && InputsObj.UpdateObj.tax_record_about
                  ? InputsObj.UpdateObj.tax_record_about
                  : `${strings.TaxNumber}*`
              }
              placeholderTextColor={
                InputsObj.UpdateObj && InputsObj.UpdateObj.tax_record_about
                  ? 'black'
                  : undefined
              }
              style={[styles.InputStyleNewAccount]}
            />
          </View>
       
          <TouchableOpacity
            onPress={() => {
              this.setState({
                typeImage: 'tax_record',
                imageModalVisible: true,
              });
            }}>
            {this.state.tax_record ? (
              <View
                style={[
                  styles.InputView,
                  {paddingHorizontal: 10, height: hp(20)},
                ]}>
                <Image
                  source={this.state.tax_record}
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
                  }}>{`${strings.AttachTaxFile}*`}</Text>
              </View>
            )}
          </TouchableOpacity>
       
          <View style={styles.InputView}>
            <TextInput
              pointerEvents="none"
              multiline={multiline}
              onBlur={() => this.setState({multiline: true})}
              onFocus={() => this.setState({multiline: false})}
              onChangeText={(text) =>
                (InputsObj['chamber_of_commerce_about'] = text)
              }
              placeholder={
                InputsObj.UpdateObj &&
                InputsObj.UpdateObj.chamber_of_commerce_about
                  ? InputsObj.UpdateObj.chamber_of_commerce_about
                  : `${strings.ChamberOfCommerceNo}*`
              }
              placeholderTextColor={
                InputsObj.UpdateObj &&
                InputsObj.UpdateObj.chamber_of_commerce_about
                  ? 'black'
                  : undefined
              }
              style={[styles.InputStyleNewAccount]}
            />
          </View>
       
          <TouchableOpacity
            onPress={() => {
              this.setState({
                typeImage: 'chamber_of_commerce',
                imageModalVisible: true,
              });
            }}>
            {this.state.chamber_of_commerce ? (
              <View
                style={[
                  styles.InputView,
                  {paddingHorizontal: 10, height: hp(20)},
                ]}>
                <Image
                  source={this.state.chamber_of_commerce}
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
                  }}>{`${strings.AttachChamberFile}*`}</Text>
              </View>
            )}
          </TouchableOpacity>
       
          <View style={{marginTop: hp('3%')}}>
            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  fontSize: hp('2%'),
                  color: '#7E7E7E',
                  marginHorizontal: 5,
                  marginRight: wp('3%'),
                }}>
                {`${strings.MoreOfficialPapers}*`}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  let arr = this.state.MoreFile.slice();
                  arr.push({
                    about: '',
                    image: '',
                  });
                  this.setState({MoreFile: arr});
                }}>
                <AntDesign name="pluscircle" size={20} color="red" />
              </TouchableOpacity>
            </View>

            {this.state.MoreFile.map((item, index) => {
              return (
                <AttachFile
                  data={item}
                  index={index}
                  onChange={(item1) => {
                    let arr = this.state.MoreFile.slice();
                    arr[index] = item1;
                    this.setState({MoreFile: arr});
                  }}
                  onDelete={() => {
                    let arr = this.state.MoreFile.slice();
                    arr.splice(index, 1);
                    this.setState({MoreFile: arr});
                  }}
                />
              );
            })}
          </View> */}

        <Text style={styles.label}>{strings.location}</Text>
        <TouchableOpacity onPress={() => this.PickLocation()}>
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
                : strings.pickLocation + ' *'}
            </Text>
          </View>
        </TouchableOpacity>
        {/* ) : null} */}

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
              latitude: this.state.latitude,
              longitude: this.state.latitude,
            }); // this.props.SignUpPost(InputsObj)
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

export { HallProviderInputs };
const styles = StyleSheet.create({
  RestoreByPhoneOrEmail: {
    //  width: wp('20%'),
    height: hp('4%'),
    flexDirection: 'row',
    marginEnd: wp('2%'),
    alignItems: 'center',
  },
  restoreByPhone: {
    fontFamily: fonts.normal,
  },
  NextTxt: {fontSize: hp('2.5%'), color: 'white', fontFamily: fonts.normal},
  LoginBTNStyle: {
    marginTop: hp('3%'),
    justifyContent: 'center',
    alignItems: 'center',
    width: wp('90%'),
    height: hp('6%'),
    backgroundColor: '#483F8C',
    borderRadius: wp('1%'),
  },
  ThirdMainView: {
    alignItems: 'center',
    width: wp('100%'),
    marginTop: hp('4%'),
    height: hp('8%'),
  },
  InputView: {
    borderColor: 'silver',
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
    fontFamily: fonts.normal,
    color: '#39A1F7',
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
    fontFamily: fonts.normal,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
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
  label: {
    fontFamily: fonts.normal,
    fontSize: hp('1.8%'),
    marginBottom: hp('1%'),
    textAlign: 'left',
    marginTop: hp('1.5%'),
    alignSelf: 'flex-start',
  },
});
