import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import React, { Component } from 'react';
import {
  ActivityIndicator,
  Alert,
  I18nManager,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Icon } from 'react-native-elements';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import UserProfile from '../../UserProfile';
import fonts from '../../fonts';
import { RadioButton } from '../common';
import ModalPicker from '../common/ModalPicker';
import strings from '../strings';
class CourseRequest extends Component {
  InputsObj = {};

  constructor(props) {
    super(props);
    this.state = {
      CourseFeildData: [],
      CountriesAPILoading: true,
      CoursesFeildsAPILoading: true,
      course_field_id: '',
      isDatePickerVisible: false,
      date: strings.date,
      gender: 0,
      serviceType: 0,
    };
  }

  componentDidMount() {
    console.log('Here');
    this.GetCourseFeildsData();
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
        console.log(
          'responseJson.data[0]:' + JSON.stringify(responseJson.data),
        );
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
          CourseFeildData: data,
          course_field_id: responseJson.data[0].id,
          CoursesFeildsAPILoading: false,
        });
        this.InputsObj['course_field_id'] = responseJson.data[0].id;
      })
      .catch(error => {
        console.log('123123error:' + error);
      });
  }

  IsThereAnyInputEmpty(Data) {
    try {
      return (
        Data.name.length === 0 ||
        Data.mobile.length === 0 ||
        Data.email.length === 0 ||
        Data.message.length === 0 ||
        Data.course_title.length === 0 ||
        Data.individuals_count.length === 0
      );
    } catch {
      return true;
    }
  }

  PostReq() {
    const {InputsObj} = this;
    this.IsThereAnyInputEmpty(InputsObj);
    if (this.state.loading) return;
    this.setState({loading: true});

    const MyFormData = new FormData();
    MyFormData.append('name', InputsObj.name);
    MyFormData.append('email', InputsObj.email);
    MyFormData.append('course_title', InputsObj.course_title);
    MyFormData.append('individuals_count', InputsObj.individuals_count);
    MyFormData.append('mobile', InputsObj.mobile);
    MyFormData.append('message', InputsObj.message);
    // MyFormData.append('course_field_id', InputsObj.course_field_id);
    MyFormData.append('course_id', InputsObj.course_field_id);

    let APILink = 'https://www.demo.ertaqee.com/api/v1/course_request';

    try {
      fetch(APILink, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        body: MyFormData,
      }).then(response => {
        response
          .json()
          .then(responseJson => {
            this.setState({loading: false});
            console.log('Data:' + JSON.stringify(responseJson));
            this.setState({loading: false});
            if (responseJson.success) {
              // alert(strings.successProcess)
              Alert.alert(strings.alert, strings.successProcess, [
                {
                  text: strings.cancel,
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
                {text: strings.ok, onPress: () => console.log('OK Pressed')},
              ]);
              this.props.navigation.goBack();
            } else this.CheckError(responseJson);
          })
          .catch(error => {
            console.log('Thirderr:' + error);
            this.setState({loading: false});
            // alert(strings.allFeildsRequeired);
            // Alert.alert(strings.alert, strings.allFeildsRequeired, [
            //   {
            //     text: strings.cancel,
            //     onPress: () => console.log('Cancel Pressed'),
            //     style: 'cancel',
            //   },
            //   {text: strings.ok, onPress: () => console.log('OK Pressed')},
            // ]);
          });
      });
    } catch (error) {
      console.log('FourthErr');
      this.setState({loading: false});
      // alert(strings.allFeildsRequeired);
      Alert.alert(strings.alert, strings.allFeildsRequeired, [
        {
          text: strings.cancel,
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: strings.ok, onPress: () => console.log('OK Pressed')},
      ]);
    }
  }

  CheckError(responseJson) {
    // console.log('Here:' + JSON.stringify(responseJson));
    try {
      if (responseJson.errors.name) {
        // alert(responseJson.errors.name[0]);
        Alert.alert(strings.alert, responseJson.errors.name[0], [
          {
            text: strings.cancel,
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {text: strings.ok, onPress: () => console.log('OK Pressed')},
        ]);
        return;
      }
      if (responseJson.errors.email) {
        // alert(responseJson.errors.email[0]);
        Alert.alert(strings.alert, responseJson.errors.email[0], [
          {
            text: strings.cancel,
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {text: strings.ok, onPress: () => console.log('OK Pressed')},
        ]);
        return;
      }
      if (responseJson.errors.mobile) {
        // alert(responseJson.errors.mobile[0]);
        Alert.alert(strings.alert, responseJson.errors.mobile[0], [
          {
            text: strings.cancel,
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {text: strings.ok, onPress: () => console.log('OK Pressed')},
        ]);
        return;
      }
      if (responseJson.errors.message) {
        // alert(responseJson.errors.message[0]);
        Alert.alert(strings.alert, responseJson.errors.message[0], [
          {
            text: strings.cancel,
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {text: strings.ok, onPress: () => console.log('OK Pressed')},
        ]);
        return;
      }
    } catch {
      // alert(strings.allFeildsRequeired)
      Alert.alert(strings.alert, strings.allFeildsRequeired, [
        {
          text: strings.cancel,
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: strings.ok, onPress: () => console.log('OK Pressed')},
      ]);
    }
    // alert(JSON.stringify(responseJson));
  }
  LoadingTxt() {
    if (this.state.loading)
      return <ActivityIndicator size="large" color="white" />;
    return <Text style={styles.NextTxt}>{strings.send}</Text>;
  }

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
  handleDatePicked = (event, date) => {
    this.setState({
      isDatePickerVisible: false,
      date: moment(date).format('YYYY-MM-DD'),
    });
  };

  CourseDetails() {
    const {InputsObj} = this;
    return (
      <View style={{}}>
        {/* {this.CourseFeildPicker()} */}
        <View style={{width: wp('90%'), height: hp('7%'), marginTop: hp('1%')}}>
          <ModalPicker
            hasBorder={true}
            data={this.state.CourseFeildData}
            hint={strings.CourseFeild}
            onSelect={value => {
              this.setState({course_field_id: value.id});
            }}
          />
        </View>
        <Text style={styles.label}>{strings.courseName}</Text>
        <TextInput
          onChangeText={text => (InputsObj['course_name'] = text)}
          placeholder={strings.courseName}
          placeholderTextColor={'gray'}
          style={[styles.InputStyleNewAccount]}
        />

        <Text style={styles.label}>{strings.numberOfIndividuals}</Text>
        <TextInput
          keyboardType={'numeric'}
          onChangeText={text => (InputsObj['individuals_count'] = text)}
          placeholder={strings.numberOfIndividuals}
          placeholderTextColor={'gray'}
          style={[styles.InputStyleNewAccount]}
        />
      </View>
    );
  }

  HallDetails() {
    const {InputsObj} = this;
    return (
      <View style={{}}>
        <Text style={styles.label}>{strings.hallSize}</Text>
        <TextInput
          onChangeText={text => (InputsObj['hall_size'] = text)}
          placeholder={strings.hallSize}
          placeholderTextColor={'gray'}
          style={[styles.InputStyleNewAccount]}
        />
      </View>
    );
  }

  render() {
    const {InputsObj} = this;
    const {date, gender, serviceType} = this.state;
    return (
      <SafeAreaView>
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
                flexDirection: 'row',
                alignItems: 'center',
                width: wp('95%'),
              }}>
              <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                <Icon
                  name={I18nManager.isRTL ? 'arrow-forward' : 'arrow-back'}
                  size={30}
                  color={'white'}
                />
              </TouchableOpacity>

              <Text style={styles.MiddleTxt}>{strings.specifywhatyouneed}</Text>
            </View>
          </View>
        </ImageBackground>

        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{alignSelf: 'center'}}>
          <Text
            style={{
              fontSize: hp('2.1%'),
              width: wp('90%'),
              color: 'black',
            }}>
            {this.props.Title}
          </Text>

          <Text style={styles.label}>{strings.name}</Text>
          <TextInput
            onChangeText={text => (InputsObj['name'] = text)}
            placeholder={strings.name}
            placeholderTextColor={'gray'}
            style={[styles.InputStyleNewAccount]}
          />

          <Text style={styles.label}>{strings.email}</Text>
          <TextInput
            onChangeText={text => (InputsObj['email'] = text)}
            placeholder={strings.email}
            placeholderTextColor={'gray'}
            style={[styles.InputStyleNewAccount]}
          />

          <Text style={styles.label}>{strings.phoneNumber}</Text>
          <TextInput
            keyboardType={'numeric'}
            onChangeText={text => (InputsObj['mobile'] = text)}
            placeholder={strings.phoneNumber}
            placeholderTextColor={'gray'}
            style={[styles.InputStyleNewAccount]}
          />

          <Text style={styles.label}>{strings.courseTitle}</Text>
          <TextInput
            onChangeText={text => (InputsObj['course_title'] = text)}
            placeholder={strings.courseTitle}
            placeholderTextColor={'gray'}
            style={[styles.InputStyleNewAccount]}
          />

          <Text style={styles.label}>{strings.date}</Text>
          <TouchableOpacity
            onPress={() => this.setState({isDatePickerVisible: true})}
            style={[
              styles.InputView,
              {height: hp('7%'), width: wp('90%'), paddingHorizontal: 8},
            ]}>
            <Text style={styles.restoreByPhone}>{date} </Text>
          </TouchableOpacity>

          <View
            style={[
              styles.InputView,
              {
                justifyContent: 'space-between',
                backgroundColor: '#F2F2F2',
                borderWidth: 0,
              },
            ]}>
            <View>
              <Text style={{height: hp('4%'), fontFamily: fonts.normal}}>
                {strings.sex}{' '}
              </Text>
            </View>
            <View style={{flexDirection: 'row', width: wp('100%')}}>
              <TouchableOpacity
                onPress={() => this.setState({gender: 0})}
                style={styles.RestoreByPhoneOrEmail}>
                <RadioButton selected={gender == 0} color={'#39A1F7'} />
                <Text style={styles.restoreByPhone}> {strings.mensOnly} </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.setState({gender: 1})}
                style={styles.RestoreByPhoneOrEmail}>
                <RadioButton selected={gender == 1} color={'#39A1F7'} />
                <Text style={styles.restoreByPhone}> {strings.womensOnly}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.setState({gender: 2})}
                style={styles.RestoreByPhoneOrEmail}>
                <RadioButton selected={gender == 2} color={'#39A1F7'} />
                <Text style={styles.restoreByPhone}>
                  {' '}
                  {strings.menAndWomen}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View
            style={[
              styles.InputView,
              {
                justifyContent: 'space-between',
                backgroundColor: '#F2F2F2',
                borderWidth: 0,
              },
            ]}>
            <View>
              <Text style={{height: hp('4%'), fontFamily: fonts.normal}}>
                {strings.serviceType}{' '}
              </Text>
            </View>
            <View style={{flexDirection: 'row', width: wp('100%')}}>
              <TouchableOpacity
                onPress={() => this.setState({serviceType: 0})}
                style={styles.RestoreByPhoneOrEmail}>
                <RadioButton selected={serviceType == 0} color={'#39A1F7'} />
                <Text style={styles.restoreByPhone}> {strings.course} </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.setState({serviceType: 1})}
                style={styles.RestoreByPhoneOrEmail}>
                <RadioButton selected={serviceType == 1} color={'#39A1F7'} />
                <Text style={styles.restoreByPhone}> {strings.hall}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.label}>{strings.serviceType}</Text>
          {serviceType == 0 && this.CourseDetails()}
          {serviceType == 1 && this.HallDetails()}

          <Text style={styles.label}>{strings.serviceProvider}</Text>
          <TextInput
            onChangeText={text => (InputsObj['service_provider'] = text)}
            placeholder={strings.serviceProvider}
            placeholderTextColor={'gray'}
            style={[styles.InputStyleNewAccount]}
          />

          <Text style={styles.label}>{strings.servicePlace}</Text>
          <TextInput
            multiline
            onChangeText={text => (InputsObj['service_place'] = text)}
            placeholder={strings.servicePlace}
            placeholderTextColor={'gray'}
            style={[styles.InputStyleNewAccount]}
          />

          <Text style={styles.label}>{strings.otherDetails}</Text>
          <TextInput
            multiline
            onChangeText={text => (InputsObj['other_details'] = text)}
            placeholder={strings.otherDetails}
            placeholderTextColor={'gray'}
            style={[styles.InputStyleNewAccount, {height: hp('17%')}]}
          />

          <TouchableOpacity
            style={styles.LoginBTNStyle}
            onPress={() => this.PostReq()}>
            {this.LoadingTxt()}
          </TouchableOpacity>
          {this.DatePickerWindow()}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export default CourseRequest;
const styles = StyleSheet.create({
  RestoreByPhoneOrEmail: {
    margin: wp('1%'),
    height: hp('4%'),
    flexDirection: 'row',
    alignItems: 'center',
  },
  restoreByPhone: {fontFamily: fonts.normal},
  MiddleTxt: {
    width: wp('80%'),
    textAlign: 'center',
    color: 'white',
    fontSize: wp('5.5%'),
    fontFamily: fonts.normal,
  },
  Header: {
    width: wp('100%'),
    height: hp('10%'),
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: fonts.normal,
  },
  InputStyleNewAccount: {
    backgroundColor: 'white',
    elevation: 2,
    shadowOpacity: 0.1,
    marginTop: hp('2%'),
    width: wp('90%'),
    height: hp('7%'),
    fontSize: hp('1.8%'),
    color: '#39A1F7',
    textAlign: I18nManager.isRTL ? 'right' : 'left',
    paddingHorizontal: 8,
    fontFamily: fonts.normal,
  },
  LoginBTNStyle: {
    marginTop: hp('3%'),
    justifyContent: 'center',
    alignItems: 'center',
    width: wp('90%'),
    height: hp('6%'),
    backgroundColor: '#4D75B8',
    borderRadius: wp('0.7%'),
    marginBottom: hp('10%'),
  },
  NextTxt: {fontSize: hp('1.8%'), color: 'white', fontFamily: fonts.normal},
  InputView: {
    borderColor: 'silver',
    marginTop: hp('2%'),
    opacity: 0.7,
    backgroundColor: 'white',
    alignItems: 'center',
    borderRadius: wp('2%'),
    borderWidth: wp('0.3%'),
    flexDirection: 'row',
    width: wp('85%'),
    height: hp('7%'),
  },
  label: {
    fontFamily: fonts.normal,
    fontSize: hp('1.8%'),
    marginBottom: -hp('1.6%'),
    textAlign: 'left',
    marginTop: hp('1.5%'),
  },
});
