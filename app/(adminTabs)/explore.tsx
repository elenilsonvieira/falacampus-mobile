import React, { useState, useEffect, useContext, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Keyboard,
  FlatList,
  RefreshControl,
  Dimensions,
  ScrollView,
} from "react-native";
import { Provider, Menu, Button } from "react-native-paper";
import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Yup from "yup";
import { Formik } from "formik";
import DropDownPicker from "react-native-dropdown-picker";
const { width, height } = Dimensions.get("window");

import ModalEditResponse from "@/components/modals/ModalEditResponse";
import ModalEditComment from "@/components/modals/ModalEditComment";
import ModalDelete from "@/components/modals/ModalDelete";
import { IComment } from "@/interface/IComment";
import ResponseAdm from "@/components/response/ResponseAdm";
import CommentComponent from "@/components/comment/Comment";
import axios from "axios";
import { AuthContext } from "@/context/AuthContext";
import { ICommentWithAnswer } from "@/interface/ICommentWithAnswer";
import { IAnswer } from "@/interface/IAnswer";
import { useFocusEffect } from "expo-router";




const validationSchema = Yup.object().shape({
  title: Yup.string()
    .trim()
    .max(50)
    .min(10, "O título tem que ter no mínimo 10 caracteres")
    .required("O título é obrigatório."),

  commentType: Yup.string().required("O tipo de comentário é obrigatório."),
});

const SearchComments = () => {
  const {dataUser} = useContext(AuthContext);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("Buscar por");
  const [selectedComment, setselectedComment] = useState<IComment>();
  const [selectedAnswer, setSelectedAnswer] = useState<IAnswer>();
  const [commentWithAnswer,setCommentWithAnswer] = useState<ICommentWithAnswer[]>([])
 
  const [refreshing, setRefreshing] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [commentToEdit, setCommentToEdit] = useState(null);
  const [editedMessage, setEditedMessage] = useState("");
  const [editResponseModalVisible, setEditResponseModalVisible] = useState(false);
  const [responseToEdit, setResponseToEdit] = useState("");
  const [openCommentType, setOpenCommentType] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [modalText, setModalText] = useState("");

  const [selectedIten, setSelectedIten] = useState("");

  const [menuVisible, setMenuVisible] = useState(false);

  const [commentTypeList, setCommentTypeList] = useState([
    { label: "Crítica", value: "Crítica" },
    { label: "Elogio", value: "Elogio" },
    { label: "Sugestão", value: "Sugestão" },
  ]);

  // Carrega os comentários do AsyncStorage
  const loadComments = async () => {
    const userId = dataUser?.id;

    try {
      const responseComments = await axios.get<IComment[]>(`http://localhost:8080/api/comment/all`);

      if (responseComments.status === 200) {
        const commentData = responseComments.data;

        const commentList: ICommentWithAnswer[] = await Promise.all(
          commentData.map(async (comment) => {
            try {
              const responseAnswer = await axios.get<IAnswer[]>(`http://localhost:8080/api/answer/byComment/${comment.id}`);
              const answer = responseAnswer.data[0] ?? null;

              return { comment, answer };
            } catch {
              return { comment, answer: null };
            }
          })
        );

      
        const list = [...commentList].sort((a, b) => {
          const idA = parseInt(a.comment.id);
          const idB = parseInt(b.comment.id);
          return idB - idA;
        });
        setCommentWithAnswer(list);
      }
    } catch (error) {
      Alert.alert("Erro", "Ocorreu um erro ao carregar os comentários.");
    }
  };


  // Função para pesquisar comentários
  const handleSearch = () => {
    console.log("pesquisando...");
    Alert.alert(
      "Pesquisar",
      `Buscando por: ${searchQuery} - Tipo: ${searchType}`
    );
  };

  // Função para atualizar a lista de comentários
  const onRefresh = () => {
    setRefreshing(true);
    loadComments().then(() => setRefreshing(false));
  };

  // Carrega os comentários ao abrir a página
  useEffect(() => {
    loadComments();
  }, []);



  const handleDeleteComment = async (id: string) => {
    try {
      const response = await axios.delete(`http://localhost:8080/api/comment/${id}`);
      if(response.status === 204){
       
        Alert.alert("Sucesso", "Departamento deletado com sucesso!");
      }
    } catch (error) {
      console.log(error); 
    }
    
  };

  const handleEditComment = (comment: IComment) => {
    setselectedComment(comment)
    setEditedMessage(comment.message);
    setEditedTitle(comment.title);
    setEditModalVisible(true);
    
  };

  
  const saveEditedComment = async () => {
  try {
    const id = selectedComment?.id;
    const updatedCommentData = {
        
      title: editedTitle,
      message: editedMessage,
      commentType:selectedComment?.commentType ,
		  authorId: selectedComment?.authorId,
		  departamentId: selectedComment?.departamentId,
		  answerId: selectedComment?.answerId
   
    };

    const response = await axios.put(
      `http://localhost:8080/api/comment/${id}`,
      updatedCommentData
    );
    
    if(response.status === 200){
      // tirar depois do teste
      const list = commentWithAnswer.map(item => 
        item.comment.id === id 
          ? { ...item, comment: { ...item.comment, title: editedTitle, message: editedMessage } }
          : item
      );

      setCommentWithAnswer(list);
      
      setEditModalVisible(false);
      setCommentToEdit(null);
      setEditedTitle("");
      setEditedMessage("");
    }

  } catch (error) {
    console.log(error); 
    Alert.alert("Erro", "Não foi possível atualizar o comentário.");
  }
};


  // const handleDeleteResponse = async (id: string) => {
  //   try {
  //     const response = await axios.delete(`http://localhost:8080/api/answer/${id}`);
  //     console.log(response.status);
      
  //     if(response.status === 204){

  //       const updatedComments = comments.map((comment) => {
         
  //         if (comment.answerId === id) {
            
  //           return {
  //             ...comment,
  //             answerId: null,
  //             answerMessage: "",
  //           };
  //         }
  //         return comment;
  //       });
  //       setComments(updatedComments);
  //     }
  //   } catch (error) {
  //     console.log(error); 
  //   }
  // };

   const handleEditResponse = (answer:IAnswer) => {
  
    setSelectedAnswer(answer)
    setResponseToEdit(answer.message);
    setEditResponseModalVisible(true);
    
  };


  const saveEditedResponse = async () => {
  try {
    const id = selectedAnswer?.id
    const updatedResponseData = {
      message: responseToEdit,
      commentId: selectedAnswer?.commentId,
      authorId: selectedAnswer?.authorId,
    };

    const response = await axios.put(
      `http://localhost:8080/api/answer/${id}`,
      updatedResponseData
    );
    
    if(response.status === 200){

      const list = commentWithAnswer.map((item) =>
        item.answer && item.answer.id === id
        ? { ...item, answer: { ...item.answer, message: responseToEdit } }
        : item
      )
       setCommentWithAnswer(list);

      setEditResponseModalVisible(false);
      setResponseToEdit("");
    }

  } catch (error) {
    console.log(error); 
    Alert.alert("Erro", "Não foi possível atualizar a resposta.");
  }
};


  // funçao que vai deletar o objeto
  const handleDeleteAction = () => {
    if (!selectedIten) return;
    
    handleDeleteComment(selectedIten);
    const list = commentWithAnswer.filter((item)=> item.comment.id !== selectedIten)
    setCommentWithAnswer(list)
    setDeleteModalVisible(false);
  };

  return (
    <Provider>
      <View style={styles.outerContainer}>
        <Image
          source={require("../../assets/images/Fala_campus-logo.png")}
          style={styles.logo}
        />
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <Formik
            initialValues={{
              title: "",
              commentType: "",
            }}
            validationSchema={validationSchema}
            onSubmit={() => handleSearch()}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              setFieldValue,
              setFieldTouched,
              values,
              errors,
              touched,
              resetForm,
            }) => (
              <View style={styles.container}>
                <View style={styles.card}>
                  <Text style={styles.title}>Buscar Comentários</Text>

                  <Text style={styles.label}>Título: *</Text>
                  <TextInput
                    style={styles.input}
                    value={values.title}
                    onChangeText={handleChange("title")}
                    placeholder="Digite o título"
                    placeholderTextColor="#333"
                    onBlur={handleBlur("title")}
                  />
                  {touched.title && errors.title && (
                    <Text style={{ color: "red" }}>{errors.title}</Text>
                  )}

                  <Text style={styles.label}>Tipo de Comentário: *</Text>
                  <DropDownPicker
                    open={openCommentType}
                    value={values.commentType}
                    items={commentTypeList}
                    setOpen={setOpenCommentType}
                    setValue={(callback) => {
                      const newValue = callback(values.commentType);
                      setFieldValue("commentType", newValue);
                    }}
                    setItems={setCommentTypeList}
                    placeholder="Selecione um tipo "
                    onClose={() => setFieldTouched("commentType", false)}
                    style={[styles.input]}
                    dropDownContainerStyle={{
                      borderColor: "#ccc",
                      zIndex: 1000,
                    }}
                    listMode="SCROLLVIEW"
                  />
                  {touched.commentType && errors.commentType && (
                    <Text style={{ color: "red" }}>{errors.commentType}</Text>
                  )}

                  <TouchableOpacity
                    style={styles.searchButton}
                    onPress={() => {
                      handleSubmit();
                    }}
                  >
                    <Text style={styles.buttonText}>Pesquisar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </Formik>

          <View style={styles.responseCard}>
            <Text style={styles.responseTitle}>Comentários Enviados</Text>
            <FlatList
              data={commentWithAnswer}
              keyExtractor={(item) => item.comment.id}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <CommentComponent
                  item={item.comment}
                  handleEditComment={handleEditComment}
                  setDeleteModalVisible={setDeleteModalVisible}
                  setEditModalVisible={setEditModalVisible}
                  setModalText={setModalText}
                  setSelectedIten={setSelectedIten}
                >
                  {item.answer && (
                    <ResponseAdm
                      item={item.answer}
                      handleEditResponse={handleEditResponse}
                      setEditModalVisible={setEditResponseModalVisible}
                      setDeleteModalVisible={setDeleteModalVisible}
                      setModalText={setModalText}
                      // setSelectedIten={setSelectedIten}
                    />
                  )}

                </CommentComponent>
              )}
            />
          </View>
        </ScrollView>

           <ModalDelete
              modalVisible={deleteModalVisible}
              setModalVisible={() => setDeleteModalVisible(false)}
              handleDelete={handleDeleteAction}
              modalText={modalText}
            />
        
        
          <ModalEditResponse
              editModalVisible={editResponseModalVisible}
              setEditModalVisible={() => setEditResponseModalVisible(false)}
              editResponse={responseToEdit}
              setEditResponse={setResponseToEdit}
              handleSaveEdit={saveEditedResponse}
          />
          
          <ModalEditComment
            editModalVisible={editModalVisible}
            setEditModalVisible={() => setEditModalVisible(false)}
            editTitulo={editedTitle}
            setEditTitulo={setEditedTitle}
            editComment={editedMessage}
            setEditComment={setEditedMessage}
            handleSaveEdit={saveEditedComment}
          />
        
        
        
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  logo: {
    width: 150,
    height: 50,
    resizeMode: "contain",
    marginVertical: 20,
    alignSelf: "center",
  },
  container: {
    width: "100%",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: "100%",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginBottom: 20,
  },
  responseCard: {
    width: "100%",
    marginBottom: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  label: {
    alignSelf: "flex-start",
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 10,
  },
  input: {
    width: "100%",
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
    color: "#333",
  },
  dropdownContainer: {
    width: "100%",
    alignSelf: "flex-start",
    marginTop: 10,
  },
  dropdownButton: {
    width: "100%",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#CCC",
    padding: 5,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dropdownButtonText: {
    fontSize: 14,
    color: "black",
  },
  searchButton: {
    width: "100%",
    marginTop: 20,
    padding: 15,
    borderRadius: 5,
    backgroundColor: "#4CAF50",
    alignItems: "center",
  },
  buttonText: {
    fontWeight: "bold",
    color: "white",
  },
  responseTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  commentItem: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#eabfb3",
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  responseContainer: {
    marginTop: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#b2dfdb",
    borderRadius: 10,
  },
  responseLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  responseText: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
    marginTop: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  editButton: {
    backgroundColor: "#c8e6c9",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 6,
    marginRight: 10,
  },
  editButtonText: {
    color: "#388e3c",
    fontWeight: "bold",
    fontSize: width * 0.035,
  },
  deleteButton: {
    backgroundColor: "#ffe5e5",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  deleteButtonText: {
    color: "#b71c1c",
    fontWeight: "bold",
    fontSize: width * 0.035,
  },
  saveButton: {
    backgroundColor: "#c8e6c9",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 6,
    marginRight: 10,
  },
  saveText: {
    color: "#388e3c",
    fontWeight: "bold",
    fontSize: width * 0.035,
  },
  cancelButton: {
    backgroundColor: "#ffe5e5",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  cancelText: {
    color: "#b71c1c",
    fontWeight: "bold",
    fontSize: width * 0.035,
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    maxWidth: 400,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default SearchComments;
