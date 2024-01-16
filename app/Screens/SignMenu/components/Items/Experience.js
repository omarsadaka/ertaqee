import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import React, { Component } from 'react';
import {
  I18nManager,
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
import AntDesign from 'react-native-vector-icons/AntDesign';
import fonts from '../../../../fonts';
import strings from '../../../strings';

class Experience extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDatePickerVisible: false,
      FromOrTo: '',
      from: '',
      to: '',
      multiline: true,
    };
  }

  handleDatePicked = (event, date) => {
    this.setState({isDatePickerVisible: false});
    this.props.onChange({...this.props.data, [this.state.FromOrTo]: date});
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

  render() {
    let {data, index} = this.props;
    let {multiline} = this.state;
    console.log(data);
    return (
      <View style={{alignSelf: 'stretch'}}>
        {index !== 0 ? (
          <TouchableOpacity
            onPress={() => {
              this.props.onDelete();
            }}>
            <AntDesign
              name="delete"
              size={20}
              color="red"
              style={{marginTop: hp('3%')}}
            />
          </TouchableOpacity>
        ) : null}
        <View style={styles.InputView}>
          <TextInput
            pointerEvents="none"
            multiline={multiline}
            onBlur={() => this.setState({multiline: true})}
            onFocus={() => this.setState({multiline: false})}
            onChangeText={text => {
              this.props.onChange({...data, facility: text});
            }}
            value={data.facility}
            placeholder={`${strings.Enterprise}*`}
            placeholderTextColor={'gray'}
            style={[styles.InputStyleNewAccount]}
          />
        </View>
        <View style={styles.InputView}>
          <TextInput
            pointerEvents="none"
            multiline={multiline}
            onBlur={() => this.setState({multiline: true})}
            onFocus={() => this.setState({multiline: false})}
            onChangeText={text => {
              this.props.onChange({...data, location: text});
            }}
            value={data.location}
            placeholder={`${strings.Place}*`}
            placeholderTextColor={'gray'}
            style={[styles.InputStyleNewAccount]}
          />
        </View>
        <View style={styles.InputView}>
          <TextInput
            pointerEvents="none"
            multiline={multiline}
            onBlur={() => this.setState({multiline: true})}
            onFocus={() => this.setState({multiline: false})}
            onChangeText={text => {
              this.props.onChange({...data, achievements: text});
            }}
            value={data.achievements}
            placeholder={`${strings.Achievements}*`}
            placeholderTextColor={'gray'}
            style={[styles.InputStyleNewAccount]}
          />
        </View>
        <View style={styles.InputView}>
          <TextInput
            pointerEvents="none"
            multiline={multiline}
            onBlur={() => this.setState({multiline: true})}
            onFocus={() => this.setState({multiline: false})}
            onChangeText={text => {
              this.props.onChange({...data, job_title: text});
            }}
            value={data.job_title}
            placeholder={`${strings.JobTitle}*`}
            placeholderTextColor={'gray'}
            style={[styles.InputStyleNewAccount]}
          />
        </View>
        <View
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
          ]}>
          <TouchableOpacity
            onPress={() =>
              this.setState({
                FromOrTo: 'from',
                isDatePickerVisible: true,
              })
            }
            style={[
              styles.InputView,
              {
                alignItems: 'center',
                justifyContent: 'center',
                height: hp('7%'),
                width: wp('40%'),
              },
            ]}>
            <Text style={styles.restoreByPhone}>
              {data.from
                ? moment(data.from).format('YYYY-MM')
                : data.from_month && data.from_year
                ? `${data.from_year}-${data.from_month}`
                : `${strings.startDate}*`}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              this.setState({
                FromOrTo: 'to',
                isDatePickerVisible: true,
              })
            }
            style={[
              styles.InputView,
              {
                alignItems: 'center',
                justifyContent: 'center',
                height: hp('7%'),
                width: wp('40%'),
              },
            ]}>
            <Text style={styles.restoreByPhone}>
              {data.to
                ? moment(data.to).format('YYYY-MM')
                : data.to_month && data.to_year
                ? `${data.to_year}-${data.to_month}`
                : `${strings.endDate}*`}
            </Text>
          </TouchableOpacity>
        </View>
        {this.DatePickerWindow()}
      </View>
    );
  }
}

export default Experience;
const styles = StyleSheet.create({
  InputView: {
    borderColor: 'silver',
    marginTop: hp('2%'),
    opacity: 0.7,
    backgroundColor: 'white',
    alignItems: 'center',
    borderRadius: wp('2%'),
    borderWidth: wp('0.3%'),
    flexDirection: 'row',
    width: wp('90%'),
    height: hp('7%'),
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
