import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./HomeScreen";
import Graph from "./Graph";

const Stack = createStackNavigator();

const RootNavigator: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerStyle: {
            height: 60,
          },
        }}
      />
      <Stack.Screen name="Graph" component={Graph} />
    </Stack.Navigator>
  );
};

export default RootNavigator;
