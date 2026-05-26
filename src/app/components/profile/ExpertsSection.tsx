import {
  View,
  Text,
  StyleSheet,
  Image,
} from "react-native";

export default function ExpertsSection({ doctorNote }: { doctorNote?: string }) {

  return (

    <View style={styles.container}>

      <View style={styles.header}>

        <Text style={styles.heading}>
          Your Experts
        </Text>

        <Text style={styles.viewAll}>
          View All
        </Text>

      </View>

      <View style={styles.card}>

        <View style={styles.row}>

          <Image

            source={{
              uri: "https://randomuser.me/api/portraits/women/68.jpg",
            }}

            style={styles.image}
          />

          <View>

            <Text style={styles.name}>
              Dr. Elena
            </Text>

            <Text style={styles.role}>
              OB-GYN
            </Text>

          </View>

        </View>

        {doctorNote ? (
          <View style={styles.noteContainer}>
            <Text style={styles.noteLabel}>DOCTOR'S ADVICE</Text>
            <Text style={styles.noteText}>"{doctorNote}"</Text>
          </View>
        ) : null}

      </View>

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

    marginBottom: 20,
  },

  heading: {

    fontSize: 30,

    color: "#111",

    fontWeight: "700",
  },

  viewAll: {

    fontSize: 18,

    color: "#5B4CF0",
  },

  card: {

    backgroundColor: "white",

    borderRadius: 24,

    padding: 18,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  image: {

    width: 70,
    height: 70,

    borderRadius: 18,

    marginRight: 18,
  },

  name: {

    fontSize: 24,

    color: "#111",

    fontWeight: "700",
  },

  role: {

    marginTop: 6,

    fontSize: 18,

    color: "#666",
  },

  noteContainer: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F4",
  },

  noteLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#5B4CF0",
    letterSpacing: 0.5,
    marginBottom: 4,
  },

  noteText: {
    fontSize: 16,
    color: "#444",
    fontStyle: "italic",
    lineHeight: 22,
  },

});