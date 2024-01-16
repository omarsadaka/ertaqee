import Geocoder from 'react-native-geocoder';
import React, { Component } from 'react';
import {
  ActivityIndicator,
  Alert,
  I18nManager,
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Icon } from 'react-native-elements';
import RNLocation from 'react-native-location';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import UserProfile from '../../UserProfile';
import fonts from '../../fonts';
import { ReloadScreen } from '../common';
import strings from '../strings';
import { CourseInputs, HallInputs } from './Items';
let CurrentRegion = '';
var GOOGLE_API_KEY = 'AIzaSyCz98PqCQhxZZS_KQQCNP2Rlobttqqrb_8';

class CreateNew extends Component {
  constructor(props) {
    super(props);
    this.ReloadBTN = this.ReloadBTN.bind(this);
    this.CreateNewPost = this.CreateNewPost.bind(this);
    this.PickLoc = this.PickLoc.bind(this);
    this.state = {
      CurrentChoosedType: 0,
      CountriesData: '',
      loading: false,
      ShowReloadBTN: false,
      CountriesAPILoading: true,
      ShowMap: false,
      Lat: '',
      Lon: '',
      region: {
        latitudeDelta: 0.001,
        longitudeDelta: 0.001,
      },
      HallObj: null,
      CourseObj: null,
      Repeat: false,
      addressDetails: '',
    };
  }

  componentWillMount() {
    let ParamsData = this.props.route.params;
    console.log(
      '🚀 ~ file: CreateNew.js:59 ~ CreateNew ~ componentWillMount ~ ParamsData:',
      ParamsData,
    );
    try {
      if (ParamsData.Course) this.setState({CurrentChoosedType: 1});
      if (ParamsData.CourseObj)
        this.setState({CourseObj: ParamsData.CourseObj});
      if (ParamsData.HallObj) {
        console.log('ParamsData.HallObj', ParamsData.HallObj);
        this.setState({HallObj: ParamsData.HallObj});
      }
    } catch {}

    try {
      if (ParamsData.Repeat) this.setState({Repeat: true});
    } catch {}
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

  GetCountriesData() {
    fetch('https://www.demo.ertaqee.com/api/v1/countries', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          CountriesData: responseJson.data,
          CountriesAPILoading: false,
          ShowReloadBTN: false,
        });
      })
      .catch(error => {
        console.log('123123error:' + error);
      });
  }

  GetHeight() {
    if (this.state.CurrentChoosedType === 1) return '150%';
    else return '150%';
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
          this.setState({ShowMap: true});
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
            //     this.GetLocationNow();
            //   }
            // });
          },
        },
      ],
      {cancelable: true},
    );
  }

  IsThereAnyInputEmpty(Data, type) {
    console.log('IsThereAnyInputEmpty', Data);
    /*
type 0=>Hall
type 1=>Course
  */
    if (type === 0) {
      return (
        // Data.title_en.length === 0 ||
        Data.individuals_count.length === 0 || Data.cost.length === 0
      );
    } else {
      return (
        Data.title_en.length === 0 ||
        Data.cost.length === 0 ||
        Data.days_per_week.length === 0 ||
        Data.number_of_hours.length === 0
      );
    }
  }

  CreateNew1 = (Data, type) => {
    console.log('update Data omar', Data);
    const {Repeat} = this.state;
    if (this.IsThereAnyInputEmpty(Data, type)) {
      alert(strings.feildsWithStarRequierd);
      return;
    }
    if (this.state.loading) return;
    this.setState({loading: true});

    const MyFormData = new FormData();

    Object.keys(Data).forEach(key => {
      if (Data[key]) {
        MyFormData.append(key, Data[key]);
      }
    });
    MyFormData.append('status', Data.status);
    if (type === 1) {
      MyFormData.append(
        'owner_id',
        UserProfile.getInstance().clientObj.user.id,
      );
    }
    MyFormData.append('token', UserProfile.getInstance().clientObj.token);
    console.log(
      '🚀 ~ file: CreateNew.js:243 ~ CreateNew ~ MyFormData:',
      MyFormData,
    );

    let APILink = 'https://www.demo.ertaqee.com/api/v1/halls/create';
    if (type === 1) APILink = 'https://www.demo.ertaqee.com/api/v1/courses/create';
    //  && !Repeat
    if (this.state.CourseObj && !Repeat)
      APILink =
        'https://www.demo.ertaqee.com/api/v1/courses/' +
        this.state.CourseObj.id +
        '/update';
    if (this.state.HallObj)
      APILink =
        'https://www.demo.ertaqee.com/api/v1/halls/' +
        this.state.HallObj.id +
        '/update';
    try {
      console.log('APILink edit hall', APILink);
      fetch(APILink, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          // 'Content-Type': 'multipart/form-data',
          Authorization: 'Bearer ' + UserProfile.getInstance().clientObj.token,
          // 'Accept-Language':'ar'
        },
        body: MyFormData,
      }).then(response => {
        console.log(response);
        this.setState({loading: false});
        response
          .json()
          .then(responseJson => {
            console.log(
              'responseJson: edit hall' + JSON.stringify(responseJson),
            );
            this.SetRespo(responseJson, Data, type);
          })
          .catch(error => {
            console.log('Thirderr:' + error);
            this.setState({loading: false});
            alert(strings.entervaliddata);
          });
      });
    } catch (error) {
      console.log('FourthErr');
      this.setState({loading: false});
      alert(strings.entervaliddata);
    }
  };

  CreateNewPost(Data, type) {
    console.log("🚀 ~ file: CreateNew.js:300 ~ CreateNew ~ CreateNewPost ~ Data:", Data)
    const {Repeat} = this.state;
    if (this.IsThereAnyInputEmpty(Data, type)) {
      alert(strings.feildsWithStarRequierd);
      return;
    }
    if (this.state.loading) return;
    this.setState({loading: true});

    const MyFormData = new FormData();

    MyFormData.append('title_en', Data.title_en);
    MyFormData.append('cost', Data.cost);
    MyFormData.append('owner_id', '1');
    MyFormData.append('center_id', '2');
    MyFormData.append('status', Data.status ? 1 : 0);
    if (type === 0) {
      MyFormData.append('title_ar', Data.title_ar);
      MyFormData.append('hall_number', Data.hall_number);
      MyFormData.append('individuals_count', Data.individuals_count);
      MyFormData.append('country_id', Data.country_id);
      MyFormData.append('city_id', Data.city_id);
      MyFormData.append('address_en', '' + Data.address_en);
      MyFormData.append('address_ar', '' + Data.address_ar);
      MyFormData.append('features_en', '' + Data.features_en);
      MyFormData.append('features_ar', '' + Data.features_ar);
      MyFormData.append('latitude', '' + this.state.Lat);
      MyFormData.append('longitude', '' + this.state.Lon);
      try {
        if (Data.main_image.length > 2)
          MyFormData.append('main_image', this.GetImgFile(Data.main_image));
      } catch {}
      try {
        if (Data.images[0].length > 2)
          MyFormData.append('images', this.GetImgFiles(Data.images));
      } catch {}
      try {
        if (Data.date[0].start_date > 2) {
          console.log('Upload Date');
          MyFormData.append('date', '' + JSON.stringify(Data.date));
        }
      } catch {}
    } else {
      MyFormData.append('days_per_week', Data.days_per_week);
      MyFormData.append('number_of_hours', Data.number_of_hours);
      MyFormData.append('individuals_type', Data.individuals_type);
      MyFormData.append('course_field_id', Data.course_field_id);
      MyFormData.append('details_en', Data.details_en);
      MyFormData.append('evaluate_students', Data.evaluate_students ? 1 : 0);
      MyFormData.append('certify_students', Data.certify_students ? 1 : 0);
      MyFormData.append('start_date', Data.start_date);
      MyFormData.append('end_date', Data.end_date);
      MyFormData.append('start_time', Data.start_time);
      MyFormData.append('end_time', Data.end_time);
      MyFormData.append('offer_cost', Data.offer_cost);
      MyFormData.append('offer_orders_count', Data.offer_orders_count);
      MyFormData.append('remote', Data.remote ? 1 : 0);
      if (Data.remote_url.length > 5)
        MyFormData.append('remote_url', '' + Data.remote_url);
      try {
        if (Data.image.length > 2)
          MyFormData.append('image', this.GetImgFile(Data.image));
      } catch {}
    }
    console.log(
      '🚀 ~ file: CreateNew.js:361 ~ CreateNew ~ CreateNewPost ~ MyFormData:',
      MyFormData,
    );

    let APILink = 'https://www.demo.ertaqee.com/api/v1/halls/create';
    if (type === 1) APILink = 'https://www.demo.ertaqee.com/api/v1/courses/create';
    if (this.state.CourseObj && !Repeat)
      APILink =
        'https://www.demo.ertaqee.com/api/v1/courses/' +
        this.state.CourseObj.id +
        '/update';
    if (this.state.HallObj)
      APILink =
        'https://www.demo.ertaqee.com/api/v1/halls/' +
        this.state.HallObj.id +
        '/update?token=' +
        UserProfile.getInstance().clientObj.token;
    try {
      fetch(APILink, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
          Authorization: 'Bearer ' + UserProfile.getInstance().clientObj.token,
        },
        body: MyFormData,
      }).then(response => {
        this.setState({loading: false});
        response
          .json()
          .then(responseJson => {
            this.SetRespo(responseJson, Data, type);
          })
          .catch(error => {
            console.log('Thirderr:' + error);
            this.setState({loading: false});
            alert(strings.somthingWentWrong);
          });
      });
    } catch (error) {
      console.log('FourthErr');
      this.setState({loading: false});
      alert(strings.somthingWentWrong);
    }
  }

  GetImgFile(IMG) {
    console.log(
      '🚀 ~ file: CreateNew.js:401 ~ CreateNew ~ GetImgFile ~ IMG:',
      IMG,
    );
    let ReturnedValue = '';
    try {
      if (IMG.fileName.length > 1) {
        console.log('Success');
        ReturnedValue = {
          uri: IMG.uri,
          type: IMG.type,
          name: IMG.fileName,
          data: IMG.data,
        };
      } else {
        console.log('Else Error');
      }
    } catch {
      console.log('Catch Error');
    }
    return ReturnedValue;
  }

  GetImgFiles(IMGS) {
    let ReturnedValue = [];
    for (let i = 0; i < IMGS.length; i++)
      ReturnedValue.push(this.GetImgFile(IMGS[i]));

    return ReturnedValue;
  }

  SetRespo(responseJson, Data, type) {
    if (responseJson.success) {
      if (type === 0) {
        if (this.state.HallObj) alert(strings.successProcess);
        else alert(strings.successProcess);
      } else {
        if (this.state.CourseObj) alert(strings.successProcess);
        else alert(strings.successProcess);
        this.props.navigation.push('NewCourses', {
          Title: strings.courses,
          IsMiddleTitle: strings.courses,
          ShowFloatingBTN: false,
          ShowBottomMenu: true,
          Filter: false,
        });
      }
      this.props.navigation.navigate('Home');
    } else {
      this.setState({loading: false});
      try {
        if (responseJson.errors.title_en) {
          alert(responseJson.errors.title_en[0]);
          return;
        }
        if (responseJson.errors.latitude) {
          alert(responseJson.errors.latitude[0]);
          return;
        }
        if (responseJson.errors.longitude) {
          alert(responseJson.errors.longitude[0]);
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
        if (responseJson.errors.number_of_hours) {
          alert(responseJson.errors.number_of_hours[0]);
          return;
        }
        if (responseJson.errors.start_time) {
          alert(responseJson.errors.start_time[0]);
          return;
        }
        if (responseJson.errors.start_date) {
          alert(responseJson.errors.start_date[0]);
          return;
        }
        if (responseJson.errors.end_date) {
          alert(responseJson.errors.end_date[0]);
          return;
        }
        if (responseJson.errors.end_time) {
          alert(responseJson.errors.end_time[0]);
          return;
        }

        if (responseJson.errors.status) {
          alert(responseJson.errors.status[0]);
          return;
        }

        if (responseJson.errors.remote_url) {
          alert(responseJson.errors.remote_url[0]);
          return;
        }

        if (responseJson.errors.offer_cost) {
          alert(responseJson.errors.offer_cost[0]);
          return;
        }

        if (responseJson.errors.evaluate_students) {
          alert(responseJson.errors.evaluate_students[0]);
          return;
        }
        if (responseJson.errors.main_image) {
          alert(responseJson.errors.main_image[0]);
          return;
        }
        if (responseJson.errors.images) {
          alert(responseJson.errors.images[0]);
          return;
        }
        if (responseJson.errors.individuals_count) {
          alert(responseJson.errors.individuals_count[0]);
          return;
        }
        if (responseJson.errors.cost) {
          alert(responseJson.errors.cost[0]);
          return;
        }
      } catch {
        alert(strings.somthingWentWrong);
        return;
      }
      console.log('2');
      this.setState({loading: false});
      alert(responseJson.message);
    }
  }

  SetInputsBasedOnAccountType() {
    if (this.state.CurrentChoosedType === 0)
      return (
        <HallInputs
          HallObj={this.state.HallObj}
          loading={this.state.loading}
          CreateNewPost={(data, type) => {
            this.CreateNew1(data, type);
          }}
          PickLoc={this.PickLoc}
          CountriesData={this.state.CountriesData}
          addressDetails={this.state.addressDetails}
        />
      );
    return (
      <CourseInputs
        CourseObj={this.state.CourseObj}
        loading={this.state.loading}
        CreateNewPost={(data, type) => {
          this.CreateNew1(data, type);
        }}
        PickLoc={this.PickLoc}
        CountriesData={this.state.CountriesData}
        Repeat={this.state.Repeat}
      />
    );
  }

  EnterNewAccountData() {
    return (
      <View
        style={[
          styles.SocendMainView,
          {justifyContent: 'space-between', marginTop: hp('2%')},
        ]}>
        {this.SetInputsBasedOnAccountType()}
      </View>
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
            width: wp('100%'),
            height: hp('100%'),
            position: 'absolute',
            bottom: hp('2%'),
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
    if (this.state.CountriesAPILoading)
      return (
        <View style={styles.LoaderStyle}>
          <ActivityIndicator size="large" color="#37A0F7" />
        </View>
      );

    return (
      <SafeAreaView style={{flex: 1}}>
        <ImageBackground
          source={require('../../res/topbar.png')}
          style={styles.Header}>
          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              width: wp('95%'),
              height: hp('10%'),
            }}>
            <View
              style={{
                justifyContent: 'space-between',
                flexDirection: 'row',
                alignItems: 'center',
                width: wp('80%'),
              }}>
              <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                <Icon
                  name={I18nManager.isRTL ? 'arrow-forward' : 'arrow-back'}
                  size={30}
                  color={'white'}
                />
              </TouchableOpacity>
              <Text style={styles.MiddleTxt}>
                {this.state.CurrentChoosedType === 0
                  ? this.state.HallObj
                    ? strings.editHall
                    : strings.registerNewHall
                  : this.state.CourseObj
                  ? strings.editCourse
                  : strings.registerNewCourse}
              </Text>
            </View>
          </View>
        </ImageBackground>
        <ScrollView>
          <ReloadScreen
            ShowReloadBTN={this.state.ShowReloadBTN}
            ReloadBTN={this.ReloadBTN}
          />
          <Image
            style={styles.BackGroundLogo}
            source={require('../../res/backgroundlogo.png')}
          />

          {this.EnterNewAccountData()}
          {this.MapView()}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export default CreateNew;
const styles = StyleSheet.create({
  MiddleTxt: {
    width: wp('70%'),
    color: 'white',
    fontSize: wp('5.5%'),
    textAlign: 'left',
  },
  LoaderStyle: {justifyContent: 'center', alignItems: 'center', flex: 1},
  ChooseTypeBTN: {
    height: hp('9%'),
    borderRadius: wp('1%'),
    marginLeft: wp('2.85%'),
    width: wp('86.85%'),
  },
  signAs: {fontSize: hp('1.5%'), color: 'white'},
  ChooseTypeStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: wp('3%'),
    width: wp('90%'),
    height: hp('10%'),
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
  NextTxt: {fontSize: hp('2.5%'), color: 'white', fontFamily: fonts.bold},
  Header: {
    width: wp('100%'),
    height: hp('10%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  ThirdMainView: {
    alignItems: 'center',
    width: wp('100%'),
    marginTop: hp('4%'),
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
  },
  justEnterEmailAndpassword: {
    marginTop: hp('1%'),
    fontSize: hp('2%'),
    color: 'silver',
  },
  forgetPassword: {fontSize: hp('4%'), color: 'white'},
  FirstMainView: {width: wp('100%'), marginTop: hp('4%'), height: hp('11%')},
  MainView: {width: wp('100%')},
  BackArrow: {resizeMode: 'contain', width: wp('20%'), height: hp('3.5%')},
  LoginBTNStyle: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: wp('90%'),
    height: hp('6%'),
    backgroundColor: '#4D75B8',
    marginTop: hp('43%'),
    borderRadius: wp('2%'),
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
  dontHaveAnAccount: {fontSize: hp('2%'), color: 'white'},
  Phase1View2: {
    justifyContent: 'space-between',
    alignSelf: 'center',
    alignItems: 'center',
    width: wp('90%'),
    marginTop: hp('3%'),
    height: hp('55%'),
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
    bottom: hp('1%'),
  },
});
