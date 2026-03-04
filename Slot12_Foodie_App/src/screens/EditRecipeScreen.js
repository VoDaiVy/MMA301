import React,
{ useState, useContext }
from 'react';

import {
  View,
  TextInput,
  Button
} from 'react-native';

import { RecipeContext }
from '../context/RecipeContext';

export default function
EditRecipeScreen(
{ route, navigation }) {

  const { recipe } =
  route.params;

  const { editRecipe } =
  useContext(RecipeContext);

  const [name, setName] =
  useState(recipe.name);

  const handleEdit = () => {

    editRecipe({
      ...recipe,
      name
    });

    navigation.goBack();
  };

  return (
    <View>
      <TextInput
        value={name}
        onChangeText={setName}
      />
      <Button
        title="Update"
        onPress={handleEdit}
      />
    </View>
  );
}