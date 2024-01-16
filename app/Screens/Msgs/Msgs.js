import React from 'react';
import {
  Alert,
  FlatList,
  Image,
  ImageBackground,
  SafeAreaView,
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
import strings from '../strings';
import UserProfile from '../../UserProfile';
import fonts from '../../fonts';
import { Colors } from '../../theme';

class Msgs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      CurrentLang: 0,
      isLoading: false,
      isRefreshing: false,
      page:1,
      data:[]
    };
  }


  componentDidMount() {
    this.getNotifications(false);
  }

  getNotifications = isLoadMore => {
   
    this.setState({isLoading: true});
    if(isLoadMore)  this.setState({isRefreshing: true});
    fetch('https://www.demo.ertaqee.com/api/v1/notifications?page='+this.state.page, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + UserProfile.getInstance().clientObj.token,
      },
    })
      .then(res => res.json())
      .then(res => {
        this.setState({isLoading: false ,refreshing: false});
        console.log('getNotifications',res)
      //   if (!isLoadMore) {
      //     Alert.alert(strings.alert, strings.noDataToShow, [
      //       {
      //         text: strings.cancel,
      //         onPress: () => console.log('Cancel Pressed'),
      //         style: 'cancel',
      //       },
      //       {text: strings.ok, onPress: () => console.log('OK Pressed')},
      //     ]);
      // } else {
        this.setState({
          data:
            this.state.page === 1 ? res?.data?.notifications : [...this.state.data, ...res.data.notifications],
          isRefreshing: false,
          isLoading: false,
        });
      })
      .catch(err => {
        this.setState({isLoading: false,refreshing: false});
        console.error(err);
      });
  };

   handleLoadMore = () => {
    this.setState(
      {
        page: this.state.page + 1,
      },
      () => {
        this.getNotifications(true);
      },
    );
  };

  UserNameAndIMG(Title, Desc, Date, ShowDot, ShowDetails) {
    return (
      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('Chat')}
        style={{
          flexDirection: 'row',
          marginTop: hp('2%'),
          width: wp('90%'),
          height: hp('13.5%'),
        }}>
        {/* was <Thumbnail style={{marginRight:wp('2%')}} large source={require('../../res/userimg.png')} /> */}
        <Image
          style={{marginRight: wp('2%'), width: 60, height: 60}}
          source={require('../../res/userimg.png')}
        />
        <View
          style={{
            marginTop: hp('0.5%'),
            alignItems: 'center',
            width: wp('70%'),
            height: hp('10%'),
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: wp('65%'),
              height: hp('3%'),
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text
                style={{
                  textAlign: 'left',
                  fontSize: hp('2.5%'),
                  color: ShowDot ? '#4D75B8' : '#4D75B8',
                }}>
                {' '}
                {Title}
              </Text>
              <View
                style={{
                  marginLeft: wp('1%'),
                  width: 12,
                  borderRadius: 12 / 2,
                  height: 12,
                  backgroundColor: ShowDot ? '#4D75B8' : '#F9F9F9',
                }}
              />
            </View>
            <Text style={{fontSize: hp('1.75%'), color: '#8D95A6'}}>
              {Date}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              marginTop: hp('0.75%'),
              alignItems: 'center',
              width: wp('70%'),
              height: hp('3%'),
            }}>
            <Text
              style={{textAlign: 'left', fontSize: hp('1.75%'), color: 'grey'}}>
              {' '}
              {Desc}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              marginTop: hp('0.15%'),
              alignItems: 'center',
              width: wp('70%'),
              height: hp('3%'),
            }}>
            {ShowDetails && (
              <Text
                style={{
                  textAlign: 'left',
                  fontSize: hp('2'),
                  textDecorationLine: 'underline',
                  color: 'grey',
                }}>
                {' '}
                شاهد التفاصيل
              </Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  NotificationItem(item) {
    return (
      <TouchableOpacity style={styles.itemContainer}
      onPress={()=> this.props.navigation.navigate('Reservations')}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.body}>{item.body}</Text>
        <Text style={styles.date}>{item.created_at}</Text>
      </TouchableOpacity>
    );
  }
  render() {
    let ParamsData = this.props.route.params;
    return (
      <View style={{width:'100%', height:'100%', alignItems:'center'}}>
      <SafeAreaView
        style={{flex: 1, alignItems: 'center', backgroundColor: '#4D75B8'}}>
        <View
          style={{
            alignItems: 'center',
            flex: 1,
            backgroundColor: 'white',
          }}>
          <ImageBackground
            source={require('../../res/topbar2.png')}
            style={styles.Header}>
            <Text style={styles.MiddleTxt}>
              {ParamsData.MsgsOrNotifications ? 'الرسائل' : 'الاشعارات'}
            </Text>
            <View
              style={{
                alignItems: 'center',
                flexDirection: 'row',
                width: wp('100%'),
                height: hp('10%'),
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: wp('100%'),
                }}>
                <TouchableOpacity
                  onPress={() => this.props.navigation.goBack()}
                  style={{marginLeft: wp('2%')}}>
                  <Icon name="arrow-forward" size={30} color={'white'} />
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>

          <Image
            style={styles.BackGroundLogo}
            source={require('../../res/backgroundlogo.png')}
          />
          <View style={{width:'100%',paddingHorizontal:4}}>
            {ParamsData.MsgsOrNotifications ?
            <Text style={styles.title}>{strings.soon}</Text>
            :
          <FlatList
            removeClippedSubviews={true}
            contentContainerStyle={{paddingBottom: hp('20%')}}
            overScrollMode="never"
            // onScroll={event => this._onScroll(event)}
            style={{alignContent: 'center',marginTop:10}}
            data={this.state.data}
            renderItem={({item}) => this.NotificationItem(item)}
            keyExtractor={i => i.id}
            refreshing={this.state.isRefreshing}
            onEndReached={this.handleLoadMore}
            onEndThreshold={0}
            showsVerticalScrollIndicator={false}
          />
         }
          </View>
        </View>
      </SafeAreaView>
      </View>
    );
  }
}

export default Msgs;
const styles = StyleSheet.create({
  Header: {
    width: wp('100%'),
    height: hp('10%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  BackArrow: {
    position: 'absolute',
    bottom: 0,
    left: wp('-8%'),
    resizeMode: 'contain',
    width: wp('25%'),
    height: hp('4%'),
  },
  MiddleTxt: {
    width: wp('100%'),
    alignSelf: 'center',
    textAlign: 'center',
    position: 'absolute',
    right: wp('0%'),
    left: wp('0%'),
    color: 'white',
    fontSize: wp('5%'),
  },
  BackGroundLogo: {
    position: 'absolute',
    right: wp('-10%'),
    bottom: hp('-4%'),
    resizeMode: 'contain',
    width: wp('75%'),
    height: hp('35%'),
  },
  itemContainer:{
    width:'99%',
    backgroundColor:'#F5F5F5',
    alignItems:'flex-start',
    elevation:4,
    shadowOpacity:0.3,
    borderRadius:6,
    marginVertical:5,
    padding:5,
    alignSelf:'center'
   
  },
  title:{
    color: Colors.black,
    fontSize:18,
    fontFamily: fonts.normal
  },
  body:{
    fontSize:15,
    fontFamily: fonts.normal
  },
  date:{
    fontSize:13,
    fontFamily: fonts.normal,
    alignSelf:'flex-end'
  }
});
