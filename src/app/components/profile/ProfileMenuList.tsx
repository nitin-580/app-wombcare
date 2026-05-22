import {
    View,
    Text,
    StyleSheet,
  } from "react-native";
  
  import {
    Ionicons,
  } from "@expo/vector-icons";
  
  const menu = [
  
    {
      icon: "person-outline",
      title: "Personal Details",
    },
  
    {
      icon: "bar-chart-outline",
      title: "Health Data",
    },
  
    {
      icon: "notifications-outline",
      title: "Notifications",
    },
  
    {
      icon: "lock-closed-outline",
      title: "Privacy & Security",
    },
  
  ];
  
  export default function ProfileMenuList() {
  
    return (
  
      <View style={styles.container}>
  
        {menu.map((item, index) => (
  
          <View
            key={index}
            style={styles.item}
          >
  
            <View style={styles.left}>
  
              <Ionicons
                name={item.icon as any}
                size={24}
                color="#777"
              />
  
              <Text style={styles.text}>
                {item.title}
              </Text>
  
            </View>
  
            <Ionicons
              name="chevron-forward"
              size={24}
              color="#777"
            />
  
          </View>
  
        ))}
  
      </View>
  
    );
  }
  
  const styles = StyleSheet.create({
  
    container: {
  
      backgroundColor: "white",
  
      borderRadius: 28,
  
      overflow: "hidden",
  
      marginBottom: 34,
    },
  
    item: {
  
      flexDirection: "row",
  
      justifyContent: "space-between",
  
      alignItems: "center",
  
      padding: 24,
  
      borderBottomWidth: 1,
      borderBottomColor: "#F0F0F4",
    },
  
    left: {
  
      flexDirection: "row",
  
      alignItems: "center",
    },
  
    text: {
  
      marginLeft: 16,
  
      fontSize: 20,
  
      color: "#111",
    },
  
  });