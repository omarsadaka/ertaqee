import React, { Component } from 'react';
import { AsyncStorage,StyleSheet,ActivityIndicator,TouchableOpacity,ToastAndroid,ImageBackground,ScrollView,View,Dimensions,Alert,Image,I18nManager,TextInput,YellowBox,BackHandler,StatusBar, SafeAreaView } from 'react-native';
import UserProfile from '../../UserProfile';
import strings from '../strings';
import {BottomMenu,CoachesScroll} from '../common';
import { Icon} from 'react-native-elements';
import { Text } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import CoachItem from '../common/Items/CoachItem';
import fonts from '../../fonts';

class Coaches extends Component {

        NewItems = () => {
            let Items = [];
            for (let i = 0; i < 5; i++)
              Items.push(<CoachItem key={i} navigation={this.props.navigation}/>)
              Items.push(<View key={-1} style={{width:wp('50%'),height:hp('15%')}}/>)
            return Items;
          }

  ScrollItems(){
    return(
      <View style={{marginTop:hp('1%'),alignSelf:'center',width:wp('100%')}}>
        {<CoachesScroll Items={this.NewItems()} navigation={this.props.navigation}/>}
      </View>
    )
  }


    render() {
      let IsAr = UserProfile.getInstance().Lang==='ar';
      return(
        <SafeAreaView style={{flex:1}}>

            <View style={{flex:1}}>
              <ImageBackground source={require('../../res/topbar.png')} style={styles.Header}>
                <View style={{alignItems:'center',flexDirection:'row',width:wp('95%'),height:hp('10%')}}>
                      <View style={{flexDirection:'row',alignItems:'center',width:wp('85%')}}>
                        <TouchableOpacity onPress={()=>this.props.navigation.goBack()}>
                          <Icon name={IsAr?'arrow-forward':'arrow-back'} size={30} color={'white'}/>
                        </TouchableOpacity>
                        <Text style={styles.MiddleTxt}>{strings.trainers}</Text>
                      </View>
                </View>
                </ImageBackground>
                {this.ScrollItems()}
              
            </View>
            </SafeAreaView>
      )
    }
  }


export default Coaches;
const styles = StyleSheet.create({
  MiddleTxt:{width:wp('80%'),textAlign:'center',color:'white',fontSize:wp('5.5%'),fontFamily: fonts.normal},
  FloatingBTN:{justifyContent:'center',alignItems:'center',backgroundColor:'white',width: 70,height: 70,borderRadius: 35,position: 'absolute',bottom: 90,right: 30},
  NextTxt:{fontSize:hp('2%'),color:'white'},
  LoginBTNStyle:{marginTop:hp('2%'),justifyContent:'center',alignItems:'center',width:wp('90%'),height:hp('8%'),backgroundColor:'#4D75B8',borderRadius:wp('2%')},
  InputStyle:{borderColor:'silver',margin:2,borderColor:'silver',borderWidth:wp('0.1%'),borderRadius:wp('1%'),width:wp('90%'),marginTop:hp('2%'),height:hp('8%'),fontSize:hp('2%')},
  footer:{width:wp('100%'),alignItems:'center',position:'absolute',height:hp('100%')},
  Header:{width:wp('100%'),height:hp('10%'),alignItems:'center',justifyContent:'center'},
  title:{fontSize:hp('2%'),color:'white'},
  BackArrow:{resizeMode:'contain',width:wp('10%'),height:hp('3.1%')},
  InputView:{opacity:.7,backgroundColor:'white',alignItems:'center',borderRadius:wp('2%'),borderWidth:wp('0.3%'),flexDirection:'row',width:wp('90%'),height:hp('7%')},
});
