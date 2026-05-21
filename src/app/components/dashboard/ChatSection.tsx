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
  
  export default function AIHealthAssistantCard() {
  
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
  
        {/* LEFT CONTENT */}
  
        <View style={styles.leftSection}>
  
          <View style={styles.badge}>
  
            <Ionicons
              name="sparkles"
              size={16}
              color="#6C63FF"
            />
  
            <Text style={styles.badgeText}>
              AI Assistant
            </Text>
  
          </View>
  
          <Text style={styles.title}>
            Chat with WombCare AI
          </Text>
  
          <Text style={styles.subtitle}>
            Ask about periods, PCOS, mood, sleep, workouts, or nutrition.
          </Text>
  
          <TouchableOpacity style={styles.button}>
  
            <Text style={styles.buttonText}>
              Start Chat
            </Text>
  
          </TouchableOpacity>
  
        </View>
  
        {/* RIGHT ICON */}
  
        <View style={styles.iconContainer}>
  
          <Ionicons
            name="chatbubbles"
            size={70}
            color="#6C63FF"
          />
  
        </View>
  
      </View>
  
    );
  }
  
  const styles = StyleSheet.create({
  
    container: {
      backgroundColor: "white",
  
      borderRadius: 30,
  
      padding: 24,
  
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
  
      marginBottom: 24,
  
      shadowColor: "#000",
      shadowOpacity: 0.03,
      shadowRadius: 10,
      elevation: 3,
    },
  
    leftSection: {
      flex: 1,
      paddingRight: 14,
    },
  
    badge: {
      flexDirection: "row",
      alignItems: "center",
  
      alignSelf: "flex-start",
  
      backgroundColor: "#F2F0FF",
  
      paddingHorizontal: 12,
      paddingVertical: 8,
  
      borderRadius: 20,
  
      marginBottom: 18,
    },
  
    badgeText: {
      marginLeft: 6,
  
      fontSize: 13,
      color: "#6C63FF",
  
      fontFamily: "PoppinsSemiBold",
    },
  
    title: {
      fontSize: 24,
      lineHeight: 34,
  
      color: "#111",
  
      fontFamily: "PoppinsBold",
    },
  
    subtitle: {
      marginTop: 10,
  
      fontSize: 14,
      lineHeight: 22,
  
      color: "#666",
  
      fontFamily: "PoppinsRegular",
    },
  
    button: {
      marginTop: 20,
  
      backgroundColor: "#6C63FF",
  
      paddingHorizontal: 22,
      paddingVertical: 14,
  
      borderRadius: 18,
  
      alignSelf: "flex-start",
    },
  
    buttonText: {
      color: "white",
      fontSize: 15,
  
      fontFamily: "PoppinsSemiBold",
    },
  
    iconContainer: {
      width: 90,
      height: 90,
  
      borderRadius: 45,
  
      backgroundColor: "#F4F2FF",
  
      justifyContent: "center",
      alignItems: "center",
    },
  
  });