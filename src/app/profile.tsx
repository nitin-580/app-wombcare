// app/profile.tsx

import React, { useState, useCallback } from "react";
import {
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  Platform,
} from "react-native";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "./services/supabaseClient";

// 6 Gorgeous Curated Feminine Avatars
const PRESET_AVATARS = [
  { id: "1", uri: "https://randomuser.me/api/portraits/women/44.jpg", label: "Classic" },
  { id: "2", uri: "https://randomuser.me/api/portraits/women/65.jpg", label: "Vibrant" },
  { id: "3", uri: "https://randomuser.me/api/portraits/women/21.jpg", label: "Coral" },
  { id: "4", uri: "https://randomuser.me/api/portraits/women/32.jpg", label: "Active" },
  { id: "5", uri: "https://randomuser.me/api/portraits/women/17.jpg", label: "Grace" },
  { id: "6", uri: "https://randomuser.me/api/portraits/women/82.jpg", label: "Blossom" },
];

export default function ProfileScreen() {
  const [profile, setProfile] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [avatarUri, setAvatarUri] = useState<string>("https://randomuser.me/api/portraits/women/44.jpg");
  const [userId, setUserId] = useState<string>("");

  // Avatar Upload / Select Modal States
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [selectedAvatarId, setSelectedAvatarId] = useState<string>("1");
  const [customPhotoUrl, setCustomPhotoUrl] = useState<string>("");
  const [loggingOut, setLoggingOut] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // Select and Upload photo using expo-image-picker and Supabase Storage
  const handleSelectAndUploadPhoto = async () => {
    try {
      // 1. Request Media Library Permissions
      if (Platform.OS !== "web") {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission Denied", "We need access to your photos to upload a profile picture.");
          return;
        }
      }

      // 2. Launch Image Picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return;
      }

      const selectedImage = result.assets[0];
      setUploadingPhoto(true);

      // 3. Convert image to ArrayBuffer for Supabase Upload
      const response = await fetch(selectedImage.uri);
      const blob = await response.blob();
      const arrayBuffer = await new Response(blob).arrayBuffer();

      // 4. Set unique file path
      const fileExt = selectedImage.uri.split(".").pop() || "jpg";
      const fileName = `${userId}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // 5. Upload file to Supabase Bucket 'avatars'
      const { data, error } = await supabase.storage
        .from("avatars")
        .upload(filePath, arrayBuffer, {
          contentType: selectedImage.mimeType || "image/jpeg",
          upsert: true,
        });

      if (error) {
        console.error("Supabase Storage Error:", error);
        Alert.alert("Upload Failed", error.message || "Could not upload image to Supabase.");
        return;
      }

      // 6. Get Public URL
      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;

      // 7. Save to local state and AsyncStorage
      setAvatarUri(publicUrl);
      await AsyncStorage.setItem(`profile_avatar_${userId}`, publicUrl);
      
      // Update backend user profile if possible
      const token = await AsyncStorage.getItem("userToken");
      await fetch(
        `https://womb-care-backend-76858014616.europe-west1.run.app/api/profiles/${userId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            avatarUrl: publicUrl
          })
        }
      );

      Alert.alert("Success", "Profile photo uploaded to Supabase and updated successfully! 🌸");
      setIsPhotoModalOpen(false);
    } catch (err: any) {
      console.error("Upload error:", err);
      Alert.alert("Upload Error", err.message || "An unexpected error occurred during photo upload.");
    } finally {
      setUploadingPhoto(false);
    }
  };

  // Fonts loading
  const [fontsLoaded] = useFonts({
    PoppinsRegular: require("../assets/fonts/Poppins-Regular.ttf"),
    PoppinsMedium: require("../assets/fonts/Poppins-Medium.ttf"),
    PoppinsSemiBold: require("../assets/fonts/Poppins-SemiBold.ttf"),
    PoppinsBold: require("../assets/fonts/Poppins-Bold.ttf"),
  });

  async function fetchProfileData() {
    try {
      const userData = await AsyncStorage.getItem("userData");
      if (!userData) return;
      const parsed = JSON.parse(userData);
      const uid = parsed.id || parsed._id;
      setUserId(uid);

      // Load avatar from storage
      const storedAvatar = await AsyncStorage.getItem(`profile_avatar_${uid}`);
      if (storedAvatar) {
        setAvatarUri(storedAvatar);
        // Sync custom URL input if not a preset
        const matchingPreset = PRESET_AVATARS.find(a => a.uri === storedAvatar);
        if (!matchingPreset) {
          setCustomPhotoUrl(storedAvatar);
          setSelectedAvatarId("");
        } else {
          setSelectedAvatarId(matchingPreset.id);
        }
      }

      const token = await AsyncStorage.getItem("userToken");

      // Fetch profile data
      const profileResponse = await fetch(
        `https://womb-care-backend-76858014616.europe-west1.run.app/api/profiles/${uid}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const profileResult = await profileResponse.json();

      // Fetch history data
      const historyResponse = await fetch(
        `https://womb-care-backend-76858014616.europe-west1.run.app/api/profiles/${uid}/history`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const historyResult = await historyResponse.json();

      if (profileResult.success && profileResult.data) {
        setProfile(profileResult.data);
      }
      if (historyResult.success && Array.isArray(historyResult.data)) {
        setHistory(historyResult.data);
      }
    } catch (err) {
      console.log("Error loading profile details:", err);
    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchProfileData();
    }, [])
  );

  // Save selected avatar
  const handleSaveAvatar = async () => {
    try {
      let finalUri = avatarUri;
      if (customPhotoUrl.trim()) {
        finalUri = customPhotoUrl.trim();
      } else {
        const selected = PRESET_AVATARS.find(a => a.id === selectedAvatarId);
        if (selected) finalUri = selected.uri;
      }

      setAvatarUri(finalUri);
      await AsyncStorage.setItem(`profile_avatar_${userId}`, finalUri);
      setIsPhotoModalOpen(false);
      Alert.alert("Success", "Profile photo updated successfully! 🌸");
    } catch (err) {
      console.log("Error saving avatar:", err);
    }
  };

  // Logout routine
  const handleLogoutPress = () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to log out of WombCare?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Log Out",
          style: "destructive",
          onPress: async () => {
            try {
              setLoggingOut(true);
              await AsyncStorage.removeItem("userToken");
              await AsyncStorage.removeItem("userData");
              await AsyncStorage.removeItem("userRole");
              router.replace("/(auth)");
            } catch (err) {
              console.log("Logout error:", err);
            } finally {
              setLoggingOut(false);
            }
          },
        },
      ]
    );
  };

  // Calculate Averages from real tracker history
  const sleepRecords = history.filter(
    (h) => typeof h.sleep === "number" && h.sleep > 0
  );
  const avgSleep =
    sleepRecords.length > 0
      ? (sleepRecords.reduce((sum, h) => sum + h.sleep, 0) / sleepRecords.length).toFixed(1)
      : "7.2";

  const waterRecords = history.filter(
    (h) => typeof h.waterIntake === "number" && h.waterIntake > 0
  );
  const avgWaterGlasses =
    waterRecords.length > 0
      ? waterRecords.reduce((sum, h) => sum + h.waterIntake, 0) / waterRecords.length
      : 8.0;
  const avgWaterLiters = (avgWaterGlasses * 0.25).toFixed(1);

  if (!fontsLoaded || loading) {
    return (
      <SafeAreaView style={styles.loaderScreen}>
        <ActivityIndicator size="large" color="#FF5CA8" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        
        {/* Modern Custom Page Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Profile</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Dynamic Card 1: Avatar & User Basic Details */}
        <View style={styles.avatarCard}>
          {/* Circular Illustration Profile Pic */}
          <View style={styles.imageWrapper}>
            <LinearGradient
              colors={["#FF5CA8", "#5B4CF0"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.avatarBorder}
            >
              <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
            </LinearGradient>
            
            {/* Camera Picker Trigger Overlay */}
            <TouchableOpacity 
              style={styles.cameraIconBadge}
              onPress={() => setIsPhotoModalOpen(true)}
              activeOpacity={0.8}
            >
              <Ionicons name="camera" size={16} color="white" />
            </TouchableOpacity>
          </View>

          {/* Name & Basic details */}
          <Text style={styles.userName}>{profile?.name || "Patient Profile"}</Text>
          
          {/* Age & BMI Badge Row */}
          <View style={styles.badgeRow}>
            <View style={styles.detailsBadge}>
              <Ionicons name="calendar-outline" size={13} color="#FF5CA8" />
              <Text style={styles.badgeText}>Age: {profile?.age || "24"}</Text>
            </View>
            <View style={styles.detailsBadge}>
              <Ionicons name="heart-half-outline" size={13} color="#5B4CF0" />
              <Text style={styles.badgeText}>BMI: {profile?.bmi || "21.8"}</Text>
            </View>
          </View>
        </View>

        {/* Dynamic Card 2: Wellness averages section */}
        <View style={styles.sectionHeaderContainer}>
          <Ionicons name="stats-chart" size={18} color="#FF5CA8" />
          <Text style={styles.sectionHeading}>Wellness Averages</Text>
        </View>

        <View style={styles.statsCardGrid}>
          {/* Stat Item 1: Sleep Average */}
          <View style={styles.statsMiniCard}>
            <View style={[styles.iconContainer, { backgroundColor: "#EEECFE" }]}>
              <Ionicons name="moon" size={24} color="#5B4CF0" />
            </View>
            <Text style={styles.miniCardLabel}>SLEEP</Text>
            <Text style={styles.miniCardValue}>{avgSleep} Hrs</Text>
            <Text style={styles.miniCardSubtitle}>Per Night</Text>
          </View>

          {/* Stat Item 2: Water Average */}
          <View style={styles.statsMiniCard}>
            <View style={[styles.iconContainer, { backgroundColor: "#E6F6FF" }]}>
              <Ionicons name="water" size={24} color="#009BF2" />
            </View>
            <Text style={styles.miniCardLabel}>WATER</Text>
            <Text style={styles.miniCardValue}>{avgWaterLiters} L</Text>
            <Text style={styles.miniCardSubtitle}>Daily Intake</Text>
          </View>

          {/* Stat Item 3: Cycle Length */}
          <View style={styles.statsMiniCard}>
            <View style={[styles.iconContainer, { backgroundColor: "#FFEBF3" }]}>
              <Ionicons name="calendar" size={24} color="#FF5CA8" />
            </View>
            <Text style={styles.miniCardLabel}>CYCLE</Text>
            <Text style={styles.miniCardValue}>{profile?.cycleLength || "28"} Days</Text>
            <Text style={styles.miniCardSubtitle}>Avg Length</Text>
          </View>
        </View>

        {/* Dynamic Card 3: Logout options container */}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogoutPress}
          activeOpacity={0.9}
          disabled={loggingOut}
        >
          {loggingOut ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <>
              <Text style={styles.logoutText}>Log Out Account</Text>
              <Ionicons name="log-out-outline" size={20} color="white" />
            </>
          )}
        </TouchableOpacity>

      </ScrollView>

      {/* CHOOSE PROFILE PHOTO BOTTOM SHEET MODAL */}
      <Modal
        visible={isPhotoModalOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsPhotoModalOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Set Profile Picture 🌸</Text>
              <TouchableOpacity onPress={() => setIsPhotoModalOpen(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            {/* Supabase Storage File Upload Option */}
            <Text style={styles.modalLabel}>Upload from Device (Supabase) ☁️:</Text>
            <TouchableOpacity 
              style={styles.supabaseUploadBtn} 
              onPress={handleSelectAndUploadPhoto}
              disabled={uploadingPhoto}
            >
              {uploadingPhoto ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <>
                  <Ionicons name="cloud-upload" size={20} color="white" />
                  <Text style={styles.supabaseUploadText}>Choose Photo & Upload</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Presets Grid */}
            <Text style={styles.modalLabel}>Choose a lovely preset avatar:</Text>
            <View style={styles.presetGrid}>
              {PRESET_AVATARS.map((avatar) => {
                const isSelected = selectedAvatarId === avatar.id;
                return (
                  <TouchableOpacity
                    key={avatar.id}
                    style={[styles.presetCard, isSelected && styles.presetCardActive]}
                    onPress={() => {
                      setSelectedAvatarId(avatar.id);
                      setCustomPhotoUrl("");
                    }}
                  >
                    <Image source={{ uri: avatar.uri }} style={styles.presetImage} />
                    <Text style={[styles.presetLabel, isSelected && styles.presetLabelActive]}>
                      {avatar.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Custom URL Input option */}
            <Text style={styles.modalLabel}>Or paste custom image URL:</Text>
            <TextInput
              style={styles.urlInput}
              placeholder="https://example.com/my-photo.jpg"
              placeholderTextColor="#999"
              value={customPhotoUrl}
              onChangeText={(txt) => {
                setCustomPhotoUrl(txt);
                setSelectedAvatarId("");
              }}
              autoCapitalize="none"
              autoCorrect={false}
            />

            {/* Save Buttons */}
            <TouchableOpacity style={styles.saveAvatarBtn} onPress={handleSaveAvatar}>
              <Text style={styles.saveAvatarText}>Save Profile Photo</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loaderScreen: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 120,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 15,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 26,
    fontFamily: "PoppinsBold",
    color: "#1A1A1A",
  },
  headerSpacer: {
    width: 28,
  },
  avatarCard: {
    backgroundColor: "white",
    borderRadius: 28,
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 2,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  imageWrapper: {
    position: "relative",
    marginBottom: 16,
  },
  avatarBorder: {
    width: 128,
    height: 128,
    borderRadius: 64,
    justifyContent: "center",
    alignItems: "center",
    padding: 3,
  },
  avatarImage: {
    width: 122,
    height: 122,
    borderRadius: 61,
    backgroundColor: "#FFF",
  },
  cameraIconBadge: {
    position: "absolute",
    right: 4,
    bottom: 4,
    backgroundColor: "#FF5CA8",
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "white",
    shadowColor: "#FF5CA8",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  userName: {
    fontSize: 20,
    fontFamily: "PoppinsBold",
    color: "#2C2C2C",
    marginBottom: 8,
  },
  badgeRow: {
    flexDirection: "row",
    gap: 10,
  },
  detailsBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F7F8FC",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontFamily: "PoppinsMedium",
    color: "#666",
  },
  sectionHeaderContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 14,
    paddingLeft: 4,
  },
  sectionHeading: {
    fontSize: 15,
    fontFamily: "PoppinsBold",
    color: "#4A4A4A",
    letterSpacing: 0.3,
  },
  statsCardGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 35,
  },
  statsMiniCard: {
    backgroundColor: "white",
    width: "31%",
    borderRadius: 24,
    paddingVertical: 18,
    paddingHorizontal: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 1,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  miniCardLabel: {
    fontSize: 9,
    fontFamily: "PoppinsBold",
    color: "#999",
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  miniCardValue: {
    fontSize: 14,
    fontFamily: "PoppinsBold",
    color: "#2D2D2D",
    textAlign: "center",
  },
  miniCardSubtitle: {
    fontSize: 9,
    fontFamily: "PoppinsMedium",
    color: "#A0A0A0",
    marginTop: 2,
  },
  logoutButton: {
    backgroundColor: "#FF5CA8",
    borderRadius: 20,
    flexDirection: "row",
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    shadowColor: "#FF5CA8",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  logoutText: {
    color: "white",
    fontFamily: "PoppinsBold",
    fontSize: 15,
    letterSpacing: 0.5,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    paddingBottom: 40,
    maxHeight: "85%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: "PoppinsBold",
    color: "#333",
  },
  modalLabel: {
    fontSize: 12,
    fontFamily: "PoppinsSemiBold",
    color: "#666",
    marginBottom: 10,
    marginTop: 10,
  },
  presetGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 20,
  },
  presetCard: {
    width: "30%",
    backgroundColor: "#F7F8FC",
    borderRadius: 16,
    padding: 8,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  presetCardActive: {
    borderColor: "#FF5CA8",
    backgroundColor: "#FFEBF3",
  },
  presetImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 4,
  },
  presetLabel: {
    fontSize: 10,
    fontFamily: "PoppinsMedium",
    color: "#666",
  },
  presetLabelActive: {
    color: "#FF5CA8",
    fontFamily: "PoppinsBold",
  },
  urlInput: {
    backgroundColor: "#F7F8FC",
    borderWidth: 1,
    borderColor: "#EAEAEA",
    borderRadius: 14,
    height: 48,
    paddingHorizontal: 16,
    fontSize: 12,
    fontFamily: "PoppinsRegular",
    color: "#333",
    marginBottom: 24,
  },
  saveAvatarBtn: {
    backgroundColor: "#5B4CF0",
    borderRadius: 16,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#5B4CF0",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  saveAvatarText: {
    color: "white",
    fontSize: 14,
    fontFamily: "PoppinsBold",
  },
  supabaseUploadBtn: {
    backgroundColor: "#FF5CA8",
    borderRadius: 16,
    height: 52,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
    shadowColor: "#FF5CA8",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  supabaseUploadText: {
    color: "white",
    fontSize: 14,
    fontFamily: "PoppinsBold",
  },
});