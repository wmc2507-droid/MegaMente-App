import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, TextInput, ScrollView } from 'react-native';

export default function App() {
  const [numerosBloqueados, setNumerosBloqueados] = useState([]);
  const numerosCartela = Array.from({ length: 60 }, (_, i) => i + 1);

  const alternarBloqueio = (num) => {
    if (numerosBloqueados.includes(num)) {
      setNumerosBloqueados(numerosBloqueados.filter(n => n !== num));
    } else {
      setNumerosBloqueados([...numerosBloqueados, num]);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>MEGA-SENA</Text>
      
      <View style={styles.cartelaContainer}>
        <Text style={styles.subtitulo}>Bloqueio Manual:</Text>
        <FlatList
          data={numerosCartela}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={[styles.botaoNumero, numerosBloqueados.includes(item) && styles.botaoBloqueado]}
              onPress={() => alternarBloqueio(item)}
            >
              <Text style={styles.textoNumero}>{item < 10 ? `0${item}` : item}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.toString()}
          numColumns={10}
          scrollEnabled={false}
          columnWrapperStyle={styles.linhaGrelha}
        />
      </View>

      <View style={styles.formContainer}>
        <TextInput style={styles.input} placeholder="Quantidade (Max 500)" keyboardType="numeric" />
        <TextInput style={styles.input} placeholder="Excluir Quadrantes (1,2,3,4)" />
        <TextInput style={styles.input} placeholder="GAP (Início, Tamanho)" />
        <TouchableOpacity style={styles.botaoGerar}>
          <Text style={styles.textoGerar}>GERAR JOGOS</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20, paddingTop: 50 },
  titulo: { fontSize: 28, fontWeight: 'bold', color: '#2c3e50', textAlign: 'center', marginBottom: 20 },
  cartelaContainer: { backgroundColor: '#fff', padding: 10, borderRadius: 10, elevation: 3 },
  subtitulo: { fontWeight: 'bold', marginBottom: 10 },
  linhaGrelha: { justifyContent: 'space-between', marginBottom: 5 },
  botaoNumero: { 
    width: '9%', 
    aspectRatio: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#eee', 
    borderRadius: 4 
  },
  botaoBloqueado: { backgroundColor: '#ff4444' },
  textoNumero: { fontSize: 10, fontWeight: 'bold' },
  formContainer: { marginTop: 20, backgroundColor: '#fff', padding: 15, borderRadius: 10 },
  input: { borderBottomWidth: 1, borderColor: '#ccc', marginBottom: 15, padding: 5 },
  botaoGerar: { backgroundColor: '#27ae60', padding: 15, borderRadius: 5, alignItems: 'center' },
  textoGerar: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});
