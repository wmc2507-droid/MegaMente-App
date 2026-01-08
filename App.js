import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, TextInput, ScrollView, Alert } from 'react-native';

export default function App() {
  const [bloqueados, setBloqueados] = useState([]);
  const [jogos, setJogos] = useState([]);
  const [qtd, setQtd] = useState('');
  const [parImpar, setParImpar] = useState('');
  const [colunas, setColunas] = useState('');
  const [quadrantes, setQuadrantes] = useState('');
  const [gap, setGap] = useState('');

  const numeros = Array.from({ length: 60 }, (_, i) => i + 1);

  const ajuda = (t, d) => Alert.alert(t, d);

  const gerarJogosMatematicos = () => {
    // 1. Base de números (remove bloqueados manualmente)
    let base = numeros.filter(n => !bloqueados.includes(n));

    // 2. Filtro Par/Ímpar (Entra no cálculo apenas o tipo escolhido)
    if (parImpar.toUpperCase() === 'P') base = base.filter(n => n % 2 === 0);
    if (parImpar.toUpperCase() === 'I') base = base.filter(n => n % 2 !== 0);

    // 3. Filtro de Colunas (Exclui colunas específicas)
    if (colunas) {
      const colsExcluidas = colunas.split(',').map(c => parseInt(c.trim()));
      base = base.filter(n => !colsExcluidas.includes(n % 10 === 0 ? 10 : n % 10));
    }

    // 4. Filtro de Quadrantes
    if (quadrantes) {
      const qExcluidos = quadrantes.split(',').map(q => q.trim());
      base = base.filter(n => {
        const linha = Math.floor((n - 1) / 10);
        const col = (n - 1) % 10;
        const q1 = linha < 3 && col < 5;
        const q2 = linha < 3 && col >= 5;
        const q3 = linha >= 3 && col < 5;
        const q4 = linha >= 3 && col >= 5;
        if (qExcluidos.includes('1') && q1) return false;
        if (qExcluidos.includes('2') && q2) return false;
        if (qExcluidos.includes('3') && q3) return false;
        if (qExcluidos.includes('4') && q4) return false;
        return true;
      });
    }

    // Validação de segurança
    if (base.length < 6) return Alert.alert("Erro", "Filtros muito agressivos! Não sobraram números suficientes.");

    // 5. Geração aleatória baseada nos filtros
    let resultadoFinal = [];
    const loop = parseInt(qtd) || 1;
    for (let i = 0; i < loop; i++) {
      let sorteio = [...base].sort(() => Math.random() - 0.5).slice(0, 6).sort((a, b) => a - b);
      resultadoFinal.push(sorteio);
    }
    setJogos(resultadoFinal);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>MEGA-SENA</Text>
      
      <View style={styles.cartela}>
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
          keyExtractor={(i) => i.toString()}
          numColumns={10}
          scrollEnabled={false}
          columnWrapperStyle={styles.row}
        />
      </View>

      <View style={styles.form}>
        <TextInput style={styles.input} placeholder="Quantidade de Jogos" keyboardType="numeric" onChangeText={setQtd} />
        
        <View style={styles.inputRow}>
          <Text style={styles.label}>Par (P) ou Ímpar (I)</Text>
          <TouchableOpacity onPress={() => ajuda('Par ou Ímpar', 'P: Apenas números pares entram no sorteio.\nI: Apenas ímpares entram.')}>
            <Text style={styles.ajuda}>?</Text>
          </TouchableOpacity>
        </View>
        <TextInput style={styles.input} placeholder="Ex: P" onChangeText={setParImpar} maxLength={1} />

        <View style={styles.inputRow}>
          <Text style={styles.label}>Excluir Colunas</Text>
          <TouchableOpacity onPress={() => ajuda('Colunas', 'Digite as colunas que NÃO quer usar (1-10).')}>
            <Text style={styles.ajuda}>?</Text>
          </TouchableOpacity>
        </View>
        <TextInput style={styles.input} placeholder="Ex: 2, 5, 8" onChangeText={setColunas} />

        <TouchableOpacity style={styles.btn} onPress={gerarJogosMatematicos}>
          <Text style={styles.btnText}>GERAR JOGOS</Text>
        </TouchableOpacity>
      </View>

      {jogos.map((j, idx) => (
        <View key={idx} style={styles.jogoCard}><Text style={styles.jogoText}>{j.join('  -  ')}</Text></View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F2F5', padding: 20, paddingTop: 40 },
  titulo: { fontSize: 32, fontWeight: '900', color: '#27AE60', textAlign: 'center', marginBottom: 20 },
  cartela: { backgroundColor: '#FFF', padding: 10, borderRadius: 12, elevation: 4 },
  row: { justifyContent: 'space-between', marginBottom: 5 },
  num: { width: '9%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#E0E6ED', borderRadius: 4 },
  bloqueado: { backgroundColor: '#FF4757' },
  numText: { fontSize: 10, fontWeight: 'bold' },
  form: { marginTop: 20, backgroundColor: '#FFF', padding: 20, borderRadius: 12, marginBottom: 20 },
  inputRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  label: { fontSize: 13, fontWeight: 'bold', color: '#7F8C8D', marginRight: 5 },
  ajuda: { fontSize: 12, color: '#3498DB', fontWeight: 'bold' },
  input: { borderBottomWidth: 1.5, borderColor: '#DCDFE6', marginBottom: 15, padding: 5 },
  btn: { backgroundColor: '#27AE60', padding: 18, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#FFF', fontWeight: 'bold', fontSize: 18 },
  jogoCard: { backgroundColor: '#FFF', padding: 15, borderRadius: 10, marginBottom: 10, borderLeftWidth: 5, borderLeftColor: '#27AE60' },
  jogoText: { fontSize: 18, fontWeight: 'bold', color: '#2C3E50', textAlign: 'center' }
});
                               
