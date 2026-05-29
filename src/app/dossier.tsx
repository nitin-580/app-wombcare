import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  TextInput,
  Alert,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";

export default function DossierScreen() {
  const router = useRouter();
  const { referredId } = useLocalSearchParams();

  const [loading, setLoading] = useState(true);
  const [selectedHistory, setSelectedHistory] = useState<any | null>(null);
  const [editingNoteText, setEditingNoteText] = useState("");
  const [savingNote, setSavingNote] = useState(false);
  const [dossierActiveTab, setDossierActiveTab] = useState<"overview" | "timeline">("overview");

  const [fontsLoaded] = useFonts({
    PoppinsRegular: require("../assets/fonts/Poppins-Regular.ttf"),
    PoppinsMedium: require("../assets/fonts/Poppins-Medium.ttf"),
    PoppinsSemiBold: require("../assets/fonts/Poppins-SemiBold.ttf"),
    PoppinsBold: require("../assets/fonts/Poppins-Bold.ttf"),
  });

  const fetchPatientHistory = async () => {
    if (!referredId) return;
    setLoading(true);
    try {
      const storedToken = await AsyncStorage.getItem("userToken");
      const response = await fetch(
        `https://womb-care-backend-76858014616.europe-west1.run.app/api/doctor/patient-history/${referredId}`,
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );
      const resJson = await response.json();
      if (resJson.success) {
        setSelectedHistory(resJson);
        setEditingNoteText(resJson.profile?.doctorNote || "");
      } else {
        Alert.alert("Access Denied", resJson.message || "Unable to retrieve clinical history.");
        router.back();
      }
    } catch (err) {
      Alert.alert("Network Error", "Failed to retrieve history logs.");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fontsLoaded && referredId) {
      fetchPatientHistory();
    }
  }, [fontsLoaded, referredId]);

  const handleSaveDoctorNote = async () => {
    if (!selectedHistory?.profile?.id) {
      Alert.alert("Error", "No user profile found associated with this patient.");
      return;
    }
    setSavingNote(true);
    try {
      const storedToken = await AsyncStorage.getItem("userToken");
      const response = await fetch(
        `https://womb-care-backend-76858014616.europe-west1.run.app/api/profiles/${selectedHistory.profile.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedToken}`,
          },
          body: JSON.stringify({
            doctorNote: editingNoteText,
          }),
        }
      );
      const resJson = await response.json();
      if (resJson.success) {
        Alert.alert("Success", "Clinical notes updated successfully! 🌸");
        setSelectedHistory({
          ...selectedHistory,
          profile: {
            ...selectedHistory.profile,
            doctorNote: editingNoteText,
          },
        });
      } else {
        Alert.alert("Failed", resJson.message || "Failed to update clinical note.");
      }
    } catch (err) {
      Alert.alert("Connection Error", "Failed to update note. Please try again.");
    } finally {
      setSavingNote(false);
    }
  };

  const getTimelineData = () => {
    interface TimelineEvent {
      date: Date;
      type: "period_start" | "period_end" | "wellness_log" | "profile_created";
      title: string;
      details: string;
    }
    const events: TimelineEvent[] = [];

    if (selectedHistory?.profile?.createdAt) {
      events.push({
        date: new Date(selectedHistory.profile.createdAt),
        type: "profile_created",
        title: "Account & Profile Created 🌸",
        details: `Initial WombCare registration completed. Baseline parameters stored in user profiles.`,
      });
    }

    if (selectedHistory?.periodHistory) {
      selectedHistory.periodHistory.forEach((cycle: any) => {
        if (cycle.startDate) {
          events.push({
            date: new Date(cycle.startDate),
            type: "period_start",
            title: "Period Cycle Started 🩸",
            details: `Logged start of period cycle. Status: Active bleeding. Symptoms logged: ${
              Array.isArray(cycle.symptoms) && cycle.symptoms.length > 0 ? cycle.symptoms.join(", ") : "None"
            }.`,
          });
        }
        if (cycle.endDate) {
          events.push({
            date: new Date(cycle.endDate),
            type: "period_end",
            title: "Period Cycle Ended ✨",
            details: `Logged completion of period bleeding phase. Bleeding duration: ${
              Math.round((new Date(cycle.endDate).getTime() - new Date(cycle.startDate).getTime()) / (1000 * 60 * 60 * 24))
            } days. Notes: ${cycle.notes || "None"}.`,
          });
        }
      });
    }

    if (selectedHistory?.wellnessHistory) {
      selectedHistory.wellnessHistory.forEach((log: any) => {
        const logDateStr = log.date || log.logDate;
        if (logDateStr) {
          const symptomsList = Array.isArray(log.symptoms) && log.symptoms.length > 0
            ? log.symptoms.join(", ")
            : "None";
          events.push({
            date: new Date(logDateStr),
            type: "wellness_log",
            title: "Daily Wellness Telemetry Log",
            details: `Mood: ${log.mood || "N/A"} | Sleep: ${log.sleep || 0} hrs | Hydration: ${log.waterIntake || 0} ml | Cycle Day: ${log.cycleDay || "N/A"}\nActive Symptoms: ${symptomsList}${log.journal ? `\nJournal Description: "${log.journal}"` : ""}`,
          });
        }
      });
    }

    events.sort((a, b) => b.date.getTime() - a.date.getTime());

    const grouped: { [monthYear: string]: TimelineEvent[] } = {};
    events.forEach(event => {
      const monthYear = event.date.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
      if (!grouped[monthYear]) {
        grouped[monthYear] = [];
      }
      grouped[monthYear].push(event);
    });

    return grouped;
  };

  if (!fontsLoaded || loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7C5CFF" />
        <Text style={styles.loadingText}>Retrieving Clinical Dossier...</Text>
      </View>
    );
  }

  const patientName = selectedHistory?.patient?.patientName || selectedHistory?.profile?.name || "Patient Dossier";
  const patientEmail = selectedHistory?.patient?.email || "";
  const patientMobile = selectedHistory?.patient?.mobile || "";

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F4FF" />
      
      {/* Dynamic Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#111" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle} numberOfLines={1}>{patientName}</Text>
          <Text style={styles.headerSubtitle}>
            {patientEmail} {patientMobile ? `• ${patientMobile}` : ""}
          </Text>
        </View>
      </View>

      {/* Dossier Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            dossierActiveTab === "overview" && styles.tabButtonActive,
          ]}
          onPress={() => setDossierActiveTab("overview")}
        >
          <Ionicons
            name="file-tray-full-outline"
            size={16}
            color={dossierActiveTab === "overview" ? "white" : "#7C5CFF"}
          />
          <Text
            style={[
              styles.tabButtonText,
              dossierActiveTab === "overview" && styles.tabButtonTextActive,
            ]}
          >
            Clinical Profile
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            dossierActiveTab === "timeline" && styles.tabButtonActive,
          ]}
          onPress={() => setDossierActiveTab("timeline")}
        >
          <Ionicons
            name="calendar-outline"
            size={16}
            color={dossierActiveTab === "timeline" ? "white" : "#7C5CFF"}
          />
          <Text
            style={[
              styles.tabButtonText,
              dossierActiveTab === "timeline" && styles.tabButtonTextActive,
            ]}
          >
            Date-wise History
          </Text>
        </TouchableOpacity>
      </View>

      {/* Page Content Scroll */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {dossierActiveTab === "overview" ? (
          <>
            {/* Demographics card */}
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Clinical Profile</Text>
              <View style={styles.row}>
                <View style={styles.col}>
                  <Text style={styles.label}>Age</Text>
                  <Text style={styles.value}>
                    {selectedHistory?.profile?.age ? `${selectedHistory.profile.age} years` : "Not specified"}
                  </Text>
                </View>
                <View style={styles.col}>
                  <Text style={styles.label}>Weight</Text>
                  <Text style={styles.value}>
                    {selectedHistory?.profile?.weight ? `${selectedHistory.profile.weight} kg` : "Not specified"}
                  </Text>
                </View>
              </View>
              <View style={[styles.row, { marginTop: 12 }]}>
                <View style={styles.col}>
                  <Text style={styles.label}>Height</Text>
                  <Text style={styles.value}>
                    {selectedHistory?.profile?.height ? `${selectedHistory.profile.height} cm` : "Not specified"}
                  </Text>
                </View>
                <View style={styles.col}>
                  <Text style={styles.label}>BMI Ratio</Text>
                  <Text style={styles.value}>
                    {(() => {
                      const w = selectedHistory?.profile?.weight;
                      const h = selectedHistory?.profile?.height;
                      if (w && h) {
                        const bmi = (w / ((h / 100) * (h / 100))).toFixed(1);
                        let cat = "Normal";
                        if (parseFloat(bmi) < 18.5) cat = "Underweight";
                        else if (parseFloat(bmi) >= 25 && parseFloat(bmi) < 30) cat = "Overweight";
                        else if (parseFloat(bmi) >= 30) cat = "Obese";
                        return `${bmi} (${cat})`;
                      }
                      return "Not calculated";
                    })()}
                  </Text>
                </View>
              </View>
              <View style={[styles.row, { marginTop: 12 }]}>
                <View style={styles.col}>
                  <Text style={styles.label}>Cycle Regularity</Text>
                  <Text style={styles.value}>
                    {selectedHistory?.patient?.cycleRegularity || "Regular"}
                  </Text>
                </View>
                <View style={styles.col}>
                  <Text style={styles.label}>Country</Text>
                  <Text style={styles.value}>
                    {selectedHistory?.patient?.country || "India"}
                  </Text>
                </View>
              </View>
            </View>

            {/* Care Plan Card */}
            <View style={styles.card}>
              <Text style={sectionTitleStyle}>Care Plan & Goals</Text>
              <View style={styles.row}>
                <View style={styles.col}>
                  <Text style={styles.label}>Active Subscription</Text>
                  <View style={selectedHistory?.profile?.activePlan ? styles.planBadgeActive : styles.planBadgeInactive}>
                    <Text style={selectedHistory?.profile?.activePlan ? styles.planBadgeActiveText : styles.planBadgeInactiveText}>
                      {selectedHistory?.profile?.activePlan ? selectedHistory.profile.activePlan.toUpperCase() : "NO ACTIVE CARE PLAN"}
                    </Text>
                  </View>
                </View>
                <View style={styles.col}>
                  <Text style={styles.label}>Water Intake Target</Text>
                  <Text style={styles.value}>
                    {selectedHistory?.profile?.targetWater ? `${selectedHistory.profile.targetWater} glasses` : "8 glasses"}
                  </Text>
                </View>
              </View>
              <View style={{ marginTop: 12 }}>
                <Text style={styles.label}>User Highlighted Symptoms</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 6, gap: 6 }}>
                  {selectedHistory?.profile?.symptoms && selectedHistory.profile.symptoms.length > 0 ? (
                    selectedHistory.profile.symptoms.map((sym: string, iIdx: number) => (
                      <View key={iIdx} style={styles.symptomBadgeChip}>
                        <Text style={styles.symptomBadgeChipText}>{sym}</Text>
                      </View>
                    ))
                  ) : (
                    <Text style={styles.valueSmall}>No active symptoms highlighted.</Text>
                  )}
                </View>
              </View>
              <View style={{ marginTop: 12 }}>
                <Text style={styles.label}>Baseline Health Problem Description</Text>
                <Text style={styles.valueSmall}>
                  {selectedHistory?.profile?.personalNotes || selectedHistory?.patient?.problem || "No personal notes recorded."}
                </Text>
              </View>
            </View>

            {/* Cycle History Card */}
            <View style={styles.card}>
              <Text style={sectionTitleStyle}>Logged Cycles & Periods</Text>
              {selectedHistory?.periodHistory && selectedHistory.periodHistory.length > 0 ? (
                selectedHistory.periodHistory.map((cycle: any, idx: number) => {
                  const hasEnded = !!cycle.endDate;
                  const bleedingDays = hasEnded
                    ? Math.round((new Date(cycle.endDate).getTime() - new Date(cycle.startDate).getTime()) / (1000 * 60 * 60 * 24))
                    : null;
                  return (
                    <View key={idx} style={styles.cycleHistoryItem}>
                      <View style={styles.cycleIconContainer}>
                        <Ionicons name="water" size={20} color="#FF4D8D" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.cycleDates}>
                          Start: {new Date(cycle.startDate).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })}
                        </Text>
                        <Text style={[styles.cycleDates, { color: hasEnded ? "#555" : "#FF4D8D" }]}>
                          End: {hasEnded ? new Date(cycle.endDate).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' }) : "Ongoing 🩸"}
                        </Text>
                        {hasEnded ? (
                          <View style={styles.cycleDurationBadgeCompleted}>
                            <Text style={styles.cycleDurationBadgeCompletedText}>
                              {bleedingDays || 1} days bleeding period
                            </Text>
                          </View>
                        ) : (
                          <View style={styles.cycleDurationBadgeActive}>
                            <Text style={styles.cycleDurationBadgeActiveText}>
                              Period currently active
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  );
                })
              ) : (
                <Text style={styles.noHistoryText}>No cycle logs tracked yet by user.</Text>
              )}
            </View>

            {/* Wellness Telemetry Card */}
            <View style={styles.card}>
              <Text style={sectionTitleStyle}>Wellness Telemetry (Last 10 Days)</Text>
              {selectedHistory?.wellnessHistory && selectedHistory.wellnessHistory.length > 0 ? (
                selectedHistory.wellnessHistory.slice(0, 10).map((log: any, idx: number) => (
                  <View key={idx} style={styles.wellnessHistoryItem}>
                    <View style={styles.wellnessIconContainer}>
                      <Ionicons name="pulse" size={20} color="#7C5CFF" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.wellnessDate}>
                        {new Date(log.logDate || log.date).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })}
                      </Text>
                      <View style={styles.wellnessDetailsRow}>
                        <Text style={styles.wellnessMetricText}>Mood: {log.mood || "N/A"}</Text>
                        <Text style={styles.wellnessMetricText}>
                          Sleep: {log.sleep || log.sleepHours || "0"} hrs
                        </Text>
                        <Text style={styles.wellnessMetricText}>
                          Water: {log.waterIntake || log.waterIntakeMl || "0"} ml
                        </Text>
                      </View>
                    </View>
                  </View>
                ))
              ) : (
                <Text style={styles.noHistoryText}>No daily wellness metrics logged yet.</Text>
              )}
            </View>

            {/* Clinical Notes Card */}
            <View style={styles.card}>
              <Text style={sectionTitleStyle}>Clinical Guidance & Note</Text>
              <Text style={styles.label}>Doctor Recommendations</Text>
              <TextInput
                style={styles.noteInput}
                multiline
                numberOfLines={5}
                value={editingNoteText}
                onChangeText={setEditingNoteText}
                placeholder="Write custom diet plans, supplement recommendations, exercise logs, or guidance..."
                placeholderTextColor="#A0A0A0"
              />
              <TouchableOpacity
                style={styles.saveNoteButton}
                onPress={handleSaveDoctorNote}
                disabled={savingNote}
              >
                {savingNote ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.saveNoteButtonText}>Save Clinical Guidance 🌸</Text>
                )}
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View style={{ flex: 1, paddingVertical: 4 }}>
            {(() => {
              const grouped = getTimelineData();
              const months = Object.keys(grouped);
              
              if (months.length === 0) {
                return (
                  <View style={styles.card}>
                    <Text style={styles.noHistoryText}>No timeline metrics or tracking logs available.</Text>
                  </View>
                );
              }

              return months.map((monthYear, mIdx) => (
                <View key={mIdx} style={styles.timelineMonthSection}>
                  <Text style={styles.timelineMonthHeader}>{monthYear}</Text>
                  <View style={styles.timelineLineContainer}>
                    {grouped[monthYear].map((event, eIdx) => {
                      let badgeColor = "#7C5CFF";
                      let badgeIcon = "pulse-outline";
                      if (event.type === "period_start") {
                        badgeColor = "#FF4D8D";
                        badgeIcon = "water-outline";
                      } else if (event.type === "period_end") {
                        badgeColor = "#10B981";
                        badgeIcon = "checkmark-circle-outline";
                      } else if (event.type === "profile_created") {
                        badgeColor = "#3B82F6";
                        badgeIcon = "person-add-outline";
                      }

                      return (
                        <View key={eIdx} style={styles.timelineEventItem}>
                          <View style={[styles.timelineBadge, { backgroundColor: badgeColor + "15", borderColor: badgeColor }]}>
                            <Ionicons name={badgeIcon as any} size={11} color={badgeColor} />
                          </View>
                          
                          <View style={styles.timelineContent}>
                            <View style={styles.timelineEventHeader}>
                              <Text style={styles.timelineEventTitle} numberOfLines={1}>{event.title}</Text>
                              <Text style={styles.timelineEventDate}>
                                {event.date.toLocaleDateString("en-IN", { day: 'numeric', month: 'short' })}
                              </Text>
                            </View>
                            <Text style={styles.timelineEventDetails}>{event.details}</Text>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                </View>
              ));
            })()}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const sectionTitleStyle = {
  fontSize: 16,
  color: "#7C5CFF",
  marginBottom: 16,
  fontFamily: "PoppinsBold",
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#F8F4FF",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#F8F4FF",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 14,
    color: "#7C5CFF",
    fontSize: 14,
    fontFamily: "PoppinsSemiBold",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: "#EEE",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F8F4FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    color: "#111",
    fontFamily: "PoppinsBold",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#666",
    fontFamily: "PoppinsMedium",
    marginTop: 2,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#F0E9FF",
    borderRadius: 16,
    padding: 4,
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 8,
  },
  tabButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  tabButtonActive: {
    backgroundColor: "#7C5CFF",
  },
  tabButtonText: {
    fontSize: 13,
    color: "#7C5CFF",
    fontFamily: "PoppinsSemiBold",
  },
  tabButtonTextActive: {
    color: "white",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 24,
    padding: 20,
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#F3EBFD",
    shadowColor: "#7C5CFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 16,
    color: "#7C5CFF",
    marginBottom: 16,
    fontFamily: "PoppinsBold",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  col: {
    flex: 1,
    marginRight: 8,
  },
  label: {
    fontSize: 12,
    color: "#666",
    fontFamily: "PoppinsMedium",
  },
  value: {
    fontSize: 15,
    color: "#111",
    fontFamily: "PoppinsSemiBold",
    marginTop: 4,
  },
  valueSmall: {
    fontSize: 13,
    color: "#444",
    fontFamily: "PoppinsRegular",
    marginTop: 4,
    lineHeight: 18,
  },
  planBadgeActive: {
    backgroundColor: "#D1FAE5",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  planBadgeActiveText: {
    fontSize: 11,
    color: "#059669",
    fontFamily: "PoppinsSemiBold",
  },
  planBadgeInactive: {
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  planBadgeInactiveText: {
    fontSize: 11,
    color: "#4B5563",
    fontFamily: "PoppinsSemiBold",
  },
  symptomBadgeChip: {
    backgroundColor: "#FFE5EF",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  symptomBadgeChipText: {
    fontSize: 12,
    color: "#FF4D8D",
    fontFamily: "PoppinsSemiBold",
  },
  cycleHistoryItem: {
    flexDirection: "row",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#F3EBFD",
    alignItems: "center",
  },
  cycleIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFE5EF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  cycleDates: {
    fontSize: 13,
    color: "#111",
    fontFamily: "PoppinsSemiBold",
  },
  cycleDurationBadgeCompleted: {
    backgroundColor: "#E0F2FE",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  cycleDurationBadgeCompletedText: {
    fontSize: 11,
    color: "#0284C7",
    fontFamily: "PoppinsMedium",
  },
  cycleDurationBadgeActive: {
    backgroundColor: "#FFE5EF",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  cycleDurationBadgeActiveText: {
    fontSize: 11,
    color: "#FF4D8D",
    fontFamily: "PoppinsMedium",
  },
  noHistoryText: {
    fontSize: 13,
    color: "#888",
    fontFamily: "PoppinsMedium",
    textAlign: "center",
    paddingVertical: 12,
  },
  wellnessHistoryItem: {
    flexDirection: "row",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#F3EBFD",
    alignItems: "center",
  },
  wellnessIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EEE9FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  wellnessDate: {
    fontSize: 14,
    color: "#111",
    fontFamily: "PoppinsSemiBold",
  },
  wellnessDetailsRow: {
    flexDirection: "row",
    marginTop: 4,
    gap: 12,
  },
  wellnessMetricText: {
    fontSize: 12,
    color: "#666",
    fontFamily: "PoppinsMedium",
  },
  noteInput: {
    backgroundColor: "#F9F9FB",
    borderWidth: 1,
    borderColor: "#E2D9F3",
    borderRadius: 16,
    padding: 14,
    fontSize: 13,
    color: "#111",
    fontFamily: "PoppinsRegular",
    minHeight: 100,
    textAlignVertical: "top",
    marginTop: 6,
    marginBottom: 12,
  },
  saveNoteButton: {
    backgroundColor: "#7C5CFF",
    borderRadius: 16,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#7C5CFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  saveNoteButtonText: {
    color: "white",
    fontSize: 14,
    fontFamily: "PoppinsSemiBold",
  },
  timelineMonthSection: {
    marginBottom: 24,
  },
  timelineMonthHeader: {
    fontSize: 13,
    color: "#7C5CFF",
    fontFamily: "PoppinsBold",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 12,
    marginLeft: 4,
  },
  timelineLineContainer: {
    borderLeftWidth: 2,
    borderLeftColor: "#E2D9F3",
    marginLeft: 14,
    paddingLeft: 18,
  },
  timelineEventItem: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "flex-start",
    position: "relative",
  },
  timelineBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    left: -32,
    backgroundColor: "white",
    borderWidth: 1.5,
  },
  timelineContent: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: "#F3EBFD",
    shadowColor: "#7C5CFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  timelineEventHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  timelineEventTitle: {
    fontSize: 11,
    color: "#111",
    fontFamily: "PoppinsSemiBold",
    flex: 1,
    marginRight: 6,
  },
  timelineEventDate: {
    fontSize: 9,
    color: "#888",
    fontFamily: "PoppinsMedium",
  },
  timelineEventDetails: {
    fontSize: 10,
    color: "#555",
    fontFamily: "PoppinsRegular",
    lineHeight: 14,
  },
});
