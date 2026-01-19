import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  centerScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingBottom: 50,
  },
  largeButton: {
    width: '100%',
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 2.5,
    borderColor: 'black',
    marginBottom: 25,
  },
  buttonWhite: {
    backgroundColor: 'white',
  },
  buttonBlue: {
    backgroundColor: '#90D5FF',
  },
  buttonText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'black',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: 'white',
  },
  bottomBarTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  }
});

export default styles;