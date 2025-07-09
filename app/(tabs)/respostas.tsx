import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

export default function App() {
  const [responseText, setResponseText] = useState('');
  const [comments, setComments] = useState([]);
  const [selectedCommentId, setSelectedCommentId] = useState(null);

  // Buscar as mensagens salvas no AsyncStorage ao carregar a página
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const existingComments = await AsyncStorage.getItem('comments');
        if (existingComments) {
          setComments(JSON.parse(existingComments));
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchComments();
  }, []);

  // Função para enviar uma resposta
  const handleSendResponse = async () => {
    if (!selectedCommentId || !responseText) {
      Alert.alert('Aviso', 'Por favor, selecione uma mensagem e digite uma resposta.');
      return;
    }

    try {
      const updatedComments = comments.map((comment) => {
        if (comment.id === selectedCommentId) {
          return { ...comment, response: responseText, status: 'Respondido' };
        }
        return comment;
      });

      await AsyncStorage.setItem('comments', JSON.stringify(updatedComments));
      setComments(updatedComments);
      setResponseText('');
      Alert.alert('Sucesso', 'Resposta enviada com sucesso!');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {/* Cabeçalho: Logo Fala Campus à esquerda, Login à direita */}
      <View style={styles.header}>

       <Image source={require('../../assets/images/Fala_campus-logo.png')} style={styles.logo} />
      </View>

      {/* Card para segurar todo o conteúdo central */}
      <View style={styles.card}>
        {/* Título "Respostas" */}
        <Text style={styles.title}>Respostas</Text>

        {/* Label e campo de texto para resposta */}
        <Text style={styles.label}>Resposta:</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite sua resposta"
          value={responseText}
          onChangeText={setResponseText}
          multiline
          editable={!!selectedCommentId} // Habilita o input apenas se uma mensagem estiver selecionada
        />

        {/* Botão "Enviar Resposta" */}
        <TouchableOpacity style={styles.sendButton} onPress={handleSendResponse}>
          <Text style={styles.sendButtonText}>Enviar Resposta</Text>
        </TouchableOpacity>

        {/* "Tabela" de respostas */}
        <View style={styles.tableContainer}>
          {/* Cabeçalho da tabela */}
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, { flex: 0.5 }]}>Id</Text>
            <Text style={[styles.tableHeaderText, { flex: 2 }]}>Mensagem</Text>
            <Text style={[styles.tableHeaderText, { flex: 1 }]}>Autor</Text>
            <Text style={[styles.tableHeaderText, { flex: 1.3 }]}>Data/Hora de Criação</Text>
          </View>

          {/* Linhas da tabela */}
          {comments.map((comment) => (
            <TouchableOpacity
              key={comment.id}
              style={[
                styles.tableRow,
                selectedCommentId === comment.id && styles.selectedTableRow // Destaca a linha selecionada
              ]}
              onPress={() => setSelectedCommentId(comment.id)}
            >
              <Text style={[styles.tableRowText, { flex: 0.5 }]}>{comment.id}</Text>
              <Text style={[styles.tableRowText, { flex: 2 }]}>{comment.message}</Text>
              <Text style={[styles.tableRowText, { flex: 1 }]}>{comment.author}</Text>
              <Text style={[styles.tableRowText, { flex: 1.3 }]}>{new Date(comment.date).toLocaleString('pt-BR')}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#fff',
    paddingVertical: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.02,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    width: '100%',
  },
  logo: {
    width: width * 0.3,
    height: height * 0.05,
    resizeMode: 'contain',
  },
  card: {
    backgroundColor: '#fff',
    padding: width * 0.05,
    margin: width * 0.05,
    borderRadius: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  title: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    marginBottom: height * 0.02,
    textAlign: 'center',
  },
  label: {
    fontSize: width * 0.04,
    marginBottom: height * 0.01,
    alignSelf: 'flex-start',
  },
  input: {
    width: '100%',
    height: height * 0.1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingHorizontal: width * 0.02,
    marginBottom: height * 0.02,
    textAlignVertical: 'top',
  },
  sendButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.04,
    borderRadius: 4,
    alignSelf: 'flex-end',
    marginBottom: height * 0.02,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: width * 0.04,
  },
  tableContainer: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginBottom: height * 0.02,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#eee',
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.01,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  tableHeaderText: {
    fontWeight: 'bold',
    fontSize: width * 0.035,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.01,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  selectedTableRow: {
    backgroundColor: '#e0f7fa',
  },
  tableRowText: {
    fontSize: width * 0.035,
    textAlign: 'center',
  },
});