import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '@/context/AuthContext';
import axios from 'axios';
import { IDepartment } from '@/interface/IDepartment';
import { useRouter } from 'expo-router';
import { useFocusEffect } from 'expo-router';

const DEFAULT_AVATAR = 'https://ui-avatars.com/api/?name=User&background=ccc&color=fff';

const User = () => {

    const router = useRouter();
    const { dataUser } = useContext(AuthContext);
    const [photo, setPhoto] = useState(DEFAULT_AVATAR);
    const [departments, setDepartments] = useState<IDepartment[]>([]);

    useFocusEffect(

        React.useCallback(() => {

          const loadPhoto = async () => {

            const savedPhoto = await AsyncStorage.getItem('userPhoto');
            if (savedPhoto) setPhoto(savedPhoto);

          };

        loadPhoto();
      }, []));

    useEffect(() => {

        const fetchUser = async () => {

            const departmentsRes = await axios.get("http://localhost:8080/api/departament/all");
            try {
                if(departmentsRes.status == 200){
                    setDepartments(departmentsRes.data);
                }
            } catch (error) {
                console.log(error);
                
            }
            
        };

        fetchUser();
    }, [])

    const getDepartmentName = (departamentId?: number | null) => {
        const departament = departments.find((d)=> Number(d.id) === departamentId);
        return departament;
    }; 

    return (
      <View style={styles.container}>
        <Image source={require('../../assets/images/Fala_campus-logo.png')} style={styles.logo} />

        <View style={styles.avatarContainer}>
          <TouchableOpacity onPress={() => router.push({pathname: '/screens/profile-photo', params: { uri: photo } })}>
            <Image source={{ uri: photo }} style={styles.avatar} />
          </TouchableOpacity>
        </View>

        <Text style={styles.name}>{dataUser?.name}</Text>
        <Text style={styles.email}>{dataUser?.email}</Text>
        <Text style={styles.department}>{getDepartmentName(dataUser?.departamentId)?.name}</Text>
      </View>
    );

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 40,
    resizeMode: 'contain',
    marginTop: 30,
    marginBottom: 40,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#DDD',
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  editButton: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: '#3f51b5',
    borderRadius: 16,
    padding: 4,
    borderWidth: 1.5,
    borderColor: '#fff',
    opacity: 0.7,
  },

  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1C',
    marginBottom: 10,
    textAlign: 'center',
  },
  email: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 10,
  },
  department: {
    fontSize: 16,
    color: '#555',
    fontWeight: '500',
    textAlign: 'center',
  },
});



export default User;
