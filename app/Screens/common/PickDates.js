import React, { Component } from 'react';
import {
  ActivityIndicator,
  Alert,
  I18nManager,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Icon } from 'react-native-elements';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import fonts from '../../fonts';
import strings from '../strings';

class PickDates extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      Dates: this.props.hallCalendar,
      PickedDatesIDs: [],
    };
  }

  LoginTxt() {
    if (this.props.APILoading)
      return <ActivityIndicator size="large" color="white" />;
    return <Text style={styles.NextTxt}>{strings.confirm}</Text>;
  }

  PostReq() {
    this.props.BookHall(this.state.PickedDatesIDs);
  }

  ToggleThisDateID(ID) {
    let PickedDatesIDs = this.state.PickedDatesIDs;
    if (PickedDatesIDs.includes(ID)) {
      let index = PickedDatesIDs.indexOf(ID);
      PickedDatesIDs.splice(index, 1);
    } else PickedDatesIDs.push(ID);
    this.setState({PickedDatesIDs: PickedDatesIDs});
    console.log('PickedDatesIDs:' + JSON.stringify(PickedDatesIDs));
  }

  DateItem(DateObj, Choosed) {
    return (
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: hp('0.5%'),
        }}
        onPress={() => this.ToggleThisDateID(DateObj.id)}>
        <Text style={[styles.ItemTxt, {color: Choosed ? '#5174B4' : 'black'}]}>
          {DateObj.start_date}{' '}
        </Text>
        <Text style={[styles.ItemTxt, {color: Choosed ? '#5174B4' : 'black'}]}>
          {DateObj.end_date}{' '}
        </Text>
        <Text style={[styles.ItemTxt, {color: Choosed ? '#5174B4' : 'black'}]}>
          {DateObj.start_time}{' '}
        </Text>
        <Text style={[styles.ItemTxt, {color: Choosed ? '#5174B4' : 'black'}]}>
          {DateObj.end_time}{' '}
        </Text>
      </TouchableOpacity>
    );
  }

  DatesList() {
    let DatesItems = [];
    const {Dates, PickedDatesIDs} = this.state;
    console.log("🚀 ~ file: PickDates.js:86 ~ PickDates ~ DatesList ~ Dates:", Dates)
    console.log('Dates', Dates);
    for (let i = 0; i < Dates.length; i++) {
      let Choosed = PickedDatesIDs.includes(Dates[i].id);
      DatesItems.push(this.DateItem(Dates[i], Choosed));
    }
    return (
      <View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: hp('0.5%'),
          }}>
          <Text style={styles.ItemTxt}>Start Date </Text>
          <Text style={styles.ItemTxt}>End Date </Text>
          <Text style={styles.ItemTxt}>Start Time </Text>
          <Text style={styles.ItemTxt}>End Time </Text>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          {DatesItems.length > 0 ? (
            DatesItems
          ) : (
            <Text style={styles.noDates}>{strings.noAvailableDates}</Text>
          )}
        </ScrollView>
      </View>
    );
  }

  render() {
    const {Show} = this.props;
    if (!Show) return <View />;
    return (
      <View style={styles.MainView}>
        <View
          style={{
            position: 'absolute',
            width: wp('100%'),
            height: hp('100%'),
            backgroundColor: 'black',
            opacity: 0.175,
          }}
        />
        <View
          style={{
            alignItems: 'center',
            backgroundColor: 'white',
            width: wp('80%'),
            height: hp('40%'),
            borderRadius: wp('5%'),
          }}>
          <View
            style={{
              marginTop: hp('2%'),
              width: wp('80%'),
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <TouchableOpacity onPress={() => this.props.HidePickDates()}>
              <Icon
                style={{marginLeft: wp('2%')}}
                name="close"
                size={40}
                color={'#ededed'}
              />
            </TouchableOpacity>
            <Text
              style={{
                color: '#7EBBDD',
                alignSelf: 'center',
                fontSize: hp('2%'),
                fontFamily: fonts.normal,
              }}>
              {strings.pickReservationsDate}
            </Text>
          </View>

          <View
            style={{
              marginTop: hp('2%'),
              alignItems: 'center',
              width: wp('75%'),
              height: hp('18%'),
            }}>
            {this.DatesList()}
          </View>

          <TouchableOpacity
            onPress={() => {
              if (this.state.PickedDatesIDs.length > 0) {
                console.log(
                  'his.state.PickedDatesIDs',
                  this.state.PickedDatesIDs,
                );
                this.PostReq();
              } else {
                Alert.alert(strings.alert, strings.chooseDate, [
                  {
                    text: strings.cancel,
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                  },
                  {text: strings.ok, onPress: () => console.log('OK Pressed')},
                ]);
              }
            }}
            style={[styles.LoginBTNStyle, {backgroundColor: '#4D75B8'}]}>
            <Text style={styles.NextTxt}>{this.LoginTxt()}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  ItemTxt: {fontSize: hp('1.45%')},
  MainView: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: wp('100%'),
    height: hp('100%'),
  },
  InputStyleNewAccount: {
    textAlignVertical: 'top',
    marginTop: hp('4%'),
    backgroundColor: '#ededed',
    borderRadius: wp('2%'),
    width: wp('70%'),
    height: hp('17.5%'),
    fontSize: hp('2%'),
    fontFamily: fonts.normal,
    color: '#39A1F7',
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
  LoginBTNStyle: {
    marginTop: hp('3%'),
    justifyContent: 'center',
    alignItems: 'center',
    width: wp('70%'),
    height: hp('6%'),
    backgroundColor: '#483F8C',
    borderRadius: wp('1%'),
  },
  NextTxt: {fontSize: hp('2.5%'), color: 'white', fontFamily: fonts.normal},
  noDates: {fontSize: hp('2%'), textAlign: 'center', fontFamily: fonts.normal},
});

export { PickDates };

