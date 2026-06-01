import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
  } from "react-native";
  
  import {
    Ionicons,
  } from "@expo/vector-icons";
  
  import { useFonts } from "expo-font";
  
  export default function ClassesHeader() {
  
    const [fontsLoaded] = useFonts({
  
      PoppinsRegular: require("../../../assets/fonts/Poppins-Regular.ttf"),
  
      PoppinsSemiBold: require("../../../assets/fonts/Poppins-SemiBold.ttf"),
  
      PoppinsBold: require("../../../assets/fonts/Poppins-Bold.ttf"),
  
    });
  
    if (!fontsLoaded) {
      return null;
    }
  
    return (
  
      <View style={styles.header}>
  
        <Text style={styles.title}>
          Classes
        </Text>
  
      </View>
  
    );
  }
  
  const styles = StyleSheet.create({
  
    header: {
  
      flexDirection: "row",
  
      justifyContent: "space-between",
  
      alignItems: "center",
  
      marginTop: 20,
  
      marginBottom: 28,
    },
  
    title: {
  
      fontSize: 30,
  
      color: "#111",
  
      fontFamily: "PoppinsBold",
    },
  
    avatar: {
  
      width: 50,
      height: 50,
  
      borderRadius: 25,
    },
  
  });