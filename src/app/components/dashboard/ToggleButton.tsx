import {
    View,
    Text,
    StyleSheet,
  } from "react-native";
  
  import {
    Ionicons,
    MaterialCommunityIcons,
  } from "@expo/vector-icons";
  
  import { useFonts } from "expo-font";
  
  export default function WellnessStatsCards() {
  
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
  
        {/* WATER */}
  
        <View style={styles.card}>
  
          <View style={styles.iconCircle}>
  
            <Ionicons
              name="water-outline"
              size={28}
              color="#4F46E5"
            />
  
          </View>
  
          <Text style={styles.value}>
            1.2L
          </Text>
  
          <Text style={styles.label}>
            Water
          </Text>
  
        </View>
  
        {/* SLEEP */}
  
        <View style={styles.card}>
  
          <View style={styles.iconCircle}>
  
            <Ionicons
              name="bed-outline"
              size={28}
              color="#666"
            />
  
          </View>
  
          <Text style={styles.value}>
            7h 20m
          </Text>
  
          <Text style={styles.label}>
            Good Sleep
          </Text>
  
        </View>
  
        {/* MOOD */}
  
        <View style={styles.card}>
  
          <View style={styles.iconCircle}>
  
            <MaterialCommunityIcons
              name="emoticon-outline"
              size={28}
              color="#666"
            />
  
          </View>
  
          <Text style={styles.value}>
            Calm
          </Text>
  
          <Text style={styles.label}>
            Current Mood
          </Text>
  
        </View>
  
      </View>
  
    );
  }
  
  const styles = StyleSheet.create({
  
    container: {
      flexDirection: "row",
      justifyContent: "space-between",
  
      marginBottom: 24,
    },
  
    card: {
      width: "31%",
  
      backgroundColor: "white",
  
      borderRadius: 20,
  
      paddingVertical: 10,
      paddingHorizontal: 0,
  
      alignItems: "center",
  
      shadowColor: "#000",
      shadowOpacity: 0.03,
      shadowRadius: 10,
      elevation: 3,
    },
  
    iconCircle: {
      width: 56,
      height: 56,
  
      borderRadius: 28,
  
      backgroundColor: "#F4F0FF",
  
      justifyContent: "center",
      alignItems: "center",
  
      marginBottom: 18,
    },
  
    value: {
      fontSize: 18,
      color: "#111",
  
      textAlign: "center",
  
      fontFamily: "PoppinsBold",
    },
  
    label: {
      marginTop: 4,
  
      fontSize: 12,
      lineHeight: 20,
  
      color: "#666",
  
      textAlign: "center",
  
      fontFamily: "PoppinsRegular",
    },
  
  });