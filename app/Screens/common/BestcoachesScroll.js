import React, { Component } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import fonts from '../../fonts';
import strings from '../strings';

class BestCoachesScroll extends Component {
  constructor(props) {
    super(props);
    this.state = {
      RecentPro: [],
    };
  }

  ListOfMainCatItems = () => {
    return this.props.Items;
  };

  NavCoaches() {
    this.props.navigation.navigate('Coaches');
  }

  scrollToEnd() {
    this.carousel.scrollTo({x: 0, animated: false});
  }

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
          <Text
            style={{
              color: 'black',
              fontSize: hp('2%'),
              fontFamily: fonts.normal,
            }}>
            {this.props.Title ? this.props.Title : strings.topTrainers}
          </Text>
          <TouchableOpacity onPress={() => this.NavCoaches()}>
            <Text
              style={{
                fontSize: hp('1.8%'),
                color: 'silver',
                fontFamily: fonts.normal,
              }}>
              {this.props.ViewAll ? this.props.ViewAll : strings.seeAll}
            </Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          style={styles.HorListView}
          horizontal
          ref={it => {
            this.carousel = it;
          }}
          onContentSizeChange={() => this.scrollToEnd()}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.contentContainerStyle}>
          {this.ListOfMainCatItems()}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  contentContainerStyle: {
    flexDirection: 'row',
  },
  promotionsbox: {
    height: hp('23%'),
    width: wp('97.5%'),
    alignSelf: 'flex-end',
  },
  HorListView: {transform: [{scaleX: -1}]},
});

export default BestCoachesScroll;
