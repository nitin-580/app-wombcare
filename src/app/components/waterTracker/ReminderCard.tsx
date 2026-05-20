import {
    View,
    Text,
    StyleSheet,
  } from "react-native";
  
  export default function ReminderCard() {
  
    return (
  
      <View style={styles.card}>
  
        <Text style={styles.title}>
          Next Reminder ⏰
        </Text>
  
        <Text style={styles.time}>
          3:30 PM
        </Text>
  
        <Text style={styles.subtitle}>
          Time for your next glass of water 💙
        </Text>
  
      </View>
  
    );
  }
  
  const styles = StyleSheet.create({
  
    card: {
      backgroundColor: "white",
  
      borderRadius: 26,
  
      padding: 24,
  
      marginBottom: 40,
  
      shadowColor: "#000",
      shadowOpacity: 0.03,
      shadowRadius: 10,
      elevation: 3,
    },
  
    title: {
      fontSize: 18,
      fontWeight: "700",
      color: "#111",
    },
  
    time: {
      marginTop: 12,
      fontSize: 36,
      fontWeight: "700",
      color: "#56CCF2",
    },
  
    subtitle: {
      marginTop: 10,
      fontSize: 15,
      color: "#666",
      lineHeight: 24,
    },
  
  });