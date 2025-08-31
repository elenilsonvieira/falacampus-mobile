import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActionSheetIOS, //menu nativo só no iOS.
  Platform, //detectar se está rodando em iOS, Android ou Web.
  Alert,
  Modal,
  Text,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';

const DEFAULT_AVATAR = 'https://ui-avatars.com/api/?name=User&background=ccc&color=fff';

export default function ProfilePhotoScreen() {

  const router = useRouter();
  const params = useLocalSearchParams();
  const initialPhoto = typeof params.uri === 'string' ? params.uri : DEFAULT_AVATAR;
  const [photo, setPhoto] = useState(initialPhoto);

  // para web
  const [modalVisible, setModalVisible] = useState(false);

  const openActionSheet = () => {

    if (Platform.OS === 'ios') {
      
      const options = photo !== DEFAULT_AVATAR? ['Alterar Foto', 'Remover Foto', 'Cancelar']: ['Alterar Foto', 'Cancelar'];
      const cancelButtonIndex = options.length - 1;

      ActionSheetIOS.showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex,
          destructiveButtonIndex: photo !== DEFAULT_AVATAR ? 1 : undefined,
          title: 'Foto de Perfil',
        },
        async (buttonIndex) => {
          if (buttonIndex === 0) handleChangePhoto();
          if (photo !== DEFAULT_AVATAR && buttonIndex === 1) handleRemovePhoto();
        }
      );

    } else if (Platform.OS === 'android') {
        const buttons: Array<{ text: string; onPress?: () => void }> = [
          { text: 'Alterar Foto', onPress: handleChangePhoto },
        ];

        if (photo !== DEFAULT_AVATAR) {
          buttons.push({ text: 'Remover Foto', onPress: handleRemovePhoto });
        }

        buttons.push({ text: 'Cancelar' });

        Alert.alert('Foto de Perfil', '', buttons);
      } else {
      // web
      setModalVisible(true);
      }
    };

  const handleChangePhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setPhoto(uri);
      await AsyncStorage.setItem('userPhoto', uri);
      router.back();
    }
  };

  const handleRemovePhoto = async () => {
    setPhoto(DEFAULT_AVATAR);
    await AsyncStorage.setItem('userPhoto', DEFAULT_AVATAR);
    router.back();
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: photo }} style={styles.fullImage} />

      <TouchableOpacity style={styles.editIcon} onPress={openActionSheet}>
        <MaterialIcons name="edit" size={26} color="#3f51b5" />
      </TouchableOpacity>

      {/* Modal customizado só para web */}
      {Platform.OS === 'web' && (
        <Modal visible={modalVisible} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Foto de Perfil</Text>

              <TouchableOpacity onPress={() => { setModalVisible(false); handleChangePhoto(); }}>
                <Text style={styles.modalOption}>Alterar Foto</Text>
              </TouchableOpacity>

              {photo !== DEFAULT_AVATAR && (
                <TouchableOpacity onPress={() => { setModalVisible(false); handleRemovePhoto(); }}>
                  <Text style={[styles.modalOption, { color: 'red' }]}>Remover Foto</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.modalOption}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  editIcon: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: '#fff',         // fundo branco
    padding: 12,
    borderRadius: 40,
    elevation: 5,                     // sombra no Android
    shadowColor: '#000',              // sombra no iOS/Web
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: 250,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalOption: {
    fontSize: 16,
    paddingVertical: 10,
    textAlign: 'center',
  },
});
