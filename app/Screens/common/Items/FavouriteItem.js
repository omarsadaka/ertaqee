
import React, { Component } from "react";
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Share
} from "react-native";
import { Icon } from 'react-native-elements';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
// import Share from "react-native-share";
import UserProfile from '../../../UserProfile';
import strings from '../../strings';

class FavouriteItem extends Component {

  constructor(props) {
          super(props);
          this.state = {
            Data:''
          }
        }


componentWillMount(){
  // alert(UserProfile.getInstance().clientObj.user.role[0])
  try {
    this.setState({Data:this.props.item})
  }catch(e){
  }
}

AddToFav(){
  let Data = this.state.Data;
  Data.is_favorited = !Data.is_favorited;
  this.setState({Data:Data})
  let FavUrl = "https://www.demo.ertaqee.com/api/v1/courses/"+Data.id+"/favorite?user_id="+UserProfile.getInstance().clientObj.user.id;
  console.log('FavUrl:'+FavUrl);
  try{
      fetch(FavUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json'
        },
      }).then((response) => {
        this.setState({loading:false});
        response.json().then((responseJson) => {
          console.log('Success:'+JSON.stringify(responseJson));

        })
        .catch((error) => {
          console.log('Thirderr:'+error);
        });
      })
    }catch(error){
      console.log('FourthErr:'+error);
    }

}

Share(Title,IMG){
  console.log('IMG:'+IMG);
  const shareOptions = {
         title: 'مشاركة',
         message: 'دورة '+ Title +' مقدمة من تطبيق ارتقي',
         url:'http://play.google.com/store/apps/details?id=com.fudex.ertaqee'
       };
       Share.open(shareOptions);
}


share = async(Title) => {
  const options={
    message: `مشاركة ${`\n\n`} دورة ${Title} مقدمة من تطبيق ارتقي ${`\n\n`} ${'http://play.google.com/store/apps/details?id=com.fudex.ertaqee'}`,
  }
  const response= await Share.share(options)
}; 

    render() {
      const {Data} = this.state;
      console.log('asd', Data)
      let userType = UserProfile.getInstance().clientObj.user.role[0]
        return (
            <TouchableOpacity
            //  onPress={()=> this.props.navigation.navigate('HallDetails',{
            //   CourseID:Data.id,
            //   IsFav: Data.is_favorited
            // })} 
            style={{flexDirection:'row',backgroundColor:'white',margin:wp('2%'),width:wp('90%'),height:hp(!this.props.CartItem?'27%':'18%')}}>
              {this.props.ShowOverLay&& <View style={{position:'absolute',width:wp('90%'),height:hp('23%'),backgroundColor:'black',opacity:0.075}}/>}
              <View style={{width:wp('62%'),height:hp('23%')}}>
                  <Text style={{textAlign:'left',color:'silver',fontSize:wp('4%'),marginTop:hp('3%'),marginLeft:wp('2%')}}>{Data&&Data.title} </Text>
                  <Text style={{textAlign:'left',color:'black',fontSize:wp('4.5%'),marginLeft:wp('2%')}}>{Data&&Data.course_field?Data.course_field.title:(strings.noMajor)} </Text>
                  <View style={{flexDirection:'row',justifyContent:'space-between',width:wp('52%'),height:hp('4%')}}>
                    <Text style={{textAlign:'left',color:'#4D75B8',width:wp('35%'),fontSize:wp('4%'),marginHorizontal:wp('2%')}}>{Data&&Data.cost}{strings.SAR} </Text>
                   
                  </View>
                  
                  
                  {!this.props.CartItem&&<View style={this.props.OutlineBTN?(styles.spcifiybtnOutLine):(styles.spcifiybtn)}>
                    <Text style={{color:this.props.OutlineBTN?'#4D75B8':'white',fontSize:wp('4%')}}>{this.props.COA?(this.props.COA):(strings.bookingNow)}</Text>
                  </View>}
              </View>


              <View style={{alignItems:'center',marginTop: hp('2%')}}>
              {
                Data&&Data.image!=null?(<Image style={{resizeMode:'contain',width:wp('25%'),marginTop:hp('3%'),height:hp('11%')}} source={{uri:Data.image}} />)
                :(<Image style={{resizeMode:'contain',width:wp('23%'),height:hp('13%')}} source={require('../../../res/newcoursesimg.png')} />)
              }

                <View style={{justifyContent:'space-between',marginTop:hp('4%'),flexDirection:'row',width:wp('15%'),height:hp('4%')}}>
                  <TouchableOpacity onPress={()=>this.AddToFav()}>
                  {
                    <Icon name={Data&&Data.is_favorited?'bookmark':'bookmark-border'} color={Data&&Data.is_favorited?'gold':'black'} style={styles.BackArrow}/>
                  }
                </TouchableOpacity>
                
                  <TouchableOpacity onPress={()=>this.share(Data.course_field.title_ar,Data.image)}>
                    <Icon name={'share'} color={'black'} style={styles.BackArrow}/>
                  </TouchableOpacity>
                </View>
              </View>
          </TouchableOpacity>
        );
    }
}

export default FavouriteItem;

const styles = StyleSheet.create({
  BackArrow:{margin:wp('1%'),tintColor:'black',width:wp('7%'),height:hp('3.5%')},
  BackArrow1:{tintColor:'black',resizeMode:'contain',width:wp('5%'),height:hp('3.5%')},
    spcifiybtn:{justifyContent:'center',alignSelf:'center',alignItems:'center',borderRadius:wp('2%'),borderWidth:wp('0%'),backgroundColor:'#4D75B8',width:wp('52%'),height:hp('5.5%')},
    spcifiybtnOutLine:{justifyContent:'center',alignSelf:'center',alignItems:'center',borderRadius:wp('2%'),borderWidth:wp('0.5%'),borderColor:'#4D75B8',backgroundColor:'transparent',width:wp('52%'),height:hp('5.5%')},
});
