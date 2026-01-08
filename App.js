import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function App() {
  const [excluidos, setExcluidos] = useState([]);
  const [jogos, setJogos] = useState([]);
  const [filtroPar, setFiltroPar] = useState(false);
  const [filtroImpar, setFiltroImpar] = useState(false);

  // Lógica de Bloqueio (Tarja Vermelha)
  const isBloqueado = (n) => {
    if (excluidos.includes(n)) return true;
    if (filtroPar && n % 2 !== 0) return true;
    if (filtroImpar && n % 2 === 0) return true;
    return false;
  };

  const gerarJogos = () => {
    let disponiveis = [];
    for (let i = 1; i <= 60; i++) {
      if (!isBloqueado(i)) disponiveis.push(i);
    }

    // Alerta de Conflito/Segurança
    if (disponiveis.length < 6) {
      Alert.alert("Erro de Conflito", "Muitas técnicas selecionadas! Não há números suficientes para gerar o jogo.");
      return;
    }

    let novosJogos = [];
    for (let i = 0; i < 10; i++) {
      let jogo = [...disponiveis].sort(() => 0.5 - Math.random()).slice(0, 6).sort((a, b) => a - b);
      novosJogos.push(jogo);
    }
    setJogos(novosJogos);
  };

  const compartilhar = async (jogo) => {
    await Share.share({ message: `Meu jogo da Mega Sena: ${jogo.join(' - ')}` });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mega Sena Pro</Text>
        <Ionicons name="menu" size={20} color="black" />
      </View>

      <View style={styles.grid}>
        {Array.from({ length: 60 }, (_, i) => i + 1).map((n) => (
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
          <Text style={styles.txtF}>Técnica Par</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btnF, filtroImpar && styles.ativo]} onPress={() => {setFiltroImpar(!filtroImpar); setFiltroPar(false);}}>
          <Text style={styles.txtF}>Técnica Ímpar</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.btnGerar} onPress={gerarJogos}>
        <Text style={styles.btnText}>GERAR 10 JOGOS COM TÉCNICAS</Text>
      </TouchableOpacity>

      {jogos.map((j, i) => (
        <View key={i} style={styles.card}>
          <Text style={styles.jogoTxt}>{j.join(' - ')}</Text>
          <TouchableOpacity onPress={() => compartilhar(j)}>
            <Ionicons name="share-social" size={16} color="green" />
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white', padding: 10 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 30, marginBottom: 10 },
  title: { fontSize: 18, fontWeight: 'bold', color: 'green' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', paddingHorizontal: 5 },
  quadrado: { width: 32, height: 32, backgroundColor: 'green', margin: 2, borderRadius: 4, justifyContent: 'flex-end', alignItems: 'center', overflow: 'hidden' },
  numText: { color: 'white', fontSize: 11, marginBottom: 2 },
  tarja: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255, 0, 0, 0.5)' },
  filtros: { flexDirection: 'row', justifyContent: 'center', marginVertical: 15 },
  btnF: { padding: 10, borderWidth: 1, borderColor: '#ccc', marginHorizontal: 5, borderRadius: 5 },
  ativo: { backgroundColor: '#e0e0e0', borderColor: 'green' },
  txtF: { fontSize: 12 },
  btnGerar: { backgroundColor: 'green', padding: 15, borderRadius: 10, alignItems: 'center', marginBottom: 20 },
  btnText: { color: 'white', fontWeight: 'bold' },
  card: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, backgroundColor: '#f9f9f9', marginBottom: 5, borderRadius: 8, borderLeftWidth: 5, borderLeftColor: 'green' },
  jogoTxt: { fontSize: 16, fontWeight: 'bold' }
});
                                 
