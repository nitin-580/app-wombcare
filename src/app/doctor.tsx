// app/doctor.tsx

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Referral {
  id: string;
  patientName: string;
  mobile: string;
  email: string;
  problem: string;
  doctorId: string;
  doctorReferralCode: string;
  referralStatus: "pending" | "contacted" | "converted" | "rejected" | "inactive";
  convertedPatientId: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function DoctorScreen() {
  const [activeTab, setActiveTab] = useState("referrals");

  // Form States
  const [patientName, setPatientName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [problem, setProblem] = useState("");

  // Data States
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Patient History Details States
  const [historyLoading, setHistoryLoading] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState<any | null>(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const [fontsLoaded] = useFonts({
    PoppinsRegular: require("../assets/fonts/Poppins-Regular.ttf"),
    PoppinsMedium: require("../assets/fonts/Poppins-Medium.ttf"),
    PoppinsSemiBold: require("../assets/fonts/Poppins-SemiBold.ttf"),
    PoppinsBold: require("../assets/fonts/Poppins-Bold.ttf"),
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const storedToken = await AsyncStorage.getItem("userToken");
      if (storedToken) {
        setToken(storedToken);
        const response = await fetch(
          "https://womb-care-backend-76858014616.europe-west1.run.app/api/referrals/my-referrals",
          {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          }
        );
        const resJson = await response.json();
        if (resJson.success) {
          setReferrals(resJson.referrals || []);
        }
      } else {
        Alert.alert("Session Expired", "Please log in to your doctor account.");
      }
    } catch (err) {
      console.error("Error loading referrals:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefer = async () => {
    if (!patientName.trim() || !mobile.trim() || !email.trim()) {
      Alert.alert("Required Fields", "Please provide a name, mobile, and email address.");
      return;
    }

    setSubmitting(true);
    try {
      const storedToken = token || (await AsyncStorage.getItem("userToken"));
      const response = await fetch(
        "https://womb-care-backend-76858014616.europe-west1.run.app/api/referrals",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedToken}`,
          },
          body: JSON.stringify({
            patientName: patientName.trim(),
            mobile: mobile.trim(),
            email: email.trim(),
            problem: problem.trim(),
          }),
        }
      );

      const resJson = await response.json();
      if (resJson.success) {
        Alert.alert(
          "Success",
          `Referral submitted! ${patientName} is now registered in WombCare administration.`
        );
        setPatientName("");
        setMobile("");
        setEmail("");
        setProblem("");
        loadData();
      } else {
        Alert.alert("Submission Failed", resJson.message || "Failed to submit referral.");
      }
    } catch (err) {
      Alert.alert("Connection Error", "Could not reach the WombCare service backend.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewPatientHistory = async (referredId: string) => {
    setHistoryLoading(true);
    try {
      const storedToken = token || (await AsyncStorage.getItem("userToken"));
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
        setShowHistoryModal(true);
      } else {
        Alert.alert("Access Denied", resJson.message || "Unable to retrieve clinical history.");
      }
    } catch (err) {
      Alert.alert("Network Error", "Failed to retrieve history logs.");
    } finally {
      setHistoryLoading(false);
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  // Calculate dynamic stats
  const totalReferrals = referrals.length;
  const totalPatients = referrals.filter((r) => r.referralStatus === "converted").length;

  // Filter lists based on tab
  const activeReferralsList = referrals.filter((r) => r.referralStatus !== "converted");
  const activePatientsList = referrals.filter((r) => r.referralStatus === "converted");

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* TOP HEADER */}
        <View style={styles.topSection}>
          <View style={styles.headerRow}>
            <Text style={styles.logo}>WombCare</Text>
            <TouchableOpacity onPress={loadData} disabled={loading} style={styles.refreshButton}>
              <Ionicons
                name="refresh-circle"
                size={32}
                color="#FF4D8D"
                style={loading ? styles.rotating : undefined}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.headerTitle}>Doctor Portal</Text>
          <Text style={styles.headerSubtitle}>Manage referrals and patient wellness</Text>
        </View>

        {/* STATS ROW */}
        <View style={styles.statsRow}>
          <View style={styles.statsCardPink}>
            <Ionicons name="people" size={24} color="#FF4D8D" />
            <Text style={styles.statsNumber}>{totalPatients}</Text>
            <Text style={styles.statsLabel}>Active Patients</Text>
          </View>

          <View style={styles.statsCardPurple}>
            <Ionicons name="document-text" size={24} color="#7C5CFF" />
            <Text style={styles.statsNumber}>{totalReferrals}</Text>
            <Text style={styles.statsLabel}>Referrals Sent</Text>
          </View>
        </View>

        {/* TAB NAVIGATION */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === "referrals" && styles.activeTabButton]}
            onPress={() => setActiveTab("referrals")}
          >
            <Text style={[styles.tabText, activeTab === "referrals" && styles.activeTabText]}>
              Referrals
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === "patients" && styles.activeTabButton]}
            onPress={() => setActiveTab("patients")}
          >
            <Text style={[styles.tabText, activeTab === "patients" && styles.activeTabText]}>
              Patients
            </Text>
          </TouchableOpacity>
        </View>

        {/* TAB CONTENT: REFERRALS */}
        {activeTab === "referrals" && (
          <View style={styles.contentContainer}>
            {/* QUICK REFERRAL HERO */}
            <View style={styles.heroPink}>
              <View>
                <Text style={styles.heroTitle}>Quick Referral</Text>
                <Text style={styles.heroSubtitle}>Refer a patient instantly</Text>
              </View>
              <Ionicons name="sparkles" size={34} color="white" />
            </View>

            {/* FORM */}
            <View style={styles.formCard}>
              <Text style={styles.sectionTitle}>Referral Details</Text>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Patient Name</Text>
                <TextInput
                  placeholder="Enter patient name"
                  placeholderTextColor="#AAA"
                  style={styles.input}
                  value={patientName}
                  onChangeText={setPatientName}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Mobile Number</Text>
                <TextInput
                  placeholder="+91 98765 43210"
                  placeholderTextColor="#AAA"
                  keyboardType="phone-pad"
                  style={styles.input}
                  value={mobile}
                  onChangeText={setMobile}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email Address</Text>
                <TextInput
                  placeholder="patient@email.com"
                  placeholderTextColor="#AAA"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Problem / Symptom details</Text>
                <TextInput
                  placeholder="Irregular cycles, severe cramping, hormonal acne..."
                  placeholderTextColor="#AAA"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  style={styles.textArea}
                  value={problem}
                  onChangeText={setProblem}
                />
              </View>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleRefer}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Text style={styles.submitText}>Refer Patient</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* RECENT REFERRALS */}
            <Text style={styles.recentTitle}>Recent Referrals</Text>

            {loading && referrals.length === 0 ? (
              <ActivityIndicator color="#FF4D8D" style={{ marginVertical: 20 }} />
            ) : activeReferralsList.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="documents-outline" size={40} color="#CCC" />
                <Text style={styles.emptyText}>No pending referrals found.</Text>
              </View>
            ) : (
              activeReferralsList.map((ref) => (
                <View key={ref.id} style={styles.referralCard}>
                  <View style={{ flex: 1, paddingRight: 10 }}>
                    <Text style={styles.patientName}>{ref.patientName}</Text>
                    <Text style={styles.patientProblem} numberOfLines={2}>
                      {ref.problem || "No notes provided"}
                    </Text>
                    <Text style={styles.patientMeta}>
                      {ref.email} • {ref.mobile}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      ref.referralStatus === "contacted" && styles.statusBadgeContacted,
                      ref.referralStatus === "rejected" && styles.statusBadgeRejected,
                    ]}
                  >
                    <Text style={styles.statusText}>{ref.referralStatus}</Text>
                  </View>
                </View>
              ))
            )}
          </View>
        )}

        {/* TAB CONTENT: ACTIVE PATIENTS */}
        {activeTab === "patients" && (
          <View style={styles.contentContainer}>
            {/* HERO */}
            <View style={styles.heroPurple}>
              <View>
                <Text style={styles.heroTitle}>Your Patients</Text>
                <Text style={styles.heroSubtitle}>View wellness telemetry and cycle logs</Text>
              </View>
              <Ionicons name="heart" size={34} color="white" />
            </View>

            {/* PATIENT CARDS */}
            {activePatientsList.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="heart-dislike-outline" size={48} color="#CCC" />
                <Text style={styles.emptyText}>No converted referral patients yet.</Text>
              </View>
            ) : (
              activePatientsList.map((pat) => (
                <TouchableOpacity
                  key={pat.id}
                  style={styles.patientCard}
                  onPress={() => handleViewPatientHistory(pat.id)}
                  disabled={historyLoading}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.patientCardName}>{pat.patientName}</Text>
                    <Text style={styles.patientCycle}>Referral Code: {pat.doctorReferralCode}</Text>
                    <Text style={styles.patientMeta}>{pat.email}</Text>
                  </View>
                  <View style={styles.safeBadge}>
                    <Text style={styles.safeText}>View Dossier</Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
        )}
      </ScrollView>

      {/* HEALTH HISTORY MODAL */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showHistoryModal}
        onRequestClose={() => setShowHistoryModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>
                  {selectedHistory?.patient?.name || "Patient Dossier"}
                </Text>
                <Text style={styles.modalSubtitle}>
                  {selectedHistory?.patient?.email || ""}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowHistoryModal(false)}
                style={styles.closeModalButton}
              >
                <Ionicons name="close" size={28} color="#FF4D8D" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
              {/* Demographics Card */}
              <View style={styles.dossierCard}>
                <Text style={styles.dossierSectionTitle}>Clinical Profile</Text>
                <View style={styles.dossierRow}>
                  <View style={styles.dossierCol}>
                    <Text style={styles.dossierLabel}>Age</Text>
                    <Text style={styles.dossierValue}>
                      {selectedHistory?.patient?.age || "Not specified"} years
                    </Text>
                  </View>
                  <View style={styles.dossierCol}>
                    <Text style={styles.dossierLabel}>Weight</Text>
                    <Text style={styles.dossierValue}>
                      {selectedHistory?.patient?.weight || "Not specified"} kg
                    </Text>
                  </View>
                </View>
                <View style={[styles.dossierRow, { marginTop: 12 }]}>
                  <View style={styles.dossierCol}>
                    <Text style={styles.dossierLabel}>Cycle regularity</Text>
                    <Text style={styles.dossierValue}>
                      {selectedHistory?.patient?.cycleRegularity || "regular"}
                    </Text>
                  </View>
                  <View style={styles.dossierCol}>
                    <Text style={styles.dossierLabel}>Country</Text>
                    <Text style={styles.dossierValue}>
                      {selectedHistory?.patient?.country || "India"}
                    </Text>
                  </View>
                </View>
                <View style={{ marginTop: 12 }}>
                  <Text style={styles.dossierLabel}>Referral Reason</Text>
                  <Text style={styles.dossierValueText}>
                    {selectedHistory?.patient?.symptoms || "None"}
                  </Text>
                </View>
              </View>

              {/* Period Cycle History */}
              <View style={styles.dossierCard}>
                <Text style={styles.dossierSectionTitle}>Logged Cycles</Text>
                {selectedHistory?.periodHistory && selectedHistory.periodHistory.length > 0 ? (
                  selectedHistory.periodHistory.map((cycle: any, idx: number) => (
                    <View key={idx} style={styles.cycleHistoryItem}>
                      <View style={styles.cycleIconContainer}>
                        <Ionicons name="calendar-sharp" size={20} color="#FF4D8D" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.cycleDates}>
                          Started: {new Date(cycle.startDate).toLocaleDateString()}
                        </Text>
                        <Text style={styles.cycleDates}>
                          Ended:{" "}
                          {cycle.endDate ? new Date(cycle.endDate).toLocaleDateString() : "Active"}
                        </Text>
                      </View>
                    </View>
                  ))
                ) : (
                  <Text style={styles.noHistoryText}>No cycle logs tracked yet by user.</Text>
                )}
              </View>

              {/* Daily Wellness Tracking */}
              <View style={styles.dossierCard}>
                <Text style={styles.dossierSectionTitle}>Wellness & Telemetry</Text>
                {selectedHistory?.wellnessHistory && selectedHistory.wellnessHistory.length > 0 ? (
                  selectedHistory.wellnessHistory.slice(0, 5).map((log: any, idx: number) => (
                    <View key={idx} style={styles.wellnessHistoryItem}>
                      <View style={styles.wellnessIconContainer}>
                        <Ionicons name="fitness" size={20} color="#7C5CFF" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.wellnessDate}>
                          Log Date: {new Date(log.logDate).toLocaleDateString()}
                        </Text>
                        <View style={styles.wellnessDetailsRow}>
                          <Text style={styles.wellnessMetricText}>Mood: {log.mood || "N/A"}</Text>
                          <Text style={styles.wellnessMetricText}>
                            Sleep: {log.sleepHours || "0"} hrs
                          </Text>
                          <Text style={styles.wellnessMetricText}>
                            Water: {log.waterIntakeMl || "0"} ml
                          </Text>
                        </View>
                      </View>
                    </View>
                  ))
                ) : (
                  <Text style={styles.noHistoryText}>No daily wellness metrics logged yet.</Text>
                )}
              </View>
            </ScrollView>

            <TouchableOpacity
              onPress={() => setShowHistoryModal(false)}
              style={styles.modalCloseButtonFull}
            >
              <Text style={styles.modalCloseButtonText}>Close Dossier</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F4FF",
  },
  topSection: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 10,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  refreshButton: {
    padding: 4,
  },
  rotating: {
    opacity: 0.6,
  },
  logo: {
    fontSize: 42,
    color: "#FF4D8D",
    fontFamily: "PoppinsBold",
  },
  headerTitle: {
    marginTop: 10,
    fontSize: 34,
    color: "#111",
    fontFamily: "PoppinsBold",
  },
  headerSubtitle: {
    marginTop: 6,
    fontSize: 15,
    color: "#666",
    lineHeight: 26,
    fontFamily: "PoppinsRegular",
  },
  statsRow: {
    flexDirection: "row",
    gap: 14,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  statsCardPink: {
    flex: 1,
    backgroundColor: "#FFE5EF",
    borderRadius: 28,
    padding: 22,
  },
  statsCardPurple: {
    flex: 1,
    backgroundColor: "#EEE9FF",
    borderRadius: 28,
    padding: 22,
  },
  statsNumber: {
    fontSize: 28,
    color: "#111",
    marginTop: 16,
    fontFamily: "PoppinsBold",
  },
  statsLabel: {
    marginTop: 6,
    color: "#666",
    fontSize: 14,
    fontFamily: "PoppinsMedium",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#F1EAFE",
    marginHorizontal: 20,
    borderRadius: 22,
    padding: 6,
    marginTop: 24,
  },
  tabButton: {
    flex: 1,
    height: 52,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  activeTabButton: {
    backgroundColor: "#111",
  },
  tabText: {
    color: "#777",
    fontSize: 15,
    fontFamily: "PoppinsSemiBold",
  },
  activeTabText: {
    color: "white",
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  heroPink: {
    marginTop: 24,
    backgroundColor: "#FF4D8D",
    borderRadius: 32,
    padding: 26,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  heroPurple: {
    marginTop: 24,
    backgroundColor: "#7C5CFF",
    borderRadius: 32,
    padding: 26,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  heroTitle: {
    color: "white",
    fontSize: 24,
    fontFamily: "PoppinsBold",
  },
  heroSubtitle: {
    color: "white",
    opacity: 0.8,
    marginTop: 8,
    fontSize: 14,
    fontFamily: "PoppinsRegular",
  },
  formCard: {
    backgroundColor: "white",
    borderRadius: 34,
    padding: 24,
    marginTop: 22,
  },
  sectionTitle: {
    fontSize: 26,
    color: "#111",
    marginBottom: 24,
    fontFamily: "PoppinsBold",
  },
  inputContainer: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    color: "#555",
    marginBottom: 10,
    fontFamily: "PoppinsMedium",
  },
  input: {
    height: 58,
    borderRadius: 18,
    backgroundColor: "#FAFAFA",
    borderWidth: 1,
    borderColor: "#EEE",
    paddingHorizontal: 18,
    fontSize: 15,
    color: "#111",
    fontFamily: "PoppinsRegular",
  },
  textArea: {
    minHeight: 100,
    borderRadius: 18,
    backgroundColor: "#FAFAFA",
    borderWidth: 1,
    borderColor: "#EEE",
    paddingHorizontal: 18,
    paddingTop: 18,
    fontSize: 15,
    color: "#111",
    fontFamily: "PoppinsRegular",
  },
  submitButton: {
    height: 58,
    borderRadius: 24,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  submitText: {
    color: "white",
    fontSize: 16,
    fontFamily: "PoppinsSemiBold",
  },
  recentTitle: {
    fontSize: 24,
    color: "#111",
    marginTop: 30,
    marginBottom: 18,
    fontFamily: "PoppinsBold",
  },
  referralCard: {
    backgroundColor: "white",
    borderRadius: 28,
    padding: 22,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  patientName: {
    fontSize: 18,
    color: "#111",
    fontFamily: "PoppinsSemiBold",
  },
  patientProblem: {
    marginTop: 6,
    color: "#555",
    fontSize: 14,
    fontFamily: "PoppinsRegular",
  },
  patientMeta: {
    marginTop: 4,
    color: "#999",
    fontSize: 12,
    fontFamily: "PoppinsMedium",
  },
  statusBadge: {
    backgroundColor: "#FFE5EF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  statusBadgeContacted: {
    backgroundColor: "#EEE9FF",
  },
  statusBadgeRejected: {
    backgroundColor: "#FEE2E2",
  },
  statusText: {
    color: "#111",
    fontSize: 11,
    fontFamily: "PoppinsSemiBold",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  patientCard: {
    backgroundColor: "white",
    borderRadius: 30,
    padding: 24,
    marginTop: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  patientCardName: {
    fontSize: 20,
    color: "#111",
    fontFamily: "PoppinsBold",
  },
  patientCycle: {
    marginTop: 4,
    color: "#7C5CFF",
    fontSize: 14,
    fontFamily: "PoppinsMedium",
  },
  safeBadge: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  safeText: {
    color: "#16A34A",
    fontSize: 12,
    fontFamily: "PoppinsSemiBold",
  },
  emptyContainer: {
    backgroundColor: "white",
    borderRadius: 28,
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#EFEAFA",
  },
  emptyText: {
    marginTop: 10,
    color: "#999",
    fontFamily: "PoppinsMedium",
    fontSize: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#F8F4FF",
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    maxHeight: "85%",
    padding: 24,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
    paddingBottom: 16,
  },
  modalTitle: {
    fontSize: 24,
    color: "#111",
    fontFamily: "PoppinsBold",
  },
  modalSubtitle: {
    fontSize: 13,
    color: "#666",
    fontFamily: "PoppinsRegular",
  },
  closeModalButton: {
    padding: 4,
  },
  dossierCard: {
    backgroundColor: "white",
    borderRadius: 28,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  dossierSectionTitle: {
    fontSize: 18,
    color: "#111",
    marginBottom: 14,
    fontFamily: "PoppinsBold",
  },
  dossierRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dossierCol: {
    flex: 1,
  },
  dossierLabel: {
    fontSize: 12,
    color: "#999",
    fontFamily: "PoppinsMedium",
    textTransform: "uppercase",
  },
  dossierValue: {
    fontSize: 16,
    color: "#111",
    fontFamily: "PoppinsSemiBold",
    marginTop: 2,
  },
  dossierValueText: {
    fontSize: 15,
    color: "#444",
    fontFamily: "PoppinsRegular",
    marginTop: 4,
    lineHeight: 22,
  },
  cycleHistoryItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F3EBFD",
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
    fontSize: 14,
    color: "#111",
    fontFamily: "PoppinsMedium",
  },
  noHistoryText: {
    fontSize: 14,
    color: "#999",
    fontFamily: "PoppinsRegular",
    fontStyle: "italic",
  },
  wellnessHistoryItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F3EBFD",
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
  modalCloseButtonFull: {
    backgroundColor: "#111",
    borderRadius: 24,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  modalCloseButtonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "PoppinsSemiBold",
  },
});