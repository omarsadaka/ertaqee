import React, { Component } from 'react';
import {
  Dimensions,
  ImageBackground,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Icon } from 'react-native-elements';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import UserProfile from '../../../UserProfile';
import fonts from '../../../fonts';
import strings from '../../strings';
const ScreenHeight = Dimensions.get('window').height;
const ScreenWidth = Dimensions.get('window').width;
// import Share from "react-native-share";

class BestCenterItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Data: '',
    };
  }

  componentWillMount() {
    try {
      this.setState({Data: this.props.Item});
    } catch (e) {
      console.log('Error:' + e);
    }
  }

  StarsNoList = StarsNo => {
    let MyStarsNoList = [];
    for (let i = 0; i < StarsNo; i++)
      MyStarsNoList.push(
        <Icon key={i} name="star" size={17} color={'white'} />,
      );
    return MyStarsNoList;
  };

  Stars(StarsNo) {
    return (
      <View
        style={{
          marginLeft: wp('1%'),
          flexDirection: 'row',
          width: wp('25%'),
          height: hp('4%'),
        }}>
        {this.StarsNoList(StarsNo)}
      </View>
    );
  }

  AddToFav() {
    let userRole = UserProfile.getInstance().clientObj.user.role[0];
    if (userRole == 'Guest') {
      alert(strings.must_login);
      return;
    }
    let Data = this.state.Data;
    Data.is_favorited = !Data.is_favorited;
    this.setState({Data: Data});
    let FavUrl =
      'https://www.demo.ertaqee.com/api/v1/courses/' +
      Data.id +
      '/favorite?user_id=' +
      UserProfile.getInstance().clientObj.user.id;
    try {
      fetch(FavUrl, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      }).then(response => {
        this.setState({loading: false});
        response
          .json()
          .then(responseJson => {
            console.log('Success:' + JSON.stringify(responseJson));
          })
          .catch(error => {
            console.log('Thirderr:' + error);
          });
      });
    } catch (error) {
      console.log('FourthErr:' + error);
    }
  }

  Share(Title) {
    const shareOptions = {
      title: 'مشاركة',
      message: 'مركز ' + Title + ' لتقديم الدورات من تطبيق ارتقي',
      url: 'http://play.google.com/store/apps/details?id=com.fudex.ertaqee',
    };
    Share.open(shareOptions);
  }

  share = async Title => {
    const options = {
      message: `مشاركة ${`\n\n`} مركز ${Title} لتقديم الدورات من تطبيق ارتقي  ${`\n\n`} ${'http://play.google.com/store/apps/details?id=com.fudex.ertaqee'}`,
    };
    const response = await Share.share(options);
  };

  render() {
    let Data = this.state.Data;
    return (
      <TouchableOpacity
        style={{}}
        onPress={() =>
          this.props.navigation.navigate('CenterDetails', {ItemID: Data.id})
        }>
        <ImageBackground
          source={{uri: Data.photo}}
          resizeMode='contain'
          imageStyle={{borderRadius: wp('3%')}}
          style={{margin: wp('1%'), width: wp('52%'), height: hp('16.5%')}}>
          <View
            style={{
              position: 'absolute',
              width: wp('52%'),
              height: hp('16.5%'),
              borderRadius: wp('3%'),
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
                marginTop: hp('7%'),
                marginHorizontal: wp('2%'),
                fontFamily: fonts.normal,
              }}>
              {' '}
              {Data.center_trade_name}
            </Text>
            <Text
              style={{
                textAlign: 'left',
                color: 'white',
                fontSize: wp('2.5%'),
                marginHorizontal: wp('2%'),
                fontFamily: fonts.normal,
              }}>
              {' '}
              {Data.center_activity}
            </Text>
            {/* omar edit */}

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: wp('52%'),
                marginTop: hp('1%'),
                height: hp('6%'),
              }}>
              {this.Stars(Data.average_rate)}
              <View
                style={{
                  marginRight: wp('2%'),
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  width: wp('8%'),
                  height: hp('4%'),
                }}>
                {/* <TouchableOpacity onPress={()=>this.AddToFav()}>
                        <Icon name={Data.is_favorited?'bookmark':'bookmark-border'} color={Data.is_favorited?'gold':'white'} style={styles.BackArrow}/>
                      </TouchableOpacity> */}
                <TouchableOpacity
                  onPress={() => this.share(Data.center_trade_name)}>
                  <Icon name="share" color="white" style={styles.BackArrow} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    );
  }
}

export default BestCenterItem;

const styles = StyleSheet.create({
  BackArrow: {resizeMode: 'contain', width: wp('5%'), height: hp('3.5%')},
});
