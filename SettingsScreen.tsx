import React from "react";
import { View, Button, Alert, StyleSheet } from "react-native";
import * as SQLite from "expo-sqlite";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";

const db = SQLite.openDatabase("incident.db");

const SettingsScreen: React.FC = ({ navigation }) => {
  const clearDatabase = () => {
    console.log("Initiating database data deletion...");
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

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      console.log("Selected file URI:", uri);
      try {
        const content = await FileSystem.readAsStringAsync(uri);
        console.log("File content:", content);
        const jsonData = JSON.parse(content);
        jsonData.forEach((item) => {
          db.transaction((tx) => {
            tx.executeSql(
              "INSERT INTO incident (date, hour, med, dosage) VALUES (?, ?, ?, ?);",
              [item.date, item.hour, item.med, item.dosage],
              (_, resultSet) => console.log("Insert success:", resultSet),
              (_, error) => {
                console.log("Insert error:", error);
                return false;
              }
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
