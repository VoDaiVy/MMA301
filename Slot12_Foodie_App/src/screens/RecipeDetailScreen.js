import React, { useContext } from 'react';
import { View, Text, Image, Button, ScrollView } from 'react-native';
import { RecipeContext } from '../context/RecipeContext';

export default function RecipeDetailScreen({ route, navigation }) {

  const { recipe } = route.params;
  const { toggleFavorite } = useContext(RecipeContext);

  return (
    <ScrollView style={{ padding: 15 }}>

      <Button title="Back"
        onPress={() => navigation.goBack()} />

      <Image
        source={{ uri: recipe.image }}
        style={{ height: 250, borderRadius: 20 }}
      />

      <Text style={{ fontSize: 22, fontWeight: 'bold', marginVertical: 10 }}>
        {recipe.name}
      </Text>

      <Text>Time: {recipe.time}</Text>
      <Text>Servings: {recipe.servings}</Text>
      <Text>Calories: {recipe.calories}</Text>
      <Text>Difficulty: {recipe.difficulty}</Text>

      <Text style={{ marginTop: 15, fontWeight: 'bold' }}>
        Ingredients:
      </Text>

      {recipe.ingredients.map((item, index) => (
        <Text key={index}>• {item}</Text>
      ))}

      <Text style={{ marginTop: 15, fontWeight: 'bold' }}>
        Steps:
      </Text>

      {recipe.steps.map((step, index) => (
        <Text key={index}>
          {index + 1}. {step}
        </Text>
      ))}

      <Button
        title="Toggle Favorite"
        onPress={() => toggleFavorite(recipe)}
      />

    </ScrollView>
  );
}