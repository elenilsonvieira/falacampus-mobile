import { router, useNavigation } from "expo-router";
import React, { useState } from "react";
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



const CadastroDepartamento = () => {

  const [nome, setNome] = useState("");

  const handleSave = async () => {
    if (!nome.trim()) {
      Alert.alert("Aviso", "Por favor, preencha o nome do departamento.");
      return;
    }

    const newDepartment:IDepartment = {
      id: Date.now().toString(),
      nome: nome.trim(),
    };

    try {
      await AsyncStorage.setItem(
        `department_${newDepartment.id}`,
        JSON.stringify(newDepartment)
      );
      Alert.alert("Sucesso", "Departamento cadastrado com sucesso!");
      setNome("");
      router.replace('/(tabs)/deps')
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Ocorreu um erro ao salvar o departamento.");
    }
  };

  const handleCancel = () => {
    router.replace('/(tabs)/deps')
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/Fala_campus-logo.png")}
        style={styles.logo}
      />
      <Text style={styles.title}>Cadastro de Departamento</Text>
      <Text style={styles.label}>* O campo é obrigatório.</Text>
      <Text style={styles.label}>Nome: *</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite o Nome do Departamento"
        maxLength={50}
        value={nome}
        onChangeText={setNome}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.buttonText}>Salvar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
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
    backgroundColor: "#6cb43f",
    width: 75,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#82368c",
    width: 75,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  footer: {
    marginTop: 20,
    fontSize: 12,
    color: "#666",
  },
});

export default CadastroDepartamento;
