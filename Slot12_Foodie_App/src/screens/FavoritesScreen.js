import React, { useContext } from 'react';
import { View, FlatList } from 'react-native';
import RecipeCard from '../components/RecipeCard';
import { RecipeContext } from '../context/RecipeContext';

export default function FavoritesScreen({ navigation }) {
  const { favorites } = useContext(RecipeContext);

  return (
    <FlatList
      data={favorites}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <RecipeCard
          recipe={item}
          onPress={() =>
            navigation.navigate('Details', { recipe: item })}
        />
      )}
    />
  );
}