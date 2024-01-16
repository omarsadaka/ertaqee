import React, {Component} from 'react';
import {ActivityIndicator,FlatList,Text,View,TouchableOpacity,StyleSheet,Alert,ScrollView,Dimensions,Image,I18nManager} from 'react-native';
const ScreenHeight=Dimensions.get('window').height;
import CoachItem from './Items/CoachItem';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import strings from '../strings';

class CoachesScroll extends Component{

  constructor(props) {
          super(props);
          this.state = {
            page: 1,
            data: [],
            isLoading: false,
            isRefreshing: false,
          }
        }

componentDidMount(){
    this.loaddata();
}

        loaddata = () => {
                 const { data, page } = this.state;
                 this.setState({ isLoading: true });
                 console.log('page:'+page);
                 fetch('https://www.demo.ertaqee.com/api/v1/trainers'+'?page='+this.state.page, {
                 method: 'GET',
                 headers: {
                   Accept: 'application/json',
                   'Content-Type': 'application/json'
                 },
                 })
                 .then(res => res.json())
                 .then(res => {
                   if(res.data.trainers.length==0)
                       this.setState({isRefreshing:false,isLoading:false})
                   else if(res.success)
                   {
                     console.log('res.data.trainers:'+JSON.stringify(res.data.trainers));
                     this.setState({
                     data: page === 1 ? res.data.trainers : [...data, ...res.data.trainers],
                     isRefreshing: false,
                     isLoading:false
                   })}
                   else
                    console.log('errrore');
                 })
                 .catch(err => {
                   console.error(err);
                 });
           };

         handleRefresh = () => {
         };

         handleLoadMore = () => {
           this.setState({
             page: this.state.page + 1
           }, () => {
             this.loaddata();
           });
         }

           Loader(){
             if(this.state.isLoading)
               {
                 console.log('Loading');
                 return (<View style={{justifyContent:'center',alignItems:'center',position:'absolute',width:wp('100%'),bottom:hp('17%')}}><ActivityIndicator size="large" color="#37A0F7" /></View>)
               }
               return;
             }


      ListOfMainCatItems = () => {
          return this.props.Items;
        }

        NavToDetails(){
          this.props.navigation.navigate('CoachDetails')
        }

        CoachItem(item){
              return(
                <View>
                  {<CoachItem item={item} navigation={this.props.navigation}/>}
                </View>
              )
          }

  render(){
    const { data, isRefreshing } = this.state;
    return (
      <View style={[styles.promotionsbox,{height: hp('90%')}]}>
        {
           data &&
          <View style={{height:hp('80%')}}>
              <FlatList
                style={[styles.promotionsbox,{alignSelf:'center',width:wp('95%')}]}
                data={data}
                renderItem={({item}) => (
                  this.CoachItem(item)
                )}
                keyExtractor={i => i.id}
                refreshing={isRefreshing}
                onEndReached={this.handleLoadMore}
                onEndThreshold={0}
                showsVerticalScrollIndicator={false}
              />
          </View>
        }
        {this.Loader()}
      </View>
    );
  }

}

const styles = StyleSheet.create({
  contentContainerStyle:{
        flexDirection: 'row',
        flexWrap: 'wrap'
  },
  promotionsbox:{
    marginTop:hp('1'),
    width:wp('100%')
 },promotionsboxHor:{
   marginTop:hp('1'),
   height: hp('30%'),
   width:wp('97.5%'),alignSelf:'flex-end'
}
});

export { CoachesScroll };
