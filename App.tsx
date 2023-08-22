import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ViewStyle, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('counter.db');

const App: React.FC = () => {
  const [counter, setCounter] = useState<number>(0);
  const [retrievedCounter, setRetrievedCounter] = useState<number | null>(null);

 useEffect(() => {
    console.log("counter db set up initiated");

    db.transaction(tx => {
      tx.executeSql('create table if not exists counter (id integer primary key not null, value int);');
    });
  }, []);

  const storeCounter = () => {
      console.log("storing counter in db");
      db.transaction(tx => {
        tx.executeSql('insert into counter (value) values (?)', [counter]);
      },
      error => {
            console.error("Error storing counter:", error);
          },
      () => {
              setRetrievedCounter(counter);
          });
    };

    const fetchCounter = () => {
      console.log("fetching counter from db");
      db.transaction(tx => {
        tx.executeSql('select * from counter order by id desc limit 1', [], (_, { rows }) => {
          if (rows.length > 0) {
            setRetrievedCounter(rows.item(0).value);
          } else {
            setRetrievedCounter(null);
          }
        });
      },
      error => {
            console.error("Error fetching counter:", error);
          });
    };

    useEffect(() => {
      fetchCounter();
    }, [counter]);

  return (
    <View style={styles.container}>
      <Text style={styles.counter}>Counter: {counter}</Text>
      <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.incrementButton} onPress={() => setCounter(prev => prev + 1)}>
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.decrementButton} onPress={() => setCounter(prev => prev > 0 ? prev - 1 : prev)}>
        <Text style={styles.buttonText}>-</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.storeCounterButton} onPress={storeCounter}>
         <Text style={styles.buttonText}>save</Text>
      </TouchableOpacity>

      </View>

        {retrievedCounter !== null && <Text style={styles.counter}>Retrieved Counter: {retrievedCounter}</Text>}
      <StatusBar style="auto" />
    </View>
  );
}

interface Styles {
  container: ViewStyle;
  incrementButton: ViewStyle;
  decrementButton: ViewStyle;
  buttonText: ViewStyle;
  storeCounterButton: ViewStyle;
  counter: ViewStyle;
}

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
  padding: 10,
  borderRadius: 20,
  backgroundColor: 'gray',
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
  storeCounterButton: {
    backgroundColor: 'green',
    padding: 10,
    margin: 5,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',},
  counter: {
  fontWeight: 'bold'
  }

});

export default App;
