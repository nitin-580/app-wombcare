import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import { useFonts } from "expo-font";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH - 40;

export default function TestimonialsSection() {
  const [fontsLoaded] = useFonts({
    PoppinsRegular: require("../../../assets/fonts/Poppins-Regular.ttf"),
    PoppinsSemiBold: require("../../../assets/fonts/Poppins-SemiBold.ttf"),
    PoppinsBold: require("../../../assets/fonts/Poppins-Bold.ttf"),
  });

  const handleVideoPress = async () => {
    try {
      await WebBrowser.openBrowserAsync("https://youtu.be/SLBlfumkDXc");
    } catch (error) {
      console.log("Could not open Youtube Video:", error);
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recovery Testimonials</Text>
        <Text style={styles.subtitle}></Text>
      </View>

      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.cardContainer}
        onPress={handleVideoPress}
      >
        <View style={styles.card}>
          {/* YouTube Video Thumbnail */}
          <Image
            source={{ uri: "https://img.youtube.com/vi/SLBlfumkDXc/maxresdefault.jpg" }}
            style={styles.image}
            contentFit="cover"
            transition={300}
          />
          
          <LinearGradient
            colors={["transparent", "rgba(0, 0, 0, 0.3)", "rgba(0, 0, 0, 0.7)"]}
            locations={[0, 0.4, 1]}
            style={styles.gradient}
          />
          
          {/* Dynamic Play Button Overlay */}
          <View style={styles.playButtonWrapper}>
            <View style={styles.playButton}>
              <Ionicons name="play" size={26} color="#FF5CA8" style={styles.playIcon} />
            </View>
          </View>

          {/* Info Badge */}
          <View style={styles.badge}>
            <Ionicons name="logo-youtube" size={14} color="white" />
            <Text style={styles.badgeText}>WATCH STORY</Text>
          </View>

          {/* Testimonial Quote Content */}
          <View style={styles.contentContainer}>
            <Text style={styles.videoTitle} numberOfLines={2}>
              "My Natural Healing Journey from PCOD : By Wombcare!"
            </Text>
            <Text style={styles.authorText}>
              WombCare Wellness Participant
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 18,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 4,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    color: "#111",
    fontFamily: "PoppinsBold",
  },
  subtitle: {
    fontSize: 11,
    color: "#FF5CA8",
    fontFamily: "PoppinsSemiBold",
  },
  cardContainer: {
    width: CARD_WIDTH,
    height: 200,
  },
  card: {
    flex: 1,
    borderRadius: 28,
    overflow: "hidden",
    backgroundColor: "#F7FAFC",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  image: {
    ...StyleSheet.absoluteFillObject,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  playButtonWrapper: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  playButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#FF5CA8",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  playIcon: {
    marginLeft: 4, // Center the play triangle optically
  },
  badge: {
    position: "absolute",
    top: 16,
    left: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 92, 168, 0.9)",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    gap: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  badgeText: {
    color: "white",
    fontSize: 9,
    fontFamily: "PoppinsBold",
    letterSpacing: 1,
  },
  contentContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  videoTitle: {
    color: "#FFF",
    fontSize: 16,
    fontFamily: "PoppinsBold",
    lineHeight: 22,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  authorText: {
    color: "#E2E8F0",
    fontSize: 11,
    fontFamily: "PoppinsRegular",
    marginTop: 4,
  },
});
