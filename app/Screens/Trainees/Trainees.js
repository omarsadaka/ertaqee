import React, {useEffect, useState} from 'react';
import {View, Text, SafeAreaView} from 'react-native';
import strings from '../strings';
import {Header} from '../../components/common';
import {TraineesList} from '../../components/trainees';
import {Icon} from 'react-native-elements';
import {Dimensions} from '../../theme';
import UserProfile from '../../UserProfile';
import {ActivityIndicator} from 'react-native';

const Trainees = ({navigation}) => {
  const [trainees, setTrainees] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
      getAllTrainees();
  }, []);


  const getAllTrainees = async () => {
    setLoading(true);
    await fetch(
      `https://www.demo.ertaqee.com/api/v1/trainees/all?token=${
        UserProfile.getInstance().clientObj.token
      }`,
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',

        },
      },
    )
      .then((res) => res.json())
      .then((parsedRes) => {
        console.log('trainee',parsedRes.data )
        setTrainees(parsedRes.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const handelDeleteUser = async (id) => {
      console.log(UserProfile.getInstance().clientObj.token)
    await fetch(
      `https://www.demo.ertaqee.com/api/v1/trainee/delete/${id}`,
      {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body:JSON.stringify({
            token: UserProfile.getInstance().clientObj.token
        })
      },
    )
      .then((res) => res.json())
      .then((parsedRes) => {
        console.log(parsedRes);
        alert(parsedRes.message)
        setLoading(false);
        getAllTrainees();
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  return (
    <View style={{flex: 1}}>
      <SafeAreaView>
      <Header navigation={navigation} title={strings.trainees} />
      {loading && <ActivityIndicator color="#4D75B8" size="large" />}
      <TraineesList
        onPress={(item) => navigation.navigate('EditTrainee', {item})}
        onDelete={(item) => handelDeleteUser(item.id)}
        items={trainees}
        onEdit={(item)=> navigation.navigate('EditTrainee', {item})}
      />
      <Icon
        onPress={() => navigation.navigate('AddTrainee')}
        color="#4D75B8"
        name="ios-add-circle"
        size={Dimensions.DEVICE_HEIGHT * 0.08}
        type="ionicon"
        containerStyle={{position: 'absolute', bottom: 20, right: 10}}
      />
      </SafeAreaView>
    </View>
  );
};

export default Trainees;
