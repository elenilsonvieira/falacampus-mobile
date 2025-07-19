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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IComment } from "@/interface/IComment";

export default function ResponderMensagem() {
  const { commentId } = useLocalSearchParams<{ commentId: string }>();
  const [comment, setComment] = useState<IComment | null>(null);
  const [resposta, setResposta] = useState("");

  useEffect(() => {
    const fetchComment = async () => {
      try {
        const stored = await AsyncStorage.getItem("comments");
        if (stored) {
          const comments: IComment[] = JSON.parse(stored);
          const selected = comments.find((c) => c.id === commentId);
          if (selected) {
            setComment(selected);
          } else {
            Alert.alert("Erro", "Comentário não encontrado.");
            router.replace("/(tabs)/respostas");
          }
        }
      } catch (error) {
        console.log(error);
        Alert.alert("Erro", "Ocorreu um erro ao carregar a mensagem.");
      }
    };

    fetchComment();
  }, []);

  const handleSend = async () => {
    if (!resposta.trim()) {
      Alert.alert("Aviso", "Por favor, digite uma resposta.");
      return;
    }

    try {
      const stored = await AsyncStorage.getItem("comments");
      if (stored) {
        let comments: IComment[] = JSON.parse(stored);
        comments = comments.map((c) =>
          c.id === commentId
            ? { ...c, response: resposta.trim(), status: "Respondido" }
            : c
        );
        await AsyncStorage.setItem("comments", JSON.stringify(comments));
        Alert.alert("Sucesso", "Resposta enviada!");
        router.replace("/(tabs)/respostas");
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Não foi possível enviar a resposta.");
    }
  };

  const handleCancel = () => {
    router.replace("/(tabs)/respostas");
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
          <Text style={styles.label}>Autor: {comment.author}</Text>
          <Text style={styles.label}>Mensagem:</Text>
          <Text style={styles.messageBox}>{comment.message}</Text>

          <Text style={styles.label}>Sua Resposta: *</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite sua resposta"
            maxLength={500}
            multiline
            value={resposta}
            onChangeText={setResposta}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
              <Text style={styles.buttonText}>Enviar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
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
  footer: {
    marginTop: 20,
    fontSize: 12,
    color: "#666",
  },
});
