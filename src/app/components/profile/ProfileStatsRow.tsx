import {
    View,
    Text,
    StyleSheet,
  } from "react-native";
  
  import {
    Ionicons,
  } from "@expo/vector-icons";
  
  export default function ProfileStatsRow({
    cycleLength,
    avgSleep,
    avgWater,
  }: {
    cycleLength: number;
    avgSleep: string;
    avgWater: string;
  }) {
    const stats = [
      {
        icon: "calendar-outline",
        label: "CYCLE",
        value: `${cycleLength} Days`,
      },
      {
        icon: "moon-outline",
        label: "SLEEP",
        value: avgSleep,
      },
      {
        icon: "water-outline",
        label: "WATER",
        value: avgWater,
      },
    ];
  
    return (
  
      <View style={styles.row}>
  
        {stats.map((item, index) => (
  
          <View
            key={index}
            style={styles.card}
          >
  
            <Ionicons
              name={item.icon as any}
              size={30}
              color="#5B4CF0"
            />
  
            <Text style={styles.label}>
              {item.label}
            </Text>
  
            <Text style={styles.value}>
              {item.value}
            </Text>
  
          </View>
  
        ))}
  
      </View>
  
    );
  }
  
  const styles = StyleSheet.create({
  
    row: {
  
      flexDirection: "row",
  
      justifyContent: "space-between",
  
      marginBottom: 34,
    },
  
    card: {
  
      width: "31%",
  
      backgroundColor: "white",
  
      borderRadius: 24,
  
      paddingVertical: 24,
  
      alignItems: "center",
    },
  
    label: {
  
      marginTop: 14,
  
      fontSize: 14,
  
      color: "#666",
  
      fontWeight: "600",
    },
  
    value: {
  
      marginTop: 6,
  
      fontSize: 22,
  
      color: "#111",
  
      fontWeight: "700",
    },
  
  });