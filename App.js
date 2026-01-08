import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native';

export default function App() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.tituloHeader}>MEGA-SENA</Text>
        <Text style={styles.menuIcon}>☰</Text>
      </View>

      <View style={styles.cardGrade}>
        <View style={styles.grade}>
          {Array.from({ length: 60 }, (_, i) => (
            <View key={i} style={styles.numeroBox}>
              <Text style={styles.numeroTexto}>{(i + 1).toString().padStart(2, '0')}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.formulario}>
        <Text style={styles.label}>Quantidade de Jogos</Text>
        <TextInput style={styles.input} placeholder="Ex: 5" keyboardType="numeric" />
        
        <Text style={styles.label}>P ou I ?</Text>
        <TextInput style={styles.input} placeholder="Ex: P" />

        <TouchableOpacity style={styles.botaoGerar}>
          <Text style={styles.textoBotao}>GERAR JOGOS</Text>
        </TouchableOpacity>

        <TextInput style={styles.input} placeholder="Nome da Pasta" />
        
        <TouchableOpacity style={styles.botaoGuardar}>
          <Text style={styles.textoBotao}>GUARDAR JOGOS</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, backgroundColor: '#fff', alignItems: 'center' },
  tituloHeader: { color: '#27ae60', fontSize: 28, fontWeight: 'bold' },
  menuIcon: { fontSize: 30, color: '#333' },
  cardGrade: { backgroundColor: '#fff', margin: 15, padding: 10, borderRadius: 15, elevation: 3 },
  grade: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  numeroBox: { width: 28, height: 28, backgroundColor: '#ebedf0', margin: 2, alignItems: 'center', justifyContent: 'center', borderRadius: 5 },
  numeroTexto: { fontSize: 10, fontWeight: 'bold', color: '#333' },
  formulario: { padding: 20, backgroundColor: '#fff', marginHorizontal: 15, borderRadius: 15, marginBottom: 20 },
  label: { color: '#666', marginBottom: 5, marginTop: 10 },
  input: { borderBottomWidth: 1, borderBottomColor: '#ddd', paddingVertical: 5, marginBottom: 15 },
  botaoGerar: { backgroundColor: '#27ae60', padding: 15, borderRadius: 10, alignItems: 'center', marginVertical: 10 },
  botaoGuardar: { backgroundColor: '#3498db', padding: 15, borderRadius: 10, alignItems: 'center' },
  textoBotao: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});
