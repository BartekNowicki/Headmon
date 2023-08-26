import React, { useState, useEffect } from "react";
import {
  View,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
  ScrollView,
} from "react-native";
import { BarChart } from "react-native-chart-kit";
import * as SQLite from "expo-sqlite";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

const db = SQLite.openDatabase("incident.db");

interface Incident {
  date: string;
  dosage: number;
  hour: string;
  id: number;
  med: string;
}

const GraphScreen: React.FC = ({ navigation }) => {
  const [data, setData] = useState(null);
  const [originalData, setOriginalData] = useState([]);

  const fetchData = (): Promise<Incident[]> => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT * FROM incident;",
          [],
          (_, resultSet) => {
            resolve(resultSet.rows._array as Incident[]);
          },
          (_, error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  };

  useEffect(() => {
    fetchData()
      .then((fetchedData) => {
        setOriginalData(fetchedData);
        const labels = fetchedData.map(
          (item) =>
            `${item.date.split("-").slice(0, 2).join(".")} - ${item.hour}`
        );

        const datasetData = fetchedData.map((item) => item.dosage);

        setData({
          labels: labels,
          datasets: [{ data: datasetData }],
        });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        Alert.alert("Error", "There was an error fetching the data.");
      });
  }, []);

  if (!data) {
    return <Text>Loading...</Text>;
  }

  const downloadData = async () => {
    const fileName = FileSystem.documentDirectory + "data.json";
    const dataString = JSON.stringify(originalData);

    try {
      await FileSystem.writeAsStringAsync(fileName, dataString);
      Alert.alert("Success", "Data has been saved!");
      await Sharing.shareAsync(fileName);
    } catch (error) {
      Alert.alert("Error", "There was an error while downloading the data.");
    }
  };

  const shareData = async () => {
    const fileName = FileSystem.documentDirectory + "data.json";
    const dataString = JSON.stringify(data);
    try {
      await FileSystem.writeAsStringAsync(fileName, dataString);
      await Sharing.shareAsync(fileName);
    } catch (error) {
      Alert.alert("Error", "There was an error while sharing the data.");
    }
  };

  const chartConfig = {
    backgroundColor: "#e26a00",
    backgroundGradientFrom: "#fb8c00",
    backgroundGradientTo: "#ffa726",
    color: (opacity = 1) => {
      const item = originalData[colorIndex];
      colorIndex = (colorIndex + 1) % originalData.length;
      return item.med === "Ibuprofen"
        ? `rgba(255, 0, 0, ${opacity})`
        : `rgba(0, 0, 128, ${opacity})`;
    },
    propsForDots: {
      r: "0",
      strokeWidth: "2",
      stroke: "#ffa726",
    },
    decimalPlaces: 0,
  };

  let colorIndex = 0;

  return (
    <View style={styles.container}>
      <ScrollView horizontal={true} style={{ paddingRight: 100 }}>
        <BarChart
          data={data}
          width={Dimensions.get("window").width * 2 - 20}
          height={Dimensions.get("window").height * 0.8 - 20}
          yAxisLabel=""
          yAxisSuffix="  mg"
          chartConfig={chartConfig}
          style={{
            marginVertical: 0,
            paddingTop: 30,
            marginHorizontal: 20,
            paddingHorizontal: 10,
            borderRadius: 16,
            marginRight: 20,
          }}
        />
      </ScrollView>
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

export default GraphScreen;
