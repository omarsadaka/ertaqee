import React, { Component } from "react";
import { Animated, View, StyleSheet, Text,TouchableOpacity } from "react-native";

export default class Test extends Component {

  constructor(props) {
     super(props);
     this.state = {
       offsetX: new Animated.Value(0),
     }
   }

   hideOnboarding() {
     Animated.timing(
       this.state.offsetX,
       { toValue: -100 }
     ).start();
   }

   render() {
     return (
       <Animated.View style={{ transform: [{translateX: this.state.offsetX}] }}>
         <TouchableOpacity onPress={ () => { this.hideOnboarding() } }>
           <View>
             <Text >Enter Now</Text>
           </View>
         </TouchableOpacity>
       </Animated.View>
     );
   }
 }
