import React, { useContext } from 'react';
import { View, FlatList, Button } from 'react-native';
import { RecipeContext } from '../context/RecipeContext';
import RecipeCard from '../components/RecipeCard';

export default function MyFoodScreen({ navigation }) {
  const { myRecipes } = useContext(RecipeContext);

  return (
    <View>
      <Button title="Add Recipe"
        onPress={() => navigation.navigate('AddRecipe')} />

      <FlatList
        data={myRecipes}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <RecipeCard recipe={item} />
        )}
      />
    </View>
  );
}