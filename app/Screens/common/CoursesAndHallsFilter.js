import React, { Component } from 'react';
import {
  ActivityIndicator,
  I18nManager,
  SafeAreaView,
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
import UserProfile from '../../UserProfile';
import fonts from '../../fonts';
import { RadioButton } from '../common';
import strings from '../strings';
import ModalPicker from './ModalPicker';
class CoursesAndHallsFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keyword: '',
      hall_number: 0,
      individuals_count: 0,
      country_id: '',
      city_id: '',
      center_id: '',
      course_field_id: '',
      CountriesData: [],
      CitiesData: [],
      centerData: [],
      CourseFeildData: [],
      CountriesAPILoading: true,
      CitiesAPILoading: true,
      CenterAPILoading: true,
      CoursesFeildsAPILoading: true,
      evaluate_students: 0,
      IsHalls: false,
    };
  }

  componentWillMount() {
    if (this.props.IsHalls) this.setState({IsHalls: true});
  }

  componentDidMount() {
    if (this.props.IsHalls) this.GetCountriesData();
    this.GetCentersData();
    if (!this.props.IsHalls) this.GetCourseFeildsData();
  }

  GetCourseFeildsData() {
    fetch('https://www.demo.ertaqee.com/api/v1/courses_fields', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Accept-Language': UserProfile.getInstance().Lang,
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log('courses_fields', JSON.stringify(responseJson));
        const data = [];
        var arr = responseJson.data;
        for (let index = 0; index < arr.length; index++) {
          const obj = {
            id: arr[index].id,
            name: arr[index].title,
          };
          data.push(obj);
        }
        this.setState({
          CoursesFeildsAPILoading: false,
          CourseFeildData: data,
          // course_field_id: responseJson.data[0].id
        });
      })
      .catch(error => {
        console.log('123123error:' + error);
      });
  }

  GetCentersData() {
    fetch('https://www.demo.ertaqee.com/api/v1/centers_array', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Accept-Language': UserProfile.getInstance().Lang,
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log('responseJson', JSON.stringify(responseJson));
        // const CentersArray = Object.keys(responseJson);
        // console.log('ffff',JSON.stringify(CentersArray))
        const data = [];
        var arr = responseJson.centers;
        for (let index = 0; index < arr.length; index++) {
          const obj = {
            id: arr[index].id,
            name: arr[index].center_trade_name,
          };
          data.push(obj);
        }
        this.setState({centerData: data, CenterAPILoading: false});
      })
      .catch(error => {
        console.log('123123error:' + error);
      });
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
        console.log('GetCountriesData', responseJson);
        const data = [];
        var arr = responseJson.data;
        for (let index = 0; index < arr.length; index++) {
          const obj = {
            id: arr[index].id,
            name:
              UserProfile.getInstance().Lang == 'ar'
                ? arr[index].title_ar
                : arr[index].title_en,
          };
          data.push(obj);
        }
        this.setState({CountriesData: data, CountriesAPILoading: false});
        this.GetCitiesData(responseJson.data[1].id);
      })
      .catch(error => {
        console.log('123123error:' + error);
      });
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
        const data = [];
        var arr = responseJson.data;
        for (let index = 0; index < arr.length; index++) {
          const obj = {
            id: arr[index].id,
            name:
              UserProfile.getInstance().Lang == 'ar'
                ? arr[index].title_ar
                : arr[index].title_en,
          };
          data.push(obj);
        }
        this.setState({CitiesData: data, CitiesAPILoading: false});
      })
      .catch(error => {
        console.log('123123error:' + error);
      });
  }

  LoginTxt() {
    if (this.props.loading)
      return <ActivityIndicator size="large" color="white" />;
    return <Text style={styles.NextTxt}>{strings.search}</Text>;
  }

  HallFilterData() {
    return (
      <View style={{
        flex: 1,
        alignContent: 'center',
        alignSelf: 'center',
        width: wp('90%'),
      }}>
        <View style={styles.InputView}>
          <TextInput
            onChangeText={text => this.setState({keyword: text})}
            placeholder={strings.hallName}
            placeholderTextColor={'gray'}
            style={[styles.InputStyleNewAccount]}
          />
        </View>

        <View style={styles.InputView}>
          <TextInput
            onChangeText={text => this.setState({hall_number: text})}
            placeholder={strings.hallNumber}
            placeholderTextColor={'gray'}
            style={[styles.InputStyleNewAccount]}
          />
        </View>

        <View style={styles.InputView}>
          <TextInput
            keyboardType={'numeric'}
            onChangeText={text => this.setState({individuals_count: text})}
            placeholder={strings.numberOfIndividuals}
            placeholderTextColor={'gray'}
            style={[styles.InputStyleNewAccount]}
          />
        </View>

        {/* {this.CountriesPicker()}
        {this.CitiesPicker()}
        {this.CentersPicker()} */}

        <View style={{height: hp('7%'), alignSelf: 'stretch'}}>
          <ModalPicker
            hasBorder={true}
            data={this.state.CountriesData}
            hint={strings.country}
            onSelect={(index, value) => {
              this.setState({country_id: value.id});
              this.GetCitiesData(value.id);
            }}
          />
        </View>

        <View style={{height: hp('7%'), marginTop: '2%', alignSelf: 'stretch'}}>
          <ModalPicker
            hasBorder={true}
            data={this.state.CitiesData}
            hint={strings.city}
            onSelect={(index, value) => {
              this.setState({city_id: value.id});
            }}
          />
        </View>

        <View style={{height: hp('7%'), alignSelf: 'stretch', marginTop: '2%'}}>
          <ModalPicker
            hasBorder={true}
            data={this.state.centerData}
            hint={strings.trainingCenters}
            onSelect={(index, value) => {
              this.setState({center_id: value.id});
            }}
          />
        </View>
      </View>
    );
  }

  CourseFilterData() {
    return (
      <View style={{
        flex: 1,
        alignContent: 'center',
        alignSelf: 'center',
        // marginHorizontal: 20,
        width: wp('90%'),
      }}>
        <View style={styles.InputView}>
          <TextInput
            onChangeText={text => this.setState({keyword: text})}
            placeholder={strings.courseName}
            placeholderTextColor={'gray'}
            style={[styles.InputStyleNewAccount]}
          />
        </View>

        <View
          style={[
            styles.InputView,
            {
              justifyContent: 'space-between',
              backgroundColor: 'transparent',
              borderWidth: 0,
            },
          ]}>
          <View>
            <Text>{strings.studentEvalute} </Text>
          </View>
          <View style={{flexDirection: 'row', width: wp('50%')}}>
            <TouchableOpacity
              onPress={() => this.setState({evaluate_students: 1})}
              style={styles.RestoreByPhoneOrEmail}>
              <RadioButton
                selected={this.state.evaluate_students}
                color={'#39A1F7'}
              />
              <Text style={styles.restoreByPhone}> {strings.yes}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.setState({evaluate_students: 0})}
              style={styles.RestoreByPhoneOrEmail}>
              <RadioButton
                selected={!this.state.evaluate_students}
                color={'#39A1F7'}
              />
              <Text style={styles.restoreByPhone}> {strings.no}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* {this.CentersPicker()} */}
        <Text style={[styles.restoreByPhone, {textAlign: 'left'}]}>
          {' '}
          {strings.trainingCenters}
        </Text>
        <View style={{height: hp('7%'), alignSelf: 'stretch'}}>
          <ModalPicker
            hasBorder={true}
            data={this.state.centerData}
            hint={strings.trainingCenters}
            onSelect={(index, value) => {
              this.setState({center_id: value.id});
            }}
          />
        </View>
        <Text
          style={[
            styles.restoreByPhone,
            {marginTop: hp('2%'), textAlign: 'left'},
          ]}>
          {' '}
          {strings.CourseFeild}
        </Text>
        <View style={{height: hp('7%'), alignSelf: 'stretch'}}>
          <ModalPicker
            hasBorder={true}
            data={this.state.CourseFeildData}
            hint={strings.CourseFeild}
            onSelect={(index, value) => {
              this.setState({course_field_id: value.id});
            }}
          />
        </View>
      </View>
    );
  }

  DoneBTN() {
    const {
      keyword,
      evaluate_students,
      center_id,
      course_field_id,
      IsHalls,
      hall_number,
      individuals_count,
      country_id,
      city_id,
    } = this.state;
    let APILink = '';
    if (IsHalls) {
      APILink =
        'https://www.demo.ertaqee.com/api/v1/halls_filter?keyword=' +
        keyword +
        '&hall_number=' +
        hall_number +
        '&individuals_count=' +
        individuals_count +
        '&center_id=' +
        center_id +
        '&country_id=' +
        country_id +
        '&city_id=' +
        city_id;
      console.log('APILink:' + APILink);
      this.props.NavToSearchHalls(APILink);
    } else {
      APILink =
        'https://www.demo.ertaqee.com/api/v1/courses_filter?keyword=' +
        keyword +
        '&evaluate_students=' +
        evaluate_students +
        '&center_id=' +
        center_id +
        '&course_field_id=' +
        course_field_id;
      this.props.NavToSearchCourses(APILink);
    }
  }

  render() {
    const {IsHalls} = this.state;
    return (
      <SafeAreaView
        style={{
          alignItems: 'center',
          position: 'absolute',
          backgroundColor: '#F8F9F9',
          width: wp('100%'),
          height: hp('100%'),
          flex: 1,
        }}>
        {this.props.Header()}
        <View style={{marginTop: hp('5%')}} />
        {IsHalls && this.HallFilterData()}
        {!IsHalls && this.CourseFilterData()}
        <TouchableOpacity
          onPress={() => this.DoneBTN()}
          style={[styles.LoginBTNStyle, {backgroundColor: '#4D75B8',marginBottom:'10%'}]}>
          <Text style={styles.NextTxt}>{this.LoginTxt()}</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}

export { CoursesAndHallsFilter };

const styles = StyleSheet.create({
  Header: {
    width: wp('100%'),
    height: hp('10%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  RestoreByPhoneOrEmail: {
    width: wp('20%'),
    height: hp('3%'),
    flexDirection: 'row',
  },
  NextTxt: {fontSize: hp('2%'), color: 'white'},
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
    marginTop: hp('1%'),
    opacity: 0.7,
    backgroundColor: 'white',
    alignItems: 'center',
    borderRadius: wp('2%'),
    borderWidth: wp('0.3%'),
    flexDirection: 'row',
    width: wp('90%'),
    paddingHorizontal: wp('5%'),
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
    width: wp('85%'),
    height: hp('7%'),
    fontSize: hp('1.8%'),
    fontFamily: fonts.normal,
    color: '#39A1F7',
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
});
