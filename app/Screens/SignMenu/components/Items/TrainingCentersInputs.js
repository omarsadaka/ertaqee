import React, { Component } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  I18nManager,
  ImageBackground,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image
} from 'react-native';
import { PERMISSIONS, request } from 'react-native-permissions';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import UserProfile from '../../../../UserProfile';
import { BestcoachesScroll, RadioButton } from '../../../common';
import BestcoachesItem from '../../../common/Items/BestcoachesItem';
import strings from '../../../strings';
import { List } from '../AddTrainerList';
// import ImagePicker from 'react-native-image-picker';
import Geocoder from 'react-native-geocoder';
import * as ImagePicker from 'react-native-image-picker';
import RNLocation from 'react-native-location';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
// import RNSettings from 'react-native-settings';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Icon2 from 'react-native-vector-icons/FontAwesome5';
import fonts from '../../../../fonts';
import ModalPicker from '../../../common/ModalPicker';
import AcceptTerms from '../AcceptTerms';
import ModalTakePhoto from '../ModalTakePhoto';
import ModalViewTerms from '../ModalViewTerms';
let CurrentRegion = '';
var GOOGLE_API_KEY = 'AIzaSyCz98PqCQhxZZS_KQQCNP2Rlobttqqrb_8';
class TrainingCentersInputs extends Component {
  InputsObj = {};

  constructor(props) {
    super(props);
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
      centerTypes: [],
      role_id: '4',
      center_activity: '',
      company_trade_name: '',
      address: '',
      UpdateObj: this.props.UpdateObj,
      multiline: true,
      tax_record: '',
      commercial_register: '',
      chamber_of_commerce: '',
      bank_account_file: '',
      imageModalVisible: false,
      typeImage: '',
      find_trainers: 0,
      loadingAllTrainer: false,
      AllTrainer: [],
      isVesible: false,
      trainers_ids: [],
      trainers_names: [],
      related_trainers: [],
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
      addressDetails: '',
      showTerms: false,
      center_type_id: '',
      centerType: '',
    };
  }

  componentDidMount() {
    console.log('UserInputs');
    this.InputsObj['role_id'] = '4';

    try {
      let RoleId = UserProfile.getInstance().clientObj.user.role_id[0];
      if (RoleId)
        this.SetStateBasedOnPropsObj(UserProfile.getInstance().clientObj.user);
    } catch (Error) {}
    this.SetCountriesData(UserProfile.getInstance().clientObj.user?.country_id);
    this.GetAllTrainer();
    this.GetCenterTypesData();
  }

  SetStateBasedOnPropsObj(UserObj) {
    console.log(
      '🚀 ~ file: TrainingCentersInputs.js:112 ~ TrainingCentersInputs ~ SetStateBasedOnPropsObj ~ UserObj:',
      UserObj,
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
    // this.InputsObj['password'] = UserProfile.getInstance().UserCreds.password;
    // this.InputsObj[
    //   'password_confirmation'
    // ] = UserProfile.getInstance().UserCreds.password;
    this.InputsObj['phone'] = UserObj.mobile ? UserObj.mobile + '' : '';
    this.setState({gender: UserObj.gender ? UserObj.gender : 'male'});
    this.InputsObj['gender'] = UserObj.gender;
    this.InputsObj['workplace'] = UserObj.workplace;
    this.InputsObj['employer'] = UserObj.employer;
    this.InputsObj['id_number'] = UserObj.id_number;
    this.InputsObj['center_activity'] = UserObj.center_activity;
    this.InputsObj['company_name'] = UserObj.company_name;
    this.InputsObj['company_trade_name'] = UserObj.center_trade_name;
    this.InputsObj['address'] = UserObj.address;
    this.InputsObj['commercial_register_about'] =
      UserObj.commercial_register_about;
    this.InputsObj['tax_record_about'] = UserObj.tax_record_about;
    this.InputsObj['chamber_of_commerce_about'] =
      UserObj.chamber_of_commerce_about;
    if (UserObj.bank_accounts && UserObj.bank_accounts.length !== 0) {
      console.log('UserObj.bank_accounts[0]. ', UserObj.bank_accounts[0]);
      this.InputsObj['account_number'] =
        UserObj.bank_accounts[0].account_number;
      this.InputsObj['bank_name'] = UserObj.bank_accounts[0].title;
      this.InputsObj['iban'] = UserObj.bank_accounts[0].iban;
    }
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
    if (UserObj.bank_account_file) {
      if (UserObj.bank_account_file.path) {
        this.setState({bank_account_file: {uri: UserObj.tax_record.path}});
      } else {
        this.setState({bank_account_file: {uri: UserObj.bank_account_file}});
      }
    }
    if (UserObj.find_trainers && UserObj.find_trainers === 1) {
      this.setState({find_trainers: 1});
    }
    if (UserObj.related_trainers && UserObj.related_trainers.length > 0) {
      this.setState({related_trainers: UserObj.related_trainers});
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
      addressDetails: UserObj.address,
      company_name: UserObj.company_name,
      company_trade_name: UserObj.center_trade_name,
      latitude: UserObj.latitude,
      longitude: UserObj.longitude,
      center_type_id: UserObj.center_type_id,
      centerType: UserObj.center_type,
    });
  }

  GetAllTrainer() {
    this.setState({loadingAllTrainer: true});
    fetch('https://www.demo.ertaqee.com/api/v1/trainers', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Accept-Language': UserProfile.getInstance().Lang,
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log('GetAllTrainer ', responseJson);
        this.setState({
          AllTrainer: responseJson.data.trainers,
          loadingAllTrainer: false,
        });
      })
      .catch(error => {
        this.setState({loadingAllTrainer: false});
        console.log('123123error:' + error);
      });
  }

  onChange(id, checked, title,photo) {
    if (!checked) {
      this.state.trainers_ids.push(id);
      this.state.trainers_names.push(title);
      this.state.related_trainers.push({
        photo: photo,
        full_name: title,
        job_title: '',
      })
    } else {
      let filteredArray_ids = this.state.trainers_ids.filter(e => e !== id);
      this.setState({trainers_ids: filteredArray_ids});

      let filteredArray_names = this.state.trainers_names.filter(
        name => name !== title,
      );
      this.setState({trainers_names: filteredArray_names});
    }
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

  GetCenterTypesData() {
    let IsAr = UserProfile.getInstance().Lang === 'ar';

    fetch('https://www.demo.ertaqee.com/api/v1/center_types/', {
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
        console.log('Here GetHallProviversData' + JSON.stringify(arr));
        for (let index = 0; index < arr.length; index++) {
          const obj = {
            id: arr[index].id,
            name: IsAr ? arr[index].title_ar : arr[index].title_en,
          };
          data.push(obj);
        }
        this.setState({
          centerTypes: data,
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
    if (this.state.UpdateObj) {
      const {
        username,
        first_name,
        family_name,
        //  id_number,
        email,
        phone,
        country_id,
        city_id,
        company_name,
        company_trade_name,
        address,
      } = this.state;
      console.log('🚀 ~ file: username:', username);
      console.log('🚀 ~ file: first_name:', first_name);
      console.log('🚀 ~ file: family_name:', family_name);
      console.log('🚀 ~ file: email:', email);
      console.log('🚀 ~ file: phone:', phone);
      console.log('🚀 ~ file: country_id:', country_id);
      console.log('🚀 ~ file: city_id:', city_id);
      console.log('🚀 ~ file: company_name:', company_name);
      console.log('🚀 ~ file: company_trade_name:', company_trade_name);
      console.log('🚀 ~ file: address:', address);

      try {
        return (
          username.length === 0 ||
          first_name.length === 0 ||
          family_name.length === 0 ||
          email.length === 0 ||
          phone.length === 0 ||
          country_id.length === 0 ||
          city_id.length === 0 ||
          // id_number.length === 0 ||
          // center_activity.length === 0 ||
          company_name.length === 0 ||
          company_trade_name.length === 0 ||
          address.length === 0 ||
          this.state.center_type_id.length === 0
          // employer.length === 0 ||
          // tax_record_about.length === 0 ||
          // commercial_register_about.length === 0 ||
          // chamber_of_commerce_about.length === 0 ||
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
          Data.company_name.length === 0 ||
          Data.company_trade_name.length === 0 ||
          Data.address.length === 0 ||
          Data.center_type_id.length === 0
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
    if (this.state.bank_account_file && this.state.bank_account_file.type) {
      Data.bank_account_file = this.state.bank_account_file;
    }
    if (this.state.trainers_ids.length > 0) {
      Data.trainers = this.state.trainers_ids;
    }
    Data.find_trainers = this.state.find_trainers;
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

  renderChooseTrainer() {
    return (
      <TouchableOpacity
        style={styles.spinner}
        onPress={() => {
          this.setState({isVesible: true});
        }}>
        <Feather name="plus" color="#7E7E7E" size={hp('3%')} />
      </TouchableOpacity>
    );
  }
  trainers_view() {
    return (
      <View style={styles.container}>
        {this.state.isVesible ? (
          <View style={styles.view_sub_cat}>
            <TouchableOpacity
              style={{alignItems: 'flex-end', margin: 10}}
              onPress={() => this.setState({isVesible: false})}>
              {/* <Icon name='x-circle' type="feather" size={Dimensions.DEVICE_HEIGHT * 0.03}/> */}
              <Feather name="x-circle" color="#7E7E7E" size={hp('3%')} />
            </TouchableOpacity>
            <View style={{paddingHorizontal: 5}}>
              {/* <FlatList
             data={this.state.AllTrainer}
             showsVerticalScrollIndicator={false}
             keyExtractor={(item, index) => item.id}
             renderItem={this.renderItem()}/> */}
              <List
                data={this.state.AllTrainer}
                onPress={(id, checked, title, photo) =>
                  this.onChange(id, checked, title, photo)
                }
              />
            </View>
          </View>
        ) : null}
      </View>
    );
  }

  renderTrainerItem(item, index) {
    console.log('itemitemitem',item)
    return (
      <TouchableOpacity>
        <ImageBackground
          source={{uri: item.photo}}
          imageStyle={{borderRadius: wp('3%')}}
          style={{
            marginEnd: wp('2%'),
            width: wp('22%'),
            height: hp('13%'),
            marginTop: 5,
          }}>
          <View
            style={{
              position: 'absolute',
              borderRadius: wp('3%'),
              width: wp('22%'),
              height: hp('13%'),
              backgroundColor: 'black',
              opacity: 0.2,
            }}
          />
          <View
            style={{
              justifyContent: 'center',
              width: wp('52%'),
              height: hp('16.5%'),
            }}>
            <Text
              style={{
                textAlign: 'left',
                color: 'white',
                fontSize: wp('4%'),
                marginTop: hp('5%'),
                marginLeft: wp('2%'),
              }}>
              {item.full_name}
            </Text>
            <Text
              style={{
                textAlign: 'left',
                color: 'white',
                fontSize: wp('3%'),
                marginLeft: wp('2%'),
              }}>
              {item.job_title}
            </Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    );
  }

  coachesItems = () => {
    let trainers = this.state.related_trainers;
    let Items = [];
    for (let i = 0; i < trainers.length; i++)
      Items.push(
        <BestcoachesItem
          key={i}
          item={trainers[i]}
          navigation={this.props.navigation}
        />,
      );
    return Items;
  };

  coaches() {
    return (
      <View style={{marginTop: hp('5%'), width: wp('100%'), height: hp('25%')}}>
        <BestcoachesScroll
          Items={this.coachesItems()}
          navigation={this.props.navigation}
        />
      </View>
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
          this.setState({ShowMap: true});
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

        {!InputsObj.UpdateObj && (
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
        {!InputsObj.UpdateObj && (
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

        <Text style={[styles.label]}>{strings.centerType}</Text>
        {this.state.centerTypes ? (
          <View
            style={{
              height: wp('14%'),
              alignSelf: 'stretch',
            }}>
            <ModalPicker
              hasBorder={true}
              data={this.state.centerTypes}
              hint={
                this.state.centerType
                  ? this.state.centerType
                  : strings.centerType + ' *'
              }
              defaultColor={'silver'}
              onSelect={(index, value) => {
                InputsObj['center_type_id'] = value.id;
                this.setState({center_type_id: value.id});
              }}
            />
          </View>
        ) : null}

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
            placeholder={strings.tradeName + ' *'}
            style={[styles.InputStyleNewAccount]}
          />
        </View>
{/* 
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
        </TouchableOpacity> */}




        <Text style={styles.label}>{strings.CommercialRegistrationNo}</Text>
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
                InputsObj.UpdateObj && InputsObj.UpdateObj.commercial_register_about
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
            }} style={{marginTop:10}}>
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
       
          <Text style={styles.label}>{strings.TaxNumber}</Text>
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
            }} style={{marginTop:10}}>
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
       
          <Text style={styles.label}>{strings.ChamberOfCommerceNo}</Text>
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
                InputsObj.UpdateObj && InputsObj.UpdateObj.chamber_of_commerce_about
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
            }}style={{marginTop:10}}>
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
          <Text style={styles.label}>{strings.BankName}</Text>
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
              style={[styles.InputStyleNewAccount]}
            />
          </View>
          <Text style={styles.label}>{strings.BankAccountNumber}</Text>
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
              style={[styles.InputStyleNewAccount]}
            />
          </View>
       
          <TouchableOpacity
            onPress={() => {
              this.setState({
                typeImage: 'bank_account_file',
                imageModalVisible: true,
              });
            }} style={{marginTop:10}}>
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
          </TouchableOpacity>
          <Text style={styles.label}>{'iban'}</Text>
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
              style={[styles.InputStyleNewAccount]}
            />
          </View>
          <Text style={styles.label}>{strings.centerActivity}</Text>
          <View style={styles.InputView}>
            <TextInput
              pointerEvents="none"
              multiline={multiline}
              onBlur={() => this.setState({multiline: true})}
              onFocus={() => this.setState({multiline: false})}
              onChangeText={(text) => (InputsObj['center_activity'] = text)}
              placeholder={
                InputsObj.UpdateObj && InputsObj.UpdateObj.center_activity
                  ? InputsObj.UpdateObj.center_activity
                  : `${strings.centerActivity}*`
              }
              placeholderTextColor={
                InputsObj.UpdateObj && InputsObj.UpdateObj.center_activity
                  ? 'black'
                  : undefined
              }
              style={[styles.InputStyleNewAccount]}
            />
          </View>

          <Text style={styles.label}>{strings.employer}</Text>
          <View style={styles.InputView}>
            <TextInput
              pointerEvents="none"
              multiline={multiline}
              onBlur={() => this.setState({multiline: true})}
              onFocus={() => this.setState({multiline: false})}
              onChangeText={(text) => (InputsObj['employer'] = text)}
              placeholder={
                InputsObj.UpdateObj && InputsObj.UpdateObj.employer
                  ? InputsObj.UpdateObj.employer
                  : `${strings.employer}*`
              }
              placeholderTextColor={
                InputsObj.UpdateObj && InputsObj.UpdateObj.employer
                  ? 'black'
                  : undefined
              }
              style={[styles.InputStyleNewAccount]}
            />
          </View>
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

       

          <TouchableOpacity
            onPress={() => {
              this.setState({
                find_trainers: this.state.find_trainers === 1 ? 0 : 1,
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
              {this.state.find_trainers === 1 ? (
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
                {strings.collaboratingCoaches}
              </Text>
            </View>
          </TouchableOpacity>
        <Text style={{textAlign:'left',color:'black',fontSize:wp('5%'),width:'100%',fontFamily: fonts.normal}}>{strings.trainers}</Text>
        <View style={{width:'100%',flexDirection:'row',alignItems:'center'}}>
         <FlatList style={{marginHorizontal:5}}
          data={this.state.related_trainers}
          numColumns={1}
          horizontal
          inverted={Platform.OS=='ios'?false:true}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item , index})=> this.renderTrainerItem(item,index)}/>
         {this.renderChooseTrainer()}
        </View>

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
            console.log(this.state.trainers_ids);
            this.onSubmit({
              ...InputsObj,
              gender: this.state.gender,
              country_id: this.state.country_id,
              city_id: this.state.city_id,
              latitude: this.state.latitude,
              longitude: this.state.longitude,
              address: this.state.addressDetails,
              center_type_id: this.state.center_type_id,
            });
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
        {this.trainers_view()}
        {this.MapView()}
        <ModalViewTerms
          visible={this.state.showTerms}
          changeState={() => this.setState({showTerms: false})}
        />
      </View>
    );
  }
}

export { TrainingCentersInputs };
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  RestoreByPhoneOrEmail: {
    marginEnd: wp('2%'),
    height: hp('4%'),
    flexDirection: 'row',
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
    fontFamily: 'Roboto',
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
  },
  title: {
    color: 'black',
    fontSize: 20,
    fontWeight: '600',
    textAlignVertical: 'center',
    textAlign: I18nManager.isRTL ? 'left' : 'right',
  },
  spiner_text: {
    fontSize: 20,
    fontWeight: '200',
    textAlign: I18nManager.isRTL ? 'left' : 'right',
  },
  spinner: {
    alignItems: 'center',
    justifyContent: 'center',
    width: hp('5%'),
    height: hp('5%'),
    backgroundColor: '#fff',
    borderRadius: hp('5%') / 2,
    borderColor: 'grey',
    borderWidth: 1,
  },
  view_sub_cat: {
    width: '100%',
    height: hp('60%'),
    position: 'absolute',
    bottom: 0,
    elevation: 2,
    backgroundColor: '#fff',
    borderTopStartRadius: 30,
    borderTopEndRadius: 30,
    borderColor: 'grey',
    borderWidth: 1,
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
