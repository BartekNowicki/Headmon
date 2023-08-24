import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { StatusBar } from "expo-status-bar";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("counter.db");

enum Med {
  Ibuprofen = "Ibuprofen",
  Paracetamol = "Paracetamol"
}

interface Incident {
  date: {
    hour: number;   // assuming 0-23 format
    day: number;    // assuming 1-31 format
    month: number;  // assuming 1-12 format
    year: number;   
  };
  med: string;
  dosage: number;
}

const App: React.FC = () => {
  const [date, setDate] = useState<string>('');
  const [med, setMed] = useState<string>('');
  const [dosage, setDosage] = useState<number>(0);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  
  useEffect(() => {
    console.log("incident db set up initiated");
    db.transaction((tx) => {
      tx.executeSql(
        `create table if not exists incident (id integer primary key not null,
          date text, 
          med text,
          dosage int
      );
      `);
    });
  }, []);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(`${selectedDate.getDate()}-${selectedDate.getMonth() + 1}-${selectedDate.getFullYear()}`);
    }
  };

  return (
    <View style={styles.container}>
      {/* Med selection */}
      <TouchableOpacity style={styles.button} onPress={() => setMed('Ibuprofen')}>
        <Text style={styles.buttonText}>Ibuprofen</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => setMed('Paracetamol')}>
        <Text style={styles.buttonText}>Paracetamol</Text>
      </TouchableOpacity>

      {/* Date selection */}
      <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
        <Text style={styles.buttonText}>Select Date</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      {/* Dosage input */}
      <TextInput
        style={styles.dosageInput}
        keyboardType="numeric"
        value={String(dosage)}
        onChangeText={text => {
          const num = parseInt(text, 10);
          if (num >= 0 && num <= 1200) {
            setDosage(num);
          }
        }}
        placeholder="Enter dosage (0-1200)"
      />

      <Text>Date: {date}</Text>
      <Text>Med: {med}</Text>
      <Text>Dosage: {dosage}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    margin: 10,
    width: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    margin: 10,
    width: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dosageInput: {
    borderWidth: 1,
    borderColor: '#4CAF50',
    padding: 10,
    width: 200,
    textAlign: 'center',
    margin: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default App;