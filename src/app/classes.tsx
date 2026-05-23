import React, { useState } from "react";

import {
  ScrollView,
  StyleSheet,
} from "react-native";

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

export default function ClassesScreen() {

  const [activeTab, setActiveTab] =
    useState("Upcoming");

  return (

    <SafeAreaView style={styles.container}>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
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
            <LiveClassCard />

            <UpcomingClassCard />

            <ChatBubble
              sender="Dr. Sarah"
              message="Welcome everyone 💕"
            />

            <ChatBubble
              sender="Ananya"
              message="Excited for today’s yoga class!"
            />

            <ChatBubble
              sender="Priya"
              message="Can this help with stress reduction?"
            />

<YoutubePlayer
  videoId="CqtlcsxK2Xw"
/>

            <ChatInput />

          </>

        )}

        {/* COMPLETED TAB */}

        {activeTab === "Completed" && (

          <CompletedClasses />

        )}

      </ScrollView>

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