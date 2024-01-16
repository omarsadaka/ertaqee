
import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,Dimensions,TouchableOpacity,Alert,ImageBackground
} from "react-native";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {Icon} from 'react-native-elements';
import strings from '../../strings';

class CoachItem extends Component {

Nav(ID){
  console.log('Hola');
  this.props.navigation.navigate('CoachDetails',{
    ItemID:ID
  })
}

    render() {
      let Data = this.props.item;
        return (
            <TouchableOpacity onPress={()=>{
              this.Nav(Data.id)
            }} style={{flexDirection:'row',backgroundColor:'white',borderRadius:10,overflow:'hidden'
            ,margin:wp('2%'),alignItems:'center',width:wp('90%'),height:hp('17%')}}>
              <View style={{justifyContent:'center',alignItems:'center',width:wp('28%'),height:hp('15%')}}>
              {/*was import { Thumbnail } from "native-base";
               <Thumbnail large source={{uri:Data.photo}}  resizeMode='contain' /> */}
                <Image style={{width:'100%', height:'100%'}} source={Data.photo?{uri: Data.photo}: require('../../../res/aboutlogo.png')}  resizeMode='contain' />
              </View>
              <View style={{justifyContent:'space-between',width:wp('62%'),height:hp('14%')}}>
                <Text style={{textAlign:'left',color:'black',fontSize:wp('4.5%')}}>{Data.full_name}</Text>
                <Text style={{textAlign:'left',color:'silver',fontSize:wp('3%')}}>{Data.email}</Text>
                <Text style={{height:hp('4%'),textAlign:'left',color:'silver',fontSize:wp('3%')}}>{Data.job_title}  </Text>
               {/* omar edit */}
                {/* <View style={{marginTop:hp('1%'),alignItems:'center',flexDirection:'row',width:wp('30%'),height:hp('4%')}}>
                  <Icon name='book' size={30} color={'silver'}/>
                  <Text style={{textAlign:'left',color:'silver',fontSize:wp('4%')}}>   {Data.courses_count}  </Text>
                  <Icon name='star' size={30} color={'silver'}/>
                  <Text style={{textAlign:'left',color:'silver',fontSize:wp('4%')}}> {Data.average_rate}  </Text>
                </View> */}
              </View>
          </TouchableOpacity>
        );
    }
}

export default CoachItem;
const styles = StyleSheet.create({
  BackArrow:{tintColor:'black',width:wp('5%'),height:hp('3.5%')},
  BackArrow1:{tintColor:'black',resizeMode:'contain',width:wp('5%'),height:hp('3.5%')},
    spcifiybtn:{justifyContent:'center',alignSelf:'center',alignItems:'center',borderRadius:wp('2%'),borderWidth:wp('0%'),backgroundColor:'#4D75B8',width:wp('52%'),height:hp('5.5%')},
    spcifiybtnOutLine:{justifyContent:'center',alignSelf:'center',alignItems:'center',borderRadius:wp('2%'),borderWidth:wp('0.5%'),borderColor:'#4D75B8',backgroundColor:'transparent',width:wp('52%'),height:hp('5.5%')},
});
