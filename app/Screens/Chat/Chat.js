import React from 'react';
import {
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { Icon } from 'react-native-elements';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      CurrentLang: 0,
    };
  }

  UserNameAndIMG(Title, Desc) {
    return (
      <View
        style={{
          flexDirection: 'row',
          marginTop: hp('2%'),
          width: wp('90%'),
          height: hp('13.5%'),
        }}>
        {/*was <Thumbnail style={{borderWidth:hp('0.15%'),borderColor:'#4D75B8',marginRight:wp('2%')}} medium source={require('../../res/userimg.png')} /> */}
        <Image
          style={{
            borderWidth: hp('0.15%'),
            borderColor: '#4D75B8',
            marginRight: wp('2%'),
          }}
          medium
          source={require('../../res/userimg.png')}
        />
        <View
          style={{
            marginTop: hp('-0.5%'),
            alignItems: 'center',
            width: wp('70%'),
            height: hp('1%'),
          }}>
          <Text
            style={{
              alignSelf: 'flex-start',
              fontSize: hp('2.5%'),
              color: 'grey',
            }}>
            {' '}
            {Title}
          </Text>
          <Text
            style={{
              alignSelf: 'flex-start',
              fontSize: hp('2%'),
              color: '#4D75B8',
            }}>
            {' '}
            {Desc}
          </Text>
        </View>
        <Icon
          style={{marginTop: hp('0.5%')}}
          name="settings"
          size={28}
          color={'grey'}
        />
      </View>
    );
  }

  MyMSG(Body, Time) {
    return (
      <View>
        <ImageBackground
          source={require('../../res/sendermsg.png')}
          imageStyle={{
            width: wp('50%'),
            height: hp('7%'),
            resizeMode: 'contain',
          }}
          style={{
            justifyContent: 'center',
            width: wp('50%'),
            height: hp('7%'),
          }}>
          <Text
            adjustsFontSizeToFit
            numberOfLines={2}
            style={{
              alignSelf: 'flex-start',
              width: wp('40%'),
              marginLeft: wp('2%'),
              fontSize: hp('1.5%'),
              color: 'white',
            }}>
            {Body}
          </Text>
        </ImageBackground>
        <Text
          style={{
            alignSelf: 'flex-start',
            marginTop: hp('-0.5%'),
            fontSize: hp('1.5%'),
            color: 'grey',
          }}>
          {Time}
        </Text>
      </View>
    );
  }

  OtherMSG(Body, Time) {
    return (
      <View style={{alignItems: 'flex-end'}}>
        <ImageBackground
          source={require('../../res/receivermsg.png')}
          imageStyle={{
            width: wp('50%'),
            height: hp('7%'),
            resizeMode: 'contain',
          }}
          style={{
            justifyContent: 'center',
            width: wp('50%'),
            height: hp('7%'),
          }}>
          <Text
            adjustsFontSizeToFit
            numberOfLines={2}
            style={{
              alignSelf: 'flex-start',
              width: wp('40%'),
              marginLeft: wp('2%'),
              fontSize: hp('1.5%'),
              color: 'black',
            }}>
            {Body}
          </Text>
        </ImageBackground>
        <Text
          style={{marginTop: hp('-0.5%'), fontSize: hp('1.5%'), color: 'grey'}}>
          {Time}
        </Text>
      </View>
    );
  }

  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <View style={{backgroundColor: 'white', alignItems: 'center', flex: 1}}>
          <View style={styles.Header}>
            <View
              style={{
                alignItems: 'center',
                flexDirection: 'row',
                width: wp('90%'),
                height: hp('10%'),
              }}>
              <TouchableOpacity
                onPress={() => this.props.navigation.goBack()}
                style={{marginLeft: wp('2%')}}>
                <Icon name="arrow-forward" size={30} color={'black'} />
              </TouchableOpacity>
            </View>

            <View
              style={{
                alignItems: 'center',
                flexDirection: 'row',
                width: wp('90%'),
                height: hp('10%'),
              }}>
              {this.UserNameAndIMG('الاسم', 'النص التفصيلي')}
            </View>
          </View>

          <View
            style={{
              alignItems: 'center',
              width: wp('100%'),
              height: hp('73%'),
            }}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{width: wp('90%')}}>
              {this.MyMSG('السلام عليكم ورحمة الله وبركاته', '00:00')}
              {this.OtherMSG('وعليكم السلام ورحمة الله وبركاته', '00:00 أنت')}
              {this.MyMSG('السلام عليكم ورحمة الله وبركاته', '00:00')}
              {this.OtherMSG('وعليكم السلام ورحمة الله وبركاته', '00:00 أنت')}
              {this.MyMSG('السلام عليكم ورحمة الله وبركاته', '00:00')}
              {this.OtherMSG('وعليكم السلام ورحمة الله وبركاته', '00:00 أنت')}
              {this.MyMSG('السلام عليكم ورحمة الله وبركاته', '00:00')}
              {this.OtherMSG('وعليكم السلام ورحمة الله وبركاته', '00:00 أنت')}
              {this.MyMSG('السلام عليكم ورحمة الله وبركاته', '00:00')}
              {this.OtherMSG('وعليكم السلام ورحمة الله وبركاته', '00:00 أنت')}
            </ScrollView>
          </View>

          <View
            style={{
              backgroundColor: 'white',
              alignItems: 'center',
              position: 'absolute',
              bottom: 0,
              flexDirection: 'row',
              borderTopWidth: 1,
              borderTopColor: 'silver',
              width: wp('100%'),
              height: hp('9%'),
            }}>
            <TextInput
              placeholder="اكتب الرسالة…"
              placeholderTextColor={'gray'}
              style={{
                width: wp('75%'),
                height: hp('6%'),
                borderRadius: hp('1%'),
                borderWidth: 1,
                borderColor: 'grey',
                marginLeft: wp('7%'),
              }}
            />
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginLeft: wp('3%'),
                width: 40,
                borderRadius: 40 / 2,
                height: 40,
                backgroundColor: '#4D75B8',
              }}>
              <Icon
                name="send"
                style={{transform: [{rotateY: '180deg'}]}}
                size={25}
                color={'white'}
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

export default Chat;
const styles = StyleSheet.create({
  Header: {
    width: wp('90%'),
    height: hp('18%'),
    alignItems: 'center',
    justifyContent: 'center',
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
});
