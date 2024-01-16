/* eslint-disable prettier/prettier */
import React from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import TraineeItem from './TraineeItem';

const TraineesList = ({items, onPress,onDelete, onEdit}) => {

  const renderItem = ({item}) => {
    return (
      <TraineeItem
        id={item.key}
        {...item}
        onPress={() => onPress(item)}
        onDelete={() => onDelete(item)}
        onEdit={() => onEdit(item)}
      />
    );
  };

  return (
    <View >
      <FlatList
        showsVerticalScrollIndicator={false}
        data={items}
        style={{alignSelf: 'center', height: '88%'}}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({});

export default TraineesList;
