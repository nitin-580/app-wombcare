import {
    View,
    Text,
    StyleSheet,
    Image,
  } from "react-native";
  
  export default function CycleTopHeader() {
  
    return (
  
      <View style={styles.container}>
  
        <View>
  
          <Text style={styles.hello}>
            Hello, <Text style={styles.name}>Lily</Text>
          </Text>
  
          <Text style={styles.date}>
            9th August, 2024
          </Text>
  
        </View>
  
        <Image
          source={{
            uri: "https://i.pravatar.cc/100",
          }}
          style={styles.avatar}
        />
  
      </View>
  
    );
  }
  
  const styles = StyleSheet.create({
  
    container: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 20,
    },
  
    hello: {
      fontSize: 38,
      color: "#111",
    },
  
    name: {
      fontWeight: "700",
    },
  
    date: {
      marginTop: 12,
      color: "#555",
      fontSize: 16,
    },
  
    avatar: {
      width: 52,
      height: 52,
      borderRadius: 26,
    },
  
  });