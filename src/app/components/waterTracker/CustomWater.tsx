import React, { useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";

import {
  Ionicons,
} from "@expo/vector-icons";

import { useFonts } from "expo-font";

export default function CustomWaterInputButton() {

  const [showInput, setShowInput] =
    useState(false);

  const [amount, setAmount] =
    useState("");

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

      {/* BUTTON */}

      {!showInput && (

        <TouchableOpacity

          style={styles.button}

          onPress={() =>
            setShowInput(true)
          }
        >

          <Ionicons
            name="add"
            size={34}
            color="white"
          />

          <Text style={styles.buttonText}>
            Add custom amount
          </Text>

        </TouchableOpacity>

      )}

      {/* INPUT FIELD */}

      {showInput && (

        <View style={styles.inputContainer}>

          <TextInput

            placeholder="Enter water amount..."

            placeholderTextColor="#B8B4D2"

            keyboardType="numeric"

            value={amount}

            onChangeText={setAmount}

            style={styles.input}
          />

          <TouchableOpacity
            style={styles.saveButton}
          >

            <Text style={styles.saveText}>
              Save
            </Text>

          </TouchableOpacity>

        </View>

      )}

    </View>

  );
}

const styles = StyleSheet.create({

  container: {

    marginBottom: 30,
  },

  button: {

    height: 92,

    borderRadius: 28,

    backgroundColor: "#4F46E5",

    flexDirection: "row",

    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#4F46E5",
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },

  buttonText: {

    marginLeft: 14,

    color: "white",

    fontSize: 20,

    fontFamily: "PoppinsSemiBold",
  },

  inputContainer: {

    backgroundColor: "white",

    borderRadius: 28,

    padding: 18,

    borderWidth: 1.5,
    borderColor: "#DDD8F6",
  },

  input: {

    height: 60,

    borderRadius: 18,

    backgroundColor: "#F8F7FD",

    paddingHorizontal: 20,

    fontSize: 17,

    color: "#111",

    marginBottom: 16,

    fontFamily: "PoppinsRegular",
  },

  saveButton: {

    height: 56,

    borderRadius: 18,

    backgroundColor: "#4F46E5",

    justifyContent: "center",
    alignItems: "center",
  },

  saveText: {

    color: "white",

    fontSize: 17,

    fontFamily: "PoppinsBold",
  },

});