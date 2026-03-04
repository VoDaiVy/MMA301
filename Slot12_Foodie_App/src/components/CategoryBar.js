import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';

export default function CategoryBar({ selected, setSelected }) {

  const categories = ['All', 'Favorites', 'My Food'];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ paddingVertical: 10 }}
    >
      {categories.map(cat => (
        <TouchableOpacity
          key={cat}
          onPress={() => setSelected(cat)}
          style={{
            paddingHorizontal: 20,
            paddingVertical: 8,
            marginHorizontal: 5,
            borderRadius: 20,
            backgroundColor:
              selected === cat ? '#ff6b6b' : '#eee'
          }}
        >
          <Text style={{
            color:
              selected === cat ? 'white' : 'black',
            fontWeight: 'bold'
          }}>
            {cat}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}