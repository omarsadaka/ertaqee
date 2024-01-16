import React, { Component } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-elements';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import UserProfile from '../../UserProfile';
import fonts from '../../fonts';
import strings from '../strings';

class SideMenu extends Component {
  UserNameAndIMG() {
    return (
      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('Profile')}
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
          marginTop: hp('7%'),
          width: wp('65%'),
          height: hp('10%'),
        }}>
        <Image
          style={styles.profileIMG}
          source={{uri: UserProfile.getInstance().clientObj.user.photo}}
        />
        <Image
          style={styles.BackArrow}
          source={require('../../res/badge.png')}
        />
        <View
          style={{
            justifyContent: 'center',
            width: wp('47%'),
            height: hp('8%'),
          }}>
          <Text
            style={{textAlign: 'left', fontSize: hp('2.7%'), color: '#4D75B8'}}>
            {' '}
            {UserProfile.getInstance().clientObj.user.username}
          </Text>
          <Text
            style={{textAlign: 'left', fontSize: hp('1.7%'), color: 'silver'}}>
            {' '}
            {UserProfile.getInstance().clientObj.user.email}{' '}
          </Text>
          <Text
            style={{textAlign: 'left', fontSize: hp('1.7%'), color: 'silver'}}>
            {' '}
            {UserProfile.getInstance().clientObj.user.code}{' '}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  NavToThis(NavMenu, SubData, Title) {
    console.log('NavMenu:' + NavMenu);
    if (NavMenu == 'NewCourses')
      this.props.navigation.navigate('NewCourses', {
        Title: SubData ? SubData : strings.addedCourses,
        IsMiddleTitle: SubData ? SubData : strings.courses,
        ShowFloatingBTN: false,
        ShowBottomMenu: true,
        Filter: false,
      });
    else if (NavMenu == 'TrainingCenters')
      this.props.navigation.navigate('TrainingCenters', {
        Title: Title,
        SubTitle: SubData,
        NavTitle: SubData === strings.trainingCenters ? 'centers' : 'halls',
      });
    else if (NavMenu == 'MoreOptions') {
      this.props.navigation.navigate('MoreOptions', {
        CurrentMenu: SubData ? 1 : -1,
        IsAsk: SubData,
      });
    } else this.props.navigation.navigate(NavMenu);
  }

  SideItem(Title, IMG, NavMenu, SubData, ItemsTitle) {
    return (
      <TouchableOpacity
        onPress={() => this.NavToThis(NavMenu, SubData, ItemsTitle)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: hp('0.25%'),
          width: wp('65%'),
          height: hp('7%'),
        }}>
        <Image source={IMG} />
        <Text
          style={{
            fontSize: wp('3.5%'),
            color: '#25252A',
            fontFamily: fonts.normal,
          }}>
          {' '}
          {Title}
        </Text>
      </TouchableOpacity>
    );
  }

  SideItemWithArrow(Title, IMG, NavMenu) {
    let IsAR = UserProfile.getInstance().Lang === 'ar';
    return (
      <TouchableOpacity
        onPress={() => this.NavToThis(NavMenu, false)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: hp('0.25%'),
          width: wp('65%'),
          height: hp('7%'),
        }}>
        <Image source={IMG} />
        <Text
          style={{
            fontSize: hp('2.1%'),
            color: '#25252A',
            fontFamily: fonts.normal,
          }}>
          {' '}
          {Title}
        </Text>
        <Icon
          name={IsAR ? 'keyboard-arrow-left' : 'keyboard-arrow-right'}
          size={33}
          style={{marginLeft: wp('20%')}}
          color={'#25252A'}
        />
      </TouchableOpacity>
    );
  }

  MenuItems() {
    let IsHallProvider = UserProfile.getInstance().IsHallProvider();
    let userRole = UserProfile.getInstance().clientObj.user.role[0];

    if (IsHallProvider)
      return (
        <View>
          {this.SideItem(
            strings.halls,
            require('../../res/teacher.png'),
            'TrainingCenters',
            strings.halls,
            strings.halls,
          )}
          {/* omar edit */}
          {this.SideItem(
            strings.changeLang,
            require('../../res/lang.png'),
            'ChangeLanguage',
          )}

          {userRole !== 'Guest'
            ? this.SideItem(
                strings.reservations,
                require('../../res/list1.png'),
                'Reservations',
              )
            : null}

          {this.SideItemWithArrow(
            strings.moreOptions,
            require('../../res/menu.png'),
            'MoreOptions',
          )}
        </View>
      );
    return (
      <View>
        {userRole === 'Company' &&
          this.SideItem(
            strings.trainees,
            require('../../res/seminar.png'),
            'Trainees',
          )}
        {this.SideItem(
          strings.courses,
          require('../../res/seminar.png'),
          'NewCourses',
        )}
        {userRole !== 'Center' &&
          userRole !== 'Trainer' &&
          this.SideItem(
            strings.specifywhatyouneed,
            require('../../res/seminar.png'),
            'CourseRequest',
          )}
        {this.SideItem(
          strings.trainingCenters,
          require('../../res/college.png'),
          'TrainingCenters',
          strings.trainingCenters,
          strings.trainingCenters,
        )}
        {userRole !== 'Trainer' &&
          this.SideItem(
            strings.halls,
            require('../../res/teacher.png'),
            'TrainingCenters',
            strings.halls,
            strings.halls,
          )}
        {/*this.SideItem('الخدمات',require('../../res/seminar.png'),'NewCourses','الخدمات')*/}
        {/* omar edit */}
        {/* <TouchableOpacity onPress={()=>this.NavToServices()} style={styles.footertab}>
            <Icon name='person' size={22} style={[styles.imgtab,{height:hp('2.25%')}]} color={'#5B739F'}/>
            <Text style={styles.tabtxt}>{strings.trainers}</Text>
          </TouchableOpacity> */}

        {this.SideItem(
          strings.trainers,
          require('../../res/brain.png'),
          'Coaches',
          'Coaches',
        )}

        {this.SideItem(
          strings.changeLang,
          require('../../res/lang.png'),
          'ChangeLanguage',
        )}

        {this.SideItem(
          strings.reservations,
          require('../../res/list1.png'),
          'Reservations',
        )}

        {/*this.SideItem(strings.subs,require('../../res/category.png'),'Subs')*/}
        {/*this.SideItem(strings.Ads,require('../../res/adicon.png'),'Ads')*/}
        {/*this.SideItem(strings.joinRequests,require('../../res/seminar.png'),'JoinRequests')*/}
        {this.SideItemWithArrow(
          strings.moreOptions,
          require('../../res/menu.png'),
          'MoreOptions',
        )}
      </View>
    );
  }

  render() {
    return (
      <View style={{backgroundColor: '#B7B7B8', flex: 1, flexDirection: 'row'}}>
        <View
          style={{
            alignItems: 'center',
            backgroundColor: '#FFFFFF',
            width: wp('72.5%'),
            height: hp('100%'),
          }}>
          <Image
            style={styles.BackGroundLogo}
            source={require('../../res/backgroundlogo.png')}
          />
          {this.UserNameAndIMG()}
          <View
            style={{
              alignItems: 'center',
              marginTop: hp('5%'),
              width: wp('72.5%'),
              height: hp('70%'),
            }}>
            {this.MenuItems()}
          </View>
        </View>
        <TouchableOpacity
          style={{width: wp('26.5%')}}
          onPress={() => this.props.navigation.goBack()}></TouchableOpacity>
      </View>
    );
  }
}

export default SideMenu;
const styles = StyleSheet.create({
  profileIMG: {width: 70, height: 70, borderRadius: 70 / 2},
  BackArrow: {
    position: 'absolute',
    bottom: 0,
    left: wp('-8%'),
    resizeMode: 'contain',
    width: wp('25%'),
    height: hp('4%'),
  },
  BackGroundLogo: {
    position: 'absolute',
    right: wp('-3%'),
    resizeMode: 'contain',
    width: wp('50%'),
    height: hp('25%'),
  },
});
