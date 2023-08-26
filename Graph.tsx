import React, { useState, useEffect } from "react";
import {
  View,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";
import { BarChart } from "react-native-chart-kit";
import * as SQLite from "expo-sqlite";

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
        <TouchableOpacity style={[styles.button, styles.downloadButton]}>
          <Text style={styles.buttonText}>Download to Disk</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.shareButton]}>
          <Text style={styles.buttonText}>Share Data</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ... [rest of the code remains unchanged]

export default Graph;

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
