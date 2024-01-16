import React, { Component } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import UserProfile from '../../UserProfile';
import fonts from '../../fonts';
import strings from '../strings';
import TrainingCentersScrollItem from './Items/TrainingCentersScrollItem';
const ScreenHeight = Dimensions.get('window').height;

class TrainingCentersScroll extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      data: [],
      isLoading: false,
      isRefreshing: false,
      ScrollingDir: true,
    };
  }

  componentDidMount() {
    console.log('this.props.API: cccc' + this.props.API);
    if (this.props.API) this.loaddata(false);
  }

  loaddata = isLoadMore => {
    let IsHallProvider = UserProfile.getInstance().IsHallProvider();
    const {data, page} = this.state;
    this.setState({isLoading: true});
    console.log('page:' + page);
    let url = IsHallProvider
      ? 'https://www.demo.ertaqee.com/api/v1/created_active_halls/' +
        UserProfile.getInstance().clientObj.user.id +
        '?page=' +
        this.state.page
      : this.props.isFilter
      ? this.props.API +
        '&user_id=' +
        UserProfile.getInstance().clientObj.user.id +
        '&page=' +
        this.state.page
      : this.props.API +
        '?user_id=' +
        UserProfile.getInstance().clientObj.user.id +
        '&page=' +
        this.state.page;
    console.log('this.props.API', url);
    fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(res => {
        console.log('trainningcenter ', res);
        if (
          this.props.HallOrCenter
            ? res.data.halls.length == 0
            : res.data.centers.length == 0
        ) {
          this.setState({isRefreshing: false, isLoading: false});
          if (!isLoadMore) {
            Alert.alert(strings.alert, strings.noDataToShow, [
              {
                text: strings.cancel,
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              {text: strings.ok, onPress: () => console.log('OK Pressed')},
            ]);
          }
        } else if (res.success) {
          this.setState({
            data: this.props.HallOrCenter
              ? page === 1
                ? res.data.halls
                : [...data, ...res.data.halls]
              : page === 1
              ? res.data.centers
              : [...data, ...res.data.centers],
            isRefreshing: false,
            isLoading: false,
          });
        } else console.log('errrore');
      })
      .catch(err => {
        console.error(err);
      });
  };

  handleRefresh = () => {};

  handleLoadMore = () => {
    this.setState(
      {
        page: this.state.page + 1,
      },
      () => {
        this.loaddata(true);
      },
    );
  };

  Loader() {
    if (this.state.isLoading) {
      return (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            width: wp('100%'),
            bottom: hp('17%'),
          }}>
          <ActivityIndicator size="large" color="#37A0F7" />
        </View>
      );
    }
    return;
  }

  TrainingCentersScrollItemItem(item) {
    return (
      <View>
        {
          <TrainingCentersScrollItem
            key={item.id}
            HallOrCenter={this.props.HallOrCenter}
            item={item}
            Title={this.props.Title}
            navigation={this.props.navigation}
          />
        }
      </View>
    );
  }

  ListOfMainCatItems = () => {
    let Items = [];
    for (const element of this.props.data) {
      let item = element;
      Items.push(
        <TrainingCentersScrollItem
          key={item.id}
          HallOrCenter={this.props.HallOrCenter}
          item={item}
          Title={this.props.Title}
          navigation={this.props.navigation}
        />,
      );
    }
    Items.push(<View style={{height: hp('17%')}} />);
    return Items;
  };

  Loader() {
    if (this.state.isLoading) {
      console.log('Loading');
      return (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            width: wp('100%'),
            bottom: hp('17%'),
          }}>
          <ActivityIndicator size="large" color="#37A0F7" />
        </View>
      );
    }
    return;
  }

  _onScroll = event => {
    const currentOffset = event.nativeEvent.contentOffset.y;
    const dif = currentOffset - (this.offset || 0);
    const {ScrollingDir} = this.state;
    if (Math.abs(dif) < 3) return;
    if (dif < 0) {
      if (ScrollingDir == false) {
        console.log('1');
        this.setState({ScrollingDir: true});
        this.props._onScroll(true);
      }
      this.offset = currentOffset;
      return;
    } else if (ScrollingDir == true && this.offset > 0) {
      console.log('2');
      this.setState({ScrollingDir: false});
      this.props._onScroll(false);
    }
    this.offset = currentOffset;
  };

  render() {
    const {data, isRefreshing} = this.state;
    return (
      <View style={styles.promotionsbox}>
        <View
          style={{
            alignSelf: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
            flex: 1,
            backgroundColor: 'red',
          }}>
          <Text
            style={{
              color: 'black',
              fontSize: hp('2%'),
              fontFamily: fonts.normal,
            }}>
            {this.props.SubTitle}
          </Text>
          <View>
            <Text style={{fontSize: hp('2%'), color: 'silver'}}></Text>
          </View>
        </View>
        {this.props.API && data && (
            <FlatList
              overScrollMode="never"
              removeClippedSubviews={true}
              onScroll={event => this._onScroll(event)}
              style={[
                styles.promotionsbox,
                {alignSelf: 'center', width: wp('95%')},
              ]}
              data={data}
              renderItem={({item}) => this.TrainingCentersScrollItemItem(item)}
              keyExtractor={i => i.id}
              refreshing={isRefreshing}
              onEndReached={this.handleLoadMore}
              onEndThreshold={0}
              showsVerticalScrollIndicator={false}
            />
        )}
        {!this.props.API && (
          <ScrollView
            overScrollMode="never"
            removeClippedSubviews={true}
            contentContainerStyle={{alignItems: 'center'}}
            style={styles.promotionsbox}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}>
            {this.ListOfMainCatItems()}
          </ScrollView>
        )}
        {this.Loader()}
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
    // height: hp('28%'),
    // width: wp('100%'),
    // flex: 1,
    // backgroundColor: 'red',
  },
});

export { TrainingCentersScroll };

