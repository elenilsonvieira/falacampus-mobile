import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, Keyboard } from 'react-native';
import { Provider, Menu, Button } from 'react-native-paper';
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import * as Yup from "yup";
import { Formik } from "formik";



const validationSchema = Yup.object().shape({
    title: Yup.string()
        .trim()
        .max(30) 
        .min(1, "O título não pode ser vazio ou só espaços")
        .required("O título é obrigatório."),
    message: Yup.string()
        .trim()
        .min(1, "A mensagem não pode ser vazia ou só espaços")
        .required("A mensagem é obrigatória.").max(255),
    department:Yup.string()
        .trim()
        .min(1, "O departamento não pode ser vazio ou só espaços")
        .required("O Departamento é obrigatório.").max(30),
    commentType:Yup.string()
        .oneOf(["Crítica", "Elogio", "Sugestão"],"Selecione um tipo válido")
        .required("O tipo de comentário é obrigatório."),
    author:Yup.string()
        .trim()
        .min(1, "O nome do autor não pode ser vazio ou só espaços")
        .required("O nome do autor é obrigatório.").max(50),

});

const CommentRegistration = () => {
    const navigation = useNavigation();
    const [menuVisible, setMenuVisible] = useState(false);

    // Data fixa para o dia atual
    const currentDate = new Date().toLocaleDateString('pt-BR');

    const handleSave = async (values:{title:string, message:string, department:string, 
        commentType:string, author:string}, resetForm:() => void) => {

        const newComment = {
            id: Date.now().toString(),
            title: values.title,
            message: values.message ,
            author: values.author,
            department: values.department,
            date: new Date().toISOString(), // Salva a data real do sistema
            type: values.commentType,
            status: 'Pendente'
        };

        try {
            const existingComments = await AsyncStorage.getItem('comments');
            const comments = existingComments ? JSON.parse(existingComments) : [];
            comments.push(newComment);
            await AsyncStorage.setItem('comments', JSON.stringify(comments));

            Alert.alert('Sucesso', 'Comentário cadastrado com sucesso!');
            Keyboard.dismiss();
            resetForm();
            navigation.navigate('SearchComments'); // Agora a navegação está correta
        } catch (error) {
            console.log(error);
        }
    };

    return (
        
        <Provider>
            
            <View style={styles.container}>
                <Image source={require('../../assets/images/Fala_campus-logo.png')} style={styles.logo} />

                <View style={styles.card}>
                    <Text style={styles.title}>Cadastro de Comentário</Text>
                    <Formik
                        initialValues={{
                            title: "",
                            message: "",
                            department: "",
                            commentType: "",
                            author: "",
                        }}
                        validationSchema={validationSchema}
                        onSubmit={(values, { resetForm }) => handleSave(values, resetForm)}
                        >
                        {({
                            handleChange,
                            handleBlur,
                            handleSubmit,
                            setFieldValue,
                            values,
                            errors,
                            touched,
                        }) => (
                            <>
                            <Text style={styles.label}>Título: *</Text>
                            <TextInput
                                style={styles.input}
                                value={values.title}
                                onChangeText={handleChange("title")}
                                onBlur={handleBlur("title")}
                                placeholder="Digite o título do comentário"
                                placeholderTextColor="#333"
                            />
                            {touched.title && errors.title && (
                                <Text style={{ color: "red" }}>{errors.title}</Text>
                            )}

                            <Text style={styles.label}>Mensagem: *</Text>
                            <TextInput
                                style={styles.input}
                                value={values.message}
                                onChangeText={handleChange("message")}
                                onBlur={handleBlur("message")}
                                placeholder="Digite a sugestão, crítica ou elogio"
                                placeholderTextColor="#333"
                                multiline
                            />
                            {touched.message && errors.message && (
                                <Text style={{ color: "red" }}>{errors.message}</Text>
                            )}

                            <Text style={styles.label}>Data: *</Text>
                            <View style={styles.input}>
                                <Text>{currentDate}</Text>
                            </View>

                            <Text style={styles.label}>Autor do comentário: *</Text>
                            <TextInput
                                style={styles.input}
                                value={values.author}
                                onChangeText={handleChange("author")}
                                onBlur={handleBlur("author")}
                                placeholder="Digite seu nome"
                                placeholderTextColor="#333"
                            />
                            {touched.author && errors.author && (
                                <Text style={{ color: "red" }}>{errors.author}</Text>
                            )}

                            <Text style={styles.label}>Nome do Departamento: *</Text>
                            <TextInput
                                style={styles.input}
                                value={values.department}
                                onChangeText={handleChange("department")}
                                onBlur={handleBlur("department")}
                                placeholder="Digite nome do departamento"
                                placeholderTextColor="#333"
                            />
                            {touched.department && errors.department && (
                                <Text style={{ color: "red" }}>{errors.department}</Text>
                            )}

                            <Text style={styles.label}>Tipo de Comentário: *</Text>
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
                                    {values.commentType || "Selecionar"}{" "}
                                    <AntDesign name="down" size={14} color="black" />
                                    </Button>
                                }
                                >
                                {["Crítica", "Elogio", "Sugestão"].map((item) => (
                                    <Menu.Item
                                    key={item}
                                    onPress={() => {
                                        setFieldValue("commentType", item);
                                        setMenuVisible(false);
                                    }}
                                    title={item}
                                    />
                                ))}
                                </Menu>
                            </View>
                            {touched.commentType && errors.commentType && (
                                <Text style={{ color: "red" }}>{errors.commentType}</Text>
                            )}

                            <View style={styles.buttonContainer}>
                                <TouchableOpacity style={styles.saveButton} onPress={()=>handleSubmit()}>
                                <Text style={styles.buttonText}>Salvar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => navigation.goBack()}
                                >
                                <Text style={styles.buttonText}>Cancelar</Text>
                                </TouchableOpacity>
                            </View>
                            </>
                        )}
                    </Formik>

                    
                </View>
            </View>
        </Provider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
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
    },
    input: {
        borderWidth: 1,
        borderColor: '#CCC',
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#FFF',
        marginTop: 5,
        color: '#333',
    },
    dropdownContainer: {
        marginTop: 10,
        alignSelf: 'flex-start',
    },
    dropdownButton: {
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#CCC',
        padding: 5,
        width: 150,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    dropdownButtonText: {
        fontSize: 14,
        color: 'black'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    saveButton: {
        backgroundColor: 'green',
        padding: 15,
        borderRadius: 5,
        flex: 1,
        alignItems: 'center',
        marginRight: 10,
    },
    cancelButton: {
        backgroundColor: 'purple',
        padding: 15,
        borderRadius: 5,
        flex: 1,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    }
});

export default CommentRegistration;
