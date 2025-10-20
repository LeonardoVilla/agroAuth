import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import Toast from 'react-native-toast-message';
import { supabase } from "../../src/supabaseClient";

export default function Login({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [modo, setModo] = useState<'login' | 'register'>('login');

  const autenticar = async () => {
    if (!email || !senha) return Alert.alert('Erro', 'Preencha todos os campos');

    if (modo === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
      if (error) Alert.alert('Erro no login', error.message);
    } else {
      const { error } = await supabase.auth.signUp({ email, password: senha });
      if (error) {
        Toast.show({
          type: 'error',
          text1: 'Erro ao registrar',
          text2: error.message,
        });
      } else {
        Toast.show({
          type: 'success',
          text1: 'Sucesso!',
          text2: 'Verifique seu e-mail para confirmar o cadastro.',
        });
        setEmail('');
        setSenha('');
        setModo('login');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{modo === 'login' ? 'Login' : 'Cadastro'}</Text>
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />
      <Button title={modo === 'login' ? 'Entrar' : 'Registrar'} onPress={autenticar} />
      <Text style={styles.toggle} onPress={() => setModo(modo === 'login' ? 'register' : 'login')}>
        {modo === 'login' ? 'Criar conta' : 'Já tem conta? Fazer login'}
      </Text>

      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  input: { borderBottomWidth: 1, marginBottom: 12, fontSize: 16 },
  title: { fontSize: 24, marginBottom: 16, textAlign: 'center' },
  toggle: { marginTop: 16, textAlign: 'center', color: 'blue' },
});
