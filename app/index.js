import { Image, ImageBackground, StyleSheet, View } from "react-native";
import Button from "../Button";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { getData } from "../utilities";
import { useEffect } from "react";

const checkSession = async () => {
  const accessToken = await getData("access_token");
  if (accessToken !== null) {
    router.replace("/home");
  }
};

export default function Index() {
  useEffect(() => {
    checkSession();
  }, []);

  return (
    <ImageBackground
      source={require('../assets/images/background.jpg')}  // replace with your image URL
      style={styles.background}
    >
      <View
        style={styles.container}
      >
        <Image
          source={require('../assets/images/app_name.png')} // replace with your logo path
          style={styles.logo}
        />
        <Button
          title="INJIRA"
          backgroundColor="#478CCA"
          textColor="white"
          onPress={() => router.push("/login")}
        />
        <View style={{ marginTop: 20 }}></View>
        <Button
          title="IYANDIKISHE"
          backgroundColor="#478CCA3D"
          textColor="#3D576F"
          onPress={() => router.push("/signup")}
        />
        <View style={styles.helpButton}>
          <Button
            title="Ubufasha"
            backgroundColor="transparent"
            textColor="#3D576F"
            underlineText={true}
            onPress={() => router.push("/help")}
          />
        </View>
        <StatusBar style="dark" />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    position: 'relative',
  },
  logo: {
    width: 230, // Adjust the width as needed
    height: 80, // Adjust the height as needed
    marginBottom: 100,
  },
  helpButton: {
    position: 'absolute',
    bottom: 100,
  },
});