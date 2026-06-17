/* Embute o GeoJSON dissolvido como window.REGIOES_GEO (compatível com file://). */
const fs = require("fs");
const path = require("path");
const D = path.join(__dirname, "data");

const NOMES = {
  1:"Centro", 2:"Zona Sul", 3:"Zona Norte", 4:"Zona Oeste", 5:"Grande Tijuca",
  6:"Baixada Fluminense", 7:"Complexos de Favelas", 8:"Região Portuária",
  9:"Barra da Tijuca e Recreio", 10:"Niterói / São Gonçalo",
  11:"Região dos Lagos / Costa do Sol", 12:"Costa Verde"
};

const g = JSON.parse(fs.readFileSync(path.join(D,"regioes-dissolved.geojson"),"utf8"));
g.features.forEach(f => {
  const id = f.properties.regiao;
  f.properties = { id, nome: NOMES[id] };
});
g.features.sort((a,b) => a.properties.id - b.properties.id);

const js = "/* Limites reais das 10 regiões — gerado de data.rio (bairros) + IBGE (municípios).\n"
  + "   Embutido como JS para funcionar ao abrir o index.html direto (file://). */\n"
  + "window.REGIOES_GEO = " + JSON.stringify(g) + ";\n";
const outPath = path.join(__dirname, "..", "assets", "regioes-geo.js");
fs.writeFileSync(outPath, js);
console.log("escrito:", outPath);
console.log("tamanho KB:", (fs.statSync(outPath).size/1024).toFixed(1));

// ---- centróides de bairros para reposicionar marcadores com precisão ----
// (usa o bairros.geojson original; calcula centróide simples por bairro)
const bairros = JSON.parse(fs.readFileSync(path.join(D,"bairros.geojson"),"utf8"));
function centroid(geom){
  let sx=0, sy=0, n=0;
  const eachRing = (coords)=>coords.forEach(pt=>{ if(typeof pt[0]==="number"){ sx+=pt[0]; sy+=pt[1]; n++; } else eachRing(pt); });
  eachRing(geom.coordinates);
  return [ +(sy/n).toFixed(4), +(sx/n).toFixed(4) ]; // [lat, lng]
}
const want = ["Madureira","Méier","Centro","Campo Grande","Bangu","Complexo do Alemão","Glória",
  "Santa Cruz","Ramos","Penha","Copacabana","Rocinha","Maré","Jacarezinho","Cidade de Deus",
  "Jardim Guanabara","Pavuna","Bonsucesso"];
const cent = {};
bairros.features.forEach(f=>{ if(want.includes(f.properties.nome)) cent[f.properties.nome]=centroid(f.geometry); });
console.log("CENTROIDES:", JSON.stringify(cent));
