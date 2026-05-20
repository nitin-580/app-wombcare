import {
    View,
    Text,
    StyleSheet,
  } from "react-native";
  
  import {
    AnimatedCircularProgress,
  } from "react-native-circular-progress";
  
  export default function WaterProgressCard() {
  
    return (
  
      <View style={styles.container}>
  
        <AnimatedCircularProgress
          size={250}
          width={16}
          fill={68}
          tintColor="#56CCF2"
          backgroundColor="#DFF6FF"
          rotation={220}
          lineCap="round"
        >
  
          {() => (
  
            <View style={styles.inner}>
  
              <Text style={styles.amount}>
                1.7L
              </Text>
  
              <Text style={styles.goal}>
                of 2.5L Goal
              </Text>
  
            </View>
  
          )}
  
        </AnimatedCircularProgress>
  
      </View>
  
    );
  }
  
  const styles = StyleSheet.create({
  
    container: {
      alignItems: "center",
      marginBottom: 30,
    },
  
    inner: {
      justifyContent: "center",
      alignItems: "center",
    },
  
    amount: {
      fontSize: 48,
      fontWeight: "700",
      color: "#111",
    },
  
    goal: {
      marginTop: 8,
      fontSize: 16,
      color: "#666",
    },
  
  });