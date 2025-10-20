// ConsultaContatos.tsx
import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";

import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { supabase } from "../../src/supabaseClient";
import { SwipeListView } from "react-native-swipe-list-view";

type Contato = {
  id: number;
  nome: string;
  telefone: string;
  email: string;
  msg: string;
};

interface Props {
  navigation: any;
}

export default function ConsultaContatos({ navigation }: Props) {
  const [contatos, setContatos] = useState<Contato[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);

  const carregarContatos = async () => {
    setCarregando(true);
    const { data, error } = await supabase
      .from("contatoagro23")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error("Erro ao buscar contatos:", error.message);
      setContatos([]);
    } else {
      setContatos(data || []);
    }

    setCarregando(false);
  };

  const deletarContato = async (id: number) => {
    // Exemplo de confirmação
    // você pode usar Alert.alert para confirmar antes de deletar
    const { error } = await supabase
      .from("contatoagro23")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Erro ao deletar contato:", error.message);
    } else {
      // Recarrega a lista após deleção
      carregarContatos();
    }
  };

  const editarContato = (contato: Contato) => {
    // Navegar para tela de edição, passando o contato
    navigation.navigate("FormularioContato", { contato });
  };

  useFocusEffect(
    useCallback(() => {
      carregarContatos();
    }, [])
  );

  const renderItem = (data: { item: Contato }) => {
    const item = data.item;
    return (
      <View style={styles.cardFront}>
        <Text style={styles.nome}>{item.nome}</Text>
        <Text style={styles.label}>Telefone:</Text>
        <Text style={styles.valor}>{item.telefone}</Text>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.valor}>{item.email}</Text>
        <Text style={styles.label}>Mensagem:</Text>
        <Text style={styles.valor}>{item.msg}</Text>
      </View>
    );
  };

  const renderHiddenItem = (data: { item: Contato }, rowMap: any) => {
    const item = data.item;
    return (
      <View style={styles.rowBack}>
        <TouchableOpacity
          style={[styles.backLeftBtn, styles.editBtn]}
          onPress={() => {
            rowMap[`${item.id}`]?.closeRow();
            editarContato(item);
          }}
        >
          <Text style={styles.backTextWhite}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.backRightBtn, styles.deleteBtn]}
          onPress={() => {
            rowMap[`${item.id}`]?.closeRow();
            deletarContato(item.id);
          }}
        >
          <Text style={styles.backTextWhite}>Excluir</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {carregando ? (
          <ActivityIndicator size="large" color="#4CAF50" />
        ) : contatos.length === 0 ? (
          <Text style={styles.mensagemVazia}>Nenhum contato cadastrado.</Text>
        ) : (
          <SwipeListView
            data={contatos}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            renderHiddenItem={renderHiddenItem}
            leftOpenValue={75}
            rightOpenValue={-75}
            disableRightSwipe={false}
            disableLeftSwipe={false}
            contentContainerStyle={styles.lista}
          />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  lista: {
    paddingBottom: 16,
  },
  cardFront: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  nome: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  valor: {
    fontSize: 14,
    color: "#444",
    marginBottom: 6,
  },
  mensagemVazia: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: "#888",
  },
  rowBack: {
    alignItems: "center",
    backgroundColor: "#DDD",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 15,
    marginBottom: 12,
    borderRadius: 8,
  },
  backLeftBtn: {
    width: 75,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4CAF50",
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  backRightBtn: {
    width: 75,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F44336",
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  editBtn: {
    // estilo extra se quiser
  },
  deleteBtn: {
    // estilo extra se quiser
  },
  backTextWhite: {
    color: "#FFF",
    fontWeight: "bold",
  },
});