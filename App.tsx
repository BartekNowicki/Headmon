import React, { useState } from 'react';
import { StyleSheet, Text, View, ViewStyle, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
const App: React.FC = () => {
  const [counter, setCounter] = useState<number>(0);

  return (
    <View style={styles.container}>
      <Text style={styles.counter}>{counter}</Text>
      <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.incrementButton} onPress={() => setCounter(prev => prev + 1)}>
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.decrementButton} onPress={() => setCounter(prev => prev > 0 ? prev - 1 : prev)}>
        <Text style={styles.buttonText}>-</Text>
      </TouchableOpacity>
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

interface Styles {
  container: ViewStyle;
  incrementButton: ViewStyle;
  decrementButton: ViewStyle;
  buttonText: ViewStyle;
}

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
  flexDirection: 'row'},
  incrementButton: {
  width: 50,
    backgroundColor: 'red',
    padding: 10,
    margin: 5,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  decrementButton: {
  width: 50,
    backgroundColor: 'blue',
    padding: 10,
    margin: 5,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
  },
  counter: {
  fontWeight: 'bold'}

});

export default App;
