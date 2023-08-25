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
  const [hour, setHour] = useState<string>("");
  const [med, setMed] = useState<string>("");
  const [dosage, setDosage] = useState<number>(0);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [isDateError, setIsDateError] = useState<boolean>(false);
  const [isHourError, setIsHourError] = useState<boolean>(false);
  const [isMedError, setIsMedError] = useState<boolean>(false);
  const [isDosageError, setIsDosageError] = useState<boolean>(false);

  useEffect(() => {
    console.log("incident db set up initiated");
    db.transaction((tx) => {
      tx.executeSql(
        `create table if not exists incident (id integer primary key not null,
        date text, 
        hour text,
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
    console.log(
      `checking if I can save to db: ${date} ${hour} ${med} ${dosage}`
    );
    if (date && hour && med && dosage) {
      db.transaction((tx) => {
        tx.executeSql(
          "INSERT INTO incident (date, hour, med, dosage) VALUES (?, ?, ?, ?);",
          [date, hour, med, dosage],
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
      console.log("Please ensure all fields are filled - ");
      if (!date) {
        console.log("select the date");
        setIsDateError(true);
        setTimeout(() => {
          setIsDateError(false);
        }, 3000);
      } else if (!hour) {
        console.log("select the hour");
        setIsHourError(true);
        setTimeout(() => {
          setIsHourError(false);
        }, 3000);
      } else if (!med) {
        console.log("select the medication");
        setIsMedError(true);
        setTimeout(() => {
          setIsMedError(false);
        }, 3000);
      } else {
        console.log("select the dosage");
        setIsDosageError(true);
        setTimeout(() => {
          setIsDosageError(false);
        }, 3000);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            isMedError
              ? styles.errorBorder
              : med === Med.Ibuprofen
              ? styles.selectedButton
              : {},
          ]}
          onPress={() => setMed(Med.Ibuprofen)}
        >
          <Text style={styles.buttonText}>{Med.Ibuprofen}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            isMedError
              ? styles.errorBorder
              : med === Med.Paracetamol
              ? styles.selectedButton
              : {},
          ]}
          onPress={() => setMed(Med.Paracetamol)}
        >
          <Text style={styles.buttonText}>{Med.Paracetamol}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[
          styles.dateButton,
          isDateError
            ? styles.errorBorder
            : date
            ? styles.dateButtonSelected
            : {},
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
        style={[styles.hourInput, isHourError ? styles.errorBorder : {}]}
        value={hour}
        onChangeText={(text) => {
          setHour(text);
        }}
        placeholder="Hour (HH:mm)"
      />

      <TextInput
        style={[styles.dosageInput, isDosageError ? styles.errorBorder : {}]}
        keyboardType="numeric"
        value={dosage ? String(dosage) : ""}
        onChangeText={(text) => {
          const num = parseInt(text, 10);
          if (num >= 0 && num <= 1200) {
            setDosage(num);
          }
        }}
        placeholder="Dosage (0-1200)"
      />

      <Text>
        Date: {date} {hour}
      </Text>
      <Text>Med: {med}</Text>
      <Text>Dosage: {dosage}</Text>

      <TouchableOpacity style={styles.saveButton} onPress={saveIncident}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.graphButton}
        onPress={() => navigation.navigate("Graph")}
      >
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
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
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
  hourInput: {
    borderWidth: 1,
    borderColor: "#4CAF50",
    padding: 5,
    width: 130,
    textAlign: "center",
    margin: 5,
  },
  dosageInput: {
    borderWidth: 1,
    borderColor: "#4CAF50",
    padding: 5,
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
  errorBorder: {
    borderColor: "red",
    borderWidth: 4,
  },
});

export default HomeScreen;
