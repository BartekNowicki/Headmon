import React, { useState, useEffect } from "react";
import {
  View,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
} from "react-native";
import { BarChart } from "react-native-chart-kit";
import * as SQLite from "expo-sqlite";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

const db = SQLite.openDatabase("incident.db");

const Graph: React.FC = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql("SELECT * FROM incident;", [], (_, resultSet) => {
        const fetchedData = resultSet.rows._array;
        const labels = fetchedData.map((item) =>
          item.date.split("-").slice(0, 2).join("-")
        );
        const datasetData = fetchedData.map((item) => item.dosage);

        setData({
          labels: labels,
          datasets: [{ data: datasetData }],
        });
      });
    });
  }, []);

  if (!data) {
    return <Text>Loading...</Text>;
  }

  const downloadData = async () => {
    const fileName = FileSystem.documentDirectory + "data.txt";
    const dataString = JSON.stringify(data);

    try {
      await FileSystem.writeAsStringAsync(fileName, dataString);
      await Sharing.shareAsync(fileName);
    } catch (error) {
      Alert.alert("Error", "There was an error while downloading the data.");
    }
  };

  const shareData = async () => {
    try {
      await Sharing.shareAsync(FileSystem.documentDirectory + "data.txt");
    } catch (error) {
      Alert.alert("Error", "There was an error while sharing the data.");
    }
  };

  return (
    <View style={styles.container}>
      <BarChart
        data={data}
        width={Dimensions.get("window").width - 16}
        height={220}
        yAxisLabel=""
        yAxisSuffix="mg"
        chartConfig={{
          backgroundColor: "#e26a00",
          backgroundGradientFrom: "#fb8c00",
          backgroundGradientTo: "#ffa726",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: "0",
            strokeWidth: "2",
            stroke: "#ffa726",
          },
        }}
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.downloadButton]}
          onPress={downloadData}
        >
          <Text style={styles.buttonText}>Download</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.shareButton]}
          onPress={shareData}
        >
          <Text style={styles.buttonText}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingHorizontal: 20,
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    margin: 3,
  },
  downloadButton: {
    backgroundColor: "magenta",
  },
  shareButton: {
    backgroundColor: "green",
  },
  buttonText: {
    color: "white",
  },
});

export default Graph;
