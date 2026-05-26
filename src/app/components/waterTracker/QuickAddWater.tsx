import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";

const quickAddData = [
  {
    id: 1,
    amount: "1 Glass",
    value: 1,
    icon: "water-outline",
  },
  {
    id: 2,
    amount: "2 Glasses",
    value: 2,
    icon: "glass-outline",
  },
  {
    id: 3,
    amount: "4 Glasses",
    value: 4,
    icon: "water",
  },
];

export default function QuickAddWater({
  onAdd,
  updating,
}: {
  onAdd: (amount: number) => void;
  updating: boolean;
}) {
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
      <Text style={styles.heading}>QUICK ADD</Text>

      <View style={styles.row}>
        {quickAddData.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            onPress={() => onAdd(item.value)}
            disabled={updating}
            activeOpacity={0.7}
          >
            <Ionicons name={item.icon as any} size={26} color="#56CCF2" />
            <Text style={styles.amount}>{item.amount}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  heading: {
    fontSize: 14,
    letterSpacing: 1,
    color: "#666474",
    marginBottom: 14,
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
    borderColor: "#DFF6FF",
    paddingVertical: 14,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 2,
  },
  amount: {
    marginTop: 10,
    fontSize: 14,
    color: "#111",
    fontFamily: "PoppinsSemiBold",
  },
});