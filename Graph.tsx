import React, { useCallback, useState } from "react";
import { View, Button } from "react-native";
import * as FileSystem from "expo-file-system";
import * as SQLite from "expo-sqlite";
import * as Sharing from "expo-sharing";

const db = SQLite.openDatabase("incident.db");

const Graph: React.FC = () => {
  const [fileUri, setFileUri] = useState<string | null>(null);

  const downloadData = useCallback(async () => {
    let fetchedData = [];

    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM incident;",
        [],
        (_, resultSet) => {
          for (let i = 0; i < resultSet.rows.length; i++) {
            fetchedData.push(resultSet.rows.item(i));
          }

          const dataString = JSON.stringify(fetchedData);

          const fileUri = FileSystem.documentDirectory + "incidentData.json";

          FileSystem.writeAsStringAsync(fileUri, dataString)
            .then(() => {
              setFileUri(fileUri);
              alert(`Data saved to ${fileUri}`);
            })
            .catch((error) => {
              alert("Error saving data to file.");
              console.error(error);
            });
        },
        (_, error) => {
          console.log("Error fetching data from database.");
          console.error(error);
          return false;
        }
      );
    });
  }, []);

  const shareFile = useCallback(async () => {
    if (!fileUri) {
      alert("Please download the data first.");
      return;
    }

    if (!(await Sharing.isAvailableAsync())) {
      alert("Sharing is not available on this platform.");
      return;
    }

    Sharing.shareAsync(fileUri);
  }, [fileUri]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button title="Download Data To the Device" onPress={downloadData} />
      <Button title="Share Data" onPress={shareFile} />
    </View>
  );
};

export default Graph;
