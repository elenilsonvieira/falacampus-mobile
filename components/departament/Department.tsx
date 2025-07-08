import { AntDesign, Feather } from '@expo/vector-icons';
import { View,StyleSheet, TouchableOpacity } from 'react-native';
import {Text } from 'react-native-paper';


export type DepartmentProps ={
    nome: string;
    handleEdit:()=>void;
    handleDeleteConfirmation:()=>void;
};

export default function Department({nome,handleEdit,handleDeleteConfirmation}:DepartmentProps) {
    return (
        <View style={styles.card}>
            <View style={styles.headerContainer}>
                <View style={styles.textContainer}>
                    <Text style={styles.title} numberOfLines={2}>{nome} </Text>
                </View>

                <View style={styles.iconsContainer}>
                <TouchableOpacity style={styles.iconButton}
                    onPress={handleEdit}>
                    <AntDesign name="edit" size={20} color="#6cb43f" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton}
                    onPress={handleDeleteConfirmation}>
                    <Feather name="trash-2" size={20} color="#ff4444" />
                </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}



const styles = StyleSheet.create({
    
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  title: {
    fontSize: 18, 
  },
  textContainer: {
    flex: 1,
},
  iconsContainer: {
    flexDirection: 'row', 
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 8, 
  },
  iconButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  card: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%',
  },
  
});
