import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, StyleSheet, Alert, Share } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [excluidos, setExcluidos] = useState([]);
  const [pastas, setPastas] = useState([{ id: 1, nome: "Meus Jogos", jogos: [] }]);
  const [filtroPar, setFiltroPar] = useState(false);
  const [filtroImpar, setFiltroImpar] = useState(false);

  // Regra de bloqueio visual (Tarja Vermelha)
  const isBloqueado = (n) => {
    if (excluidos.includes(n)) return true;
    if (filtroPar && n % 2 !== 0) return true;
    if (filtroImpar && n % 2 === 0) return true;
    return false;
  };

  const gerarJogo = () => {
    let disponiveis = [];
    for (let i = 1; i <= 60; i++) { if (!isBloqueado(i)) disponiveis.push(i); }

    if (disponiveis.length < 6) {
      Alert.alert("Erro", "Técnicas em conflito! Não há números suficientes.");
      return;
    }

    let novoJogo = disponiveis.sort(() => 0.5 - Math.random()).slice(0, 6).sort((a, b) => a - b);
    let novasPastas = [...pastas];
    novasPastas[0].jogos.push(novoJogo);
    setPastas(novasPastas);
  };

  const compartilhar = async (jogos) => {
    await Share.share({ message: `Meus Jogos: \n${jogos.map(j => j.join(' - ')).join('\n')}` });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>MEGA SENA PRO</Text>
        <Text style={{fontSize: 20}}>≡</Text> 
      </View>

      <View style={styles.grid}>
        {Array.from({ length: 60 }, (_, i) => i + 1).map(n => (
          <TouchableOpacity key={n} style={styles.quadrado} onPress={() => {
            excluidos.includes(n) ? setExcluidos(excluidos.filter(x => x !== n)) : setExcluidos([...excluidos, n]);
          }}>
            <Text style={styles.numText}>{n}</Text>
            {isBloqueado(n) && <View style={styles.tarja} />}
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.filtros}>
        <TouchableOpacity style={[styles.btnF, filtroPar && styles.ativo]} onPress={() => {setFiltroPar(!filtroPar); setFiltroImpar(false);}}>
          <Text>PAR</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btnF, filtroImpar && styles.ativo]} onPress={() => {setFiltroImpar(!filtroImpar); setFiltroPar(false);}}>
          <Text>ÍMPAR</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.btnGerar} onPress={gerarJogo}>
        <Text style={styles.btnText}>GERAR JOGO COM TÉCNICAS</Text>
      </TouchableOpacity>

      {pastas.map(p => (
        <View key={p.id} style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.pastaNome}>{p.nome}</Text>
            <TouchableOpacity onPress={() => compartilhar(p.jogos)}><Text>🔗</Text></TouchableOpacity>
          </View>
          {p.jogos.map((j, idx) => <Text key={idx} style={styles.jogoText}>{j.join(' - ')}</Text>)}
          
          <TextInput 
            placeholder="Resultado (ex: 01,02...)" 
            style={styles.input} 
            onChangeText={(v) => p.conferir = v}
          />
          <TouchableOpacity style={[styles.btnConf, {opacity: 1}]} onPress={() => Alert.alert("Conferindo...", "Lógica de conferência ativa.")}>
            <Text style={styles.btnText}>CONFERIR</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 10 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  title: { color: 'white', fontWeight: 'bold' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  quadrado: { width: 30, height: 30, backgroundColor: '#1b5e20', margin: 2, justifyContent: 'flex-end', alignItems: 'center' },
  numText: { color: 'white', fontSize: 10, marginBottom: 2 },
  tarja: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255,0,0,0.5)' },
  filtros: { flexDirection: 'row', justifyContent: 'center', marginVertical: 15 },
  btnF: { padding: 10, backgroundColor: '#333', marginHorizontal: 5, borderRadius: 5 },
  ativo: { backgroundColor: '#2196F3' },
  btnGerar: { backgroundColor: '#4CAF50', padding: 15, alignItems: 'center', borderRadius: 10 },
  btnText: { color: 'white', fontWeight: 'bold' },
  card: { backgroundColor: '#1e1e1e', padding: 15, marginTop: 20, borderRadius: 10 },
  pastaNome: { color: '#4CAF50', fontWeight: 'bold', fontSize: 18 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  jogoText: { color: 'white', marginVertical: 5, letterSpacing: 2 },
  input: { borderBottomWidth: 1, borderColor: '#444', color: 'white', marginTop: 10 },
  btnConf: { backgroundColor: '#2e7d32', padding: 10, marginTop: 10, alignItems: 'center' }
});
            
