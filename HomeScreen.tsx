import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { StatusBar } from "expo-status-bar";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("incident.db");

enum Med {
  Ibuprofen = "Ibuprofen",
  Paracetamol = "Paracetamol",
}

const HomeScreen: React.FC = ({ navigation }) => {
  const [date, setDate] = useState<string>("");
  const [med, setMed] = useState<string>("");
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
      `
      );
    });
  }, []);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(
        `${selectedDate.getDate()}-${
          selectedDate.getMonth() + 1
        }-${selectedDate.getFullYear()}`
      );
    }
  };

  const saveIncident = () => {
    if (date && med && dosage) {
      db.transaction((tx) => {
        tx.executeSql(
          "INSERT INTO incident (date, med, dosage) VALUES (?, ?, ?);",
          [date, med, dosage],
          (_, result) => {
            console.log("Data Inserted Successfully:", result);

            tx.executeSql(
              "SELECT * FROM incident;",
              [],
              (_, resultSet) => {
                console.log(
                  "All incidents from the database:",
                  resultSet.rows._array
                );
              },
              (_, error) => {
                console.log("Error fetching data:", error);
                return false;
              }
            );
          },
          (_, error) => {
            console.log("Error inserting data:", error);
            return false;
          }
        );
      });
    } else {
      console.log("Please ensure all fields are filled.");
    }
  };

  return (
    <View style={styles.container}>
       <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.button,
                med === Med.Ibuprofen ? styles.selectedButton : {},
              ]}
              onPress={() => setMed(Med.Ibuprofen)}
            >
              <Text style={styles.buttonText}>{Med.Ibuprofen}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                med === Med.Paracetamol ? styles.selectedButton : {},
              ]}
              onPress={() => setMed(Med.Paracetamol)}
            >
              <Text style={styles.buttonText}>{Med.Paracetamol}</Text>
            </TouchableOpacity>
          </View>

      <TouchableOpacity
        style={[
          styles.dateButton,
          date ? styles.dateButtonSelected : {}
        ]}
        onPress={() => setShowDatePicker(true)}
      >
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

      <TextInput
        style={styles.dosageInput}
        keyboardType="numeric"
        value={String(dosage)}
        onChangeText={(text) => {
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

      <TouchableOpacity style={styles.saveButton} onPress={saveIncident}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>

       <TouchableOpacity style={styles.graphButton} onPress={() => navigation.navigate('Graph')}>
              <Text>{"Graph >>"}</Text>
            </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
      paddingHorizontal: 20,
    },
  button: {
    backgroundColor: "#4CAF50",
    padding: 10,
    margin: 5,
    width: 100,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  dateButton: {
    backgroundColor: "#ADD8E6",
    padding: 10,
    margin: 5,
    width: 100,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  dosageInput: {
    borderWidth: 1,
    borderColor: "#4CAF50",
    padding: 10,
    width: 130,
    textAlign: "center",
    margin: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 12,
  },
  selectedButton: {
    backgroundColor: "#2E7D32",
  },
  dateButtonSelected: {
      backgroundColor: "#4169E1",
    },
  saveButton: {
    backgroundColor: "#FF0000",
    padding: 13,
    margin: 5,
    width: 130,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  saveButtonText: {
    color: "white",
    fontSize: 13,
  },
  graphButton: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      padding: 13,
      margin: 5,
      width: 130,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 10,
    },
});


export default HomeScreen;
