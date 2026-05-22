import {
    View,
    Text,
    StyleSheet,
  } from "react-native";
  
  export default function WaterHeader() {
  
    return (
  
      <View style={styles.container}>
  
        <Text style={styles.title}>
          Water Tracker
        </Text>
  
        <Text style={styles.subtitle}>
          Stay hydrated for better hormonal balance
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