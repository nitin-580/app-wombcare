import {
    View,
    Text,
    StyleSheet,
  } from "react-native";
  
  export default function LegendRow() {
  
    return (
  
      <View style={styles.container}>
  
        <View style={styles.item}>
  
          <View
            style={[
              styles.dot,
              { backgroundColor: "#FF6B8A" },
            ]}
          />
  
          <Text style={styles.text}>
            Period phase
          </Text>
  
        </View>
  
        <View style={styles.item}>
  
          <View
            style={[
              styles.dot,
              { backgroundColor: "#9BE7F2" },
            ]}
          />
  
          <Text style={styles.text}>
            Fertile window
          </Text>
  
        </View>
  
      </View>
  
    );
  }
  
  const styles = StyleSheet.create({
  
    container: {
      flexDirection: "row",
      justifyContent: "center",
      marginBottom: 30,
    },
  
    item: {
      flexDirection: "row",
      alignItems: "center",
      marginHorizontal: 14,
    },
  
    dot: {
      width: 12,
      height: 12,
      borderRadius: 6,
      marginRight: 8,
    },
  
    text: {
      fontSize: 15,
      color: "#555",
    },
  
  });