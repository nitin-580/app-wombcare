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

import { useFonts } from "expo-font";

const sessions = [

  {
    title: "Prenatal Yoga",

    time: "Oct 28, 10:00 AM",

    coach: "Coach Sarah",

    image:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1200",
  },

  {
    title: "Nutrition for Two",

    time: "Oct 30, 02:00 PM",

    coach: "Dr. Elena",

    image:
      "https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=1200",
  },

];

export default function UpcomingSessions() {

  const [fontsLoaded] = useFonts({

    PoppinsRegular: require("../../../assets/fonts/Poppins-Regular.ttf"),

    PoppinsMedium: require("../../../assets/fonts/Poppins-Medium.ttf"),

    PoppinsSemiBold: require("../../../assets/fonts/Poppins-SemiBold.ttf"),

    PoppinsBold: require("../../../assets/fonts/Poppins-Bold.ttf"),

  });

  if (!fontsLoaded) {
    return null;
  }

  return (

    <View style={styles.container}>

      <View style={styles.header}>

        <Text style={styles.heading}>
          Upcoming Sessions
        </Text>

        <TouchableOpacity>

          <Text style={styles.viewAll}>
            View All
          </Text>

        </TouchableOpacity>

      </View>

      {sessions.map((item, index) => (

        <View
          key={index}
          style={styles.card}
        >

          <View style={styles.topRow}>

            <Image
              source={{
                uri: item.image,
              }}
              style={styles.image}
            />

            <View style={styles.info}>

              <Text style={styles.title}>
                {item.title}
              </Text>

              <View style={styles.timeRow}>

                <Ionicons
                  name="calendar-outline"
                  size={18}
                  color="#666"
                />

                <Text style={styles.time}>
                  {item.time}
                </Text>

              </View>

            </View>

          </View>

          <View style={styles.divider} />

          <View style={styles.bottomRow}>

            <View style={styles.coachRow}>

              <Image

                source={{
                  uri: "https://randomuser.me/api/portraits/women/68.jpg",
                }}

                style={styles.coachImage}
              />

              <Text style={styles.coach}>
                {item.coach}
              </Text>

            </View>

            <TouchableOpacity style={styles.joinButton}>

              <Text style={styles.joinText}>
                Join
              </Text>

            </TouchableOpacity>

          </View>

        </View>

      ))}

    </View>

  );
}

const styles = StyleSheet.create({

  container: {
    marginBottom: 34,
  },

  header: {

    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",

    marginBottom: 22,
  },

  heading: {

    fontSize: 24,

    color: "#111",

    fontFamily: "PoppinsBold",
  },

  viewAll: {

    fontSize: 16,

    color: "#5B4CF0",

    fontFamily: "PoppinsSemiBold",
  },

  card: {

    backgroundColor: "white",

    borderRadius: 30,

    padding: 18,

    marginBottom: 22,
  },

  topRow: {
    flexDirection: "row",
  },

  image: {

    width: 80,
    height: 80,

    borderRadius: 22,

    marginRight: 18,
  },

  info: {
    flex: 1,
    justifyContent: "center",
  },

  title: {

    fontSize: 20,

    color: "#111",

    marginBottom: 0,

    fontFamily: "PoppinsSemiBold",
  },

  timeRow: {

    flexDirection: "row",

    alignItems: "center",
  },

  time: {

    marginLeft: 8,

    fontSize: 12,

    color: "#666",

    fontFamily: "PoppinsRegular",
  },

  divider: {

    height: 1,

    backgroundColor: "#F2EFF8",

    marginVertical: 18,
  },

  bottomRow: {

    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",
  },

  coachRow: {

    flexDirection: "row",

    alignItems: "center",
  },

  coachImage: {

    width: 36,
    height: 36,

    borderRadius: 18,

    marginRight: 10,
  },

  coach: {

    fontSize: 12,

    color: "#555",

    fontFamily: "PoppinsMedium",
  },

  joinButton: {

    backgroundColor: "#5B4CF0",

    paddingHorizontal: 24,

    paddingVertical: 10,

    borderRadius: 30,
  },

  joinText: {

    color: "white",

    fontSize: 12,

    fontFamily: "PoppinsBold",
  },

});