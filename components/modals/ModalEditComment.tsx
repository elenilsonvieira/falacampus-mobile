import { Modal, StyleSheet, TouchableOpacity } from "react-native";
import { Text, TextInput, View } from "react-native";
import * as Yup from "yup";
import { Formik } from "formik";

export type ModalCommentsProps ={
    editModalVisible:boolean;
    setEditModalVisible: (visible: boolean) => void;
    editTitulo: string;
    setEditTitulo: (name: string) => void;
    handleSaveEdit: () => void;
    editComment: string;
    setEditComment: (name: string) => void;

};
const validationSchema = Yup.object().shape({
  titulo: Yup.string()
    .trim()
    .min(5, "O título tem que ter no mínimo 5 caracteres")
    .max(50," O título não pode ser maior que 50 caracteres")
    .required("O nome do departamento é obrigatório."),
    comentario: Yup.string()
    .trim()
    .min(5, "O comentário tem que ter no mínimo 5 caracteres")
    .max(250," O comentário  não pode ser maior que 250 caracteres")
    .required("O nome do departamento é obrigatório."),
});

export default function ModalEditDepartment({
    editModalVisible,
    setEditModalVisible,
    editTitulo,
    setEditTitulo,
    editComment,
    setEditComment,
    handleSaveEdit,

    }:ModalCommentsProps){

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
                      initialValues={{
                        titulo: editTitulo,
                        comentario: editComment
                      }}
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
                            <Text style={styles.modalText}>Editar Título</Text>
                          <TextInput
                            style={styles.input}
                            placeholder="Digite o título"
                            value={values.titulo}
                            onChangeText={(text) => {
                              handleChange("titulo")(text);
                              setEditTitulo(text);
                            }}
                            onBlur={handleBlur("titulo")}
                          />
                          {touched.titulo && errors.titulo && (
                            <Text style={{ color: "red", marginBottom: 20 }}>{errors.titulo}</Text>
                          )}
                            <Text style={styles.modalText}>Editar Comentário</Text>
                          <TextInput
                            style={styles.inputComment}
                            placeholder="Digite o comentário"
                            value={values.comentario}
                            multiline={true}
                            onChangeText={(text) => {
                                handleChange("cometario")(text);
                                setEditComment(text);
                            }}
                            onBlur={handleBlur("cometario")}
                          />
                          {touched.comentario && errors.comentario && (
                            <Text style={{ color: "red", marginBottom: 20 }}>{errors.comentario}</Text>
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
  },
  inputComment: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    height:100
  },
});