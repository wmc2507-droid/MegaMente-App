import 'package:flutter/material.dart';
import 'dart:math';

void main() => runApp(MaterialApp(
  home: MegaSenaPro(),
  theme: ThemeData(primarySwatch: Colors.green, scaffoldBackgroundColor: Colors.white),
));

class MegaSenaPro extends StatefulWidget {
  @override
  _MegaSenaProState createState() => _MegaSenaProState();
}

class _MegaSenaProState extends State<MegaSenaPro> {
  Set<int> excluidosManuais = {};
  List<List<int>> jogosGerados = [];
  bool filtroParImpar = false;
  bool filtroQuadrantes = false;

  bool _isNumeroBloqueado(int n) {
    if (excluidosManuais.contains(n)) return true;
    if (filtroParImpar) {
      // Exemplo: se quer par, bloqueia ímpar (lógica simplificada para visual)
      if (n % 2 != 0) return true;
    }
    return false;
  }

  void _gerarJogos() {
    List<int> disponiveis = [];
    for (int i = 1; i <= 60; i++) {
      if (!_isNumeroBloqueado(i)) disponiveis.push(i);
    }

    if (disponiveis.length < 6) {
      showDialog(
        context: context,
        builder: (c) => AlertDialog(title: Text("Aviso"), content: Text("Impossível gerar: Técnicas em conflito ou muitos números excluídos!")),
      );
      return;
    }

    List<List<int>> novos = [];
    Random rnd = Random();
    for (int i = 0; i < 10; i++) {
      List<int> temp = (disponiveis..shuffle()).take(6).toList()..sort();
      novos.add(temp);
    }
    setState(() => jogosGerados = novos);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Mega Sena Pro", style: TextStyle(fontSize: 16)),
        actions: [IconButton(icon: Icon(Icons.menu, size: 18), onPressed: () {})],
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.all(8.0),
              child: Wrap(
                alignment: WrapAlignment.center,
                children: List.generate(60, (i) {
                  int n = i + 1;
                  bool bloqueado = _isNumeroBloqueado(n);
                  return GestureDetector(
                    onTap: () => setState(() => excluidosManuais.contains(n) ? excluidosManuais.remove(n) : excluidosManuais.add(n)),
                    child: Container(
                      width: 32, height: 32, margin: EdgeInsets.all(2),
                      decoration: BoxDecoration(color: Colors.green, borderRadius: BorderRadius.circular(4)),
                      child: Stack(
                        children: [
                          Center(child: Text("$n", style: TextStyle(color: Colors.white, fontSize: 12))),
                          if (bloqueado) Container(decoration: BoxDecoration(color: Colors.red.withOpacity(0.5), borderRadius: BorderRadius.circular(4))),
                        ],
                      ),
                    ),
                  );
                }),
              ),
            ),
            CheckboxListTile(title: Text("Técnica Par/Ímpar"), value: filtroParImpar, onChanged: (v) => setState(() => filtroParImpar = v!)),
            CheckboxListTile(title: Text("Técnica Quadrantes"), value: filtroQuadrantes, onChanged: (v) => setState(() => filtroQuadrantes = v!)),
            ElevatedButton(onPressed: _gerarJogos, child: Text("GERAR 10 JOGOS")),
            ...jogosGerados.map((jogo) => Card(
              child: ListTile(
                title: Text(jogo.join(' - ')),
                trailing: Icon(Icons.share, size: 16, color: Colors.green),
              ),
            )).toList(),
          ],
        ),
      ),
    );
  }
      }
