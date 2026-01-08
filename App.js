import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, TextInput, ScrollView, Alert } from 'react-native';

export default function App() {
  const [bloqueados, setBloqueados] = useState([]);
  const numeros = Array.from({ length: 60 }, (_, i) => i + 1);

  const ajuda = (titulo, desc) => Alert.alert(titulo, desc);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>MEGA-SENA</Text>
      
      <View style={styles.cartelaContainer}>
        <FlatList
          data={numeros}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={[styles.num, bloqueados.includes(item) && styles.bloqueado]}
              onPress={() => setBloqueados(prev => prev.includes(item) ? prev.filter(n => n !== item) : [...prev, item])}
            >
              <Text style={styles.numText}>{item < 10 ? `0${item}` : item}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.toString()}
          numColumns={10}
          scrollEnabled={false}
          columnWrapperStyle={styles.row}
        />
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Quantidade (Max 500)</Text>
          <TextInput style={styles.input} keyboardType="numeric" placeholder="Ex: 10" />
        </View>

        {[
          { t: 'Excluir Quadrantes', d: 'Elimina áreas (1 a 4) da cartela.\n1: Top-Esq, 2: Top-Dir, 3: Base-Esq, 4: Base-Dir.' },
          { t: 'GAP (Início, Tamanho)', d: 'Cria um buraco de números.\nEx: 20, 10 pula do 20 ao 29.' },
          { t: 'Filtrar Colunas', d: 'Escolha quais colunas (1 a 10) deseja ignorar no sorteio.' },
          { t: 'Par ou Ímpar', d: 'Selecione "P" para apenas pares ou "I" para apenas ímpares.' }
        ].map((item, index) => (
          <View key={index} style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>{item.t}</Text>
              <TouchableOpacity onPress={() => ajuda(item.t, item.d)}>
                <Text style={styles.ajudaIcon}>❓</Text>
              </TouchableOpacity>
            </View>
            <TextInput style={styles.input} placeholder="Configurar..." />
          </View>
        ))}

        <TouchableOpacity style={styles.btn}>
          <Text style={styles.btnText}>GERAR JOGOS</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F2F5', padding: 20, paddingTop: 40 },
  titulo: { fontSize: 32, fontWeight: '900', color: '#2C3E50', textAlign: 'center', marginBottom: 20 },
  cartelaContainer: { backgroundColor: '#FFF', padding: 10, borderRadius: 12, elevation: 4 },
  row: { justifyContent: 'space-between', marginBottom: 5 },
  num: { width: '9%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#E0E6ED', borderRadius: 4 },
  bloqueado: { backgroundColor: '#FF4757' },
  numText: { fontSize: 11, fontWeight: 'bold', color: '#34495E' },
  form: { marginTop: 20, backgroundColor: '#FFF', padding: 20, borderRadius: 12, marginBottom: 40 },
  inputGroup: { marginBottom: 15 },
  labelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  label: { fontWeight: 'bold', color: '#7F8C8D', marginRight: 5 },
  ajudaIcon: { fontSize: 16, color: '#3498DB' },
  input: { borderBottomWidth: 1.5, borderColor: '#DCDFE6', paddingVertical: 5, color: '#2C3E50' },
  btn: { backgroundColor: '#27AE60', padding: 18, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  btnText: { color: '#FFF', fontWeight: 'bold', fontSize: 18 }
});
