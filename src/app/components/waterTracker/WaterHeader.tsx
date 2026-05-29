import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useFonts } from "expo-font";

export default function WaterHeader() {
  const [fontsLoaded] = useFonts({
    PoppinsRegular: require("../../../assets/fonts/Poppins-Regular.ttf"),
    PoppinsSemiBold: require("../../../assets/fonts/Poppins-SemiBold.ttf"),
    PoppinsBold: require("../../../assets/fonts/Poppins-Bold.ttf"),
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#FF4D8D" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Water Tracker</Text>
      <Text style={styles.subtitle}>
        Stay hydrated for better hormonal balance
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    height: 70,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    marginTop: 20,
    marginBottom: 20,
    paddingLeft: 20
  },
  title: {
    fontSize: 32,
    color: "#111",
    fontFamily: "PoppinsSemiBold",
  },
  subtitle: {
    fontSize: 16,
    color: "#777",
    marginTop: 2,
    fontFamily: "PoppinsRegular",
  },
});