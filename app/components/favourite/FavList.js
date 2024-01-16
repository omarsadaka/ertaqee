/* eslint-disable prettier/prettier */
import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import {
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import FavItem from './FavItem';

const FavList = ({items, loadData, onPress, onDelete, onEdit}) => {
  const renderItem = ({item}) => {
    return (
      <FavItem
        id={item.key}
        {...item}
        loadData={loadData}
        onPress={() => onPress(item)}
        onDelete={() => onDelete(item)}
        onEdit={() => onEdit(item)}
        model_type={item.model_type}
      />
    );
  };

  return (
    <FlatList
      showsVerticalScrollIndicator={false}
      data={items}
      style={{alignSelf: 'center', marginTop: '3%'}}
      contentContainerStyle={{paddingBottom: hp('20%')}}
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item, index) => item.id}
      renderItem={renderItem}
    />
  );
};

const styles = StyleSheet.create({});

export default FavList;
