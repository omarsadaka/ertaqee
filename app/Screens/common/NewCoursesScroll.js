import React, { Component } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Icon } from 'react-native-elements';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import UserProfile from '../../UserProfile';
import fonts from '../../fonts';
import strings from '../strings';
import NewCoursesItem from './Items/NewCoursesItem';
const ScreenHeight = Dimensions.get('window').height;

class NewCoursesScroll extends Component {
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
    console.log(
      'UserProfile.getInstance().clientObj.user',
      UserProfile.getInstance().clientObj.user,
    );
    try {
      console.log('this.props.Items:' + JSON.stringify(this.props.Items));
    } catch {}
    if (this.props.API) this.loadData(false);
    console.log(
      '🚀 ~ file: NewCoursesScroll.js:45 ~ NewCoursesScroll ~ componentDidMount ~ this.props.API:',
      this.props.API,
    );
  }

  loadData = isLoadMore => {
    console.log(
      '🚀 ~ file: NewCoursesScroll.js:52 ~ NewCoursesScroll ~ isLoadMore:',
      isLoadMore,
    );
    const {data, page} = this.state;
    console.log(
      '🚀 ~ file: NewCoursesScroll.js:57 ~ NewCoursesScroll ~ page:',
      page,
    );
    this.setState({isLoading: true});
    console.log('this.props.API:' + this.props.API);
    let PaginiationMark = '?';
    if (this.props.API.includes('keyword')) PaginiationMark = '&';
    let api =
      this.props.API +
      PaginiationMark +
      'page='+
      page +
      '&token=' +
      UserProfile.getInstance().clientObj.token +
      '&user_id=' +
      UserProfile.getInstance().clientObj.user.id;
    console.log('url:' + api);
    fetch(api, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        // Authorization: 'Bearer ' + UserProfile.getInstance().clientObj.token,
      },
    })
      .then(res => res.json())
      .then(res => {
        if (this.props.PaginationParm) {
          if (this.props.PaginationParm === 'favorites') {
            if (res.data.favorites.length == 0) {
              this.setState({isRefreshing: false, isLoading: false});
            } else if (res.success) {
              this.setState({
                data:
                  page === 1
                    ? res.data.favorites
                    : [...data, ...res.data.favorites],
                isRefreshing: false,
                isLoading: false,
              });
            }
          }
          return;
        }
        if (res?.data?.courses.length === 0) {
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
        } else {
          this.setState({
            data:
              page === 1 ? res?.data?.courses : [...data, ...res.data.courses],
            isRefreshing: false,
            isLoading: false,
          });
        }
      })
      .catch(err => {
        console.error(err);
      });
  };

  // handleRefresh = () => {
  //   this.setState(
  //     {
  //       page: 1,
  //     },
  //     () => {
  //       this.loadData(false);
  //     },
  //   );
  // };

  // handleLoadMore = () => {
  //   this.setState(
  //     {
  //       page: this.state.page + 1,
  //     },
  //     () => {
  //       this.loadData(true);
  //     },
  //   );
  // };

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

  ListOfMainCatItems = () => {
    return this.props.Items;
  };

  NavNewCourses() {
    if (!this.props.ViewAllNav) return;
    this.props.navigation.navigate('NewCourses', {
      Title: this.props.Title,
      IsMiddleTitle: this.props.IsMiddleTitle,
      ShowFloatingBTN: this.props.ShowFloatingBTN,
      ShowBottomMenu: this.props.ShowBottomMenu,
      Filter: this.props.Filter,
    });
  }

  NewCoursesItem(item) {
    return (
      <View>
        {
          <NewCoursesItem
            item={item}
            IsVer={true}
            IsFav={false}
            navigation={this.props.navigation}
            // CartItem={item}
          />
        }
      </View>
    );
  }

  _onScroll = event => {
    if (!this.props._onScroll) return;

    console.log('_onScroll');
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
    let userRole = UserProfile.getInstance().clientObj.user.role[0];
    return (
      <View
        style={[
          styles.promotionsbox,
          {height: hp(this.props.Height ? this.props.Height : '90%')},
        ]}>
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
              fontSize: wp('5%'),
              fontWeight: 'bold',
              marginVertical: 5,
            }}>
            {this.props.Title ? this.props.Title : ''}
          </Text>

          {this.props.ViewAddNew &&
          (userRole === 'Center' || userRole === 'Trainer') ? (
            // || userRole === 'Trainer'
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('CreateNew', {
                  Course: true,
                });
              }}>
              <Icon name={'add'} size={30} color={'#4D75B8'} />
            </TouchableOpacity>
          ) : null}
          {this.props.SubTitle || this.props.ViewAll ? (
            <TouchableOpacity onPress={() => this.NavNewCourses()}>
              <Text
                style={{
                  fontSize: hp('1.8%'),
                  fontFamily: fonts.normal,
                  color: this.props.SubTitleColor
                    ? this.props.SubTitleColor
                    : 'silver',
                }}>
                {this.props.SubTitle
                  ? this.props.SubTitle
                  : this.props.ViewAll
                  ? 'عرض الكل'
                  : ''}
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
        {this.props.API && data && (
          <FlatList
            removeClippedSubviews={true}
            contentContainerStyle={{paddingBottom: hp('20%')}}
            overScrollMode="never"
            onScroll={event => this._onScroll(event)}
            style={[
              styles.promotionsbox,
              {alignSelf: 'center', width: wp('95%')},
            ]}
            data={data}
            renderItem={({item}) => this.NewCoursesItem(item)}
            keyExtractor={i => i.id}
            refreshing={isRefreshing}
            onEndReached={this.handleLoadMore}
            onEndThreshold={0}
            showsVerticalScrollIndicator={false}
          />
        )}

        {!this.props.API && (
          <ScrollView
            removeClippedSubviews={true}
            overScrollMode="never"
            contentContainerStyle={
              this.props.IsVer ? {alignItems: 'center'} : {}
            }
            refreshControl={
              <RefreshControl
                refreshing={this.state.isRefreshing}
                onRefresh={() => this.handleRefresh()}
              />
            }
            style={
              this.props.IsVer ? styles.promotionsbox : styles.promotionsboxHor
            }
            horizontal={!this.props.IsVer}
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
    width: wp('100%'),
  },
  promotionsboxHor: {
    marginTop: hp('1'),
    height: hp('30%'),
    width: wp('97.5%'),
    alignSelf: 'flex-end',
  },
});

export { NewCoursesScroll };

