import {
    View,
    Text,
    StyleSheet,
  } from "react-native";
  
  const dates = [
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
  ];
  
  export default function DateSelector() {
  
    return (
  
      <View style={styles.container}>
  
        {dates.map((item, index) => {
  
          const active = item === "09";
  
          return (
  
            <View
              key={index}
              style={[
                styles.dateBox,
  
                active && styles.activeBox,
              ]}
            >
  
              <Text
                style={[
                  styles.day,
  
                  active && styles.activeDay,
                ]}
              >
                {item}
              </Text>
  
            </View>
  
          );
  
        })}
  
      </View>
  
    );
  }
  
  const styles = StyleSheet.create({
  
    container: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 30,
      marginBottom: 40,
    },
  
    dateBox: {
      width: 48,
      height: 72,
      borderRadius: 20,
  
      justifyContent: "center",
      alignItems: "center",
    },
  
    activeBox: {
      backgroundColor: "#BEEFFF",
    },
  
    day: {
      fontSize: 28,
      color: "#111",
    },
  
    activeDay: {
      fontWeight: "700",
    },
  
  });