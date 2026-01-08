import 'package:flutter/material.dart';
import 'dart:math';
import 'package:shared_preferences/shared_preferences.dart';

void main() => runApp(MaterialApp(home: MegaSenaPro(), theme: ThemeData.dark()));

class MegaSenaPro extends StatefulWidget {
  @override
  _MegaSenaProState createState() => _MegaSenaProState();
}

class _MegaSenaProState extends State<MegaSenaPro> {
  Set<int> excluidos = {};
  List<List<int>> jogosGerados = [];
  bool filtroParImpar = true;
  bool filtroQuadrantes = true;
  bool filtroColunas = true;

  void _gerarJogos() {
    List<List<int>> novosJogos = [];
    Random rnd = Random();
    
    while (novosJogos.length < 10) {
      List<int> jogo = [];
      while (jogo.length < 6) {
        int num = rnd.nextInt(60) + 1;
        if (!excluidos.contains(num) && !jogo.contains(num)) {
          jogo.add(num);
        }
      }
      jogo.sort();

      bool passaParImpar = !filtroParImpar || _checkParImpar(jogo);
      bool passaQuadrante = !filtroQuadrantes || _checkQuadrantes(jogo);
      
      if (passaParImpar && passaQuadrante) {
        novosJogos.add(jogo);
      }
    }
    setState(() => jogosGerados = novosJogos);
  }

  bool _checkParImpar(List<int> jogo) {
    int pares = jogo.where((n) => n % 2 == 0).length;
    return pares >= 2 && pares <= 4;
  }

  bool _checkQuadrantes(List<int> jogo) {
    Map<int, int> q = {1:0, 2:0, 3:0, 4:0};
    for (var n in jogo) {
      if (n <= 30 && n % 10 <= 5 && n % 10 != 0) q[1] = q[1]! + 1;
      else if (n <= 30) q[2] = q[2]! + 1;
      else if (n % 10 <= 5 && n % 10 != 0) q[3] = q[3]! + 1;
      else q[4] = q[4]! + 1;
    }
    return q.values.every((v) => v <= 3);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Mega Sena: Filtros Ativos")),
      body: Column(
        children: [
          Wrap(
            children: List.generate(60, (i) {
              int n = i + 1;
              bool isEx = excluidos.contains(n);
              return GestureDetector(
                onTap: () => setState(() => isEx ? excluidos.remove(n) : excluidos.add(n)),
                child: Container(
                  width: 35, height: 35, margin: EdgeInsets.all(2),
                  color: isEx ? Colors.red : Colors.green,
                  child: Center(child: Text("$n")),
                ),
              );
            }),
          ),
          Divider(),
          SwitchListTile(title: Text("Filtro Par/Ímpar"), value: filtroParImpar, onChanged: (v)=>setState(()=>filtroParImpar=v)),
          SwitchListTile(title: Text("Filtro Quadrantes"), value: filtroQuadrantes, onChanged: (v)=>setState(()=>filtroQuadrantes=v)),
          ElevatedButton(onPressed: _gerarJogos, child: Text("GERAR 10 JOGOS COM TÉCNICAS")),
          Expanded(
            child: ListView.builder(
              itemCount: jogosGerados.length,
              itemBuilder: (c, i) => ListTile(title: Text("Jogo ${i+1}: ${jogosGerados[i].join(' - ')}")),
            ),
          )
        ],
      ),
    );
  }
}
