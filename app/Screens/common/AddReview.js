import React, { Component } from 'react';
import {
  ActivityIndicator,
  I18nManager,
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

class AddReview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      CurrentStars: 1,
      Content: '',
      loading: false,
    };
  }

  componentWillMount() {
    this.setState({Show: this.props.Show});
  }

  StarsNoList = StarsNo => {
    let MyStarsNoList = [];
    for (let i = 0; i < 5; i++)
      MyStarsNoList.push(
        <TouchableOpacity onPress={() => this.setState({CurrentStars: i + 1})}>
          <Icon
            key={i}
            name="star"
            size={50}
            color={i < StarsNo ? '#FFD685' : 'grey'}
          />
        </TouchableOpacity>,
      );
    return MyStarsNoList;
  };

  LoginTxt() {
    if (this.state.loading)
      return <ActivityIndicator size="large" color="white" />;
    return <Text style={styles.NextTxt}>تأكيد</Text>;
  }

  Stars(StarsNo) {
    return (
      <View
        style={{
          marginTop: hp('3%'),
          alignItems: 'center',
          flexDirection: 'row',
          height: hp('4%'),
        }}>
        {this.StarsNoList(StarsNo)}
      </View>
    );
  }

  PostReq() {
    let State = this.state;
    if (this.state.loading) return;
    this.setState({loading: true});
    const MyFormData = new FormData();
    MyFormData.append('rating', State.CurrentStars);
    MyFormData.append('content', State.Content);

    try {
      fetch(this.props.APILink, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer ' + UserProfile.getInstance().clientObj.token,
        },
        body: MyFormData,
      }).then(response => {
        response
          .json()
          .then(responseJson => {
            this.setState({loading: false});
            console.log('Data:' + JSON.stringify(responseJson));
            this.setState({loading: false});
            alert('تم اضافة التقييم');
            this.props.HideReview();
          })
          .catch(error => {
            console.log('Thirderr:' + error);
            this.setState({loading: false});
          });
      });
    } catch (error) {
      console.log('FourthErr');
      this.setState({loading: false});
    }
  }

  render() {
    const {Show} = this.props;
    console.log("🚀 ~ file: AddReview.js:108 ~ AddReview ~ render ~ Show:", Show)
    if (!Show) return <View />;
    return (
      <View style={styles.MainView}>
        <View
          style={{
            // position: 'absolute',
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
            height: hp('50%'),
            borderRadius: wp('5%'),
          }}>
          <View
            style={{
              marginTop: hp('2%'),
              width: wp('80%'),
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <TouchableOpacity onPress={() => this.props.HideReview()}>
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
                marginLeft: wp('17%'),
                fontSize: hp('2.5%'),
              }}>
              أضف تقييم
            </Text>
          </View>
          {this.Stars(this.state.CurrentStars)}
          <TextInput
            multiline={true}
            onChangeText={text => this.setState({Content: text})}
            placeholder={'اكتب هنا..'}
            placeholderTextColor={'gray'}
            style={[styles.InputStyleNewAccount]}
          />

          <TouchableOpacity
            onPress={() => this.PostReq()}
            style={[styles.LoginBTNStyle, {backgroundColor: '#4D75B8'}]}>
            <Text style={styles.NextTxt}>{this.LoginTxt()}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  MainView: {
    // position: 'absolute',
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
    marginTop: hp('5%'),
    justifyContent: 'center',
    alignItems: 'center',
    width: wp('70%'),
    height: hp('6%'),
    backgroundColor: '#483F8C',
    borderRadius: wp('1%'),
  },
  NextTxt: {fontSize: hp('2.5%'), color: 'white'},
});

export { AddReview };

