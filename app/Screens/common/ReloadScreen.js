import React, { Component } from 'react';
import { StyleSheet,ActivityIndicator,TouchableOpacity,ToastAndroid,ImageBackground,ScrollView,View,Dimensions,Alert,Image,I18nManager,TextInput,BackHandler,StatusBar } from 'react-native';
const ScreenWidth=Dimensions.get('window').width;
import strings from '../strings';
import { Text } from 'react-native';
import fonts from '../../fonts';

class ReloadScreen extends Component {


    render() {
      if(this.props.ShowReloadBTN===true)
       return(
         <View style={styles.MainView}>
          <TouchableOpacity onPress={()=>this.props.ReloadBTN()} style={styles.BTNStyle}>
            <Text style={styles.TxtStyle}>{strings.reload}</Text>
          </TouchableOpacity>
       </View>)

       return(<View/>)
    }
  }

  const styles = StyleSheet.create({
    MainView:{justifyContent:'center',alignItems:'center',flex:1},
    BTNStyle:{justifyContent:'center',
    alignItems:'center',borderRadius:ScreenWidth*.015,backgroundColor:'#4696E5',width:'35%',height:'8%',alignSelf:'center',justifyContent:'center'},
    TxtStyle:{color:'white',fontSize:ScreenWidth*.045,fontFamily:fonts.normal}
  });

export {ReloadScreen};
