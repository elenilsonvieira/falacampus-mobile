import { router, useLocalSearchParams } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { IComment } from "@/interface/IComment";
import * as Yup from "yup";
import { Formik } from "formik";
import axios from "axios";
import { IUser } from "@/interface/IUser";



const validationSchema = Yup.object().shape({
  resposta: Yup.string()
    .trim()
    .min(10, "O campo tem que ter no mínimo 10 caracteres")
    .max(500)
    .required("O campo de resposta é obrigatório."),
});

export default function ResponderMensagem() {
  const { commentId } = useLocalSearchParams<{ commentId: string }>();
  const [comment, setComment] = useState<IComment | null>(null);
  const [users, setUser] = useState<IUser[]>([]);

  useEffect(() => {
    const fetchComment = async () => {
      try {
        const[commentRes, userRes] = await Promise.all([
              axios.get(`http://localhost:8080/api/comment/${commentId}`),
              axios.get("http://localhost:8080/api/user/all")
            ])
        
          if (commentRes.status === 200) {     
            setComment(commentRes.data);
          }
          if (userRes.status === 200){
            setUser(userRes.data);
          }  

      } catch (error) {
        console.log(error);
        Alert.alert("Erro", "Ocorreu um erro ao carregar a mensagem.");
      }
    };

    fetchComment();
  }, []);

  const handleSend = async (values:{resposta:string}) => {

    try {
      const newAnswer = {
        message: values.resposta,
        commentId: comment?.id,
        authorId: comment?.authorId //Corrigir isso aqui, atualmente ta como se o proprio usuario respondesse o proprio comentario. O id que deve ser passado aqui é o ID do responsavel pelo Departamento, no caso quem estaria respondendo o comentario.
      };

      try {
       const response = await axios.post("http://localhost:8080/api/answer", newAnswer)
        if(response.status === 201){
          router.replace("/(adminTabs)/respostas");
        }
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Não foi possível enviar a resposta.");
    }
  };

  const getAuthorName = (authorId?: number | null) => {
    const user = users.find((u)=>u.id === authorId);    
    return user;
  };

  const handleCancel = () => {
    router.replace("/(adminTabs)/respostas");
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/Fala_campus-logo.png")}
        style={styles.logo}
      />
      <Text style={styles.title}>Responder Mensagem</Text>
      {comment ? (
        <>
          <Text style={styles.label}>Autor: {getAuthorName(comment.authorId)?.name}</Text>
          <Text style={styles.label}>Mensagem:</Text>
          <Text style={styles.messageBox}>{comment.message}</Text>
          <Formik
            initialValues={{resposta:""}}
            validationSchema={validationSchema}
            onSubmit={(values)=> handleSend(values)}
          >{({
            handleChange,
            handleSubmit,
            values,
            errors,
            touched,
            handleBlur,}) =>(
              <>
                <Text style={styles.label}>Sua Resposta: *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Digite sua resposta"
                  maxLength={500}
                  multiline
                  value={values.resposta}
                  onBlur={handleBlur("resposta")}
                  onChangeText={handleChange("resposta")}
                />
                {touched.resposta && errors.resposta && (
                    <Text style={styles.errorText}>{errors.resposta}</Text>
                  )}

                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.sendButton} onPress={() => handleSubmit()}>
                    <Text style={styles.buttonText}>Enviar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                    <Text style={styles.buttonText}>Cancelar</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}


          </Formik>
         
        </>
      ) : (
        <Text>Carregando mensagem...</Text>
      )}

      <Text style={styles.footer}>
        Projeto Fala Campus Mobile - IFPB - Guarabira 2025
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  logo: {
    width: 150,
    height: 50,
    resizeMode: "contain",
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    alignSelf: "flex-start",
    fontWeight: "bold",
    marginBottom: 4,
  },
  messageBox: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#f5f5f5",
    borderRadius: 5,
    marginBottom: 20,
    fontSize: 14,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    minHeight: 100,
    textAlignVertical: "top",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  sendButton: {
    backgroundColor: "#6cb43f",
    width: 100,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#82368c",
    width: 100,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
   errorText: {
    color: "red",
    alignSelf: "flex-start",
    marginBottom: 15,
  },
  footer: {
    marginTop: 20,
    fontSize: 12,
    color: "#666",
  },
});
