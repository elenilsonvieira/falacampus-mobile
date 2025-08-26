import { router, useLocalSearchParams, useNavigation } from "expo-router";
import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IDepartment } from "@/interface/IDepartment";
import * as Yup from "yup";
import { Formik } from "formik";
import axios from "axios";
import { AuthContext } from "@/context/AuthContext";
import { useAuth } from "@/hooks/useAuth";

const validationSchema = Yup.object().shape({
  nome: Yup.string()
    .trim()
    .min(5, "O campo tem que ter no mínimo 5 caracteres")
    .max(100)
    .required("O nome do departamento é obrigatório."),
});

const CadastroDepartamento = () => {
  const {dataUser} = useAuth();

  const handleSave = async(values: { nome: string }, resetForm: () => void) => {
    const newDepartment = {
      name: values.nome,
    };
    
    try {
      const response = await axios.post("http://localhost:8080/api/departament", newDepartment)
      if(response.status === 201){

        const departamentId = response.data.id;

        const addResponsibleUsers={
          id:departamentId,
          name: values.nome,
          responsibleUsers: [dataUser?.id]
        } 
        
       console.log(addResponsibleUsers)
        console.log(dataUser)

        const data = await axios.put(`http://localhost:8080/api/departament/${departamentId}`, addResponsibleUsers ) // melhorar  depois
        if (data.status == 200){ 
          resetForm();
          router.back();
        }
          
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Navega
  const handleCancel = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/Fala_campus-logo.png")}
        style={styles.logo}
      />
      <Text style={styles.title}>Cadastro de Departamento</Text>
      <Formik
        initialValues={{ nome: "" }}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => handleSave(values, resetForm)}
      >
        {({
          handleChange,
          handleSubmit,
          values,
          errors,
          touched,
          handleBlur,
        }) => (
          <>
            <Text style={styles.label}>Nome: *</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite o Nome do Departamento"
              maxLength={50}
              value={values.nome}
              onChangeText={handleChange("nome")}
              onBlur={handleBlur("nome")}
              numberOfLines={2}
              autoCapitalize={"words"}
            />
            {touched.nome && errors.nome && (
              <Text style={styles.errorText}>{errors.nome}</Text>
            )}

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={() => handleSubmit()}
              >
                <Text style={styles.buttonText}>Salvar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancel}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </Formik>

      <Text style={styles.footer}>
        Projeto Fala Campus Mobile - IFPB - Guarabira 2025
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    padding: 20,
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
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    alignSelf: "flex-start",
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 10,
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    width: 100,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#F44336",
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

export default CadastroDepartamento;
