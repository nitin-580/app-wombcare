import React from "react";

import {
  View,
  StyleSheet,
} from "react-native";

import YoutubeIframe
from "react-native-youtube-iframe";

type Props = {
  videoId: string;
};

export default function YoutubePlayer({
  videoId,
}: Props) {

  return (

    <View style={styles.container}>

      <YoutubeIframe

        height={230}

        play={false}

        videoId= {videoId}
      />

    </View>

  );
}

const styles = StyleSheet.create({

  container: {

    backgroundColor: "white",

    borderRadius: 24,

    overflow: "hidden",

    marginBottom: 24,
  },

});