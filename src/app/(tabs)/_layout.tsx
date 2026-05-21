import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {

  return (

    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarShowLabel: false,

        tabBarStyle: {
          position: "absolute",

          bottom: 0,
          left: 20,
          right: 20,

          height: 100,

          borderRadius: 0,

          backgroundColor: "#111",

          borderTopWidth: 0,

          elevation: 0,

          paddingTop: 10,
        },
      }}
    >

      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="home"
              size={26}
              color={focused ? "#FF4D8D" : "white"}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="cycle"
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="calendar"
              size={26}
              color={focused ? "#FF4D8D" : "white"}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="mood"
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="happy"
              size={26}
              color={focused ? "#FF4D8D" : "white"}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="water"
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="water"
              size={26}
              color={focused ? "#FF4D8D" : "white"}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="classes"
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="videocam"
              size={26}
              color={focused ? "#FF4D8D" : "white"}
            />
          ),
        }}
      />

    </Tabs>

  );
}