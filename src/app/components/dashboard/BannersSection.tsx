import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  NativeSyntheticEvent,
  NativeScrollEvent,
  useWindowDimensions,
} from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";

import { useResponsive } from "../../../utils/responsive";

interface Banner {
  id: string;
  title: string;
  imageUrl: string;
  targetUrl?: string;
  position: number;
}

const FALLBACK_BANNERS: Banner[] = [
  {
    id: "fallback-1",
    title: "🌸 Live Hormonal Wellness Masterclass\nJoin Dr. Anjali Mehta this Sunday at 11 AM",
    imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop",
    targetUrl: "https://wombcare.in/classes/hormonal-wellness",
    position: 1,
  },
  {
    id: "fallback-2",
    title: "✨ Premium PCOS Care Program\nTailored meal plans & daily yoga rituals",
    imageUrl: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=800&auto=format&fit=crop",
    targetUrl: "https://wombcare.in/pcos-care",
    position: 2,
  },
];

export default function BannersSection() {
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const { isTablet } = useResponsive();
  const CARD_WIDTH = isTablet ? Math.min(SCREEN_WIDTH - 40, 500) : SCREEN_WIDTH - 40;

  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const fetchBanners = async () => {
    try {
      const response = await fetch(
        "https://womb-care-backend-76858014616.europe-west1.run.app/api/banners"
      );
      const result = await response.json();
      if (result.success && Array.isArray(result.data) && result.data.length > 0) {
        setBanners(result.data);
      } else {
        setBanners(FALLBACK_BANNERS);
      }
    } catch (err) {
      console.log("FETCH BANNERS ERROR, USING FALLBACK:", err);
      setBanners(FALLBACK_BANNERS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollOffset / CARD_WIDTH);
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  const handleBannerPress = async (url?: string) => {
    if (!url) return;
    try {
      await WebBrowser.openBrowserAsync(url);
    } catch (error) {
      console.log("Could not open URL in-app:", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="small" color="#FF5CA8" />
      </View>
    );
  }

  if (banners.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Featured Updates</Text>
        <Text style={styles.subtitle}>Programs & Live Events</Text>
      </View>

      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        snapToInterval={CARD_WIDTH}
        decelerationRate="fast"
        contentContainerStyle={styles.scrollContainer}
      >
        {banners.map((banner) => (
          <TouchableOpacity
            key={banner.id}
            activeOpacity={0.9}
            style={[styles.cardContainer, { width: CARD_WIDTH }]}
            onPress={() => handleBannerPress(banner.targetUrl)}
          >
            <View style={styles.card}>
              <Image
                source={{ uri: banner.imageUrl }}
                style={styles.image}
                contentFit="cover"
                transition={300}
              />
              <LinearGradient
                colors={["transparent", "rgba(0, 0, 0, 0.4)", "rgba(0, 0, 0, 0.8)"]}
                locations={[0, 0.4, 1]}
                style={styles.gradient}
              />
              
              <View style={styles.contentContainer}>
                <View style={styles.tagWrapper}>
                  <Ionicons name="sparkles" size={12} color="#FFF" style={styles.tagIcon} />
                  <Text style={styles.tagText}>RECOMMENDED</Text>
                </View>
                
                <Text style={styles.bannerTitle} numberOfLines={2}>
                  {banner.title}
                </Text>

                {banner.targetUrl && (
                  <View style={styles.actionRow}>
                    <Text style={styles.actionText}>Learn More</Text>
                    <Ionicons name="arrow-forward-outline" size={14} color="#FFF" style={styles.arrowIcon} />
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Page Indicators */}
      {banners.length > 1 && (
        <View style={styles.indicatorContainer}>
          {banners.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === activeIndex ? styles.activeDot : null,
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  loaderContainer: {
    height: 160,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 4,
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    color: "#111",
    fontFamily: "PoppinsBold",
  },
  subtitle: {
    fontSize: 10,
    color: "#FF5CA8",
    fontFamily: "PoppinsSemiBold",
  },
  scrollContainer: {
    alignItems: "center",
  },
  cardContainer: {
    height: 180,
    paddingRight: 8,
  },
  card: {
    flex: 1,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "#F7FAFC",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  contentContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  tagWrapper: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "rgba(255, 92, 168, 0.85)",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  tagIcon: {
    marginRight: 4,
  },
  tagText: {
    color: "#FFF",
    fontSize: 8,
    fontWeight: "800",
    fontFamily: "PoppinsSemiBold",
    letterSpacing: 1,
  },
  bannerTitle: {
    color: "#FFF",
    fontSize: 15,
    fontFamily: "PoppinsBold",
    lineHeight: 22,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  actionText: {
    color: "#FFF",
    fontSize: 11,
    fontFamily: "PoppinsSemiBold",
    textDecorationLine: "underline",
  },
  arrowIcon: {
    marginLeft: 4,
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#E2E8F0",
    marginHorizontal: 3,
  },
  activeDot: {
    width: 16,
    backgroundColor: "#FF5CA8",
  },
});
