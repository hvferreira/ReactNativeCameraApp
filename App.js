import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, Button, Image } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { Camera, CameraType } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';

export default function App() {

  const [type, setType] = useState(CameraType.front);

  let cameraRef = useRef();
  const [hasCameraPermission, setHasCameraPermission] = useState();
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();
  const [photo, setPhoto] = useState();

  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
      setHasCameraPermission(cameraPermission.status === "granted");
      setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
    })();
  }, []);

  if (hasCameraPermission === undefined) {
    return <Text>Requesting permissions.</Text>
  } else if (!hasCameraPermission) {
    return <Text>Permission for camera Denied. Change the settings.</Text>
  }

  let takePic = async () => {
    let options = {
      quality: 1,
      base64: true,
      exif: false
    };

    let newPhoto = await cameraRef.current.takePictureAsync(options);
    setPhoto(newPhoto);
  };

  if (photo) {


    let savePhoto = () => {
      MediaLibrary.saveToLibraryAsync(photo.uri).then(() => {
        setPhoto(undefined);
      });
    };

    return (
      <SafeAreaView style={styles.container}>
        <Image style={styles.preview} source={{ uri: "data:image/jpg;base64," + photo.base64 }} />

        <View style={styles.buttonContainer}>
          {hasMediaLibraryPermission ? <Button title="Save" onPress={savePhoto} /> : undefined}
        </View>

        <View style={styles.buttonContainerFlip}>
          <Button title="Cancel" onPress={() => setPhoto(undefined)} />
        </View>

      </SafeAreaView>
    );
  }

  return (
    <Camera style={styles.container} type={type} ref={cameraRef} >
      <View style={styles.buttonContainer}>
        <Button title="Take Pic" onPress={takePic} />

      </View>
      <View style={styles.buttonContainerFlip}>
        <Button title="Flip" onPress={() => { setType(type === CameraType.back ? CameraType.front : CameraType.back) }} />
      </View>

      <StatusBar style="auto" />
    </ Camera >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    flex: 1,
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  buttonContainerFlip: {
    flex: 1,
    position: 'absolute',
    bottom: 20,
    left: 20,
  },
  preview: {
    alignSelf: 'stretch',
    flex: 1
  }
});