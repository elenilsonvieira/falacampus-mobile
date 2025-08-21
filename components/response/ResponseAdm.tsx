import React, { useContext } from 'react'
import { StyleSheet, Text, TouchableOpacity, View,  Dimensions } from 'react-native'


import { AuthContext } from '@/context/AuthContext';
import { IAnswer } from '@/interface/IAnswer';

const { width, height } = Dimensions.get('window');

export type ResposeAdmProps = {

    item:IAnswer;
    handleEditResponse:(answer:IAnswer) => void;
    setEditModalVisible:(visible: boolean) => void;
    setDeleteModalVisible:(visible: boolean) => void;
    setModalText:(text:string) => void;
    // setSelectedIten: ( item: string) => void;
};  
    

export default function ResponseAdm ({ item, handleEditResponse,setEditModalVisible,setModalText, setDeleteModalVisible   }: ResposeAdmProps){
  const {dataUser} = useContext(AuthContext);

  return(
    <View style={styles.responseContainer}>
        <Text style={styles.responseLabel}>Resposta da Administração:</Text>
        <Text style={styles.responseText}>{item.message}</Text>

        {dataUser?.roles[0].authority==="ADMIN" &&(
          
        <View style={styles.buttonContainer}>
            <TouchableOpacity
            style={[styles.editButton]}
            onPress={() =>{
              handleEditResponse(item)
              setEditModalVisible(true)
            } }
            >
            <Text style={styles.editButtonText}>Editar</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity
            style={[styles.deleteButton]}
            onPress={() => {
              setSelectedIten({
                action: 'response',
                item: item.id,
              });
              setDeleteModalVisible(true);
              setModalText("Tem certeza que quer deletar o resposta?");
            }}
            >
            <Text style={styles.deleteButtonText}>Remover</Text>
            </TouchableOpacity> */}
        </View>
        )}
    </View>
 )
}

const styles = StyleSheet.create({
     responseContainer: {
    marginTop: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#b2dfdb',
    borderRadius: 10,
  },
  responseLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  responseText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    marginTop: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  editButton: {
    backgroundColor: '#c8e6c9',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 6,
    marginRight: 10,
  },
  editButtonText: {
    color: '#388e3c',
    fontWeight: 'bold',
    fontSize: width * 0.035,
    },
  deleteButton: {
    backgroundColor: '#ffe5e5',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  deleteButtonText: {
    color: '#b71c1c',
    fontWeight: 'bold',
    fontSize: width * 0.035,
  },
})