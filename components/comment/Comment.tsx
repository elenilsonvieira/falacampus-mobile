import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native'
import { IComment } from '@/interface/IComment';
const { width, height } = Dimensions.get('window');

export type CommentProps = {

    children: React.ReactNode;
    item: IComment;
    handleEditComment:(id: string) => void;
    setSelectedIten: (value: { action: string; item: string}) => void;
    setDeleteModalVisible:(visible: boolean) => void;
    setModalText:(text:string) => void;
};

export default function CommentComponent({children, handleEditComment,setSelectedIten, item,setDeleteModalVisible,setModalText}:CommentProps){
    return(
        <View style={styles.commentItem}>
        
            {/* Conteúdo centralizado */}
            <View style={styles.commentContent}>
                <Text style={styles.commentTitle}>{item.title}</Text>
                <Text style={styles.commentText}>{item.message}</Text>
                <Text style={styles.commentStatus}><b>Autor</b>: {item.author}</Text>
                <Text style={styles.commentStatus}><b>Status</b>: {item.status}</Text>
            </View>

            {/* Botões principais */}
            <View style={styles.cardFooter}>
                {!item.response && (
                <TouchableOpacity
                    style={[styles.editButton]}
                    onPress={() => handleEditComment(item.id)}
                >
                    <Text style={styles.editButtonText}>Editar</Text>
                </TouchableOpacity>
                )}
                <TouchableOpacity
                style={[styles.deleteButton]}
                onPress={() => {
                  setSelectedIten({
                            action:'response',
                            item:item.id,
                  })
                  setDeleteModalVisible(true);
                  setModalText(
                    "Tem certeza que quer deletar a resposta"
                  );
                }}
                >
                <Text style={styles.deleteButtonText}>Remover</Text>
                </TouchableOpacity>
            </View>

            {/* Resposta da administração */}
            {item.response && children}
        </View>

    )
}


const styles = StyleSheet.create({
    commentItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#eabfb3',
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  commentContent: {
    alignItems: 'center',
  },
  commentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  commentText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    marginVertical: 8,
  },
  commentStatus: {
    fontSize: 12,
    color: '#666',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  editButton: {
    backgroundColor: '#c8e6c9',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 6,
    marginRight: 10,
  },
  editButtonText: {
    color: '#388e3c',
    fontWeight: 'bold',
    fontSize: width * 0.035,
    },
  deleteButton: {
    backgroundColor: '#ffe5e5',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  deleteButtonText: {
    color: '#b71c1c',
    fontWeight: 'bold',
    fontSize: width * 0.035,
  },
})