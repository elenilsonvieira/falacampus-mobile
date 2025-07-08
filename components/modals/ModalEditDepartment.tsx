import { Modal, StyleSheet, TouchableOpacity } from "react-native";
import { Text, TextInput, View } from "react-native";

export type ModalDepartmentProps ={
    editModalVisible:boolean;
    editName: string;
    setEditName: (name: string) => void;
    setEditModalVisible: (visible: boolean) => void;
    handleSaveEdit: () => void;

};

export default function ModalEditDepartment({editModalVisible,setEditModalVisible,editName,setEditName,handleSaveEdit }:ModalDepartmentProps){

    return(
        <Modal
            visible={editModalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setEditModalVisible(false)}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalText}>Editar Departamento</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nome do Departamento"
                        value={editName}
                        onChangeText={setEditName}
                    />
                    <View style={styles.modalButtons}>
                        <TouchableOpacity
                        style={styles.modalButton}
                        onPress={handleSaveEdit}
                        >
                        <Text style={styles.buttonText}>Salvar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                        style={[styles.modalButton, styles.cancelButton]}
                        onPress={() => setEditModalVisible(false)}
                        >
                        <Text style={styles.buttonText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>  
    )
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  modalButton: {
    backgroundColor: "#6cb43f",
    padding: 10,
    borderRadius: 5,
    width: "40%",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#82368c",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
   input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
});