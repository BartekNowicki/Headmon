import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ViewStyle,
  TouchableOpacity,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("counter.db");

const App: React.FC = () => {
  const [counter_state, setCounter_state] = useState<number>(0);
  const [counter_db, setCounter_db] = useState<number>(0);

  useEffect(() => {
    console.log("counter db set up initiated");
    db.transaction((tx) => {
      tx.executeSql(
        "create table if not exists counter (id integer primary key not null, value int);"
      );
    });
  }, []);

  const storeCounterInDb = () => {
    console.log("storing counter in db");
    db.transaction(
      (tx) => {
        tx.executeSql("insert into counter (value) values (?)", [
          counter_state,
        ]);
      },
      (error) => {
        console.error("Error storing counter:", error);
      },
      () => {
        setCounter_db(counter_state);
      }
    );
  };

  const logDatabaseContents = async () => {
    db.transaction(
      (tx) => {
        tx.executeSql("SELECT * FROM counter", [], (_, { rows }) => {
          console.log("Logging entire counter table:");
          let data = rows._array;
          let headers = Object.keys(data[0] || {}).join("\t");
          console.log(headers);
          data.forEach((item) => {
            console.log(`${item.id}\t${item.value}`);
          });
        });
      },
      (error) => {
        console.error("Error fetching data from the database:", error);
      }
    );
  };

  useEffect(() => {
    storeCounterInDb();
  }, [counter_state]);

  useEffect(() => {
    logDatabaseContents();
  }, [counter_db]);

  return (
    <View style={styles.container}>
      <Text style={styles.counter}>Counter: {counter_state}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.incrementButton}
          onPress={() => setCounter_state((prev) => prev + 1)}
        >
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.decrementButton}
          onPress={() =>
            setCounter_state((prev) => (prev > 0 ? prev - 1 : prev))
          }
        >
          <Text style={styles.buttonText}>-</Text>
        </TouchableOpacity>
      </View>
      <StatusBar style="auto" />
    </View>
  );
};

interface Styles {
  buttonContainer: ViewStyle;
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
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainer: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: "gray",
    flexDirection: "row",
  },
  incrementButton: {
    width: 50,
    backgroundColor: "red",
    padding: 10,
    margin: 5,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  decrementButton: {
    width: 50,
    backgroundColor: "blue",
    padding: 10,
    margin: 5,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 20,
  },
  storeCounterButton: {
    backgroundColor: "green",
    padding: 10,
    margin: 5,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  counter: {
    fontWeight: "bold",
  },
});

export default App;
