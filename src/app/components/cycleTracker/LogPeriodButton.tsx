import {
    TouchableOpacity,
    Text,
    StyleSheet,
  } from "react-native";
  
  export default function LogPeriodButton() {
  
    return (
  
      <TouchableOpacity style={styles.button}>
  
        <Text style={styles.text}>
          Log Period +
        </Text>
  
      </TouchableOpacity>
  
    );
  }
  
  const styles = StyleSheet.create({
  
    button: {
      alignSelf: "center",
  
      backgroundColor: "white",
  
      paddingHorizontal: 34,
      paddingVertical: 18,
  
      borderRadius: 22,
  
      shadowColor: "#000",
      shadowOpacity: 0.05,
      shadowRadius: 10,
      elevation: 4,
  
      marginBottom: 30,
    },
  
    text: {
      fontSize: 18,
      fontWeight: "600",
      color: "#111",
    },
  
  });