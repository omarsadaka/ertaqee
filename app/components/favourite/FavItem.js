import React from 'react';
import {TouchableOpacity, Text, StyleSheet, View, Image, Share, Alert} from 'react-native';
import {Icon} from 'react-native-elements';
import strings from '../../Screens/strings';
import UserProfile from '../../UserProfile';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
// import Share from "react-native-share";

const FavItem = ({
    loadData,
    onPress,
    id ,
    title,
    quantity,
    course_field,
    cost,
    number_of_attendees,
    image,
    is_favorited,
    model_type
    }) => {
    let userType = UserProfile.getInstance().clientObj.user.role[0]

   const AddToFav=(type)=>{
      let FavUrl=''
      if(type=='Course') FavUrl = "https://www.demo.ertaqee.com/api/v1/courses/"+id+"/favorite?user_id="+UserProfile.getInstance().clientObj.user.id;
       else FavUrl = "https://www.demo.ertaqee.com/api/v1/halls/"+id+"/favorite?user_id="+UserProfile.getInstance().clientObj.user.id;

      console.log('FavUrl:'+FavUrl);
      try{
          fetch(FavUrl, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            Authorization: 'Bearer ' + UserProfile.getInstance().clientObj.token,
            },
          }).then((response) => {
            response.json().then((responseJson) => {
              console.log('Success:'+JSON.stringify(responseJson));
              loadData()
            })
            .catch((error) => {
              console.log('Thirderr:'+error);
            });
          })
        }catch(error){
          console.log('FourthErr:'+error);
        }
    
    }
    
    const onShare=(Title,IMG)=>{
      console.log('IMG:'+IMG);
      const shareOptions = {
             title: 'مشاركة',
             message: 'دورة '+ Title +' مقدمة من تطبيق ارتقي',
             url:'http://play.google.com/store/apps/details?id=com.fudex.ertaqee'
           };
      Share.open(shareOptions);
    }

   const share = async(Title) => {
      const options={
        message: `مشاركة ${`\n\n`} دورة ${Title} مقدمة من تطبيق ارتقي ${`\n\n`} ${'http://play.google.com/store/apps/details?id=com.fudex.ertaqee'}`,
      }
      const response= await Share.share(options)
    }; 

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.8}
      onPress={onPress}>
        <View style={{width:wp('62%'),height:hp('23%')}}>
                  <Text style={{textAlign:'left',color:'silver',fontSize:wp('4%'),marginTop:hp('3%'),marginLeft:wp('2%')}}>{title} </Text>
                  {quantity?
                    <Text style={{textAlign:'left',color:'silver',fontSize:wp('4%'),marginTop:hp('1%'),marginLeft:wp('2%')}}>{strings.student_num} {quantity} </Text>
                  :
                  null
                  }
                  <Text style={{textAlign:'left',color:'black',fontSize:wp('4.5%'),marginLeft:wp('2%')}}>{course_field?course_field:(strings.noMajor)} </Text>
                  <View style={{flexDirection:'row',justifyContent:'space-between',width:wp('52%'),height:hp('4%')}}>
                    <Text style={{textAlign:'left',color:'#4D75B8',width:wp('35%'),fontSize:wp('4%'),marginHorizontal:wp('2%')}}>{cost}{strings.SAR} </Text>
                  </View>
                  {number_of_attendees>=0?<Text style={{color:'#4D75B8',fontSize:wp('4%'),marginBottom:5}}> {strings.number_of_attendees} {number_of_attendees} </Text>:null}
                  
                  {userType=='User' || userType=='Company'?
                  <View style={styles.spcifiybtn}>
                    <Text style={{color:'#fff',fontSize:wp('4%')}}>{strings.bookingNow}</Text>
                  </View>
                  :null }
                  
              </View>


              <View style={{alignItems:'center',width:wp('28%'),height:hp('23%')}}>
                <Image style={{resizeMode:'contain',width:wp('23%'),marginTop:hp('2%'),height:hp('11%')}} source={{uri:image}} />
                <View style={{justifyContent:'space-between',marginTop:hp('4%'),flexDirection:'row',width:wp('15%'),height:hp('4%')}}>
                  {/* <TouchableOpacity onPress={()=> AddToFav(model_type)}>
                    <Icon name={is_favorited?'bookmark':'bookmark-border'} color={is_favorited?'gold':'black'} style={styles.BackArrow}/>
                  </TouchableOpacity> */}
                  <TouchableOpacity onPress={()=> share(title,image)}>
                    <Icon name={'share'} color={'black'} style={styles.BackArrow}/>
                  </TouchableOpacity>
                </View>
              </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container:{flexDirection:'row',backgroundColor:'white',margin:wp('2%'),width:wp('90%'),height:hp('27%')},
  BackArrow:{margin:wp('1%'),tintColor:'black',width:wp('7%'),height:hp('3.5%')},
  BackArrow1:{tintColor:'black',resizeMode:'contain',width:wp('5%'),height:hp('3.5%')},
    spcifiybtn:{justifyContent:'center',alignSelf:'center',alignItems:'center',borderRadius:wp('2%'),borderWidth:wp('0%'),backgroundColor:'#4D75B8',width:wp('52%'),height:hp('5.5%')},
    spcifiybtnOutLine:{justifyContent:'center',alignSelf:'center',alignItems:'center',borderRadius:wp('2%'),borderWidth:wp('0.5%'),borderColor:'#4D75B8',backgroundColor:'transparent',width:wp('52%'),height:hp('5.5%')},
});

export default FavItem;
