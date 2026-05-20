import {
    View,
    Text,
    StyleSheet,
  } from "react-native";
  
  export default function StressLevelCard() {
  
    return (
  
      <View style={styles.card}>
  
        <Text style={styles.title}>
          Stress Level
        </Text>
  
        <Text style={styles.level}>
          Moderate
        </Text>
  
        <Text style={styles.subtitle}>
          Try meditation or a short walk today 🌿
        </Text>
  
      </View>
  
    );
  }
  
  const styles = StyleSheet.create({
  
    card: {
      backgroundColor: "#EAF9FF",
  
      borderRadius: 26,
  
      padding: 24,
  
      marginBottom: 30,
    },
  
    title: {
      fontSize: 18,
      fontWeight: "700",
      color: "#111",
    },
  
    level: {
      marginTop: 12,
      fontSize: 36,
      fontWeight: "700",
      color: "#7B61FF",
    },
  
    subtitle: {
      marginTop: 10,
      fontSize: 15,
      lineHeight: 24,
      color: "#555",
    },
  
  });