import React, { Component } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import fonts from '../../fonts';
import strings from '../strings';
import BestCenterItem from './Items/BestCenterItem';
const ScreenHeight = Dimensions.get('window').height;

class BestCentersHorScroll extends Component {
  constructor(props) {
    super(props);
    this.state = {
      RecentPro: [],
    };
  }

  ListOfMainCatItems = () => {
    let PassedItems = this.props.Items;
    let Items = [];
    for (let i = 0; i < PassedItems.length; i++)
      Items.push(
        <BestCenterItem
          key={i}
          Item={PassedItems[i]}
          navigation={this.props.navigation}
        />,
      );
    return Items;
  };

  GoToTrainingCenters() {
    this.props.navigation.navigate('TrainingCenters', {
      Title: this.props.Title,
      SubTitle: this.props.SubTitle,
      NavTitle: 'centers',
    });
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
            {strings.bestTrainingCenters}
          </Text>
          <TouchableOpacity onPress={() => this.GoToTrainingCenters()}>
            <Text
              style={{
                fontSize: hp('1.8%'),
                color: 'silver',
                fontFamily: fonts.normal,
              }}>
              {strings.seeAll}
            </Text>
          </TouchableOpacity>
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
  contentContainerStyle: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  promotionsbox: {
    marginTop: hp('1'),
    height: hp('23%'),
    width: wp('97.5%'),
    alignSelf: 'flex-end',
  },
  HorListView: {
    marginTop: hp('1%'),
  },
});

export { BestCentersHorScroll };

