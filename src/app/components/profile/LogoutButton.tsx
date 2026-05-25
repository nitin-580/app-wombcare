import React from "react";

import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";

import AsyncStorage
from "@react-native-async-storage/async-storage";

import {
  Ionicons,
} from "@expo/vector-icons";

import {
  router,
} from "expo-router";

import { useFonts }
from "expo-font";

export default function LogoutButton() {

  /* ---------------- STATE ---------------- */

  const [loading, setLoading] =
    React.useState(false);

  /* ---------------- FONTS ---------------- */

  const [fontsLoaded] = useFonts({

    PoppinsRegular: require("../../../assets/fonts/Poppins-Regular.ttf"),

    PoppinsSemiBold: require("../../../assets/fonts/Poppins-SemiBold.ttf"),

    PoppinsBold: require("../../../assets/fonts/Poppins-Bold.ttf"),

  });

  if (!fontsLoaded) {
    return null;
  }

  /* ---------------- LOGOUT ---------------- */

  const handleLogout = () => {

    Alert.alert(

      "Logout",

      "Are you sure you want to logout?",

      [

        {
          text: "Cancel",
          style: "cancel",
        },

        {

          text: "Logout",

          style: "destructive",

          onPress: async () => {

            try {

              setLoading(true);

              /* REMOVE USER DATA */

              await AsyncStorage.removeItem(
                "userToken"
              );

              await AsyncStorage.removeItem(
                "userData"
              );

              /* CLEAR ALL STORAGE (OPTIONAL) */

              // await AsyncStorage.clear();

              /* GO TO LOGIN SCREEN */

              router.replace("/(auth)");

            } catch (err) {

              console.log(
                "LOGOUT ERROR:",
                err
              );

            } finally {

              setLoading(false);
            }
          },
        },
      ]
    );
  };

  return (

    <TouchableOpacity

      style={styles.button}

      activeOpacity={0.85}

      onPress={handleLogout}

      disabled={loading}
    >

      {loading ? (

        <ActivityIndicator
          size="small"
          color="#555"
        />

      ) : (

        <>

          <Ionicons
            name="log-out-outline"
            size={26}
            color="#555"
          />

          <Text style={styles.text}>
            Logout
          </Text>

        </>

      )}

    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({

  button: {

    height: 76,

    borderWidth: 1.5,

    borderColor: "#D9D5F0",

    borderRadius: 24,

    flexDirection: "row",

    justifyContent: "center",

    alignItems: "center",

    marginBottom: 40,

    backgroundColor: "white",

    shadowColor: "#000",

    shadowOpacity: 0.04,

    shadowRadius: 10,

    elevation: 3,
  },

  text: {

    marginLeft: 14,

    fontSize: 22,

    color: "#444",

    fontFamily: "PoppinsSemiBold",
  },

});