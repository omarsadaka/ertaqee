import React, { Component } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
const ScreenHeight = Dimensions.get('window').height;

class BestCoachesCirclesScroll extends Component {
  constructor(props) {
    super(props);
    this.state = {
      RecentPro: [],
    };
  }

  ListOfMainCatItems = () => {
    return this.props.Items;
  };

  render() {
    return (
      <View style={styles.promotionsbox}>
        <View
          style={{
            alignSelf: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: wp('90%'),
            height: hp('5%'),
          }}>
          <Text style={{color: 'black', fontSize: hp('3%')}}>
            {this.props.Title}
          </Text>
          <Text style={{fontSize: hp('2%'), color: 'silver'}}></Text>
        </View>
        <ScrollView
          style={styles.HorListView}
          horizontal={true}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}>
          {this.ListOfMainCatItems()}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  promotionsbox: {
    marginTop: hp('1'),
    height: hp('20%'),
    width: wp('97.5%'),
  },
  HorListView: {
    flexDirection: 'row',
    transform: [{scaleX: -1}],
  },
});

export default BestCoachesCirclesScroll;
