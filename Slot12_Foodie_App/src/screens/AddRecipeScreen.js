import React, { useState, useContext }
from 'react';

import {
  View,
  TextInput,
  Button,
  Image
} from 'react-native';

import * as ImagePicker from 'expo-image-picker';
import { RecipeContext }
from '../context/RecipeContext';

export default function AddRecipeScreen(
{ navigation }) {

  const { addRecipe } =
  useContext(RecipeContext);

  const [name, setName] =
  useState('');
  const [image, setImage] =
  useState(null);

  const pickImage = async () => {

    let result =
    await ImagePicker.launchImageLibraryAsync({
      mediaTypes:
      ImagePicker.MediaTypeOptions.Images,
      quality: 1
    });

    if (!result.canceled)
      setImage(result.assets[0].uri);
  };

  const handleAdd = () => {

    addRecipe({
      id: Date.now().toString(),
      name,
      image
    });

    navigation.goBack();
  };

  return (
    <View>

      <Button title="Pick Image"
        onPress={pickImage}/>

      {image && (
        <Image
          source={{ uri: image }}
          style={{ height:200 }}
        />
      )}

      <TextInput
        placeholder="Recipe Name"
        onChangeText={setName}
      />

      <Button title="Add"
        onPress={handleAdd}/>
    </View>
  );
}