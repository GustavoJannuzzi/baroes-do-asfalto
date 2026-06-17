/* Tag each Rio bairro + Baixada/Niterói municipality with its game region (1-10),
   producing a single tagged FeatureCollection for mapshaper to dissolve. */
const fs = require("fs");
const path = require("path");
const D = path.join(__dirname, "data");

// ---- bairro -> região (cidade do Rio) ----
const MAP = {
  1: ["Centro","Lapa","Cidade Nova","Estácio","Catumbi","Rio Comprido","Santa Teresa","Paquetá"],
  2: ["Copacabana","Leme","Ipanema","Leblon","Botafogo","Urca","Flamengo","Laranjeiras",
      "Cosme Velho","Humaitá","Lagoa","Jardim Botânico","Gávea","São Conrado","Glória","Catete"],
  4: ["Campo Grande","Bangu","Realengo","Padre Miguel","Senador Camará","Santíssimo","Paciência",
      "Santa Cruz","Sepetiba","Guaratiba","Barra de Guaratiba","Pedra de Guaratiba","Ilha de Guaratiba",
      "Cosmos","Inhoaíba","Senador Vasconcelos","Jardim Sulacap","Magalhães Bastos","Vila Militar",
      "Deodoro","Campo dos Afonsos","Gericinó","Vila Kennedy","Jabour","Argentino"],
  5: ["Tijuca","Praça da Bandeira","Alto da Boa Vista","Andaraí","Grajaú","Maracanã","Vila Isabel"],
  7: ["Complexo do Alemão","Maré","Rocinha","Jacarezinho","Cidade de Deus","Manguinhos","Vidigal"],
  8: ["Santo Cristo","Gamboa","Saúde","Caju","Imperial de São Cristóvão","Vasco da Gama","Mangueira","Benfica"],
  9: ["Barra da Tijuca","Barra Olímpica","Recreio dos Bandeirantes","Joá","Itanhangá","Camorim",
      "Vargem Grande","Vargem Pequena","Grumari","Jacarepaguá","Taquara","Tanque","Pechincha",
      "Freguesia (Jacarepaguá)","Curicica","Anil","Gardênia Azul","Praça Seca","Vila Valqueire"]
  // 3 (Zona Norte) = catch-all para os demais bairros
};
const bairroToReg = {};
for (const [reg, list] of Object.entries(MAP)) list.forEach(n => bairroToReg[n] = +reg);

// ---- município -> região (fora da cidade) ----
const MUN_REG = {
  "3301702":6,"3303500":6,"3305109":6,"3300456":6,"3303203":6,"3302858":6,"3304144":6,"3302270":6,"3302502":6,
  "3303302":10,"3304904":10,
  // Região 11 — Lagos / Costa do Sol
  "3302700":11,"3305505":11,"3300209":11,"3305208":11,"3301876":11,"3300704":11,"3300258":11,"3300233":11,"3304524":11,
  // Região 12 — Costa Verde
  "3300100":12,"3302601":12,"3303807":12,"3302007":12
};

const out = { type:"FeatureCollection", features:[] };
const hist = {}; const def3 = [];

// bairros
const bairros = JSON.parse(fs.readFileSync(path.join(D,"bairros.geojson"),"utf8"));
bairros.features.forEach(f => {
  const nome = f.properties.nome;
  let reg = bairroToReg[nome];
  if (!reg) { reg = 3; def3.push(nome); }
  hist[reg] = (hist[reg]||0)+1;
  out.features.push({ type:"Feature", properties:{ regiao:reg }, geometry:f.geometry });
});

// municípios
for (const [cod, reg] of Object.entries(MUN_REG)) {
  const g = JSON.parse(fs.readFileSync(path.join(D,`mun-${cod}.geojson`),"utf8"));
  g.features.forEach(f => {
    hist[reg] = (hist[reg]||0)+1;
    out.features.push({ type:"Feature", properties:{ regiao:reg }, geometry:f.geometry });
  });
}

fs.writeFileSync(path.join(D,"all-tagged.geojson"), JSON.stringify(out));
console.log("features:", out.features.length);
console.log("por região:", JSON.stringify(hist));
console.log("default→3 (Zona Norte):", def3.length, "bairros");
console.log(def3.join(", "));
