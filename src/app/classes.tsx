import React, { useState, useEffect, useCallback } from "react";

import {
  ScrollView,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import {
  SafeAreaView,
} from "react-native-safe-area-context";


import ClassesHeader
from "./components/classes/ClassesHeader";

import UpcomingClassCard
from "./components/classes/UpcomingClassCard";

import LiveClassCard
from "./components/classes/LiveClassCard";

import ChatBubble
from "./components/classes/ChatBubble";

import ChatInput
from "./components/classes/ChatInput";

import ClassesTabs
from "./components/classes/ClassesTabs";

import CompletedClasses
from "./components/classes/CompletedClasses";

import YoutubePlayer
from "./components/classes/YoutubePlayer";
import WombCareChatUI from "./components/classes/ChatBubble";
import LiveClassRoomModal from "./components/classes/LiveClassRoomModal";

import SkeletonLoader from "./components/common/SkeletonLoader";

export default function ClassesScreen() {
  const navigation = useNavigation();

  const [activeTab, setActiveTab] =
    useState("Upcoming");

  const [selectedLiveClass, setSelectedLiveClass] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Transition Focus Listener
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setLoading(true);
      const timer = setTimeout(() => {
        setLoading(false);
      }, 750);
      return () => clearTimeout(timer);
    });
    return unsubscribe;
  }, [navigation]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  // tabPress Auto-Refresh
  useEffect(() => {
    const parentNav: any = navigation.getParent();
    if (parentNav) {
      const unsubscribe = parentNav.addListener("tabPress", (e: any) => {
        if (navigation.isFocused()) {
          setRefreshing(true);
          setTimeout(() => {
            setRefreshing(false);
          }, 1200);
        }
      });
      return unsubscribe;
    }
  }, [navigation]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <SkeletonLoader preset="classes" />
      </SafeAreaView>
    );
  }

  return (

    <SafeAreaView style={styles.container} edges={["top"]}>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={["#FF5CA8"]}
            tintColor="#FF5CA8"
          />
        }
      >


        <ClassesHeader />

        {/* TABS */}

        <ClassesTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {/* UPCOMING TAB */}

        {activeTab === "Upcoming" && (

          <>
            <LiveClassCard
              refreshing={refreshing}
              onPress={(liveClass) => {
                setSelectedLiveClass({
                  id: liveClass.id,
                  title: liveClass.title,
                  youtubeVideoId: liveClass.youtubeVideoId,
                  instructorName: liveClass.instructorName,
                  description: liveClass.description,
                });
                setModalVisible(true);
              }}
            />

            <UpcomingClassCard refreshing={refreshing} />


<YoutubePlayer
  videoId="SLBlfumkDXc"
/>


          </>

        )}

        {/* COMPLETED TAB */}

        {activeTab === "Completed" && (

          <CompletedClasses refreshing={refreshing} />

        )}

      </ScrollView>

      <LiveClassRoomModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setSelectedLiveClass(null);
        }}
        liveClass={selectedLiveClass}
      />

    </SafeAreaView>

  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

});