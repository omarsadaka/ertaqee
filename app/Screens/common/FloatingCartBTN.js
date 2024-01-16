import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Bag from '../../res/bag.svg';

class FloatingCartBTN extends Component {
  render() {
    let CartItemsNo = this.props.cartCount; // UserProfile.getInstance().CartNo;
    // if (CartItemsNo == 0) return <View />;

    return (
      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('MyCart')}
        style={styles.FloatingBTN}>
        <Bag style={styles.BackArrow} />
        {CartItemsNo > 0 ? (
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('MyCart')}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              left: 14,
              top: 18,
              backgroundColor: 'red',
              width: 20,
              height: 20,
              borderRadius: 20 / 2,
            }}>
            <Text
              numberOfLines={1}
              style={{textAlign: 'center', fontSize: hp('1%'), color: 'white'}}>
              {CartItemsNo}
            </Text>
          </TouchableOpacity>
        ) : null}
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  BackArrow: {resizeMode: 'contain', alignSelf: 'center'},
  FloatingBTN: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    width: 70,
    height: 70,
    borderRadius: 35,
    position: 'absolute',
    bottom: 90,
    right: 30,
    zIndex: 10000,
  },
});

export { FloatingCartBTN };

