import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { RecipeContext } from '../context/RecipeContext';

export default function AddRecipeScreen({ navigation }) {
  const { addRecipe } = useContext(RecipeContext);

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState(null);
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [servings, setServings] = useState('');
  const [calories, setCalories] = useState('');
  const [difficulty, setDifficulty] = useState('Easy');

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    // Validation
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter recipe name');
      return;
    }
    if (!image) {
      Alert.alert('Error', 'Please select an image');
      return;
    }
    if (!ingredients.trim()) {
      Alert.alert('Error', 'Please enter ingredients');
      return;
    }
    if (!instructions.trim()) {
      Alert.alert('Error', 'Please enter instructions');
      return;
    }

    const newRecipe = {
      name: name.trim(),
      category: category.trim() || 'Other',
      image,
      ingredients: ingredients
        .split(',')
        .map((item) => item.trim())
        .filter((item) => item.length > 0),
      instructions: instructions
        .split('\n')
        .map((item) => item.trim())
        .filter((item) => item.length > 0),
      prepTime: prepTime.trim() || '30 mins',
      servings: parseInt(servings) || 2,
      calories: parseInt(calories) || 0,
      difficulty: difficulty,
    };

    addRecipe(newRecipe);
    Alert.alert('Success', 'Recipe added successfully!', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <Text style={styles.title}>Add New Recipe</Text>

          {/* Image Picker */}
          <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
            {image ? (
              <Image source={{ uri: image }} style={styles.imagePreview} />
            ) : (
              <View style={styles.imagePickerPlaceholder}>
                <Text style={styles.imagePickerIcon}>📷</Text>
                <Text style={styles.imagePickerText}>Tap to select image</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Recipe Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Recipe Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Chocolate Cake"
              value={name}
              onChangeText={setName}
            />
          </View>

          {/* Category */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Category</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Dessert, Beef, Chicken"
              value={category}
              onChangeText={setCategory}
            />
          </View>

          {/* Ingredients */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Ingredients (comma-separated) *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="e.g. 2 eggs, 1 cup flour, 1/2 cup sugar"
              value={ingredients}
              onChangeText={setIngredients}
              multiline
              numberOfLines={4}
            />
          </View>

          {/* Instructions */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Instructions (one per line) *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="e.g. Preheat oven to 350°F&#10;Mix all ingredients&#10;Bake for 30 minutes"
              value={instructions}
              onChangeText={setInstructions}
              multiline
              numberOfLines={6}
            />
          </View>

          {/* Time and Servings Row */}
          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Prep Time</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 30 mins"
                value={prepTime}
                onChangeText={setPrepTime}
              />
            </View>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Servings</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 4"
                value={servings}
                onChangeText={setServings}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Calories and Difficulty Row */}
          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Calories</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 350"
                value={calories}
                onChangeText={setCalories}
                keyboardType="numeric"
              />
            </View>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Difficulty</Text>
              <View style={styles.difficultyButtons}>
                {['Easy', 'Medium', 'Hard'].map((level) => (
                  <TouchableOpacity
                    key={level}
                    style={[
                      styles.difficultyButton,
                      difficulty === level && styles.difficultyButtonActive,
                    ]}
                    onPress={() => setDifficulty(level)}
                  >
                    <Text
                      style={[
                        styles.difficultyButtonText,
                        difficulty === level && styles.difficultyButtonTextActive,
                      ]}
                    >
                      {level}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Recipe</Text>
          </TouchableOpacity>

          {/* Cancel Button */}
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  imagePicker: {
    width: '100%',
    height: 200,
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 20,
    backgroundColor: '#f5f5f5',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  imagePickerPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePickerIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  imagePickerText: {
    fontSize: 16,
    color: '#999',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  difficultyButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  difficultyButton: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 2,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  difficultyButtonActive: {
    backgroundColor: '#FFC107',
    borderColor: '#FFC107',
  },
  difficultyButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  difficultyButtonTextActive: {
    color: '#fff',
  },
  saveButton: {
    backgroundColor: '#FFC107',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  cancelButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
});