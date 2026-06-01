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
  const [searchQuery, setSearchQuery] = useState("");

  // Form States
  const [patientName, setPatientName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [problem, setProblem] = useState("PCOD/PMOS");

  // Data States
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Patient History Details States
  const [historyLoading, setHistoryLoading] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState<any | null>(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [editingNoteText, setEditingNoteText] = useState("");
  const [savingNote, setSavingNote] = useState(false);
  const [dossierActiveTab, setDossierActiveTab] = useState<"overview" | "timeline">("overview");

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
    if (!patientName.trim() || !mobile.trim() || !problem) {
      Alert.alert("Required Fields", "Please provide a name, mobile, and select a condition.");
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
            email: "",
            problem: problem,
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

  const handleViewPatientHistory = (referredId: string) => {
    router.push({
      pathname: "/dossier",
      params: { referredId },
    });
  };

  const handleSaveDoctorNote = async () => {
    if (!selectedHistory?.profile?.id) {
      Alert.alert("Error", "No user profile found associated with this patient.");
      return;
    }
    setSavingNote(true);
    try {
      const storedToken = token || (await AsyncStorage.getItem("userToken"));
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

    // 1. Add Profile Created Event
    if (selectedHistory?.profile?.createdAt) {
      events.push({
        date: new Date(selectedHistory.profile.createdAt),
        type: "profile_created",
        title: "Account & Profile Created 🌸",
        details: `Initial WombCare registration completed. Baseline parameters stored in user profiles.`,
      });
    }

    // 2. Add Period History Events
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

    // 3. Add Wellness Telemetry History Events
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

    // Sort events descending by date
    events.sort((a, b) => b.date.getTime() - a.date.getTime());

    // Group events by Month & Year (e.g. "May 2026")
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

  if (!fontsLoaded) {
    return null;
  }

  // Calculate dynamic stats
  const totalReferrals = referrals.length;
  const totalPatients = referrals.filter((r) => r.referralStatus === "converted").length;

  // Filter lists based on tab
  const activeReferralsList = referrals.filter((r) => r.referralStatus !== "converted");
  const activePatientsList = referrals
    .filter((r) => r.referralStatus === "converted")
    .filter((pat) => {
      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;
      const patientName = (pat.patientName || "").toLowerCase();
      const patientEmail = (pat.email || "").toLowerCase();
      const patientCode = (pat.doctorReferralCode || "").toLowerCase();
      const patientPhone = (pat.mobile || "").toLowerCase();
      return (
        patientName.includes(q) ||
        patientEmail.includes(q) ||
        patientCode.includes(q) ||
        patientPhone.includes(q)
      );
    });

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
                <Text style={styles.label}>Clinical Condition / Goal</Text>
                <View style={styles.toggleRow}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={[
                      styles.toggleOption,
                      problem === "PCOD/PMOS" && styles.toggleOptionActive,
                    ]}
                    onPress={() => setProblem("PCOD/PMOS")}
                  >
                    <Ionicons
                      name="medical-outline"
                      size={16}
                      color={problem === "PCOD/PMOS" ? "white" : "#FF4D8D"}
                      style={styles.optionIcon}
                    />
                    <Text
                      style={[
                        styles.toggleOptionText,
                        problem === "PCOD/PMOS" && styles.toggleOptionTextActive,
                      ]}
                    >
                      PCOD/PMOS
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={[
                      styles.toggleOption,
                      problem === "Conceive" && styles.toggleOptionActive,
                    ]}
                    onPress={() => setProblem("Conceive")}
                  >
                    <Ionicons
                      name="heart-outline"
                      size={16}
                      color={problem === "Conceive" ? "white" : "#FF4D8D"}
                      style={styles.optionIcon}
                    />
                    <Text
                      style={[
                        styles.toggleOptionText,
                        problem === "Conceive" && styles.toggleOptionTextActive,
                      ]}
                    >
                      Conceive
                    </Text>
                  </TouchableOpacity>
                </View>
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
                      {ref.email ? `${ref.email} • ` : ""}{ref.mobile}
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

            {/* SEARCH BAR */}
            <View style={styles.searchBarContainer}>
              <Ionicons name="search-outline" size={20} color="#7C5CFF" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search by name, email, referral code..."
                placeholderTextColor="#A0A0A0"
                clearButtonMode="while-editing"
              />
              {searchQuery !== "" && (
                <TouchableOpacity onPress={() => setSearchQuery("")} style={styles.clearSearchButton}>
                  <Ionicons name="close-circle" size={18} color="#999" />
                </TouchableOpacity>
              )}
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
              <View style={{ flex: 1, marginRight: 10 }}>
                <Text style={styles.modalTitle} numberOfLines={1}>
                  {selectedHistory?.patient?.patientName || selectedHistory?.profile?.name || "Patient Dossier"}
                </Text>
                <Text style={styles.modalSubtitle}>
                  {selectedHistory?.patient?.email || ""} {selectedHistory?.patient?.mobile ? `• ${selectedHistory.patient.mobile}` : ""}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowHistoryModal(false)}
                style={styles.closeModalButton}
              >
                <Ionicons name="close" size={28} color="#FF4D8D" />
              </TouchableOpacity>
            </View>

            {/* Tab Selector */}
            <View style={styles.dossierTabContainer}>
              <TouchableOpacity
                style={[
                  styles.dossierTabButton,
                  dossierActiveTab === "overview" && styles.dossierTabButtonActive,
                ]}
                onPress={() => setDossierActiveTab("overview")}
              >
                <Ionicons
                  name="file-tray-full-outline"
                  size={14}
                  color={dossierActiveTab === "overview" ? "white" : "#7C5CFF"}
                />
                <Text
                  style={[
                    styles.dossierTabButtonText,
                    dossierActiveTab === "overview" && styles.dossierTabButtonTextActive,
                  ]}
                >
                  Clinical Profile
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.dossierTabButton,
                  dossierActiveTab === "timeline" && styles.dossierTabButtonActive,
                ]}
                onPress={() => setDossierActiveTab("timeline")}
              >
                <Ionicons
                  name="calendar-outline"
                  size={14}
                  color={dossierActiveTab === "timeline" ? "white" : "#7C5CFF"}
                />
                <Text
                  style={[
                    styles.dossierTabButtonText,
                    dossierActiveTab === "timeline" && styles.dossierTabButtonTextActive,
                  ]}
                >
                  Date-wise History
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
              {dossierActiveTab === "overview" ? (
                <>
                  {/* Demographics & Clinical Profile */}
              <View style={styles.dossierCard}>
                <Text style={styles.dossierSectionTitle}>Clinical Profile</Text>
                <View style={styles.dossierRow}>
                  <View style={styles.dossierCol}>
                    <Text style={styles.dossierLabel}>Age</Text>
                    <Text style={styles.dossierValue}>
                      {selectedHistory?.profile?.age ? `${selectedHistory.profile.age} years` : "Not specified"}
                    </Text>
                  </View>
                  <View style={styles.dossierCol}>
                    <Text style={styles.dossierLabel}>Weight</Text>
                    <Text style={styles.dossierValue}>
                      {selectedHistory?.profile?.weight ? `${selectedHistory.profile.weight} kg` : "Not specified"}
                    </Text>
                  </View>
                </View>
                <View style={[styles.dossierRow, { marginTop: 12 }]}>
                  <View style={styles.dossierCol}>
                    <Text style={styles.dossierLabel}>Height</Text>
                    <Text style={styles.dossierValue}>
                      {selectedHistory?.profile?.height ? `${selectedHistory.profile.height} cm` : "Not specified"}
                    </Text>
                  </View>
                  <View style={styles.dossierCol}>
                    <Text style={styles.dossierLabel}>BMI Ratio</Text>
                    <Text style={styles.dossierValue}>
                      {(() => {
                        const h = selectedHistory?.profile?.height;
                        const w = selectedHistory?.profile?.weight;
                        const bmiVal = selectedHistory?.profile?.bmi || (h && w ? parseFloat((w / Math.pow(h / 100, 2)).toFixed(1)) : null);
                        return bmiVal 
                          ? `${bmiVal} (${bmiVal < 18.5 ? "Under" : bmiVal < 25 ? "Normal" : bmiVal < 30 ? "Over" : "Obese"})`
                          : "Not calculated";
                      })()}
                    </Text>
                  </View>
                </View>
                <View style={[styles.dossierRow, { marginTop: 12 }]}>
                  <View style={styles.dossierCol}>
                    <Text style={styles.dossierLabel}>Cycle Length</Text>
                    <Text style={styles.dossierValue}>
                      {selectedHistory?.profile?.cycleLength ? `${selectedHistory.profile.cycleLength} days` : "Not specified"}
                    </Text>
                  </View>
                  <View style={styles.dossierCol}>
                    <Text style={styles.dossierLabel}>Mobile Contact</Text>
                    <Text style={styles.dossierValue}>
                      {selectedHistory?.patient?.mobile || "Not provided"}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Care Plan & Goals */}
              <View style={styles.dossierCard}>
                <Text style={styles.dossierSectionTitle}>Care Plan & Goals</Text>
                
                <Text style={styles.dossierLabel}>Active Program</Text>
                {selectedHistory?.profile?.activePlan ? (
                  <View style={selectedHistory.profile.activePlan.toLowerCase().includes("premium") ? styles.planBadgePremium : styles.planBadgeBasic}>
                    <Text style={selectedHistory.profile.activePlan.toLowerCase().includes("premium") ? styles.planBadgeTextPremium : styles.planBadgeTextBasic}>
                      ✨ {selectedHistory.profile.activePlan}
                    </Text>
                  </View>
                ) : (
                  <Text style={[styles.dossierValueText, { color: "#666" }]}>No active Care Plan registered</Text>
                )}

                <View style={{ marginTop: 12 }}>
                  <Text style={styles.dossierLabel}>Wellness Goal</Text>
                  <Text style={styles.dossierValueText}>
                    🎯 {selectedHistory?.profile?.wellnessGoal || "General PCOD Management"}
                  </Text>
                </View>

                <View style={{ marginTop: 12 }}>
                  <Text style={styles.dossierLabel}>Tracked PCOD Symptoms</Text>
                  {selectedHistory?.profile?.symptoms && selectedHistory.profile.symptoms.length > 0 ? (
                    <View style={styles.symptomContainer}>
                      {selectedHistory.profile.symptoms.map((symptom: string, sIdx: number) => (
                        <View key={sIdx} style={styles.symptomBadge}>
                          <Text style={styles.symptomBadgeText}>{symptom}</Text>
                        </View>
                      ))}
                    </View>
                  ) : (
                    <Text style={[styles.dossierValueText, { fontStyle: "italic", color: "#999" }]}>
                      No active PCOD symptoms logged
                    </Text>
                  )}
                </View>

                <View style={{ marginTop: 12 }}>
                  <Text style={styles.dossierLabel}>Patient Onboarding Notes</Text>
                  <Text style={styles.dossierValueText}>
                    {selectedHistory?.profile?.personalNotes || selectedHistory?.patient?.problem || "No personal notes recorded."}
                  </Text>
                </View>
              </View>

              {/* Period Cycle History */}
              <View style={styles.dossierCard}>
                <Text style={styles.dossierSectionTitle}>Logged Cycles & Periods</Text>
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

              {/* Daily Wellness Tracking */}
              <View style={styles.dossierCard}>
                <Text style={styles.dossierSectionTitle}>Wellness Telemetry (Last 10 Days)</Text>
                {selectedHistory?.wellnessHistory && selectedHistory.wellnessHistory.length > 0 ? (
                  selectedHistory.wellnessHistory.slice(0, 10).map((log: any, idx: number) => (
                    <View key={idx} style={styles.wellnessHistoryItem}>
                      <View style={styles.wellnessIconContainer}>
                        <Ionicons name="pulse" size={20} color="#7C5CFF" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.wellnessDate}>
                          {new Date(log.logDate).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })}
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

              {/* Clinical Guidance Section */}
              <View style={styles.dossierCard}>
                <Text style={styles.dossierSectionTitle}>Clinical Guidance & Note</Text>
                <Text style={styles.dossierLabel}>Doctor Recommendations</Text>
                <TextInput
                  style={styles.noteInput}
                  multiline
                  numberOfLines={4}
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
            <View style={{ flex: 1, paddingHorizontal: 4, paddingVertical: 10 }}>
              {(() => {
                const grouped = getTimelineData();
                const months = Object.keys(grouped);
                
                if (months.length === 0) {
                  return (
                    <View style={styles.dossierCard}>
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
                            {/* Left Icon Badge Indicator */}
                            <View style={[styles.timelineBadge, { backgroundColor: badgeColor + "15", borderColor: badgeColor }]}>
                              <Ionicons name={badgeIcon as any} size={11} color={badgeColor} />
                            </View>
                            
                            {/* Event Content */}
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
  dossierTabContainer: {
    flexDirection: "row",
    backgroundColor: "#F0E9FF",
    borderRadius: 16,
    padding: 4,
    marginBottom: 16,
  },
  dossierTabButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  dossierTabButtonActive: {
    backgroundColor: "#7C5CFF",
  },
  dossierTabButtonText: {
    fontSize: 13,
    color: "#7C5CFF",
    fontFamily: "PoppinsSemiBold",
  },
  dossierTabButtonTextActive: {
    color: "white",
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
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E2D9F3",
    paddingHorizontal: 16,
    height: 52,
    marginTop: 16,
    marginBottom: 12,
    shadowColor: "#7C5CFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#111",
    fontFamily: "PoppinsMedium",
    paddingVertical: 8,
  },
  clearSearchButton: {
    padding: 4,
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
  symptomContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 8,
  },
  symptomBadge: {
    backgroundColor: "#FFE5EF",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  symptomBadgeText: {
    fontSize: 12,
    color: "#FF4D8D",
    fontFamily: "PoppinsSemiBold",
  },
  planBadgePremium: {
    backgroundColor: "#FFF3D6",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignSelf: "flex-start",
    marginTop: 6,
  },
  planBadgeTextPremium: {
    color: "#D89B00",
    fontSize: 12,
    fontFamily: "PoppinsBold",
  },
  planBadgeBasic: {
    backgroundColor: "#E0F2FE",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignSelf: "flex-start",
    marginTop: 6,
  },
  planBadgeTextBasic: {
    color: "#0284C7",
    fontSize: 12,
    fontFamily: "PoppinsBold",
  },
  noteInput: {
    borderWidth: 1,
    borderColor: "#EFEAFA",
    borderRadius: 18,
    padding: 14,
    minHeight: 100,
    fontSize: 14,
    color: "#111",
    fontFamily: "PoppinsRegular",
    backgroundColor: "#FAFAFA",
    textAlignVertical: "top",
    marginTop: 10,
  },
  saveNoteButton: {
    backgroundColor: "#FF4D8D",
    height: 50,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
  },
  saveNoteButtonText: {
    color: "white",
    fontSize: 14,
    fontFamily: "PoppinsSemiBold",
  },
  cycleDurationBadgeActive: {
    backgroundColor: "#FEE2E2",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  cycleDurationBadgeActiveText: {
    color: "#EF4444",
    fontSize: 11,
    fontFamily: "PoppinsSemiBold",
  },
  cycleDurationBadgeCompleted: {
    backgroundColor: "#DCFCE7",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  cycleDurationBadgeCompletedText: {
    color: "#16A34A",
    fontSize: 11,
    fontFamily: "PoppinsSemiBold",
  },
  toggleRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 6,
  },
  toggleOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF0F5",
    borderWidth: 1.5,
    borderColor: "#FFE4E1",
    paddingVertical: 12,
    borderRadius: 16,
  },
  toggleOptionActive: {
    backgroundColor: "#FF4D8D",
    borderColor: "#FF4D8D",
  },
  optionIcon: {
    marginRight: 6,
  },
  toggleOptionText: {
    fontSize: 13,
    fontFamily: "PoppinsSemiBold",
    color: "#FF4D8D",
  },
  toggleOptionTextActive: {
    color: "white",
  },
});