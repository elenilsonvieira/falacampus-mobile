import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import { Provider, Menu, Button } from 'react-native-paper';
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SearchComments = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('Buscar por');
  const [menuVisible, setMenuVisible] = useState(false);
  const [comments, setComments] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // Carrega os comentários do AsyncStorage
  const loadComments = async () => {
    try {
      const storedComments = await AsyncStorage.getItem('comments');
      if (storedComments) {
        setComments(JSON.parse(storedComments));
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao carregar os comentários.');
    }
  };

  // Função para pesquisar comentários
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      Alert.alert('Aviso', 'Por favor, preencha o campo de título antes de pesquisar.');
      return;
    }
    Alert.alert('Pesquisar', `Buscando por: ${searchQuery} - Tipo: ${searchType}`);
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

  return (
    <Provider>
      <View style={styles.outerContainer}>
        <Image source={require('../../assets/images/Fala_campus-logo.png')} style={styles.logo}  />
        <View style={styles.container}>
          <View style={styles.card}>
            <Text style={styles.title}>Buscar Comentários</Text>

            <Text style={styles.label}>Título: *</Text>
            <TextInput
              style={styles.input}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Digite o título"
              placeholderTextColor="#333"
              onBlur={() => Keyboard.dismiss()}
            />

            <View style={styles.dropdownContainer}>
              <Menu
                visible={menuVisible}
                onDismiss={() => setMenuVisible(false)}
                anchor={
                  <Button
                    mode="outlined"
                    onPress={() => setMenuVisible(true)}
                    style={styles.dropdownButton}
                    labelStyle={styles.dropdownButtonText}
                  >
                    {searchType} <AntDesign name="down" size={14} color="black" />
                  </Button>
                }
              >
                <Menu.Item onPress={() => { setSearchType("Título"); setMenuVisible(false); }} title="Título" />
                <Menu.Item onPress={() => { setSearchType("Autor"); setMenuVisible(false); }} title="Autor" />
                <Menu.Item onPress={() => { setSearchType("Comentário"); setMenuVisible(false); }} title="Comentário" />
              </Menu>
            </View>

            <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
              <Text style={styles.buttonText}>Pesquisar</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.responseCard}>
          <Text style={styles.responseTitle}>Comentários Enviados</Text>
          <FlatList
            data={comments}
            keyExtractor={(item) => item.id}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            renderItem={({ item }) => (
              <View style={styles.commentItem}>
                <Text style={styles.commentTitle}>{item.title}</Text>
                <Text style={styles.commentText}>{item.message}</Text>
                <Text style={styles.commentStatus}>Autor: {item.author}</Text>
                <Text style={styles.commentStatus}>Status: {item.status}</Text>

                {/* Exibe a resposta da administração, se existir */}
                {item.response && (
                  <View style={styles.responseContainer}>
                    <Text style={styles.responseLabel}>Resposta da Administração:</Text>
                    <Text style={styles.responseText}>{item.response}</Text>
                  </View>
                )}
              </View>
            )}
          />
        </View>
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  container: {
    width: '100%',
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 50,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  card: {
    backgroundColor: 'white',
    width: '90%',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#FFF',
    marginTop: 5,
    color: '#333',
    width: '100%',
  },
  dropdownContainer: {
    marginTop: 10,
    alignSelf: 'flex-start',
    width: '100%',
  },
  dropdownButton: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CCC',
    padding: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  dropdownButtonText: {
    fontSize: 14,
    color: 'black',
  },
  searchButton: {
    backgroundColor: 'green',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  responseCard: {
    backgroundColor: 'white',
    width: '90%',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    marginTop: 20,
    flex: 1,
  },
  responseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  commentItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#CCC',
  },
  commentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  commentText: {
    fontSize: 14,
    color: '#333',
  },
  commentStatus: {
    fontSize: 12,
    color: '#666',
  },
  responseContainer: {
    backgroundColor: '#e0f7fa',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  responseLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  responseText: {
    fontSize: 14,
    color: '#333',
    marginTop: 5,
  },
});

export default SearchComments;