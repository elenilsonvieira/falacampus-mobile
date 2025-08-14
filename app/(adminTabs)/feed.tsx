import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  Alert,
} from "react-native";
import { IComment } from "@/interface/IComment";
import axios from "axios";
import { IAnswer } from "@/interface/IAnswer";
import { IUser } from "@/interface/IUser";
import { IDepartment } from "@/interface/IDepartment";

const { width, height } = Dimensions.get('window');


export default function Feed() {

  const [comments, setComments] = useState<IComment[]>([]);
  const [answers, setAnswers] = useState<IAnswer[]>([]);
  const [users, setUsers] = useState<IUser[]>([]);
  const [departments, setDepartments] = useState<IDepartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedComments, setExpandedComments] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {

    const fetchComments = async () => {
      try {
        
        const[commentsRes, answersRes, usersRes, departmentsRes] = await Promise.all([
          axios.get("http://localhost:8080/api/comment/all"),
          axios.get("http://localhost:8080/api/answer/all"),
          axios.get("http://localhost:8080/api/user/all"),
          axios.get("http://localhost:8080/api/departament/all")
        ])
  
        if (commentsRes.status === 200) {
          setComments(commentsRes.data);
        }
        
        if (answersRes.status === 200){          
          setAnswers(answersRes.data);
        }

        if (usersRes.status === 200){
          setUsers(usersRes.data);
        }

        if(departmentsRes.status === 200){
          setDepartments(departmentsRes.data);
        }

      } catch (error) {
        console.log(error); 
        Alert.alert("Erro", "Ocorreu um erro ao carregar os dados.");
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, []);
  
  const toggleExpand = (id: number) => {
  setExpandedComments(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  //Pega Resposta do comentario por ID
  const getAnswerMessage = (answerId?: number | null) => {
    const answer = answers.find((a)=>a.id === answerId);
    return answer;
  };

  //Pega o nome do usuario pelo ID
  const getAuthorName = (authorId?: number | null) => {
    const user = users.find((u)=>u.id === authorId);    
    return user;
  };

  //Pega o Nome do departamento pelo ID
  const getDepartmentName = (departamentId?: number | null) => {
    const departament = departments.find((d)=> Number(d.id) === departamentId);
    return departament;
  };

  return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Image source={require('../../assets/images/Fala_campus-logo.png')} style={styles.logo} />
            <Text style={styles.topTitle}>Feed de Comentários</Text>
            {loading ? (
                <Text style={{ textAlign: 'center', marginTop: 20 }}>Carregando comentários...</Text>
            ) : comments.length === 0 ? (
            <Text style={{ textAlign: 'center', marginTop: 20 }}>Nenhum Comentário encontrado.</Text>
            ) : (
                <View>
                    {comments
                    .map((comment) => (
                        <View key={comment.id} style={styles.messageCard}>
                            <Text><Text style={styles.labelBold}>Autor:</Text> <Text style={styles.value}>{getAuthorName(comment.authorId)?.name}</Text></Text>
                            <Text><Text style={styles.labelBold}>Título:</Text> <Text style={styles.value}>{comment.title}</Text></Text>
                            <Text><Text style={styles.labelBold}>Tipo:</Text> <Text style={styles.value}>{comment.commentType}</Text></Text>
                            <Text><Text style={styles.labelBold}>Departamento:</Text> <Text style={styles.value}>{getDepartmentName(comment.departamentId)?.name}</Text></Text>
                            <Text style={styles.labelBold}>Mensagem:</Text>
                            <Text style={styles.messageBox}>{comment.message}</Text>

                            <View style={styles.cardFooterContainer}>
                              <View style={styles.cardFooterLeft}>
                                <Text
                                  style={[
                                    styles.cardStatus,
                                    comment.statusComment === 'SOLVED' ? styles.statusAnswered : styles.statusPending,
                                  ]}
                                >
                                  {comment.statusComment || 'NOT_SOLVED'}
                                </Text>

                                {comment.statusComment === 'SOLVED' && (
                                  <Text
                                    style={styles.detailButton}
                                    onPress={() => toggleExpand(comment.id)}
                                  >
                                    {expandedComments[comment.id] ? "Ocultar detalhes" : "Ver detalhes"}
                                  </Text>
                                )}
                              </View>

                              <Text style={styles.cardDate}>
                                Enviado em: {comment.creationDate}
                              </Text>
                            </View>

                            {comment.statusComment === 'SOLVED' && expandedComments[comment.id] && comment.answerId && (
                              <View style={styles.replyBox}>
                                <Text style={styles.labelBold}>Resposta do Departamento:</Text>
                                <Text style={styles.replyText}>{getAnswerMessage(comment.answerId)?.message}</Text>
                              </View>
                            )}                       
                        </View>
                    ))}
                </View>   
            )}
            <Text style={styles.footer}>
              Projeto Fala Campus Mobile - IFPB - Guarabira 2025
            </Text>
        </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#fff",
    padding: 20,
    alignItems: "center",
    paddingBottom: 100, 
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
    width: 150,
    height: 50,
    resizeMode: "contain",
    marginBottom: 20
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
  messageBox: {
    width: "100%",
    padding: 12,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 15,
    lineHeight: 20,
    color: "#333",
    
  },
  cardAuthor: {
    fontWeight: 'bold',
    fontSize: width * 0.045,
    marginBottom: 4,
  },
  cardTitle:{
    fontWeight: 'bold',
    fontSize: width * 0.045,
    marginBottom: 4,
  },
  cardType:{
    fontWeight: 'bold',
    fontSize: width * 0.045,
    marginBottom: 4,
  },
  cardDate: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
  },
  cardMessage: {
    fontWeight: 'bold',
    fontSize: width * 0.04,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardStatus: {
    paddingVertical: 4,
    paddingHorizontal: 8,
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
  labelBold: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#111',
  },
  value: {
    fontWeight: 'normal',
    color: '#444',
    fontSize: 15,
  },
  footer: {
    marginTop: 20,
    fontSize: 12,
    color: "#666",
  },
  detailButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    fontWeight: 'bold',
    fontSize: width * 0.035,
    backgroundColor: '#d0e8ff',
    color: '#0056b3',
  },

  replyBox: {
    marginTop: 10,
    marginBottom: 6,
    backgroundColor: '#eef6ee',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cde3cd',
    width: '100%',
    alignSelf: 'center',
  },

  replyText: {
    fontSize: 14,
    color: '#333',
    marginTop: 6,
    lineHeight: 18,
  },

  cardFooterContainer: {
  flexDirection: 'column',
  gap: 8,
},

cardFooterLeft: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 16,
},

});
