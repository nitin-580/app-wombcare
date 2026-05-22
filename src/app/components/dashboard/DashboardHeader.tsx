import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
  } from "react-native";
  
  import { useFonts } from "expo-font";
  
  import { Ionicons } from "@expo/vector-icons";
  
  import { router } from "expo-router";
  
  export default function DashboardHeader() {
  
    const [fontsLoaded] = useFonts({
  
      PoppinsRegular: require("../../../assets/fonts/Poppins-Regular.ttf"),
  
      PoppinsSemiBold: require("../../../assets/fonts/Poppins-SemiBold.ttf"),
  
      PoppinsBold: require("../../../assets/fonts/Poppins-Bold.ttf"),
  
    });
  
    if (!fontsLoaded) {
      return null;
    }
  
    return (
  
      <View style={styles.header}>
  
        <View>
  
          <Text style={styles.welcome}>
            Hi Nitin
          </Text>
  
          <Text style={styles.name}>
            Here's your health Summary
          </Text>
  
        </View>
  
        {/* PROFILE BUTTON */}
  
        <TouchableOpacity
  
          style={styles.profileButton}
  
          onPress={() =>
            router.push("/profile")
          }
        >
  
          <Ionicons
            name="person"
            size={22}
            color="#111"
          />
  
        </TouchableOpacity>
  
      </View>
  
    );
  }
  
  const styles = StyleSheet.create({
  
    header: {
  
      flexDirection: "row",
  
      justifyContent: "space-between",
  
      alignItems: "center",
  
      marginTop: 30,
  
      marginBottom: 10,
    },
  
    welcome: {
  
      fontSize: 32,
  
      color: "#111",
  
      fontFamily: "PoppinsSemiBold",
    },
  
    name: {
  
      fontSize: 16,
  
      color: "#777",
  
      marginBottom: 8,
  
      fontFamily: "PoppinsRegular",
    },
  
    profileButton: {
  
      width: 50,
      height: 50,
  
      borderRadius: 25,
  
      backgroundColor: "white",
  
      justifyContent: "center",
      alignItems: "center",
  
      shadowColor: "#000",
      shadowOpacity: 0.05,
      shadowRadius: 10,
      elevation: 4,
    },
  
  });