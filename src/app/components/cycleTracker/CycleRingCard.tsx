import {
    View,
    Text,
    StyleSheet,
  } from "react-native";
  
  import {
    AnimatedCircularProgress,
  } from "react-native-circular-progress";
  
  export default function CycleRingCard() {
  
    return (
  
      <View style={styles.container}>
  
        <AnimatedCircularProgress
          size={280}
          width={10}
          fill={70}
          tintColor="#FF6B8A"
          backgroundColor="#D9F5FF"
          rotation={220}
          lineCap="round"
        >
  
          {() => (
  
            <View style={styles.inner}>
  
              <Text style={styles.day}>
                Day 15
              </Text>
  
              <Text style={styles.phase}>
                Ovulation Phase
              </Text>
  
              <Text style={styles.emoji}>
                😊
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
  
    day: {
      fontSize: 52,
      fontWeight: "700",
      color: "#111",
    },
  
    phase: {
      marginTop: 8,
      fontSize: 18,
      color: "#666",
    },
  
    emoji: {
      fontSize: 42,
      marginTop: 18,
    },
  
  });