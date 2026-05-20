import {
    View,
    Text,
    StyleSheet,
  } from "react-native";
  
  export default function MoodHeader() {
  
    return (
  
      <View style={styles.container}>
  
        <Text style={styles.title}>
          Mood Tracker
        </Text>
  
        <Text style={styles.subtitle}>
          Track your emotional wellness today
        </Text>
  
      </View>
  
    );
  }
  
  const styles = StyleSheet.create({
  
    container: {
      marginTop: 20,
      marginBottom: 30,
    },
  
    title: {
      fontSize: 34,
      fontWeight: "700",
      color: "#111",
    },
  
    subtitle: {
      marginTop: 8,
      fontSize: 15,
      color: "#666",
    },
  
  });