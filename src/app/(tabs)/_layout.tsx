import {
  Tabs,
} from "expo-router";

import {
  Ionicons,
} from "@expo/vector-icons";

export default function TabsLayout() {

  return (

    <Tabs

      screenOptions={{

        headerShown: false,

        tabBarStyle: {

          height: 80,

          borderTopWidth: 1,
          borderTopColor: "#F1F5F9",

          elevation: 8,

          backgroundColor: "white",

          paddingBottom: 25,
          
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.04,
          shadowRadius: 6,
        },

        tabBarActiveTintColor: "#5B4CF0",

        tabBarInactiveTintColor: "#999",
      }}
    >

      <Tabs.Screen

        name="index"

        options={{

          title: "Home",

          tabBarIcon: ({
            color,
            size,
          }) => (

            <Ionicons
              name="home"
              size={size}
              color={color}
            />

          ),
        }}
      />

      <Tabs.Screen

        name="classes"

        options={{

          title: "Classes",

          tabBarIcon: ({
            color,
            size,
          }) => (

            <Ionicons
              name="play-circle"
              size={size}
              color={color}
            />

          ),
        }}
      />

      <Tabs.Screen

        name="cycle"

        options={{

          title: "Cycle",

          tabBarIcon: ({
            color,
            size,
          }) => (

            <Ionicons
              name="calendar"
              size={size}
              color={color}
            />

          ),
        }}
      />

      <Tabs.Screen

        name="water"

        options={{

          title: "Water",

          tabBarIcon: ({
            color,
            size,
          }) => (

            <Ionicons
              name="water"
              size={size}
              color={color}
            />

          ),
        }}
      />

      <Tabs.Screen

        name="mood"

        options={{

          title: "Mood",

          tabBarIcon: ({
            color,
            size,
          }) => (

            <Ionicons
              name="happy"
              size={size}
              color={color}
            />

          ),
        }}
      />

    </Tabs>

  );
}