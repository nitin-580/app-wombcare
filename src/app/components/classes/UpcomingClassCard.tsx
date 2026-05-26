import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
} from "react-native";

import {
  Ionicons,
} from "@expo/vector-icons";

import { useFonts } from "expo-font";

import {
  useEffect,
  useState,
} from "react";

type PlacementType = {

  id: string;

  label: string;

  description: string;

  class?: {

    id: string;

    title?: string;

    description?: string;

    type?: string;

    thumbnailUrl?: string;

    videoUrl?: string;

    youtubeVideoId?: string;

    googleMeetLink?: string;

    scheduledAt?: string;

    instructorName?: string;

    duration?: number;
  };
};

export default function UpcomingSessions() {

  const [loading, setLoading] =
    useState(true);

  const [sessions, setSessions] =
    useState<any[]>([]);

  const [fontsLoaded] = useFonts({

    PoppinsRegular: require("../../../assets/fonts/Poppins-Regular.ttf"),

    PoppinsMedium: require("../../../assets/fonts/Poppins-Medium.ttf"),

    PoppinsSemiBold: require("../../../assets/fonts/Poppins-SemiBold.ttf"),

    PoppinsBold: require("../../../assets/fonts/Poppins-Bold.ttf"),

  });

  useEffect(() => {

    fetchPlacements();

  }, []);

  const fetchPlacements =
async () => {

  try {

    const response =
      await fetch(
        "https://womb-care-backend-76858014616.europe-west1.run.app/api/classes/placements"
      );

    const data =
      await response.json();

    console.log(
      "PLACEMENTS:",
      JSON.stringify(
        data,
        null,
        2
      )
    );

    if (data.success) {

      const placements =
        data.data || [];

      /* ---------------- FILTER ONLY LINK 2 & 3 ---------------- */

      const filteredPlacements =
        placements.filter(
          (p: PlacementType) =>
            p.label === "Link 2" ||
            p.label === "Link 3"
        );

      console.log(
        "FILTERED:",
        filteredPlacements
      );

      /* ---------------- MAP CLASSES ---------------- */

      const mappedClasses =
        filteredPlacements.map(
          (placement: PlacementType) => ({
            label: placement.label,
            class: placement.class,
          })
        );

      setSessions(mappedClasses);
    }

  } catch (err) {

    console.log(
      "PLACEMENT ERROR:",
      err
    );

  } finally {

    setLoading(false);
  }
};
  /* ---------------- EMPTY ---------------- */

  if (sessions.length === 0) {

    return (

      <View style={styles.container}>

        <View style={styles.header}>

          <Text style={styles.heading}>
            Upcoming Sessions
          </Text>

        </View>

        <View style={styles.emptyCard}>

          <Ionicons
            name="calendar-outline"
            size={54}
            color="#999"
          />

          <Text style={styles.emptyTitle}>
            No wellness sessions available
          </Text>

          <Text style={styles.emptySubtitle}>

            Upcoming wellness classes
            and guided care sessions
            will appear here automatically.

          </Text>

        </View>

      </View>
    );
  }

  return (

    <View style={styles.container}>

      {/* HEADER */}

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

      {/* SESSIONS */}

      {sessions.map((item, index) => {

        const classData =
          item.class;

        if (!classData) {
          return null;
        }

        return (

          <View
            key={index}
            style={styles.card}
          >

            {/* LINK BADGE */}

            <View style={styles.linkBadge}>

              <Text style={styles.linkText}>
                {item.label}
              </Text>

            </View>

            {/* TOP */}

            <View style={styles.topRow}>

              <Image

                source={{

                  uri:

                    classData.thumbnailUrl ||

                    `https://img.youtube.com/vi/${classData.youtubeVideoId}/hqdefault.jpg`,
                }}

                style={styles.image}
              />

              <View style={styles.info}>

                <Text style={styles.title}>

                  {classData.title ||
                    "Wellness Session"}

                </Text>

                <View style={styles.timeRow}>

                  <Ionicons
                    name="calendar-outline"
                    size={18}
                    color="#666"
                  />

                  <Text style={styles.time}>

                    {classData.scheduledAt

                      ? new Date(
                          classData.scheduledAt
                        ).toLocaleString()

                      : "Available Anytime"}

                  </Text>

                </View>

              </View>

            </View>

            {/* DESCRIPTION */}

            {classData.description ? (

              <Text style={styles.description}>
                {classData.description}
              </Text>

            ) : null}

            <View style={styles.divider} />

            {/* BOTTOM */}

            <View style={styles.bottomRow}>

              <View style={styles.coachRow}>

                <View style={styles.avatar}>

                  <Ionicons
                    name="person"
                    size={18}
                    color="white"
                  />

                </View>

                <Text style={styles.coach}>

                  {classData.instructorName ||

                    "WombCare Expert"}

                </Text>

              </View>

              {/* BUTTON */}

              {classData.googleMeetLink ? (

                <TouchableOpacity

                  style={styles.joinButton}

                  onPress={() =>

                    Linking.openURL(
                      classData.googleMeetLink
                    )
                  }
                >

                  <Text style={styles.joinText}>
                    Join
                  </Text>

                </TouchableOpacity>

              ) : (

                <TouchableOpacity

                  style={styles.watchButton}

                  onPress={() =>

                    Linking.openURL(
                      classData.videoUrl
                    )
                  }
                >

                  <Text style={styles.watchText}>
                    Watch
                  </Text>

                </TouchableOpacity>

              )}

            </View>

          </View>
        );
      })}

    </View>
  );
}

const styles = StyleSheet.create({

  loaderContainer: {

    height: 220,

    justifyContent: "center",

    alignItems: "center",
  },

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

    shadowColor: "#000",

    shadowOpacity: 0.03,

    shadowRadius: 10,

    elevation: 3,
  },

  linkBadge: {

    alignSelf: "flex-start",

    backgroundColor: "#F4F0FF",

    paddingHorizontal: 14,

    paddingVertical: 6,

    borderRadius: 20,

    marginBottom: 14,
  },

  linkText: {

    color: "#5B4CF0",

    fontSize: 12,

    fontFamily: "PoppinsBold",
  },

  topRow: {

    flexDirection: "row",
  },

  image: {

    width: 90,

    height: 90,

    borderRadius: 22,

    marginRight: 18,

    backgroundColor: "#EEE",
  },

  info: {

    flex: 1,

    justifyContent: "center",
  },

  title: {

    fontSize: 18,

    color: "#111",

    marginBottom: 6,

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

  description: {

    marginTop: 18,

    color: "#666",

    lineHeight: 24,

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

  avatar: {

    width: 36,

    height: 36,

    borderRadius: 18,

    backgroundColor: "#5B4CF0",

    justifyContent: "center",

    alignItems: "center",

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

  watchButton: {

    backgroundColor: "#111",

    paddingHorizontal: 24,

    paddingVertical: 10,

    borderRadius: 30,
  },

  watchText: {

    color: "white",

    fontSize: 12,

    fontFamily: "PoppinsBold",
  },

  emptyCard: {

    backgroundColor: "white",

    borderRadius: 30,

    padding: 40,

    justifyContent: "center",

    alignItems: "center",
  },

  emptyTitle: {

    marginTop: 20,

    fontSize: 18,

    color: "#111",

    textAlign: "center",

    fontFamily: "PoppinsBold",
  },

  emptySubtitle: {

    marginTop: 10,

    color: "#777",

    textAlign: "center",

    lineHeight: 24,

    fontFamily: "PoppinsRegular",
  },

});