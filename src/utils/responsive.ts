import { Platform, useWindowDimensions } from "react-native";

export const isTablet = Platform.OS === "ios" && Platform.isPad;
export const maxContentWidth = 600;

export function getResponsiveWidth(width: number, customMax = maxContentWidth): number | string {
  if (isTablet) {
    return Math.min(width * 0.85, customMax);
  }
  return "100%";
}

export function getResponsiveContainerStyle(width: number, customMax = maxContentWidth) {
  if (isTablet) {
    return {
      width: getResponsiveWidth(width, customMax) as any,
      alignSelf: "center" as const,
    };
  }
  return {
    width: "100%" as const,
  };
}

export function getResponsivePadding(width: number): number {
  if (isTablet) {
    return width > 1000 ? 40 : 28;
  }
  return 18;
}

export function useResponsive() {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  return {
    isTablet,
    isLandscape,
    screenWidth: width,
    screenHeight: height,
    maxContentWidth,
    responsiveContainerStyle: getResponsiveContainerStyle(width),
    responsiveWidth: getResponsiveWidth(width),
    responsivePadding: getResponsivePadding(width),
    getResponsiveWidth: (customMax?: number) => getResponsiveWidth(width, customMax),
    getResponsiveContainerStyle: (customMax?: number) => getResponsiveContainerStyle(width, customMax),
    getResponsivePadding: () => getResponsivePadding(width),
  };
}
