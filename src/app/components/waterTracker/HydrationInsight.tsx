import {
    View,
    Text,
    StyleSheet,
  } from "react-native";
  
  export default function HydrationInsight() {
  
    return (
  
      <View style={styles.card}>
  
        <Text style={styles.title}>
          Hydration Insight ✨
        </Text>
  
        <Text style={styles.text}>
          Drinking enough water may help reduce fatigue and improve skin health.
        </Text>
  
      </View>
  
    );
  }
  
  const styles = StyleSheet.create({
  
    card: {
      backgroundColor: "#EAF9FF",
  
      borderRadius: 26,
  
      padding: 24,
  
      marginBottom: 20,
    },
  
    title: {
      fontSize: 18,
      fontWeight: "700",
      color: "#111",
      marginBottom: 12,
    },
  
    text: {
      fontSize: 15,
      lineHeight: 24,
      color: "#555",
    },
  
  });