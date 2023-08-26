import React from "react";
import { View, Button, Alert, StyleSheet } from "react-native";
import * as SQLite from "expo-sqlite";
import * as DocumentPicker from "expo-document-picker";

const db = SQLite.openDatabase("incident.db");

const SettingsScreen: React.FC = ({ navigation }) => {
  const clearDatabase = () => {
    db.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM incident;",
        [],
        (_, result) => {
          Alert.alert("Success", "All data has been cleared!");
        },
        (_, error) => {
          Alert.alert("Error", "There was an error clearing the data.");
          return true; // rollback transaction
        }
      );
    });
  };

  const uploadData = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/json",
    });
    if (result.type === "success") {
      try {
        const content = await FileSystem.readAsStringAsync(result.uri);
        const jsonData = JSON.parse(content);
        jsonData.forEach((item) => {
          db.transaction((tx) => {
            tx.executeSql(
              "INSERT INTO incident (date, hour, med, dosage) VALUES (?, ?, ?, ?);",
              [item.date, item.hour, item.med, item.dosage]
            );
          });
        });
        Alert.alert("Success", "Data has been uploaded!");
      } catch (error) {
        Alert.alert("Error", "There was an error uploading the data.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Clear Database" onPress={clearDatabase} />
      <Button title="Upload Data from JSON" onPress={uploadData} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
});

export default SettingsScreen;
