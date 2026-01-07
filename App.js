import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';

export default function App() {
  const [bloqueados, setBloqueados] = useState([]);
  const [jogos, setJogos] = useState([]);
  const [config, setConfig] = useState({ qtd: '10', pasta: '', gap: '', quads: '', cols: '' });

  const toggleBloqueio = (num) => {
    setBloqueados(prev => prev.includes(num) ? prev.filter(n => n !== num) : [...prev, num]);
  };

  const gerarEstrategia = () => {
    let pool = Array.from({ length: 60 }, (_, i) => i + 1).filter(n => !bloqueados.includes(n));
    if (config.quads) {
      const qMap = {
        '1': [1,2,3,4,5,11,12,13,14,15,21,22,23,24,25],
        '2': [6,7,8,9,10,16,17,18,19,20,26,27,28,29,30],
        '3': [31,32,33,34,35,41,42,43,44,45,51,52,53,54,55],
        '4': [36,37,38,39,40,46,47,48,49,50,56,57,58,59,60]
      };
      config.quads.split(',').forEach(q => {
        const alvos = qMap[q.trim()];
        if (alvos) pool = pool.filter(n => !alvos.includes(n));
      });
    }
    if (config.gap.includes(',')) {
      const [ini, tam] = config.gap.split(',').map(Number);
      const gapSet = Array.from({ length: tam }, (_, i) => ini + i);
      pool = pool.filter(n => !gapSet.includes(n));
    }
    if (config.cols) {
      config.cols.split(',').forEach(c => {
        const colIdx = parseInt(c.trim());
        pool = pool.filter(n => (n - colIdx) % 10 !== 0);
      });
    }
    if (pool.length < 6) return Alert.alert("Erro", "Filtros excessivos.");
    const novos = [];
    while (novos.length < Math.min(parseInt(config.qtd) || 1, 500)) {
      let jogo = [...pool].sort(() => Math.random() - 0.5).slice(0, 6).sort((a, b) => a - b);
      if (!novos.includes(jogo.join(' - '))) novos.push(jogo.join(' - '));
    }
    setJogos(novos);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>MegaMente Sniper</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Bloqueio Manual:</Text>
        <View style={styles.grid}>
          {Array.from({ length: 60 }, (_, i) => i + 1).map(n => (
            <TouchableOpacity key={n} style={[styles.num, bloqueados.includes(n) && styles.numB]} onPress={() => toggleBloqueio(n)}>
              <Text style={{fontSize: 10, color: bloqueados.includes(n) ? '#fff' : '#000'}}>{n}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.card}>
        <TextInput placeholder="Quantidade (Max 500)" style={styles.input} onChangeText={t => setConfig({...config, qtd: t})}/>
        <TextInput placeholder="Excluir Quadrantes (1,2,3,4)" style={styles.input} onChangeText={t => setConfig({...config, quads: t})}/>
        <TextInput placeholder="GAP (Início,Tamanho)" style={styles.input} onChangeText={t => setConfig({...config, gap: t})}/>
        <TextInput placeholder="Colunas (1-10)" style={styles.input} onChangeText={t => setConfig({...config, cols: t})}/>
        <TouchableOpacity style={styles.btn} onPress={gerarEstrategia}><Text style={styles.btnT}>GERAR JOGOS</Text></TouchableOpacity>
      </View>
      {jogos.length > 0 && <View style={styles.card}>{jogos.map((j, i) => <Text key={i} style={styles.jText}>{j}</Text>)}</View>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f4f4f4' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 20, color: '#2c3e50' },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 20, elevation: 3 },
  label: { fontWeight: 'bold', marginBottom: 10 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  num: { width: 30, height: 30, margin: 2, backgroundColor: '#eee', alignItems: 'center', justifyContent: 'center', borderRadius: 5 },
  numB: { backgroundColor: '#e74c3c' },
  input: { borderBottomWidth: 1, borderColor: '#ccc', marginBottom: 15, padding: 5 },
  btn: { backgroundColor: '#27ae60', padding: 15, borderRadius: 5 },
  btnT: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  jText: { fontSize: 18, fontFamily: 'monospace', textAlign: 'center', marginVertical: 5 }
});
