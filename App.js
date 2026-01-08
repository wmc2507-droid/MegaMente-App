import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native';

export default function App() {
  const [jogos, setJogos] = useState([]);
  const [sorteio, setSorteio] = useState([1, 15, 23, 34, 45, 58]); // Exemplo de sorteio real

  const gerarEOrdenar = (qtd, tecnica, colunas, gaps, quads) => {
    let novosJogos = [];
    const colExcluidas = colunas.split(',').map(n => parseInt(n.trim()));
    
    for (let i = 0; i < qtd; i++) {
      let jogo = [];
      while (jogo.length < 6) {
        let num = Math.floor(Math.random() * 60) + 1;
        let col = num % 10 === 0 ? 10 : num % 10;
        let par = num % 2 === 0 ? 'P' : 'I';
        
        // Filtros das Técnicas
        if (!colExcluidas.includes(col) && (!tecnica || tecnica === par) && !jogo.includes(num)) {
          jogo.push(num);
        }
      }
      // Cálculo de Acertos para o Ranking
      let acertos = jogo.filter(n => sorteio.includes(n)).length;
      novosJogos.push({ numeros: jogo.sort((a, b) => a - b), acertos });
    }
    // Ranking: Ordem dos que MAIS acertaram
    setJogos(novosJogos.sort((a, b) => b.acertos - a.acertos));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}><Text style={styles.titulo}>LÓGICA MILION</Text></View>
      <View style={styles.cardGrade}>
        <View style={styles.grade}>
          {Array.from({ length: 60 }, (_, i) => (
            <View key={i} style={styles.box}><Text style={styles.boxTxt}>{(i + 1)}</Text></View>
          ))}
        </View>
      </View>
      <View style={styles.form}>
        <TextInput style={styles.input} placeholder="Técnica P ou I?" />
        <TextInput style={styles.input} placeholder="Excluir Quadrantes? Ex: 1, 4" />
        <TextInput style={styles.input} placeholder="GAP (Início, Tamanho)?" />
        <TextInput style={styles.input} placeholder="Excluir Colunas? Ex: 5, 10" />
        <TouchableOpacity style={styles.btn} onPress={() => gerarEOrdenar(10, 'P', '5,10')}>
          <Text style={styles.btnTxt}>GERAR E GUARDAR JOGOS</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.ranking}>
        <Text style={styles.rankTit}>Ranking de Acertos (Simulação):</Text>
        {jogos.map((j, i) => (
          <Text key={i} style={styles.res}>{i+1}º - {j.numeros.join(' ')} ({j.acertos} acertos)</Text>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f6f7' },
  header: { padding: 40, backgroundColor: '#fff', alignItems: 'center' },
  titulo: { color: '#2d6a4f', fontSize: 24, fontWeight: 'bold' },
  cardGrade: { backgroundColor: '#fff', margin: 15, padding: 10, borderRadius: 15, elevation: 3 },
  grade: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  box: { width: '9%', aspectRatio: 1, backgroundColor: '#eee', margin: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 4 },
  boxTxt: { fontSize: 9, fontWeight: 'bold' },
  form: { padding: 20, backgroundColor: '#fff', margin: 15, borderRadius: 15 },
  input: { borderBottomWidth: 1, borderBottomColor: '#ccc', marginBottom: 15, padding: 5 },
  btn: { backgroundColor: '#2dc653', padding: 15, borderRadius: 10, alignItems: 'center' },
  btnTxt: { color: '#fff', fontWeight: 'bold' },
  ranking: { padding: 20 },
  rankTit: { fontWeight: 'bold', color: '#2d6a4f', marginBottom: 10 },
  res: { fontSize: 14, marginBottom: 5, backgroundColor: '#fff', padding: 5, borderRadius: 5 }
});
