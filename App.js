import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert, Share, TextInput, Modal, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function App() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [excluidosManuais, setExcluidos] = useState([]);
  const [pastas, setPastas] = useState([{ id: 1, nome: "Quero ganhar", jogos: [] }]);
  const [tecnicaPI, setTeconicaPI] = useState('');
  const [excluirCol, setExcluirCol] = useState('');
  const [resultadoInput, setResultadoInput] = useState('');
  const [conferenciaRank, setConferenciaRank] = useState([]);

  const isBloqueado = (n) => {
    if (excluidosManuais.includes(n)) return true;
    if (tecnicaPI.toUpperCase() === 'P' && n % 2 !== 0) return true;
    if (tecnicaPI.toUpperCase() === 'I' && n % 2 === 0) return true;
    const col = n % 10 === 0 ? 10 : n % 10;
    if (excluirCol.split(',').map(x => x.trim()).includes(col.toString())) return true;
    return false;
  };

  const gerarEGuardar = () => {
    let disponiveis = [];
    for (let i = 1; i <= 60; i++) { if (!isBloqueado(i)) disponiveis.push(i); }
    if (disponiveis.length < 6) {
      Alert.alert("Erro", "Técnicas em conflito! Números insuficientes.");
      return;
    }
    let novos = [];
    for (let i = 0; i < 10; i++) {
      let jogo = [...disponiveis].sort(() => 0.5 - Math.random()).slice(0, 6).sort((a, b) => a - b);
      novos.push(jogo);
    }
    setPastas([{ ...pastas[0], jogos: [...pastas[0].jogos, ...novos] }]);
  };

  const conferirERanking = () => {
    const res = resultadoInput.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
    if (res.length < 6) {
      Alert.alert("Aviso", "Insira o resultado completo.");
      return;
    }
    let ranking = pastas[0].jogos.map((jogo, idx) => {
      const acertos = jogo.filter(n => res.includes(n)).length;
      return { id: idx, jogo, acertos };
    });
    ranking.sort((a, b) => b.acertos - a.acertos);
    setConferenciaRank(ranking);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f4f6f7' }}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.logo}>LÓGICA MILION</Text>
          <TouchableOpacity onPress={() => setMenuVisible(true)}>
            <Ionicons name="menu" size={18} color="black" />
          </TouchableOpacity>
        </View>

        <View style={styles.cartela}>
          {Array.from({ length: 60 }, (_, i) => i + 1).map(n => (
            <TouchableOpacity key={n} style={styles.num} onPress={() => {
              excluidosManuais.includes(n) ? setExcluidos(excluidosManuais.filter(x => x !== n)) : setExcluidos([...excluidosManuais, n]);
            }}>
              <Text style={styles.numTxt}>{n < 10 ? `0${n}` : n}</Text>
              {isBloqueado(n) && <View style={styles.tarja} />}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.tecnicasArea}>
          <Text style={styles.label}>Técnica P ou I ?</Text>
          <TextInput style={styles.input} value={tecnicaPI} onChangeText={setTeconicaPI} placeholder="P ou I" autoCapitalize="characters" />
          <Text style={styles.label}>Excluir Colunas ?</Text>
          <TextInput style={styles.input} value={excluirCol} onChangeText={setExcluirCol} placeholder="Ex: 5, 10" />
          <TouchableOpacity style={styles.btnGerar} onPress={gerarEGuardar}>
            <Text style={styles.btnTxt}>GERAR E GUARDAR JOGOS</Text>
          </TouchableOpacity>
        </View>

        {pastas.map(p => (
          <View key={p.id} style={styles.pastaCard}>
            <View style={styles.pastaHeader}>
              <Text style={styles.pastaTitulo}>{p.nome}</Text>
              <TouchableOpacity onPress={() => Share.share({ message: p.jogos.map(j => j.join('-')).join('\n') })}>
                <Ionicons name="share-outline" size={18} color="gray" />
              </TouchableOpacity>
            </View>
            {p.jogos.map((j, i) => <Text key={i} style={styles.jogoTxt}>{j.join(' - ')}</Text>)}
          </View>
        ))}
      </ScrollView>

      <Modal visible={menuVisible} animationType="slide">
        <View style={styles.modalContent}>
          <View style={styles.headerModal}>
            <Text style={styles.logo}>RANKING DE ACERTOS</Text>
            <TouchableOpacity onPress={() => {setMenuVisible(false); setConferenciaRank([]);}}><Ionicons name="close" size={24} color="red" /></TouchableOpacity>
          </View>
          <TextInput placeholder="Resultado Real (01,02...)" style={styles.inputModal} value={resultadoInput} onChangeText={setResultadoInput} keyboardType="numeric" />
          <TouchableOpacity style={styles.btnConf} onPress={conferirERanking}><Text style={styles.btnTxt}>ORDENAR POR PONTOS</Text></TouchableOpacity>
          <FlatList data={conferenciaRank} keyExtractor={(item) => item.id.toString()} renderItem={({ item }) => (
            <View style={styles.rankItem}>
              <Text style={styles.rankJogo}>{item.jogo.join(' - ')}</Text>
              <Text style={[styles.rankAcerto, {color: item.acertos >= 4 ? 'green' : 'black'}]}>{item.acertos} ACERTOS</Text>
            </View>
          )} />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 15 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, marginTop: 35 },
  headerModal: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  logo: { fontSize: 20, fontWeight: '900', color: '#2e7d32' },
  cartela: { flexDirection: 'row', flexWrap: 'wrap', backgroundColor: 'white', padding: 10, borderRadius: 15, elevation: 3, justifyContent: 'center' },
  num: { width: 30, height: 26, margin: 2, backgroundColor: '#eceff1', borderRadius: 4, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  numTxt: { fontSize: 11, fontWeight: 'bold' },
  tarja: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255, 0, 0, 0.4)' },
  tecnicasArea: { backgroundColor: 'white', padding: 15, borderRadius: 15, marginTop: 20, elevation: 2 },
  label: { fontSize: 11, color: 'gray', marginTop: 10 },
  input: { borderBottomWidth: 1, borderColor: '#ddd', paddingVertical: 5 },
  btnGerar: { backgroundColor: '#2ecc71', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 20 },
  btnTxt: { color: 'white', fontWeight: 'bold' },
  pastaCard: { backgroundColor: 'white', padding: 15, borderRadius: 15, marginTop: 20, elevation: 2 },
  pastaHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  pastaTitulo: { fontSize: 16, fontWeight: 'bold', color: '#2e7d32' },
  jogoTxt: { fontSize: 13, color: '#333', marginBottom: 4 },
  modalContent: { flex: 1, padding: 20, backgroundColor: 'white', paddingTop: 40 },
  inputModal: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 15, marginTop: 20 },
  btnConf: { backgroundColor: '#3498db', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 15 },
  rankItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  rankJogo: { fontSize: 13 },
  rankAcerto: { fontSize: 13, fontWeight: 'bold' }
});
