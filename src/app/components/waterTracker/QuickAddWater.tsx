import React from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import {
  Ionicons,
} from "@expo/vector-icons";

import { useFonts } from "expo-font";

const quickAddData = [

  {
    id: 1,

    amount: "250ml",

    icon: "water-outline",
  },

  {
    id: 2,

    amount: "500ml",

    icon: "glass-outline",
  },

  {
    id: 3,

    amount: "1L",

    icon: "water",
  },

];

export default function QuickAddWater() {

  const [fontsLoaded] = useFonts({

    PoppinsRegular: require("../../../assets/fonts/Poppins-Regular.ttf"),

    PoppinsSemiBold: require("../../../assets/fonts/Poppins-SemiBold.ttf"),

    PoppinsBold: require("../../../assets/fonts/Poppins-Bold.ttf"),

  });

  if (!fontsLoaded) {
    return null;
  }

  return (

    <View style={styles.container}>

      {/* TITLE */}

      <Text style={styles.heading}>
        QUICK ADD
      </Text>

      {/* CARDS */}

      <View style={styles.row}>

        {quickAddData.map((item) => (

          <TouchableOpacity
            key={item.id}
            style={styles.card}
          >

            {/* ICON */}

            <Ionicons
              name={item.icon as any}
              size={25}
              color="#4B7BEC"
            />

            {/* TEXT */}

            <Text style={styles.amount}>
              {item.amount}
            </Text>

          </TouchableOpacity>

        ))}

      </View>

    </View>

  );
}

const styles = StyleSheet.create({

  container: {

    marginBottom: 30,
  },

  heading: {

    fontSize: 16,

    letterSpacing: 1,

    color: "#666474",

    marginBottom: 20,

    fontFamily: "PoppinsBold",
  },

  row: {

    flexDirection: "row",

    justifyContent: "space-between",
  },

  card: {

    width: "31%",

    backgroundColor: "white",

    borderRadius: 20,

    borderWidth: 1.5,
    borderColor: "#DCD5F4",

    paddingVertical: 10,

    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 2,
  },

  amount: {

    marginTop: 18,

    fontSize: 16,

    color: "#111",

    fontFamily: "PoppinsSemiBold",
  },

});