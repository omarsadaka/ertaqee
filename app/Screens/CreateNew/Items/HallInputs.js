import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import React, { Component } from 'react';
import {
  ActivityIndicator,
  Alert,
  I18nManager,
  Image,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import { Icon } from 'react-native-elements';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { RadioButton } from '../../common';
import strings from '../../strings';
// import ImagePicker from 'react-native-image-picker';
import * as ImagePicker from 'react-native-image-picker';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import fonts from '../../../fonts';
import ModalPicker from '../../common/ModalPicker';
import HallCredences from './HallCredences';

import Geocoder from 'react-native-geocoder';
import RNLocation from 'react-native-location';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import UserProfile from '../../../UserProfile';

let CurrentRegion = '';
var GOOGLE_API_KEY = 'AIzaSyCz98PqCQhxZZS_KQQCNP2Rlobttqqrb_8';

class HallInputs extends Component {
  // start_date:'121',//T,
  constructor(props) {
    super(props);
    this.state = {
      title_en: '',
      hall_number: '',
      individuals_count: '',
      cost: '',
      country_id: '',
      city_id: '',
      country: '',
      city: '',
      ShowMap: false,
      Lat: '',
      Lon: '',
      region: {
        latitudeDelta: 0.001,
        longitudeDelta: 0.001,
      },
      address_en: '',
      features_en: '',
      status: 1,
      images: [],
      main_image: '',
      date: [
        {
          start_date: '',
          end_date: '',
          start_time: '',
          end_time: '',
        },
      ],
      CurrentIdex: 0,
      HallObj: null,
      AccreditationData: [],
      HallCredences: [
        {
          credence_name: '',
          credence_number: '',
          image: '',
        },
      ],
      tags: '',
      building_no: '',
      offer_cost: '',
      offer_days_count: '',
      FeaturesData: [],
      selectedFeatures: [],
      another: false,
      addressDetails: '',
    };
  }

  componentDidMount() {
    this.SetCountriesData();
    this.GetAccreditationData();
    this.GetFeaturesData();
    if (this.props.HallObj) this.SetStateBasedOnPropsObj(this.props.HallObj);
  }

  SetStateBasedOnPropsObj(HallObj) {
    console.log('HallObj:' + JSON.stringify(HallObj));
    this.setState({
      title_en: HallObj.title,
      hall_number: HallObj.hall_number,
      individuals_count: HallObj.individuals_count,
      cost: HallObj.cost,
      address_en: HallObj.address ? HallObj.address : '',
      // features_en: HallObj.features ? HallObj.features : '',
      status: HallObj.status ? 1 : 0,
      HallObj: HallObj,
      building_no: HallObj.building_no,
      main_image: HallObj.main_image ? {uri: HallObj.main_image} : '',
      offer_cost: HallObj.offer_cost ? HallObj.offer_cost : '',
      offer_days_count: HallObj.offer_days_count
        ? HallObj.offer_days_count
        : '',
      features_en: HallObj.details ? HallObj.details : '',
      address: HallObj.address ? HallObj.address : '',
      tags: HallObj.tags ? HallObj.tags : '',
      date: HallObj.date ? HallObj.date : '',
      city: HallObj?.city?.title,
      country: HallObj?.country?.title,
    });

    if (HallObj.credences && HallObj.credences.length !== 0) {
      // let arr = [];
      // HallObj.credences.map((item) => {
      //   arr.push({...item, image: {uri: item.image}});
      // });
      this.setState({HallCredences: HallObj.credences});
    }
    if (HallObj.images && HallObj.images.length !== 0) {
      let arr = [];
      HallObj.images.map(item => {
        arr.push({uri: item.path});
      });
      this.setState({images: arr});
    }
  }

  GetAccreditationData() {
    fetch('https://www.demo.ertaqee.com/api/v1/halls_credences', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        this.setState({AccreditationData: responseJson.data});
      })
      .catch(error => {
        console.log('123123error:' + error);
      });
  }

  GetFeaturesData() {
    fetch('https://www.demo.ertaqee.com/api/v1/halls_features', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        let arr = [];
        if (
          this.props.HallObj &&
          this.props.HallObj.features &&
          this.props.HallObj.features.length !== 0
        ) {
          responseJson.data.items.map(item => {
            if (this.props.HallObj.features.indexOf(item.id + '') !== -1) {
              arr.push({id: item.id, select: true});
            } else {
              arr.push({id: item.id, select: false});
            }
          });
        } else {
          responseJson.data.items.map(item => {
            arr.push({id: item.id, select: false});
          });
        }
        // arr.push({id: -1, select: false});
        this.setState({
          selectedFeatures: arr,
          FeaturesData: [
            ...responseJson.data.items,
            // {name_ar: 'آخري', name_en: 'another', id: -1},
          ],
        });
      })
      .catch(error => {
        console.log('123123error:' + error);
      });
  }

  SetCountriesData() {
    this.setState({
      CountriesData: this.props.CountriesData,
      country_id: this.props.CountriesData[1].id,
    });
    this.GetCitiesData(this.props.CountriesData[1].id);
  }

  GetCitiesData(Country) {
    this.setState({CitiesData: ''});
    fetch('https://www.demo.ertaqee.com/api/v1/cities/' + Country, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          CitiesData: responseJson.data,
          city_id: responseJson.data[0].id,
        });
      })
      .catch(error => {
        console.log('123123error:' + error);
      });
  }

  SelectThisCountry(itemValue) {
    console.log('itemValue:' + itemValue);
    this.setState({country_id: itemValue});
    this.GetCitiesData(itemValue);
  }

  CountriesPicker() {
    let CountriesData = this.state.CountriesData;
    try {
      if (CountriesData.length === 0)
        return (
          <View style={styles.InputView}>
            <ActivityIndicator size="large" color="black" />
          </View>
        );
    } catch {
      return (
        <View style={styles.InputView}>
          <ActivityIndicator size="large" color="black" />
        </View>
      );
    }

    let PickerItems = [];
    // for (let i = 0; i < CountriesData.length; i++)
    //   PickerItems.push(
    //     <Picker.Item
    //       key={i}
    //       name={CountriesData[i].title_ar}
    //       id={CountriesData[i].id}
    //     />,
    //   );
    CountriesData.forEach(element => {
      const obj = {
        name: element.title_ar,
        id: element.id,
      };
      PickerItems.push(obj);
    });

    return (
      <View style={styles.pickerView}>
        {/* <Picker
          style={{height: hp('7%'), width: wp('90%')}}
          selectedValue={this.state.country_id}
          onValueChange={(itemValue, itemIndex) =>
            this.SelectThisCountry(itemValue)
          }>
          {PickerItems}
        </Picker> */}
        <ModalPicker
          hasBorder={true}
          data={PickerItems}
          hint={
            this.state.country ? this.state.country : strings.country + ' *'
          }
          onSelect={(index, value) => {
            this.SelectThisCountry(value.id);
          }}
        />
      </View>
    );
  }

  CitiesPicker() {
    let CitiesData = this.state.CitiesData;
    try {
      if (CitiesData.length === 0)
        return (
          <View style={styles.InputView}>
            <ActivityIndicator size="large" color="black" />
          </View>
        );
    } catch {
      return (
        <View style={styles.InputView}>
          <ActivityIndicator size="large" color="black" />
        </View>
      );
    }

    let PickerItems = [];
    // for (let i = 0; i < CitiesData.length; i++)
    //   PickerItems.push(
    //     <Picker.Item
    //       key={i}
    //       label={CitiesData[i].title_ar}
    //       value={CitiesData[i].id}
    //     />,
    //   );
    CitiesData.forEach(element => {
      const obj = {
        name: element.title_ar,
        id: element.id,
      };
      PickerItems.push(obj);
    });

    return (
      <View style={styles.pickerView}>
        {/* <Picker
          style={{height: hp('7%'), width: wp('90%')}}
          selectedValue={this.state.city_id}
          onValueChange={(itemValue, itemIndex) =>
            this.setState({city_id: itemValue})
          }>
          {PickerItems}
        </Picker> */}
        <ModalPicker
          hasBorder={true}
          data={PickerItems}
          hint={this.state.city ? this.state.city : strings.city + ' *'}
          onSelect={(index, value) => {
            this.setState({city_id: value.id});
          }}
        />
      </View>
    );
  }

  LoginTxt() {
    if (this.props.loading)
      return <ActivityIndicator size="large" color="white" />;
    return (
      <Text style={styles.NextTxt}>
        {this.state.CourseObj || this.state.HallObj
          ? strings.update
          : strings.signup}
      </Text>
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
        console.log('🚀 ~ file: HallInputs.js:494 ~ HallInputs ~ res:', res);
        // setAddressDetails(res[0].formattedAddress + ', ' + res[0].adminArea);
        this.setState({
          addressDetails: res[0].formattedAddress + ', ' + res[0].adminArea,
          address_en: res[0].formattedAddress,
          address: res[0].formattedAddress,
          latitude: location.lat,
          longitude: location.lng,
        });
        this.InputsObj['address'] =
          res[0].formattedAddress + ', ' + res[0].adminArea;
        console.log(
          '🚀 ~ file: HallInputs.js:494 ~ HallInputs ~ res:',
          this.InputsObj,
        );
        this.InputsObj['latitude'] = location.lat;
        this.InputsObj['longitude'] = location.lng;
        var add = res[0].formattedAddress;
        var value = add.split(',');
        var count = value.length;
        var city = value[count - 3];
        console.log('city', city);
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
            height: hp('35%'),
            // position: 'absolute',
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
                ? this.state.Lat
                : Number(UserProfile.getInstance().Lat),
              longitude: this.state.Lon
                ? this.state.Lon
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
              tracksViewChanges={true}
            />
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

      let PickedMedia = [];
      for (const res of results) {
        PickedMedia.push(res);
      }
      this.setState({images: PickedMedia});
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  }
  handleDatePicked = (event, date) => {
    // this.setState({isDatePickerVisible:false});
    // return;
    let CurrentDate = this.state.date;
    let CurrentIdex = this.state.CurrentIdex;
    if (this.state.FromOrTo)
      CurrentDate[CurrentIdex].start_date = moment(date).format('YYYY-MM-DD');
    else CurrentDate[CurrentIdex].end_date = moment(date).format('YYYY-MM-DD');
    this.setState({isDatePickerVisible: false, date: CurrentDate});
  };

  hideDatePicker = () => {
    this.setState({isDatePickerVisible: false});
  };

  DatePickerWindow() {
    if (!this.state.isDatePickerVisible) return;
    var date = new Date();
    var dateValue = new Date();
    date.setDate(date.getDate());
    let CurrentDay = new Date().getDate();
    let Currentmonth = '' + new Date().getMonth();
    let CurrentYear = new Date().getFullYear();

    return (
      <DateTimePicker
        onChange={this.handleDatePicked}
        minimumDate={date}
        value={date}
      />
    );
  }

  TimePickerWindow() {
    if (!this.state.isTimePickerVisible) return;
    return (
      <DateTimePicker
        onChange={this.handleTimePicked}
        mode="time"
        is24Hour={true}
        value={new Date()}
      />
    );
  }

  handleTimePicked = (event, Pickeddate) => {
    let CurrentDate = this.state.date;
    let CurrentIdex = this.state.CurrentIdex;
    if (this.state.FromOrTo)
      CurrentDate[CurrentIdex].start_time = moment(Pickeddate).format('HH:mm');
    else CurrentDate[CurrentIdex].end_time = moment(Pickeddate).format('HH:mm');
    this.setState({isTimePickerVisible: false, date: CurrentDate});
  };

  hideTimePicker = () => {
    this.setState({isTimePickerVisible: false});
  };

  AddNewDateAndTime() {
    let CurrentDate = this.state.date;
    let NewDate = {
      start_date: '',
      end_date: '',
      start_time: '',
      end_time: '',
    };
    CurrentDate.push(NewDate);
    this.setState({CurrentDate: CurrentDate});
  }

  RemoveThisOne(IndexNo) {
    let CurrentDate = this.state.date;
    CurrentDate.splice(IndexNo, 1);
    this.setState({CurrentDate: CurrentDate});
  }

  DatesAndTimesItem(IndexNo, date) {
    return (
      <View>
        <View
          style={[
            styles.InputView,
            {
              alignSelf: 'center',
              width: wp('85%'),
              borderWidth: 0,
              backgroundColor: '#F2F2F2',
              justifyContent: 'space-between',
              alignItems: 'center',
            },
          ]}>
          <TouchableOpacity
            onPress={() =>
              this.setState({
                CurrentIdex: IndexNo,
                FromOrTo: true,
                isDatePickerVisible: true,
              })
            }
            style={[styles.InputView, styles.PickDateOrTimeStyle]}>
            <Text style={styles.restoreByPhone}>
              {date.start_date.length > 1
                ? date.start_date
                : this.state.start_date
                ? this.state.start_date
                : strings.startDate}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              this.setState({
                CurrentIdex: IndexNo,
                FromOrTo: false,
                isDatePickerVisible: true,
              })
            }
            style={[styles.InputView, styles.PickDateOrTimeStyle]}>
            <Text style={styles.restoreByPhone}>
              {date.end_date.length > 1
                ? date.end_date
                : this.state.end_date
                ? this.state.end_date
                : strings.endDate}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              this.setState({
                CurrentIdex: IndexNo,
                FromOrTo: true,
                isTimePickerVisible: true,
              })
            }
            style={[styles.InputView, styles.PickDateOrTimeStyle]}>
            <Text style={styles.restoreByPhone}>
              {date.start_time.length > 1 ? date.start_time : strings.startTime}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              this.setState({
                CurrentIdex: IndexNo,
                FromOrTo: false,
                isTimePickerVisible: true,
              })
            }
            style={[styles.InputView, styles.PickDateOrTimeStyle]}>
            <Text style={styles.restoreByPhone}>
              {date.end_time.length > 1 ? date.end_time : strings.endTime}
            </Text>
          </TouchableOpacity>

          {IndexNo !== 0 && (
            <TouchableOpacity
              onPress={() => this.RemoveThisOne(IndexNo)}
              style={[
                styles.InputView,
                styles.PickDateOrTimeStyle,
                {height: hp('3%'), marginLeft: wp('2.5%'), width: wp('6%')},
              ]}>
              <Icon name="remove" size={20} color={'red'} />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={() => this.AddNewDateAndTime()}
            style={[
              styles.InputView,
              styles.PickDateOrTimeStyle,
              {height: hp('3%'), marginLeft: wp('2.5%'), width: wp('6%')},
            ]}>
            <Icon name="add" size={20} color={'red'} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  DatesAndTimes(date) {
    let Items = [];
    for (let i = 0; i < date.length; i++)
      Items.push(this.DatesAndTimesItem(i, date[i]));
    return <View>{Items}</View>;
  }

  PickPhoto(type) {
    if (Platform.OS === 'ios') this.openImagePicker(type);
    else this.requestCameraPermission(type);
  }

  async requestCameraPermission(type) {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: strings.alert,
          message: strings.appNeedPhotoPermission,
          buttonNegative: strings.no,
          buttonPositive: strings.yes,
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        this.openImagePicker(type);
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  }

  openImagePicker = type => {
    console.log("🚀 ~ file: HallInputs.js:834 ~ type:", type)
    console.log('Image picker function');
    const PICKER_OPTIONS = {
      mediaType: 'photo',
      maxWidth: 1000,
      maxHeight: 1000,
      quality: 1,
      selectionLimit: type ? 1 : 5,
    };
    ImagePicker.launchImageLibrary(PICKER_OPTIONS, response => {
      if (response.didCancel) {
      } else if (response.error) {
        alert(
          'ImagePicker Error: ' +
            '\t' +
            response.error +
            '\t' +
            JSON.stringify(response.error),
        );
      } else if (response.customButton) {
      } else {
        if (type) {
          this.setState({
            [type]: {
              uri: response.assets[0].uri,
              name: response.assets[0].fileName
                ? response.assets[0].fileName
                : 'image',
              type: response.assets[0].type
                ? response.assets[0].type
                : 'image/png',
            },
          });
        } else {
          let PickedMedia = [];
          for (const res of response.assets) {
            console.log('🚀 ~ file: HallInputs.js:856 ~ res:', res);
            const img = {
              ...res,
              name: res.fileName ? res.fileName : 'image',
              type: res.type ? res.type : 'image/png',
            };
            PickedMedia.push(img);
          }
          this.setState({images: PickedMedia});
        }

        // let source = {uri: response.assets[0].uri};
        // if (source.uri.length > 5) {
        //   console.log('Success Uploaded', response);
        //   this.setState({
        //     [type]: {
        //       uri: response.assets[0].uri,
        //       name: response.assets[0].fileName
        //         ? response.assets[0].fileName
        //         : 'image',
        //       type: response.assets[0].type
        //         ? response.assets[0].type
        //         : 'image/png',
        //     },
        // });
        // this.setState({
        //   imageURI: source,
        //   image: {
        //     ...response.assets[0],
        //     name: response.assets[0].fileName
        //       ? response.assets[0].fileName
        //       : 'image',
        //     type: response.assets[0].type
        //       ? response.assets[0].type
        //       : 'image/png',
        //   },
        // });
      }
    });
  };

  IsThereAnyInputEmpty() {
    const {
      title_en,
      hall_number,
      individuals_count,
      cost,
      country_id,
      city_id,
      address_en,
      building_no,
      features_en,
      FeaturesData,
      address,
    } = this.state;
    console.log(
      '🚀 ~ file: HallInputs.js:882 ~ HallInputs ~ IsThereAnyInputEmpty ~ ',
      'title_en:',
      title_en,
      'hall_number:',
      hall_number,
      'individuals_count:',
      individuals_count,
      'cost:',
      cost,
      'country_id:',
      country_id,
      'city_id:',
      city_id,
      'address_en:',
      address_en,
      'building_no:',
      building_no,
      'features_en:',
      features_en,
      'FeaturesData:',
      FeaturesData,
      'address:',
      address,
    );
    try {
      return (
        title_en.length === 0 ||
        hall_number.length === 0 ||
        individuals_count.length === 0 ||
        cost.length === 0 ||
        country_id.length === 0 ||
        city_id.length === 0 ||
        address_en.length === 0 ||
        building_no.length === 0 ||
        features_en.length === 0 ||
        address.length === 0 ||
        FeaturesData.length === 0
      );
    } catch {
      return true;
    }
  }
  onSubmit() {
    if (this.IsThereAnyInputEmpty()) {
      alert('الحقول * مطلوبة');
      return;
    }
    let {
      title_en,
      hall_number,
      individuals_count,
      cost,
      offer_cost,
      offer_days_count,
      address_en,
      building_no,
      country_id,
      city_id,
      features_en,
      status,
      HallCredences,
      tags,
      images,
      main_image,
      date,
      selectedFeatures,
      Lat,
      Lon,
    } = this.state;

    let data = {
      title_en,
      hall_number,
      individuals_count,
      cost,
      country_id,
      city_id,
      status,
      latitude: Lat,
      longitude: Lon,
    };
    if (offer_cost) {
      data.offer_cost = offer_cost;
    }
    if (offer_days_count) {
      data.offer_days_count = offer_days_count;
    }
    if (address_en) {
      data.address_en = address_en;
    }
    if (building_no) {
      data.building_no = building_no;
    }
    if (features_en) {
      data.features_en = features_en;
    }
    if (HallCredences && HallCredences.length !== 0) {
      HallCredences.map((item, index) => {
        if (item.credence_name) {
          data[`credence[${index}][credence_name]`] = item.credence_name;
        }
        if (item.credence_number) {
          data[`credence[${index}][credence_number]`] = item.credence_number;
        }
        if (item.image && item.image.type) {
          data[`credence[${index}][image]`] = item.image;
        }
      });
    }
    if (tags) {
      data.tags = tags;
    }
    if (images && images.length !== 0) {
      images.map((item, index) => {
        if (item.type) {
          data[`images[${index}]`] = item;
        }
      });
    }
    if (main_image && main_image.type) {
      data.main_image = main_image;
    }
    if (date && date.length !== 0) {
      // date.map((item, index) => {
      //   if (item.start_date) {
      //     data[`date[${index}][start_date]`] = item.start_date;
      //   }
      //   if (item.end_date) {
      //     data[`date[${index}][end_date]`] = item.end_date;
      //   }
      //   if (item.start_time) {
      //     data[`date[${index}][start_time]`] = item.start_time;
      //   }
      //   if (item.end_time) {
      //     data[`date[${index}][end_time]`] = item.end_time;
      //   }
      // });
      data.date = JSON.stringify(date);
    }

    if (selectedFeatures && selectedFeatures.length !== 0) {
      let i = 0;
      selectedFeatures.map(item => {
        if (item.select) {
          data[`hall_features[${i}]`] = item.id;
          i++;
        }
      });
    }
    // CurrentIdex: 0,
    // HallObj: null,
    this.props.CreateNewPost(data, 0);
  }

  render() {
    const {date} = this.state;
    return (
      <View
        style={{
          flex: 1,
          alignContent: 'center',
          alignSelf: 'center',
          alignItems: 'center',
          marginHorizontal: 15,
          width: wp('95%'),
        }}>
        <TouchableOpacity activeOpacity={1}>
          <View style={styles.InputView}>
            <TextInput
              // ref={(input) => (this.hallName = input)}
              onChangeText={text => this.setState({title_en: text})}
              placeholder={`${strings.hallName} *`}
              placeholderTextColor={'gray'}
              value={this.state.title_en + ''}
              style={[styles.InputStyleNewAccount]}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={1}>
          <View style={styles.InputView}>
            <TextInput
              onChangeText={text => this.setState({hall_number: text})}
              placeholder={`${strings.hallNumber} *`}
              placeholderTextColor={'gray'}
              keyboardType="numeric"
              value={this.state.hall_number + ''}
              style={[styles.InputStyleNewAccount]}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={1}>
          <View style={styles.InputView}>
            <TextInput
              // ref={(input) => (this.password = input)}
              onChangeText={text => this.setState({individuals_count: text})}
              placeholder={`${strings.hallCapacity} *`}
              placeholderTextColor={'gray'}
              keyboardType="numeric"
              value={this.state.individuals_count + ''}
              style={[styles.InputStyleNewAccount]}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={1}>
          <View style={styles.InputView}>
            <TextInput
              // ref={(input) => (this.password_confirmation = input)}
              onChangeText={text => this.setState({cost: text})}
              placeholder={`${strings.cost1} *`}
              placeholderTextColor={'gray'}
              keyboardType="numeric"
              value={this.state.cost + ''}
              style={[styles.InputStyleNewAccount]}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={1}>
          <View style={styles.InputView}>
            <TextInput
              // ref={(input) => (this.password_confirmation1 = input)}
              onChangeText={text => this.setState({offer_cost: text})}
              placeholder={`${strings.discountDay}`}
              placeholderTextColor={'gray'}
              keyboardType="numeric"
              value={this.state.offer_cost + ''}
              style={[styles.InputStyleNewAccount]}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={1}>
          <View style={styles.InputView}>
            <TextInput
              // ref={(input) => (this.password_confirmation2 = input)}
              onChangeText={text => this.setState({offer_days_count: text})}
              placeholder={`${strings.numberDaysDiscount}`}
              placeholderTextColor={'gray'}
              keyboardType="numeric"
              value={this.state.offer_days_count + ''}
              style={[styles.InputStyleNewAccount]}
            />
          </View>
        </TouchableOpacity>
        {this.DatesAndTimes(date)}
        {this.DatePickerWindow()}
        {this.TimePickerWindow()}
        {this.CountriesPicker()}
        {this.CitiesPicker()}
        <TouchableOpacity activeOpacity={1}>
          <View style={styles.InputView}>
            <TextInput
              // ref={(input) => (this.email = input)}
              onChangeText={text => this.setState({address_en: text})}
              placeholder={strings.address + ' *'}
              placeholderTextColor={'gray'}
              value={this.state.address_en + ''}
              style={[styles.InputStyleNewAccount]}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={1}>
          <View style={styles.InputView}>
            <TextInput
              // ref={(input) => (this.mobile = input)}
              onChangeText={text => this.setState({building_no: text})}
              placeholder={strings.buildingNumber + ' *'}
              placeholderTextColor={'gray'}
              keyboardType="numeric"
              value={this.state.building_no + ''}
              style={[styles.InputStyleNewAccount]}
            />
          </View>
        </TouchableOpacity>

        {/* {this.CountriesPicker()}
        {this.CitiesPicker()} */}

        {/* <TouchableOpacity
          activeOpacity={1}
          onPress={() => this.id_number.focus()}>
          <View style={styles.InputView}>
            <TextInput
              onChangeText={(text) => this.setState({features_en: text})}
              ref={(input) => (this.id_number = input)}
              placeholder={strings.DescriptionHall}
              placeholderTextColor={'gray'}
              value={this.state.features_en + ''}
              style={[styles.InputStyleNewAccount]}
            />
          </View>
        </TouchableOpacity> */}

        <View
          style={[
            styles.InputView,
            {backgroundColor: '#F2F2F2', borderWidth: 0},
          ]}>
          <Text style={{fontFamily: fonts.normal}}> {strings.hallStatus}</Text>
          <View style={{flex: 1}} />
          <TouchableOpacity
            onPress={() => this.setState({status: 1})}
            style={styles.RestoreByPhoneOrEmail}>
            <RadioButton selected={this.state.status == 1} color={'#39A1F7'} />
            <Text style={[styles.restoreByPhone, {fontSize: wp('4%')}]}>
              {' '}
              {strings.available}{' '}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.setState({status: 0})}
            style={styles.RestoreByPhoneOrEmail}>
            <RadioButton selected={this.state.status === 1} color={'#39A1F7'} />
            <Text style={[styles.restoreByPhone, {fontSize: wp('4%')}]}>
              {' '}
              {strings.notAvailable}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity activeOpacity={1}>
          <View style={styles.InputView}>
            <TextInput
              multiline
              onChangeText={text => this.setState({features_en: text})}
              // ref={(input) => (this.id_number = input)}
              placeholder={strings.DescriptionHall + ' *'}
              placeholderTextColor={'gray'}
              value={this.state.features_en + ''}
              style={[styles.InputStyleNewAccount]}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={1}>
          <View style={styles.InputView}>
            <TextInput
              onChangeText={text => this.setState({tags: text})}
              // ref={(input) => (this.id_number1 = input)}
              placeholder={strings.keywords}
              placeholderTextColor={'gray'}
              value={this.state.tags + ''}
              style={[styles.InputStyleNewAccount]}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => this.PickPhoto('main_image')}>
          <View style={styles.InputView}>
            <Text style={[styles.NextTxt, {color: '#7E7E7E'}]}>
              {' '}
              {strings.profileImage}
            </Text>
          </View>
        </TouchableOpacity>

        {this.state.main_image ? (
          <View style={[styles.InputView, {height: hp(20)}]}>
            <Image
              source={this.state.main_image}
              style={{height: hp(20), width: wp('90%')}}
              resizeMode="stretch"
            />
          </View>
        ) : null}

        <TouchableOpacity onPress={() => this.PickPhoto()}>
          <View style={styles.InputView}>
            <Text style={[styles.NextTxt, {color: '#7E7E7E'}]}>
              {' '}
              {strings.hallImages}
            </Text>
          </View>
        </TouchableOpacity>

        <View
          style={{
            alignSelf: 'stretch',
            flexDirection: 'row',
            flexWrap: 'wrap',
          }}>
          {this.state.images.map((item, index) => {
            return (
              <View style={{height: hp(9), width: wp(18), margin: 5}}>
                <Image
                  source={item}
                  style={{
                    // alignSelf: 'stretch',
                    height: hp(8),
                    width: wp(18),
                    borderRadius: 5,
                  }}
                  resizeMode="cover"
                />

                <AntDesign
                  name="closecircle"
                  color="red"
                  size={16}
                  backgroundColor="white"
                  style={{
                    position: 'absolute',
                    top: 2,
                    right: 2,
                    zIndex: 1000,
                  }}
                  onPress={() => {
                    let arr = this.state.images.slice();
                    arr.splice(index, 1);
                    this.setState({images: arr});
                  }}
                />
              </View>
            );
          })}
        </View>
        <View style={{marginTop: hp('2%')}}>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                fontSize: hp('2%'),
                color: '#7E7E7E',
                marginHorizontal: wp('3%'),
                fontFamily: fonts.normal,
              }}>
              {`${strings.HallCredences}*`}
            </Text>
            <TouchableOpacity
              onPress={() => {
                let arr = this.state.HallCredences.slice();
                arr.push({
                  credence_name: '',
                  credence_number: '',
                  image: '',
                });
                this.setState({HallCredences: arr});
              }}>
              <AntDesign name="pluscircle" size={20} color="red" />
            </TouchableOpacity>
          </View>
          {this.state.HallCredences.map((item, index) => {
            return (
              <HallCredences
                data={item}
                index={index}
                AccreditationData={this.state.AccreditationData}
                onChange={item1 => {
                  let arr = this.state.HallCredences.slice();
                  arr[index] = item1;
                  this.setState({HallCredences: arr});
                }}
                onDelete={() => {
                  let arr = this.state.HallCredences.slice();
                  arr.splice(index, 1);
                  this.setState({HallCredences: arr});
                }}
              />
            );
          })}
        </View>

        {/* {this.DatesAndTimes(date)} */}

        <View
          style={{
            flex: 1,
            marginTop: hp('2.5%'),
            marginHorizontal: 15,
            width: wp('90%'),
          }}>
          <Text style={styles.label}>{strings.location}</Text>
        </View>

        <TouchableOpacity onPress={() => this.PickLocation()}>
          <View style={styles.InputView}>
            <Text
              style={[
                styles.NextTxt,
                {
                  color: this.props.addressDetails ? '#39A1F7' : '#7E7E7E',
                  fontSize: hp('1.8%'),
                  marginHorizontal: wp('3%'),
                  textAlign: 'left',
                },
              ]}>
              {' '}
              {this.props.addressDetails
                ? this.props.addressDetails
                : this.state.address
                ? this.state.address
                : strings.pickLocation + ' *'}
            </Text>
          </View>
        </TouchableOpacity>
        {this.MapView()}
        <View
          style={{
            flex: 1,
            marginTop: hp('2.5%'),
            marginHorizontal: 15,
            width: wp('90%'),
          }}>
          <Text
            style={{
              fontSize: hp('2.5%'),
              color: '#7E7E7E',
              marginHorizontal: 5,
              textAlign: 'left',
            }}>
            {`${strings.hallFeatures} *`}
          </Text>
        </View>

        {this.state.FeaturesData && this.state.FeaturesData.length !== 0 ? (
          <View
            style={{
              alignSelf: 'center',
              flexWrap: 'wrap',
              width: wp('90%'),
              flexDirection: 'row',
              marginVertical: 10,
            }}>
            {this.state.FeaturesData.map((item, index) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    let arr = this.state.selectedFeatures.slice();
                    arr[index].select = !arr[index].select;
                    this.setState({selectedFeatures: arr});
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      margin: 5,
                      alignItems: 'center',
                    }}>
                    {this.state.selectedFeatures[index].select ? (
                      <AntDesign
                        name="checksquare"
                        color={'#39A1F7'}
                        size={20}
                      />
                    ) : (
                      <Feather name="square" color={'#7E7E7E'} size={20} />
                    )}
                    <Text
                      style={[
                        styles.NextTxt,
                        {
                          color: this.state.selectedFeatures[index].select
                            ? '#39A1F7'
                            : '#7E7E7E',
                          marginLeft: 5,
                          height: hp('5%'),
                        },
                      ]}>
                      {I18nManager ? item.name_ar : item.name_en}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : null}

        <TouchableOpacity
          onPress={() => {
            this.onSubmit();
          }}
          style={[styles.LoginBTNStyle, {backgroundColor: '#4D75B8'}]}>
          <Text style={styles.NextTxt}>{this.LoginTxt()}</Text>
        </TouchableOpacity>
        {/* {this.DatePickerWindow()}
        {this.TimePickerWindow()} */}
      </View>
    );
  }
}

export { HallInputs };
const styles = StyleSheet.create({
  PickDateOrTimeStyle: {
    marginLeft: wp('1%'),
    alignItems: 'center',
    justifyContent: 'center',
    height: hp('5%'),
    width: wp('15%'),
  },
  restoreByPhone: {
    fontSize: hp('1%'),
    color: '#483F8C',
    fontFamily: fonts.normal,
  },
  RestoreByPhoneOrEmail: {
    height: hp('4%'),
    flexDirection: 'row',
    alignItems: 'center',
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
    // marginTop: hp('3%'),
    opacity: 0.7,
    backgroundColor: 'white',
    alignItems: 'center',
    borderRadius: wp('2%'),
    borderWidth: wp('0.3%'),
    flexDirection: 'row',
    width: wp('90%'),
    height: hp('7%'),
    marginVertical: hp('1.5%'),
  },
  pickerView: {
    marginTop: hp('2%'),
    height: hp('7%'),
    alignSelf: 'stretch',
    marginHorizontal: wp('2.5%'),
  },
  mapView: {
    height: hp('35%'),
    width: wp('90%'),
    alignSelf: 'center',
    marginTop: hp('2%'),
    borderRadius: wp('2%'),
    borderWidth: wp('0.3%'),
    borderColor: '#707070',
    overflow: 'hidden',
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
    paddingHorizontal: 8,
  },
});
