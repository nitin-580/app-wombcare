import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
  } from "react-native";
  
  import {
    Ionicons,
  } from "@expo/vector-icons";
  
  export default function ProfileAvatarCard({
    name,
    age,
    cycleDay,
  }: {
    name: string;
    age: number;
    cycleDay: number;
  }) {
  
    return (
  
      <View style={styles.container}>
  
        <View style={styles.imageWrapper}>
  
          <Image
  
            source={{
              uri: "https://randomuser.me/api/portraits/women/44.jpg",
            }}
  
            style={styles.avatar}
          />
  
          <TouchableOpacity style={styles.editButton}>
  
            <Ionicons
              name="pencil"
              size={16}
              color="white"
            />
  
          </TouchableOpacity>
  
        </View>
  
        <Text style={styles.name}>
          {name}
        </Text>
  
        <Text style={styles.subtitle}>
          Age: {age} • Cycle: Day {cycleDay}
        </Text>
  
      </View>
  
    );
  }
  
  const styles = StyleSheet.create({
  
    container: {
      alignItems: "center",
      marginBottom: 30,
    },
  
    imageWrapper: {
      position: "relative",
    },
  
    avatar: {
  
      width: 140,
      height: 140,
  
      borderRadius: 70,
  
      borderWidth: 5,
      borderColor: "white",
    },
  
    editButton: {
  
      position: "absolute",
  
      right: 6,
      bottom: 6,
  
      width: 36,
      height: 36,
  
      borderRadius: 18,
  
      backgroundColor: "#5B4CF0",
  
      justifyContent: "center",
      alignItems: "center",
    },
  
    name: {
  
      marginTop: 20,
  
      fontSize: 34,
  
      color: "#111",
  
      fontWeight: "700",
    },
  
    subtitle: {
  
      marginTop: 8,
  
      fontSize: 18,
  
      color: "#666",
    },
  
  });