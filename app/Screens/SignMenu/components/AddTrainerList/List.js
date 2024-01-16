import React from 'react';
import {FlatList, StyleSheet} from 'react-native';
import Item from './Item';

const List = ({data, onPress}) => {
  const renderItem = ({item}) => {
    return (
      <Item
        {...item} onPress={onPress}
      />
    );
  };

  return (
    <FlatList
      data={data}
      showsVerticalScrollIndicator={false}
      keyExtractor={(item, index) => item.id}
      renderItem={renderItem}
    />
  );
};

const styles = StyleSheet.create({
 
});

export default List;
