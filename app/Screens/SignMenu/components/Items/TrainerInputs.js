import DateTimePicker from '@react-native-community/datetimepicker';
import Geocoder from 'react-native-geocoder';
import moment from 'moment';
import React, { Component } from 'react';
import {
  ActivityIndicator,
  Alert,
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
import ModalViewTerms from '../ModalViewTerms';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import Education from './Education';
import Experience from './Experience';
import ModalTakePhoto from '../ModalTakePhoto';
import { PERMISSIONS, request } from 'react-native-permissions';
import * as ImagePicker from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';

let CurrentRegion = '';
var GOOGLE_API_KEY = 'AIzaSyCz98PqCQhxZZS_KQQCNP2Rlobttqqrb_8';

class TrainerInputs extends Component {
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
      id_number: '',
      CountriesData: [],
      CitiesData: [],
      role_id: '6',
      trainertype: 'Collaborator',
      UpdateObj: this.props.UpdateObj,
      multiline: true,
      bank_account_file: '',
      imageModalVisible: false,
      typeImage: '',
      find_collaboration_center: 0,
      isDatePickerVisible: false,
      FromOrTo: '',
      education: [],
      experience: [],
      Degrees: [],
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
      showEye: false,
      showEyeConfirm: false,
      showTerms: false,
      skills:[],
      languages:[],
      cv_name:''
    };
  }

  componentDidMount() {
    this.InputsObj['role_id'] = '6';
    this.InputsObj['trainertype'] = 'Collaborator';
    console.log('UserInputs');
    try {
      let RoleId = UserProfile.getInstance().clientObj.user.role_id[0];
      if (RoleId) {
        this.SetStateBasedOnPropsObj(UserProfile.getInstance().clientObj.user);
        this.GetDegreeData();
      }
    } catch (Error) {}
    this.SetCountriesData(UserProfile.getInstance().clientObj.user?.country_id);
    this.GetSkillsData()
    this.GetLanguagesData()
  }

  GetDegreeData() {
    this.setState({Degrees: []});
    fetch('https://www.demo.ertaqee.com/api/v1/degrees', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Accept-Language': UserProfile.getInstance().Lang,
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.data.length > 0) {
          this.setState({
            Degrees: responseJson.data,
          });
        } else {
          Alert.alert('', strings.noDegrees, [
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

  SetStateBasedOnPropsObj(UserObj) {
    console.log(
      '🚀 ~ file: TrainerInputs.js:119 ~ TrainerInputs ~ SetStateBasedOnPropsObj ~ SetStateBasedOnPropsObj:',
    );
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
    this.InputsObj['phone'] = UserObj.phone
      ? UserObj.phone
      : UserObj.mobile
      ? UserObj.mobile
      : '';
    this.InputsObj['gender'] = UserObj.gender;
    this.InputsObj['id_number'] = UserObj.id_number;
    this.setState({gender: UserObj.gender ? UserObj.gender : 'male'});
    this.InputsObj['gender'] = UserObj.gender;
    this.InputsObj['address'] = UserObj.address;
    this.InputsObj['latitude'] = UserObj.latitude;
    this.InputsObj['longitude'] = UserObj.longitude;

    console.log(
      '🚀 ~ file: TrainerInputs.js:139 ~ TrainerInputs ~ SetStateBasedOnPropsObj ~ InputsObj:',
      this.InputsObj,
    );
    if (UserObj.bank_accounts && UserObj.bank_accounts.length !== 0) {
      console.log('UserObj.bank_accounts[0]. ', UserObj.bank_accounts[0]);
      this.InputsObj['account_number'] =
        UserObj.bank_accounts[0].account_number;
      this.InputsObj['bank_name'] = UserObj.bank_accounts[0].title;
      this.InputsObj['iban'] = UserObj.bank_accounts[0].iban;
    }
    if (UserObj.bank_account_file) {
      if (UserObj.bank_account_file.path) {
        this.setState({bank_account_file: {uri: UserObj.tax_record.path}});
      } else {
        this.setState({bank_account_file: {uri: UserObj.bank_account_file}});
      }
    }
    if (
      UserObj.find_collaboration_center &&
      UserObj.find_collaboration_center === 1
    ) {
      this.setState({find_collaboration_center: 1});
    }
    if (UserObj.educations) {
      if (UserObj.educations.length === 0) {
        this.setState({
          education: [
            {
              from: '',
              to: '',
              achievements: '',
              location: '',
              facility: '',
              degree: '',
            },
          ],
        });
      } else {
        this.setState({education: UserObj.educations});
      }
    } else {
      this.setState({
        education: [
          {
            from: '',
            to: '',
            achievements: '',
            location: '',
            facility: '',
            degree: '',
          },
        ],
      });
    }
    if (UserObj.experiences) {
      if (UserObj.experiences.length === 0) {
        this.setState({
          experience: [
            {
              from: '',
              to: '',
              achievements: '',
              job_title: '',
              location: '',
              facility: '',
            },
          ],
        });
      } else {
        this.setState({experience: UserObj.experiences});
      }
    } else {
      this.setState({
        experience: [
          {
            from: '',
            to: '',
            achievements: '',
            job_title: '',
            location: '',
            facility: '',
          },
        ],
      });
    }
    console.log(
      '🚀 ~ file: TrainerInputs.js:241 ~ SetStateBasedOnPropsObj ~ UserObj.country_id:',
      UserObj.country_id,
    );

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

  SelectThisCountry(itemValue) {
    this.setState({country_id: itemValue});
    this.InputsObj['country_id'] = itemValue;
    this.GetCitiesData(itemValue);
  }
  GetSkillsData() {
    // this.setState({CitiesData: []});
    fetch('https://www.demo.ertaqee.com/api/v1/skills', {
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
          console.log('GetSkillsData' + JSON.stringify(arr));
          for (let index = 0; index < arr.length; index++) {
            const obj = {
              id: arr[index].id,
              name: UserProfile.getInstance().Lang=='ar'? arr[index].title_ar: arr[index].title_en,
            };
            data.push(obj);
          }
          this.setState({
            skills: data,
          });
        } 
      })
      .catch(error => {
        console.log('123123error:' + error);
      });
  }

  GetLanguagesData() {
    // this.setState({CitiesData: []});
    fetch('https://www.demo.ertaqee.com/api/v1/languages', {
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
          console.log('GetLanguagesData' + JSON.stringify(arr));
          for (let index = 0; index < arr.length; index++) {
            const obj = {
              id: arr[index].id,
              name: UserProfile.getInstance().Lang=='ar'? arr[index].title_ar: arr[index].title_en,
            };
            data.push(obj);
          }
          this.setState({
            languages: data,
          });
        } 
      })
      .catch(error => {
        console.log('123123error:' + error);
      });
  }
  LoginTxt() {
    if (this.props.loading)
      return <ActivityIndicator size="large" color="white" />;
    return <Text style={styles.NextTxt}>{strings.done}</Text>;
  }

  IsThereAnyInputEmpty(Data) {
    console.log(
      '🚀 ~ file: TrainerInputs.js:316 ~ TrainerInputs ~ IsThereAnyInputEmpty ~ Data:',
      Data,
    );
    if (this.state.UpdateObj) {
      //   let UpdateObj = this.state.UpdateObj;
      //   if (
      //     !UpdateObj.bank_accounts ||
      //     (UpdateObj.bank_accounts && UpdateObj.bank_accounts.length === 0)
      //   ) {
      //     console.log('safsaf');
      //     try {
      //       return (
      //         Data.username.length === 0 ||
      //         Data.first_name.length === 0 ||
      //         Data.family_name.length === 0 ||
      //         Data.email.length === 0 ||
      //         Data.phone.length === 0 ||
      //         Data.country_id.length === 0 ||
      //         Data.city_id.length === 0 ||
      //         Data.bank_name.length === 0 ||
      //         Data.account_number.length === 0 ||
      //         Data.iban.length === 0 ||
      //         !this.state.bank_account_file
      //       );
      //     } catch {
      //       return true;
      //     }
      //   } else {
      //     try {
      //       return (
      //         Data.username.length === 0 ||
      //         Data.first_name.length === 0 ||
      //         Data.family_name.length === 0 ||
      //         Data.email.length === 0 ||
      //         Data.phone.length === 0 ||
      //         Data.country_id.length === 0 ||
      //         Data.city_id.length === 0
      //       );
      //     } catch {
      //       return true;
      //     }
      //   }
      try {
        return (
          Data.username.length === 0 ||
          Data.first_name.length === 0 ||
          Data.family_name.length === 0 ||
          Data.email.length === 0 ||
          Data.phone.length === 0 ||
          Data.country_id.length === 0 ||
          Data.city_id.length === 0 ||
          Data.address.length === 0
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
          Data.address.length === 0
        );
      } catch {
        return true;
      }
    }
  }

  onSubmit(Data) {
    console.log('2', Data.UpdateObj);
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
    if (this.state.UpdateObj) {
      let experience = [];
      let flag = false;
      this.state.experience.map(item => {
        let experience1 = {};
        if (
          !item.facility ||
          !item.job_title ||
          !item.location ||
          !item.achievements
        ) {
          flag = true;
        } else {
          experience1 = item;
        }
        if (item.from) {
          experience1.from_month = moment(item.from).format('MM');
          experience1.from_year = moment(item.from).format('YYYY');
        } else if (!item.from_month && !item.from_year) {
          flag = true;
        }
        if (item.to) {
          experience1.to_month = moment(item.to).format('MM');
          experience1.to_year = moment(item.to).format('YYYY');
        } else if (!item.to_month && !item.to_year) {
          flag = true;
        }
        experience.push(experience1);
      });
      // if (flag) {
      //   Alert.alert('', strings.feildsWithStarRequierd, [
      //     {
      //       text: strings.cancel,
      //       onPress: () => console.log('Cancel Pressed'),
      //       style: 'cancel',
      //     },
      //     {text: strings.ok, onPress: () => console.log('OK Pressed')},
      //   ]);
      //   return;
      // }

      let education = [];
      let flag1 = false;
      this.state.education.map(item => {
        let education1 = {};
        if (
          !item.facility ||
          !item.location ||
          !item.achievements ||
          !item.degree
        ) {
          flag1 = true;
        } else {
          education1 = item;
        }
        if (item.from) {
          education1.from_month = moment(item.from).format('MM');
          education1.from_year = moment(item.from).format('YYYY');
        } else if (!item.from_month && !item.from_year) {
          flag1 = true;
        }
        if (item.to) {
          education1.to_month = moment(item.to).format('MM');
          education1.to_year = moment(item.to).format('YYYY');
        } else if (!item.to_month && !item.to_year) {
          flag1 = true;
        }
        education.push(education1);
      });
      // if (flag1) {
      //   Alert.alert('', strings.feildsWithStarRequierd, [
      //     {
      //       text: strings.cancel,
      //       onPress: () => console.log('Cancel Pressed'),
      //       style: 'cancel',
      //     },
      //     {text: strings.ok, onPress: () => console.log('OK Pressed')},
      //   ]);
      //   return;
      // }
      Data.experience = JSON.stringify(experience);
      Data.education = JSON.stringify(education);
    }

    delete Data.UpdateObj;
    if (this.state.bank_account_file && this.state.bank_account_file.type) {
      Data.bank_account_file = this.state.bank_account_file;
    }
    Data.find_collaboration_center = this.state.find_collaboration_center;
    this.props.SignUpPost(Data);
  }

  handleDatePicked = (event, date) => {
    this.setState({isDatePickerVisible: false, [this.state.FromOrTo]: date});
  };

  DatePickerWindow() {
    if (!this.state.isDatePickerVisible) return;
    var date = new Date();

    return (
      <DateTimePicker
        onChange={this.handleDatePicked}
        maximumDate={date}
        value={date}
        onCancel={() => {
          this.setState({isDatePickerVisible: false});
        }}
      />
    );
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
      this.setState({ShowMap: true});
      return;
    }
    this.setState({loading: true});
    RNLocation.configure({distanceFilter: 0});
    RNLocation.getLatestLocation({timeout: 3000}).then(latestLocation => {
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
      InputsObj['cv'] = data;
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  }

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
            top: hp('50%'),
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
        <View style={[styles.InputView]}>
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

        <Text style={styles.label}>{strings.workplace}</Text>
        <View style={styles.InputView}>
          <TextInput
            pointerEvents="none"
            multiline={multiline}
            onBlur={() => this.setState({multiline: true})}
            onFocus={() => this.setState({multiline: false})}
            onChangeText={(text) => (InputsObj['workplace'] = text)}
            placeholder={
              InputsObj.UpdateObj
                ? InputsObj.UpdateObj.workplace
                : strings.workplace + ' *'
            }
                placeholderTextColor={'gray'}
            style={[styles.InputStyleNewAccount]}
          />
        </View>
        <Text style={styles.label}>{strings.JobTitle}</Text>
        <View style={styles.InputView}>
          <TextInput
            pointerEvents="none"
            multiline={multiline}
            onBlur={() => this.setState({multiline: true})}
            onFocus={() => this.setState({multiline: false})}
            onChangeText={(text) => (InputsObj['employer'] = text)}
            placeholder={
              InputsObj.UpdateObj
                ? InputsObj.UpdateObj.employer
                : strings.JobTitle + ' *'
            }
                placeholderTextColor={'gray'}
            style={[styles.InputStyleNewAccount]}
          />
        </View>
        <Text style={styles.label}>{strings.employeeLevel}</Text>
        <View style={styles.InputView}>
          <TextInput
            pointerEvents="none"
            multiline={multiline}
            onBlur={() => this.setState({multiline: true})}
            onFocus={() => this.setState({multiline: false})}
            onChangeText={(text) => (InputsObj['employeeLevel'] = text)}
                placeholderTextColor={'gray'}
            placeholder={
              InputsObj.UpdateObj
                ? InputsObj.UpdateObj.employeeLevel
                : strings.employeeLevel + ' *'
            }
            style={[styles.InputStyleNewAccount]}
          />
        </View>

        <Text style={[styles.label]}>{strings.skills}</Text>
        <View
          style={{
            height: wp('14%'),
            alignSelf: 'stretch',
          }}>
          <ModalPicker
            hasBorder={true}
            data={this.state.skills}
            hint={
               strings.skills
            }
            defaultColor={'silver'}
            onSelect={(index, value) => {
              InputsObj['skills_ids[]'] = value.id;
            }}
          />
        </View>
        <Text style={[styles.label, {marginBottom: -hp('2.5%'), marginTop: 6}]}>
          {strings.Languages}
        </Text>
          <View
            style={{
              height: wp('14%'),
              marginTop: hp('2%'),
              alignSelf: 'stretch',
            }}>
            <ModalPicker
              hasBorder={true}
              data={this.state.languages}
              hint={
                strings.Languages
              }
              defaultColor={'silver'}
              onSelect={(index, value) => {
                InputsObj['languages_ids[]'] = value.id;
              }}
            />
          </View>

          <Text style={[styles.label]}>{strings.BankName}</Text>
          <View style={styles.InputView}>
            <TextInput
              pointerEvents="none"
              multiline={multiline}
              onBlur={() => this.setState({multiline: true})}
              onFocus={() => this.setState({multiline: false})}
              onChangeText={(text) => (InputsObj['bank_name'] = text)}
              placeholder={
                InputsObj.UpdateObj &&
                InputsObj.UpdateObj.bank_accounts &&
                InputsObj.UpdateObj.bank_accounts.length !== 0 &&
                InputsObj.UpdateObj.bank_accounts[0].title
                  ? InputsObj.UpdateObj.bank_accounts[0].title
                  : `${strings.BankName}*`
              }
                placeholderTextColor={'gray'}
              style={[styles.InputStyleNewAccount]}
            />
          </View>
          <Text style={[styles.label]}>{strings.BankAccountNumber}</Text>
          <View style={styles.InputView}>
            <TextInput
              pointerEvents="none"
              multiline={multiline}
              onBlur={() => this.setState({multiline: true})}
              onFocus={() => this.setState({multiline: false})}
              onChangeText={(text) => (InputsObj['account_number'] = text)}
              placeholder={
                InputsObj.UpdateObj &&
                InputsObj.UpdateObj.bank_accounts &&
                InputsObj.UpdateObj.bank_accounts.length !== 0 &&
                InputsObj.UpdateObj.bank_accounts[0].account_number
                  ? InputsObj.UpdateObj.bank_accounts[0].account_number
                  : `${strings.BankAccountNumber}*`
              }
                placeholderTextColor={'gray'}
              style={[styles.InputStyleNewAccount]}
            />
          </View>
       
          {/* <TouchableOpacity
            onPress={() => {
              this.setState({
                typeImage: 'bank_account_file',
                imageModalVisible: true,
              });
            }}>
            {this.state.bank_account_file ? (
              <View
                style={[
                  styles.InputView,
                  {paddingHorizontal: 10, height: hp(20)},
                ]}>
                <Image
                  source={this.state.bank_account_file}
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
                  }}>{`${strings.AttachBankAccountFile}*`}</Text>
              </View>
            )}
          </TouchableOpacity> */}
          <Text style={[styles.label]}>{`iban*`}</Text>
          <View style={styles.InputView}>
            <TextInput
              pointerEvents="none"
              multiline={multiline}
              onBlur={() => this.setState({multiline: true})}
              onFocus={() => this.setState({multiline: false})}
              onChangeText={(text) => (InputsObj['iban'] = text)}
              placeholder={
                InputsObj.UpdateObj &&
                InputsObj.UpdateObj.bank_accounts &&
                InputsObj.UpdateObj.bank_accounts.length !== 0 &&
                InputsObj.UpdateObj.bank_accounts[0].iban
                  ? InputsObj.UpdateObj.bank_accounts[0].iban
                  : `iban*`
              }
                placeholderTextColor={'gray'}
              style={[styles.InputStyleNewAccount]}
            />
          </View>

          <View style={{width:'100%', marginTop: hp('3%')}}>
            <View style={{width:'100%', flexDirection: 'row'}}>
              <Text
                style={{
                  fontSize: hp('2%'),
                  color: '#7E7E7E',
                  marginHorizontal: 5,
                  fontFamily: fonts.normal
                }}>
                {`${strings.education}*`}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  let arr = this.state.education.slice();
                  arr.push({
                    from: '',
                    to: '',
                    achievements: '',
                    location: '',
                    facility: '',
                    degree: '',
                  });
                  this.setState({education: arr});
                }}>
                <AntDesign name="pluscircle" size={20} color="red" />
              </TouchableOpacity>
            </View>
            
            {this.state.education.map((item, index) => {
              return (
                <Education
                  data={item}
                  index={index}
                  Degrees={this.state.Degrees}
                  onChange={(item1) => {
                    let arr = this.state.education.slice();
                    arr[index] = item1;
                    this.setState({education: arr});
                  }}
                  onDelete={() => {
                    let arr = this.state.education.slice();
                    arr.splice(index, 1);
                    this.setState({education: arr});
                  }}
                />
              );
            })}
          </View>

          <View style={{marginTop: hp('3%')}}>
            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  fontSize: hp('2%'),
                  color: '#7E7E7E',
                  marginHorizontal: 5,
                  marginRight: wp('3%'),
                  fontFamily: fonts.normal
                }}>
                {`${strings.experience}*`}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  let arr = this.state.experience.slice();
                  arr.push({
                    from: '',
                    to: '',
                    achievements: '',
                    job_title: '',
                    location: '',
                    facility: '',
                  });
                  this.setState({experience: arr});
                }}>
                <AntDesign name="pluscircle" size={20} color="red" />
              </TouchableOpacity>
            </View>

            {this.state.experience.map((item, index) => {
              return (
                <Experience
                  data={item}
                  index={index}
                  onChange={(item1) => {
                    let arr = this.state.experience.slice();
                    arr[index] = item1;
                    this.setState({experience: arr});
                  }}
                  onDelete={() => {
                    let arr = this.state.experience.slice();
                    arr.splice(index, 1);
                    this.setState({experience: arr});
                  }}
                />
              );
            })}
          </View>

          <TouchableOpacity
            onPress={() => {
              this.PickMultipleFiles()
            }} style={{marginTop:10}}>
              <View style={[styles.InputView, {paddingHorizontal: 10}]}>
                <Text
                  style={{
                    color: '#7E7E7E',
                    fontSize: hp('1.8%'),
                  }}>{this.state.cv_name? this.state.cv_name: `${strings.cv}`}</Text>
              </View>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => {
              this.setState({
                find_collaboration_center:
                  this.state.find_collaboration_center === 1 ? 0 : 1,
              });
            }}>
            <View
              style={{
                marginTop: hp('2%'),
                backgroundColor: 'white',
                alignItems: 'center',
                flexDirection: 'row',
                width: wp('90%'),
                height: hp('7%'),
              }}>
              {this.state.find_collaboration_center === 1 ? (
                <AntDesign name="checksquare" color="#39A1F7" size={hp('3%')} />
              ) : (
                <Feather name="square" color="#7E7E7E" size={hp('3%')} />
              )}
              <Text
                style={{
                  fontSize: hp('1.8%'),
                  color: '#7E7E7E',
                  marginHorizontal: 5,
                  fontFamily: fonts.normal
                }}>
                {strings.LookingCooperation}
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
        {this.DatePickerWindow()}
        {this.MapView()}

        <ModalViewTerms
          visible={this.state.showTerms}
          changeState={() => this.setState({showTerms: false})}
        />
      </View>
    );
  }
}

export { TrainerInputs };
const styles = StyleSheet.create({
  RestoreByPhoneOrEmail: {
    // width: wp('30%'),
    height: hp('4%'),
    flexDirection: 'row',
    marginEnd: wp('3%'),
    alignItems: 'center',
  },
  restoreByPhone: {
    fontFamily: fonts.normal,
  },
  NextTxt: {fontSize: hp('2.5%'), color: 'white'},
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
    fontFamily: fonts.normal,
    color: '#39A1F7',
  },
  InputStyleNewAccount: {
    // width: wp('90%'),
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
    alignSelf: 'flex-start',
    marginTop: hp('1.5%'),
  },
});
