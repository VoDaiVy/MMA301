import React, { useState, useContext } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RecipeContext } from '../context/RecipeContext';
import RecipeCard from '../components/RecipeCard';
import CategoryBar from '../components/CategoryBar';

export default function HomeScreen({ navigation }) {
  const { allRecipes, favorites, myRecipes } = useContext(RecipeContext);
  const [selected, setSelected] = useState('All');

  const getFilteredData = () => {
    if (selected === 'My Favorites') {
      return favorites;
    }
    if (selected === 'My Food') {
      return myRecipes;
    }
    if (selected === 'All') {
      return allRecipes;
    }
    // Filter by category
    return allRecipes.filter(recipe => recipe.category === selected);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.greeting}>Hello! 👋</Text>
          <Text style={styles.subtitle}>What would you like to cook today?</Text>
        </View>
      </View>

      {/* Category Bar */}
      <CategoryBar selected={selected} setSelected={setSelected} />

      {/* Recipe List */}
      <FlatList
        data={getFilteredData()}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <RecipeCard
            recipe={item}
            onPress={() => navigation.navigate('Details', { recipe: item })}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No recipes found</Text>
            <Text style={styles.emptySubtext}>
              {selected === 'My Food' ? 'Start adding your own recipes!' : 'Try a different category'}
            </Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
    backgroundColor: '#fff',
  },
  headerTextContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#999',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#bbb',
  },
});