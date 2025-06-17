import React from "react";
import { ImageBackground, StyleSheet } from "react-native";

interface Props {
  children?: React.ReactNode;
}

const ContentBackground = ({ children }: Props) => {
  return (
    <ImageBackground
      source={require("../assets/content.jpg")} // replace with your image URL
      style={styles.background}
    >
      {children}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
});

export default ContentBackground;
