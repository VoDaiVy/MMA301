import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity
} from 'react-native';

export default function
RecipeCard({recipe,onPress}){

  return(
    <TouchableOpacity
      onPress={onPress}
      style={{
        margin:15,
        backgroundColor:'#fff',
        borderRadius:20,
        overflow:'hidden',
        elevation:5
      }}>

      <Image
        source={{uri:recipe.image}}
        style={{
          height:180,
          width:'100%'
        }}/>

      <Text style={{
        padding:10,
        fontSize:18,
        fontWeight:'bold'
      }}>
        {recipe.name}
      </Text>

    </TouchableOpacity>
  );
}