import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
} from "react-native";

import {
  Ionicons,
} from "@expo/vector-icons";

import {
  useEffect,
  useState,
} from "react";

import YoutubeIframe
from "react-native-youtube-iframe";

type LiveClassType = {

  id: string;

  title: string;

  description: string;

  youtubeVideoId: string;

  googleMeetLink?: string;

  instructorName?: string;

  scheduledAt?: string;

  duration?: number;
};

export default function LiveClassCard() {

  const [loading, setLoading] =
    useState(true);

  const [liveClass, setLiveClass] =
    useState<LiveClassType | null>(
      null
    );

  useEffect(() => {

    fetchLiveClass();

  }, []);

  const fetchLiveClass =
  async () => {

    try {

      const response =
        await fetch(

          "https://womb-care-backend-76858014616.europe-west1.run.app/api/classes?type=live&isActive=true"

        );

      const result =
        await response.json();

      console.log(
        "LIVE CLASSES:",
        result
      );

      if (

        result.success &&

        result.data?.length > 0

      ) {

        setLiveClass(
          result.data[0]
        );
      }

    } catch (err) {

      console.log(
        "LIVE CLASS ERROR:",
        err
      );

    } finally {

      setLoading(false);
    }
  };

  /* ---------------- LOADING ---------------- */

  if (loading) {

    return (

      <View style={styles.loadingCard}>

        <ActivityIndicator
          size="large"
          color="#4F46E5"
        />

      </View>
    );
  }

  /* ---------------- EMPTY ---------------- */

  if (!liveClass) {

    return (

      <View style={styles.card}>

        <View style={styles.liveRow}>

          <View
            style={styles.inactiveDot}
          />

          <Text style={styles.offlineText}>
            NO LIVE SESSION
          </Text>

        </View>

        <View style={styles.emptyContainer}>

          <Ionicons
            name="moon-outline"
            size={54}
            color="#999"
          />

          <Text style={styles.emptyTitle}>
            No live wellness class right now
          </Text>

          <Text style={styles.emptySubtitle}>

            Upcoming wellness sessions
            and live interactions will
            appear here automatically.

          </Text>

        </View>

      </View>
    );
  }

  return (

    <View style={styles.card}>

      {/* LIVE STATUS */}

      <View style={styles.liveRow}>

        <View style={styles.liveDot} />

        <Text style={styles.liveText}>
          LIVE CLASS
        </Text>

      </View>

      {/* TITLE */}

      <Text style={styles.title}>
        {liveClass.title}
      </Text>

      {/* INSTRUCTOR */}

      {liveClass.instructorName ? (

        <Text style={styles.instructor}>
          By {liveClass.instructorName}
        </Text>

      ) : null}

      {/* VIDEO */}

      <View style={styles.videoContainer}>

        <YoutubeIframe

          height={220}

          play={false}

          videoId={
            liveClass.youtubeVideoId
          }
        />

      </View>

      {/* DESCRIPTION */}

      {liveClass.description ? (

        <Text style={styles.description}>
          {liveClass.description}
        </Text>

      ) : null}

      {/* SCHEDULE */}

      {liveClass.scheduledAt ? (

        <Text style={styles.schedule}>
          {new Date(
            liveClass.scheduledAt
          ).toLocaleString()}
        </Text>

      ) : null}

      {/* JOIN BUTTON */}

      {liveClass.googleMeetLink ? (

        <TouchableOpacity

          style={styles.joinButton}

          onPress={() =>

            Linking.openURL(

              liveClass.googleMeetLink!
            )
          }
        >

          <Ionicons
            name="videocam"
            size={22}
            color="white"
          />

          <Text style={styles.joinText}>
            Join Live Session
          </Text>

        </TouchableOpacity>

      ) : null}

    </View>
  );
}

const styles = StyleSheet.create({

  loadingCard: {

    height: 260,

    justifyContent: "center",

    alignItems: "center",

    backgroundColor: "white",

    borderRadius: 28,

    marginBottom: 24,
  },

  card: {

    marginBottom: 24,

    backgroundColor: "white",

    borderRadius: 28,

    padding: 18,

    shadowColor: "#000",

    shadowOpacity: 0.03,

    shadowRadius: 10,

    elevation: 3,
  },

  liveRow: {

    flexDirection: "row",

    alignItems: "center",

    marginBottom: 14,
  },

  liveDot: {

    width: 10,

    height: 10,

    borderRadius: 5,

    backgroundColor: "red",

    marginRight: 8,
  },

  inactiveDot: {

    width: 10,

    height: 10,

    borderRadius: 5,

    backgroundColor: "#999",

    marginRight: 8,
  },

  liveText: {

    color: "#111",

    fontWeight: "700",
  },

  offlineText: {

    color: "#777",

    fontWeight: "700",
  },

  title: {

    fontSize: 22,

    color: "#111",

    marginBottom: 6,

    fontWeight: "700",
  },

  instructor: {

    color: "#666",

    marginBottom: 18,
  },

  videoContainer: {

    overflow: "hidden",

    borderRadius: 22,

    backgroundColor: "#000",
  },

  description: {

    marginTop: 18,

    color: "#666",

    lineHeight: 24,
  },

  schedule: {

    marginTop: 14,

    color: "#4F46E5",

    fontWeight: "600",
  },

  joinButton: {

    marginTop: 20,

    height: 56,

    borderRadius: 20,

    backgroundColor: "#4F46E5",

    flexDirection: "row",

    justifyContent: "center",

    alignItems: "center",
  },

  joinText: {

    color: "white",

    fontSize: 16,

    marginLeft: 10,

    fontWeight: "700",
  },

  emptyContainer: {

    height: 220,

    justifyContent: "center",

    alignItems: "center",

    paddingHorizontal: 30,
  },

  emptyTitle: {

    marginTop: 18,

    fontSize: 18,

    color: "#111",

    textAlign: "center",

    fontWeight: "700",
  },

  emptySubtitle: {

    marginTop: 10,

    color: "#777",

    textAlign: "center",

    lineHeight: 24,
  },

});