import {
    View,
    Text,
    StyleSheet,
  } from "react-native";
  
  export default function ClassesHeader() {
  
    return (
  
      <View style={styles.container}>
  
        <Text style={styles.title}>
          Wellness Classes
        </Text>
  
        <Text style={styles.subtitle}>
          Join live sessions & community discussions
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