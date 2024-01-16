import React from 'react';
import { ImageBackground } from 'react-native';
import {View, Text,StyleSheet,TouchableOpacity} from 'react-native';
import { Icon } from 'react-native-elements';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import UserProfile from '../../UserProfile';
import fonts from '../../fonts';

const Header = ({navigation,title}) => {
    let IsAr = UserProfile.getInstance().Lang==='ar';

  return (
    <View >
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
              width: wp('85%'),
            }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon
                name={IsAr ? 'arrow-forward' : 'arrow-back'}
                size={30}
                color={'white'}
              />
            </TouchableOpacity>
            <Text style={styles.MiddleTxt}>{title}</Text>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};


const styles = StyleSheet.create({
    MiddleTxt:{width:wp('80%'),textAlign:'center',color:'white',fontSize:wp('5.5%'),fontFamily: fonts.normal},
    Header:{width:wp('100%'),height:hp('10%'),alignItems:'center',justifyContent:'center'},
    title:{fontSize:hp('2%'),color:'white'},
    BackArrow:{resizeMode:'contain',width:wp('10%'),height:hp('3.1%')},
    InputView:{opacity:.7,backgroundColor:'white',alignItems:'center',borderRadius:wp('2%'),borderWidth:wp('0.3%'),flexDirection:'row',width:wp('90%'),height:hp('7%')},
  });

export default Header;
