import { Modal, StyleSheet, TouchableOpacity } from "react-native";
import { Text, TextInput, View } from "react-native";
import * as Yup from "yup";
import { Formik } from "formik";

export type ModalResponseProps ={
    editModalVisible:boolean;
    editResponse: string;
    setEditResponse: (name: string) => void;
    setEditModalVisible: (visible: boolean) => void;
    handleSaveEdit: () => void;

};
const validationSchema = Yup.object().shape({
  response: Yup.string()
    .trim()
    .min(5, "O campo tem que ter no mínimo 5 caracteres")
    .max(250," A resposta não pode ser maior que 250 caracteres")
    .required("O nome do departamento é obrigatório."),
});

export default function ModalEditDepartment({editModalVisible,setEditModalVisible,editResponse,setEditResponse,handleSaveEdit }:ModalResponseProps){

    return(
        <Modal
            visible={editModalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setEditModalVisible(false)}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalText}>Editar Resposta da Administração</Text>
                    <Formik
                      initialValues={{response:editResponse}}
                      validationSchema={validationSchema}
                      onSubmit={()=> handleSaveEdit()}
                    >
                      {({
                        handleChange,
                        handleSubmit,
                        values,
                        errors,
                        touched,
                        handleBlur, 
                      })=>(
                        <>
                          <TextInput
                            style={styles.input}
                            placeholder="Digite a resposta"
                            value={values.response}
                           multiline={true}
                            onChangeText={(text) => {
                              handleChange("response")(text);
                              setEditResponse(text);
                            }}
                            onBlur={handleBlur("response")}
                          />
                          {touched.response&& errors.response && (
                            <Text style={{ color: "red", marginBottom: 20 }}>{errors.response}</Text>
                          )}
                          <View style={styles.modalButtons}>
                              <TouchableOpacity
                              style={styles.modalButton}
                              onPress={() => handleSubmit()}
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
                        </>
                      )}

                    </Formik>
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
    fontWeight: 'bold',
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  modalButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    width: "40%",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: '#F44336',
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
    marginBottom: 10,
    height:100
  },
});