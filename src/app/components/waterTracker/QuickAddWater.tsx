import {
    View,
    TouchableOpacity,
    Text,
    StyleSheet,
  } from "react-native";
  
  const amounts = [
    "100ml",
    "250ml",
    "500ml",
    "1L",
  ];
  
  export default function QuickAddWater() {
  
    return (
  
      <View style={styles.container}>
  
        {amounts.map((item, index) => (
  
          <TouchableOpacity
            key={index}
            style={styles.button}
          >
  
            <Text style={styles.text}>
              + {item}
            </Text>
  
          </TouchableOpacity>
  
        ))}
  
      </View>
  
    );
  }
  
  const styles = StyleSheet.create({
  
    container: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      marginBottom: 30,
    },
  
    button: {
      width: "48%",
  
      backgroundColor: "white",
  
      borderRadius: 22,
  
      paddingVertical: 20,
  
      alignItems: "center",
  
      marginBottom: 16,
  
      shadowColor: "#000",
      shadowOpacity: 0.03,
      shadowRadius: 10,
      elevation: 3,
    },
  
    text: {
      color: "#56CCF2",
      fontSize: 17,
      fontWeight: "700",
    },
  
  });