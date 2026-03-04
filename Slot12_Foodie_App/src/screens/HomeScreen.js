import React, { useState, useContext } from 'react';
import { View, FlatList } from 'react-native';

import { RecipeContext } from '../context/RecipeContext';
import RecipeCard from '../components/RecipeCard';
import CategoryBar from '../components/CategoryBar';

export default function HomeScreen({ navigation }) {

  const { recipes, favorites } =
    useContext(RecipeContext);

  const [selected, setSelected] =
    useState('All');

  const filteredData = () => {
    if (selected === 'Favorites')
      return favorites;

    if (selected === 'My Food')
      return recipes.filter(r => r.isMyFood);

    return recipes;
  };

  return (
    <View style={{ flex: 1 }}>

      <CategoryBar
        selected={selected}
        setSelected={setSelected}
      />

      <FlatList
        data={filteredData()}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <RecipeCard
            recipe={item}
            onPress={() =>
              navigation.navigate('Details', { recipe: item })
            }
          />
        )}
      />

    </View>
  );
}