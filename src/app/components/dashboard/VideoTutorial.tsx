import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
  } from "react-native";
  
  import { Ionicons } from "@expo/vector-icons";
  
  import { useFonts } from "expo-font";
  
  const tutorials = [
    {
      id: 1,
      title: "PCOS Yoga Flow",
      duration: "12 min",
  
      image:
        "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1200",
    },
  
    {
      id: 2,
      title: "Healthy Hormones Diet",
      duration: "8 min",
  
      image:
        "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1200",
    },
  
    {
      id: 3,
      title: "Stress Relief Meditation",
      duration: "15 min",
  
      image:
        "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1200",
    },
  
    {
      id: 4,
      title: "Beginner Prenatal Care",
      duration: "10 min",
  
      image:
        "https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=1200",
    },
  ];
  
  export default function TutorialVideosSection() {
  
    const [fontsLoaded] = useFonts({
      PoppinsRegular: require("../../../assets/fonts/Poppins-Regular.ttf"),
      PoppinsSemiBold: require("../../../assets/fonts/Poppins-SemiBold.ttf"),
      PoppinsBold: require("../../../assets/fonts/Poppins-Bold.ttf"),
    });
  
    if (!fontsLoaded) {
      return null;
    }
  
    return (
  
      <View style={styles.container}>
  
        {/* HEADER */}
  
        <View style={styles.header}>
  
          <Text style={styles.heading}>
            Tutorials
          </Text>
  
          <TouchableOpacity>
  
            <Text style={styles.seeAll}>
              See All
            </Text>
  
          </TouchableOpacity>
  
        </View>
  
        {/* HORIZONTAL SCROLL */}
  
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
        >
  
          {tutorials.map((item) => (
  
            <TouchableOpacity
              key={item.id}
              style={styles.card}
            >
  
              {/* IMAGE */}
  
              <Image
                source={{
                  uri: item.image,
                }}
                style={styles.image}
              />
  
              {/* PLAY BUTTON */}
  
              <View style={styles.playButton}>
  
                <Ionicons
                  name="play"
                  size={22}
                  color="white"
                />
  
              </View>
  
              {/* TEXT */}
  
              <View style={styles.content}>
  
                <Text style={styles.title}>
                  {item.title}
                </Text>
  
                <Text style={styles.duration}>
                  {item.duration}
                </Text>
  
              </View>
  
            </TouchableOpacity>
  
          ))}
  
        </ScrollView>
  
      </View>
  
    );
  }
  
  const styles = StyleSheet.create({
  
    container: {
      marginBottom: 30,
    },
  
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
  
      marginBottom: 18,
    },
  
    heading: {
      fontSize: 24,
      color: "#111",
  
      fontFamily: "PoppinsBold",
    },
  
    seeAll: {
      color: "#6C63FF",
      fontSize: 15,
  
      fontFamily: "PoppinsSemiBold",
    },
  
    card: {
      width: 240,
  
      backgroundColor: "white",
  
      borderRadius: 28,
  
      marginRight: 18,
  
      overflow: "hidden",
  
      shadowColor: "#000",
      shadowOpacity: 0.03,
      shadowRadius: 10,
      elevation: 3,
    },
  
    image: {
      width: "100%",
      height: 150,
    },
  
    playButton: {
      position: "absolute",
  
      top: 55,
      left: 95,
  
      width: 52,
      height: 52,
  
      borderRadius: 26,
  
      backgroundColor: "rgba(0,0,0,0.5)",
  
      justifyContent: "center",
      alignItems: "center",
    },
  
    content: {
      padding: 18,
    },
  
    title: {
      fontSize: 17,
      lineHeight: 24,
  
      color: "#111",
  
      fontFamily: "PoppinsBold",
    },
  
    duration: {
      marginTop: 8,
  
      color: "#777",
      fontSize: 14,
  
      fontFamily: "PoppinsRegular",
    },
  
  });