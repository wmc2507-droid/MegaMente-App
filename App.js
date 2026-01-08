    import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, TextInput, ScrollView, Alert, Modal, Share } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [bloqueados, setBloqueados] = useState([]);
  const [jogosAtuais, setJogosAtuais] = useState([]);
  const [pastas, setPastas] = useState([]);
  const [menuAberto, setMenuAberto] = useState(false);
  const [nomePasta, setNomePasta] = useState('');
  const [sorteados, setSorteados] = useState('');
  
  // Estados dos filtros
  const [qtd, setQtd] = useState('');
  const [parImpar, setParImpar] = useState('');
  const [colunas, setColunas] = useState('');
  const [quadrantes, setQuadrantes] = useState('');
  const [gap, setGap] = useState('');

  const numeros = Array.from({ length: 60 }, (_, i) => i + 1);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const saved = await AsyncStorage.getItem('@mega_pastas');
      if (saved) setPastas(JSON.parse(saved));
    } catch (e) { Alert.alert("Erro", "Falha ao carregar dados."); }
  };

  const saveData = async (novas) => {
    try {
      await AsyncStorage.setItem('@mega_pastas', JSON.stringify(novas));
      setPastas(novas);
    } catch (e) { Alert.alert("Erro", "Falha ao salvar."); }
  };

  const ajuda = (t, d) => Alert.alert(t, d);

  const gerarJogos = () => {
    let base = numeros.filter(n => !bloqueados.includes(n));

    if (parImpar.toUpperCase() === 'P') base = base.filter(n => n % 2 === 0);
    if (parImpar.toUpperCase() === 'I') base = base.filter(n => n % 2 !== 0);

    if (colunas) {
      const cols = colunas.split(',').map(c => parseInt(c.trim()));
      base = base.filter(n => !cols.includes(n % 10 === 0 ? 10 : n % 10));
    }

    if (quadrantes) {
      const qE = quadrantes.split(',').map(q => q.trim());
      base = base.filter(n => {
        const l = Math.floor((n - 1) / 10), c = (n - 1) % 10;
        if (qE.includes('1') && l < 3 && c < 5) return false;
        if (qE.includes('2') && l < 3 && c >= 5) return false;
        if (qE.includes('3') && l >= 3 && c < 5) return false;
        if (qE.includes('4') && l >= 3 && c >= 5) return false;
        return true;
      });
    }

    if (gap.includes(',')) {
      const [i, t] = gap.split(',').map(v => parseInt(v.trim()));
      base = base.filter(n => !(n >= i && n < i + t));
    }

    if (base.length < 6) return Alert.alert("Erro", "Filtros excessivos!");

    let res = [];
    for (let i = 0; i < (parseInt(qtd) || 1); i++) {
      res.push([...base].sort(() => Math.random() - 0.5).slice(0, 6).sort((a, b) => a - b));
    }
    setJogosAtuais(res);
  };

  const compartilhar = async (p) => {
    const msg = `Pasta: ${p.nome}\n\n` + p.jogos.map((j, i) => `J${i+1}: ${j.join('-')}`).join('\n');
    await Share.share({ message: msg });
  };

  const conferir = (jgs) => {
    const s = sorteados.split(',').map(n => parseInt(n.trim()));
    if (s.length < 6) return Alert.alert("Erro", "Insira 6 números.");
    let m = jgs.map((j, i) => `Jogo ${i+1}: ${j.filter(n => s.includes(n)).length} acertos`).join('\n');
    Alert.alert("Resultado", m);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F0F2F5' }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 50 }}>
        <View style={styles.header}>
          <Text style={styles.titulo}>MEGA-SENA</Text>
          <TouchableOpacity onPress={() => setMenuAberto(true)}><Text style={styles.menuIcon}>☰</Text></TouchableOpacity>
        </View>

        <View style={styles.cartela}>
          <FlatList
            data={numeros}
            numColumns={10}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={[styles.num, bloqueados.includes(item) && styles.bloqueado]}
                onPress={() => setBloqueados(prev => prev.includes(item) ? prev.filter(n => n !== item) : [...prev, item])}
              >
                <Text style={styles.numText}>{item < 10 ? `0${item}` : item}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={i => i.toString()}
            columnWrapperStyle={styles.row}
            scrollEnabled={false}
          />
        </View>

        <View style={styles.form}>
          <TextInput style={styles.input} placeholder="Quantidade de Jogos" keyboardType="numeric" onChangeText={setQtd} />
          <View style={styles.inputRow}><Text style={styles.label}>P ou I</Text><TouchableOpacity onPress={() => ajuda('P/I', 'P: Pares, I: Ímpares')}><Text style={styles.ajuda}>?</Text></TouchableOpacity></View>
          <TextInput style={styles.input} placeholder="Ex: P" onChangeText={setParImpar} maxLength={1} />
          <View style={styles.inputRow}><Text style={styles.label}>Excluir Quadrantes</Text><TouchableOpacity onPress={() => ajuda('Q', '1 a 4')}><Text style={styles.ajuda}>?</Text></TouchableOpacity></View>
          <TextInput style={styles.input} placeholder="Ex: 1, 4" onChangeText={setQuadrantes} />
          <View style={styles.inputRow}><Text style={styles.label}>GAP (Início, Tamanho)</Text><TouchableOpacity onPress={() => ajuda('GAP', 'Ex: 10, 5')}><Text style={styles.ajuda}>?</Text></TouchableOpacity></View>
          <TextInput style={styles.input} placeholder="Ex: 20, 10" onChangeText={setGap} />
          <View style={styles.inputRow}><Text style={styles.label}>Excluir Colunas</Text><TouchableOpacity onPress={() => ajuda('C', '1 a 10')}><Text style={styles.ajuda}>?</Text></TouchableOpacity></View>
          <TextInput style={styles.input} placeholder="Ex: 5, 10" onChangeText={setColunas} />
          
          <TouchableOpacity style={styles.btn} onPress={gerarJogos}><Text style={styles.btnText}>GERAR JOGOS</Text></TouchableOpacity>
          
          <TextInput style={[styles.input, {marginTop: 20}]} placeholder="Nome da Pasta" value={nomePasta} onChangeText={setNomePasta} />
          <TouchableOpacity style={[styles.btn, {backgroundColor: '#3498DB'}]} onPress={() => {
            if (jogosAtuais.length > 0 && nomePasta) {
              const n = [...pastas, { nome: nomePasta, jogos: jogosAtuais }];
              saveData(n);
              setNomePasta('');
              Alert.alert("Sucesso", "Salvo!");
            } else { Alert.alert("Erro", "Gere jogos e dê um nome!"); }
          }}><Text style={styles.btnText}>GUARDAR JOGOS</Text></TouchableOpacity>
        </View>

        {jogosAtuais.map((j, i) => (
          <View key={i} style={styles.jogoCard}><Text style={styles.jogoText}>{j.join('  -  ')}</Text></View>
        ))}
        <View style={{ height: 80 }} />
      </ScrollView>

      <Modal visible={menuAberto} animationType="slide">
        <View style={styles.modal}>
          <View style={styles.headerModal}><Text style={styles.tituloModal}>MINHAS PASTAS</Text><TouchableOpacity onPress={() => setMenuAberto(false)}><Text style={styles.close}>X</Text></TouchableOpacity></View>
          <TextInput style={styles.input} placeholder="Resultado Real (ex: 1,5,20,30,40,50)" onChangeText={setSorteados} keyboardType="numeric" />
          <FlatList
            data={pastas}
            renderItem={({ item, index }) => (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>{item.nome}</Text>
                {item.jogos.map((j, i) => <Text key={i} style={{fontSize: 12}}>{j.join(' - ')}</Text>)}
                <TouchableOpacity style={styles.btnConf} onPress={() => conferir(item.jogos)}><Text style={styles.btnText}>CONFERIR</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.btnConf, {backgroundColor: '#25D366'}]} onPress={() => compartilhar(item)}><Text style={styles.btnText}>WHATSAPP</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => saveData(pastas.filter((_, i) => i !== index))}><Text style={{color: 'red', marginTop: 15, textAlign: 'center'}}>Excluir</Text></TouchableOpacity>
              </View>
            )}
            keyExtractor={(_, i) => i.toString()}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  titulo: { fontSize: 32, fontWeight: '900', color: '#27AE60' },
  menuIcon: { fontSize: 35, color: '#333' },
  cartela: { backgroundColor: '#FFF', padding: 10, borderRadius: 12, elevation: 4 },
  row: { justifyContent: 'space-between', marginBottom: 5 },
  num: { width: '9%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#E0E6ED', borderRadius: 4 },
  bloqueado: { backgroundColor: '#FF4757' },
  numText: { fontSize: 10, fontWeight: 'bold' },
  form: { marginTop: 20, backgroundColor: '#FFF', padding: 20, borderRadius: 12, marginBottom: 20 },
  inputRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  label: { fontSize: 12, fontWeight: 'bold', color: '#7F8C8D', marginRight: 5 },
  ajuda: { fontSize: 16, color: '#3498DB', fontWeight: 'bold' },
  input: { borderBottomWidth: 1.5, borderColor: '#DCDFE6', marginBottom: 15, padding: 5 },
  btn: { backgroundColor: '#27AE60', padding: 18, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#FFF', fontWeight: 'bold' },
  jogoCard: { backgroundColor: '#FFF', padding: 15, borderRadius: 10, marginBottom: 10, borderLeftWidth: 5, borderLeftColor: '#27AE60' },
  jogoText: { fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
  modal: { flex: 1, padding: 20, backgroundColor: '#F0F2F5' },
  headerModal: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  tituloModal: { fontSize: 24, fontWeight: 'bold', color: '#27AE60' },
  close: { fontSize: 30, color: 'red' },
  card: { backgroundColor: '#FFF', padding: 15, borderRadius: 10, marginBottom: 15 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#27AE60', marginBottom: 10 },
  btnConf: { padding: 12, borderRadius: 5, marginTop: 10, alignItems: 'center', backgroundColor: '#27AE60' }
});
