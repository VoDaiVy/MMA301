import { StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';

import Header from './components/Header';
import ProfileCard from './components/ProfileCard';
import InputSection from './components/InputSection';
import ItemList from './components/ItemList';

export default function App() {
  const [text, setText] = useState('');
  const [items, setItems] = useState([
    { id: '1', title: 'View' },
    { id: '2', title: 'Text' },
    { id: '3', title: 'Image' },
  ]);

  const addItem = () => {
    if (text.trim() === '') return;
    setItems([...items, { id: Date.now().toString(), title: text }]);
    setText('');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ItemList items={[item]} />}
        ListHeaderComponent={
          <>
            <Header />
            <ProfileCard />
            <InputSection
              text={text}
              setText={setText}
              addItem={addItem}
            />
          </>
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
    paddingHorizontal: 20,
  },
});
