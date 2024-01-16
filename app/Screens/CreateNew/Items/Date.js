import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import React, { Component } from 'react';
import {
  I18nManager,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import fonts from '../../../fonts';
import strings from '../../strings';

let tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
console.log('🚀 ~ file: Date.js:21 ~ tomorrow:', tomorrow);

class Date1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDatePickerVisible: false,
      FromOrTo: '',
      from: '',
      to: '',
      multiline: true,
      mode: false,
    };
  }

  handleDatePicked = (event, date) => {
    this.setState({isDatePickerVisible: false, mode: false});
    const num = Object.keys(this.props.data).length;
    let data = this.props.data;
    // if (num > 8) {
    //   data = {};
    // } else {
    //   data = this.props.data;
    // }
    this.props.onChange({
      ...data,
      [this.state.FromOrTo]: date,
      // changed: num > 8,
      changedInput: this.state.changed,
    });
  };

  DatePickerWindow() {
    const {previousStartDate} = this.props;

    if (!this.state.isDatePickerVisible) return;

    return (
      <DateTimePicker
        onChange={this.handleDatePicked}
        mode={this.state.mode ? 'time' : undefined}
        // minimumDate={previousStartDate ?? tomorrow}
        minimumDate={ tomorrow}
        value={tomorrow}
        onCancel={() => {
          this.setState({isDatePickerVisible: false, mode: false});
        }}
      />
    );
  }

  render() {
    let {data, previousDate, index} = this.props;

    return (
      <View style={{alignSelf: 'stretch'}}>
        {/* {index !== 0 ? ( */}
        <TouchableOpacity
          onPress={() => {
            this.props.onDelete();
          }}>
          <AntDesign
            name="delete"
            size={20}
            color="red"
            style={{marginRight: hp('2%'), marginBottom: hp('1')}}
          />
        </TouchableOpacity>
        {/* ) : null} */}
        <View
          style={[
            // styles.InputView,
            {
              alignSelf: 'center',
              // width: wp('85%'),
              flexDirection: 'row',
              flexWrap: 'wrap',
              borderWidth: 0,
              // backgroundColor: 'red',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginHorizontal: 10,
            },
          ]}>
          <TouchableOpacity
            onPress={() => {
              // if (data.fromDate) {
              //   return;
              // } else
                this.setState({
                  FromOrTo: 'fromDate',
                  changed: 'fromDate',
                  isDatePickerVisible: true,
                  mode: false,
                });
            }}
            style={[
              styles.InputView,
              {
                alignItems: 'center',
                justifyContent: 'center',
                height: hp('7%'),
                width: wp('44%'),
              },
            ]}>
            <Text style={styles.restoreByPhone}>
              {data.fromDate
                ? moment(data.fromDate).format('YYYY-MM-DD')
                : data.start_date
                ? data.start_date
                : `${strings.startDate}`}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              // if (data.toDate) {
              //   return;
              // } else
                this.setState({
                  FromOrTo: 'toDate',
                  changed: 'toDate',
                  isDatePickerVisible: true,
                  mode: false,
                });
            }}
            style={[
              styles.InputView,
              {
                alignItems: 'center',
                justifyContent: 'center',
                height: hp('7%'),
                width: wp('44%'),
              },
            ]}>
            <Text style={styles.restoreByPhone}>
              {data.toDate
                ? moment(data.toDate).format('YYYY-MM-DD')
                : data.end_date
                ? data.end_date
                : `${strings.endDate}`}
            </Text>
          </TouchableOpacity>

          {/* <View
          style={[
            styles.InputView,
            {
              alignSelf: 'center',
              width: wp('85%'),
              borderWidth: 0,
              // backgroundColor: '#F2F2F2',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 5,
            },
          ]}> */}
          <TouchableOpacity
            onPress={() => {
              // if (data.fromTime) {
              //   return;
              // } else
                this.setState({
                  FromOrTo: 'fromTime',
                  changed: 'fromTime',
                  mode: true,
                  isDatePickerVisible: true,
                });
            }}
            style={[
              styles.InputView,
              {
                alignItems: 'center',
                justifyContent: 'center',
                height: hp('7%'),
                marginTop: hp('2%'),
                width: wp('44%'),
              },
            ]}>
            <Text style={styles.restoreByPhone}>
              {data.fromTime
                ? moment(data.fromTime).format('hh:mm A')
                : data.start_time
                ? data.start_time
                : `${strings.startTime}`}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              // if (data.toTime) {
              //   return;
              // } else
                this.setState({
                  FromOrTo: 'toTime',
                  changed: 'toTime',
                  mode: true,
                  isDatePickerVisible: true,
                });
            }}
            style={[
              styles.InputView,
              {
                alignItems: 'center',
                justifyContent: 'center',
                height: hp('7%'),
                width: wp('44%'),
              },
            ]}>
            <Text style={styles.restoreByPhone}>
              {data.toTime
                ? moment(data.toTime).format('hh:mm A')
                : data.end_time
                ? data.end_time
                : `${strings.endTime}`}
            </Text>
          </TouchableOpacity>
          {/* </View> */}
        </View>
        {this.DatePickerWindow()}
      </View>
    );
  }
}

export default Date1;
const styles = StyleSheet.create({
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
    height: hp('8%'),
  },
  InputStyleNewAccount: {
    width: wp('85%'),
    height: hp('7%'),
    fontSize: hp('2%'),
    fontFamily: fonts.normal,
    color: '#39A1F7',
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
});
