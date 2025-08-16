import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { IComment } from '@/interface/IComment';
import axios from 'axios';
import { IUser } from '@/interface/IUser';

const { width, height } = Dimensions.get('window');

const STATUS_LABEL: Record<'NOT_SOLVED' | 'SOLVED', string> = {
  NOT_SOLVED: 'Pendente',
  SOLVED: 'Resolvido',
};

export default function Respostas() {
  const [comments, setComments] = useState<IComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'todos' | 'respondidos' | 'nao_respondidos'>('todos');
  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => {

    const fetchComments = async () => {
      try{
        const[commentsRes, usersRes] = await Promise.all([
              axios.get("http://localhost:8080/api/comment/all"),
              axios.get("http://localhost:8080/api/user/all")
            ])
      
            if (commentsRes.status === 200) {
              setComments(commentsRes.data);
            }

            if (usersRes.status === 200){
              setUsers(usersRes.data);
            }
          }catch (error) {
            console.log(error); 
            Alert.alert("Erro", "Ocorreu um erro ao carregar os dados.");
          } finally {
            setLoading(false);
          }
    };
    fetchComments();
  }, []);

  const getAuthorName = (authorId?: number | null) => {
    const user = users.find((u)=>u.id === authorId);    
    return user;
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.header}>
        <Image source={require('../../assets/images/Fala_campus-logo.png')} style={styles.logo} />
      </View>
      <Text style={styles.topTitle}>Mensagens Recebidas</Text>
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'todos' && styles.activeFilter]}
          onPress={() => setFilter('todos')}
        >
          <Text style={styles.filterText}>Todos</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'respondidos' && styles.activeFilter]}
          onPress={() => setFilter('respondidos')}
        >
          <Text style={styles.filterText}>Respondidos</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'nao_respondidos' && styles.activeFilter]}
          onPress={() => setFilter('nao_respondidos')}
        >
          <Text style={styles.filterText}>Não Respondidos</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
  <Text style={{ textAlign: 'center', marginTop: 20 }}>Carregando mensagens...</Text>
) : comments.length === 0 ? (
  <Text style={{ textAlign: 'center', marginTop: 20 }}>Nenhuma mensagem encontrada.</Text>
) : (
  <View style={styles.card}>
    {comments 
        .filter((comment) => { //Filtra os comentarios.
          if (filter === 'respondidos') return comment.statusComment === 'SOLVED';
          if (filter === 'nao_respondidos') return comment.statusComment !== 'SOLVED';
          return true;
        })
        .map((comment) => (//Itera cada comentario e mostra na tela.
        <View key={comment.id} style={styles.messageCard}>
          <Text style={styles.cardAuthor}>Autor: {getAuthorName(comment.authorId)?.name}</Text>
          <Text style={styles.cardDate}>
            Enviado em: {comment.creationDate}
          </Text>
          <Text style={styles.cardMessage}>Mensagem: {comment.message}</Text>
          <View style={styles.cardFooter}>
            <Text
              style={[
                styles.cardStatus,
                comment.statusComment === 'SOLVED' ? styles.statusAnswered : styles.statusPending,
              ]}
            >
              {STATUS_LABEL[(comment.statusComment ?? 'NOT_SOLVED') as keyof typeof STATUS_LABEL] ?? comment.statusComment}
            </Text>
            {comment.statusComment !== 'SOLVED' && (
              <TouchableOpacity
                style={styles.replyButton}
                 onPress={() =>
                      router.push(`/screens/responder-mensagem?commentId=${comment.id}`)
                    }
              >
                <Text style={styles.replyButtonText}>Responder</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      ))}
  </View>
)}

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
    justifyContent: 'flex-start',
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
  topTitle: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: height * 0.02,
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
  messageCard: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#eabfb3',
    borderRadius: 10,
    padding: width * 0.04,
    marginBottom: height * 0.02,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardAuthor: {
    fontWeight: 'bold',
    fontSize: width * 0.045,
    marginBottom: 4,
  },
  cardDate: {
    fontSize: width * 0.035,
    color: '#555',
    marginBottom: 8,
  },
  cardMessage: {
    fontSize: width * 0.04,
    marginBottom: 12,
    textAlign: 'center',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardStatus: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    fontWeight: 'bold',
    fontSize: width * 0.035,
  },
  statusPending: {
    backgroundColor: '#ffe5b4',
    color: '#a67c52',
  },
  statusAnswered: {
    backgroundColor: '#c8e6c9',
    color: '#388e3c',
  },
  replyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  replyButtonText: {
    fontSize: width * 0.035,
    color: '#333',
    fontWeight: 'bold',
  },
  filterContainer: {
  flexDirection: 'row',
  justifyContent: 'center',
  marginBottom: 20,
  gap: 10,
  flexWrap: 'wrap',
},
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f5f5f5',
  },
  filterText: {
    fontSize: width * 0.035,
    color: '#333',
    fontWeight: 'bold',
  },
  activeFilter: {
    backgroundColor: '#c8e6c9',
    borderColor: '#388e3c',
  },

});