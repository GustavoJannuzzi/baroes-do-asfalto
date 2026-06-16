# _build — geração dos limites reais do mapa

Estes scripts geram `../assets/regioes-geo.js` (os contornos das 10 regiões do jogo),
embutido como `window.REGIOES_GEO` para o site funcionar ao abrir o `index.html` direto (file://).

## Fontes (oficiais e públicas)
- **Bairros da cidade do Rio** — data.rio / Prefeitura (ArcGIS FeatureServer "Limite de Bairros").
- **Municípios** (Baixada Fluminense, Niterói e São Gonçalo) — malha municipal do **IBGE**.

## Como regenerar
```bash
npm install            # instala o mapshaper

# 1) baixar bairros do data.rio
curl "https://pgeo3.rio.rj.gov.br/arcgis/rest/services/Cartografia/Limites_administrativos/FeatureServer/4/query?where=1=1&outFields=nome,regiao_adm&outSR=4326&f=geojson" -o data/bairros.geojson

# 2) baixar municípios do IBGE (códigos no tag.js): ex. Duque de Caxias
curl "https://servicodados.ibge.gov.br/api/v3/malhas/municipios/3301702?formato=application/vnd.geo+json" -o data/mun-3301702.geojson
#   ...repita para os demais códigos listados em tag.js (MUN_REG)

# 3) marcar cada bairro/município com sua região (1-10) -> data/all-tagged.geojson
node tag.js

# 4) dissolver POR REGIÃO (com -clean, senão a Grande Tijuca colapsa), depois unir e simplificar
for n in 1 2 3 4 5 6 7 8 9 10; do \
  npx mapshaper data/all-tagged.geojson -filter "regiao===$n" -clean -dissolve regiao -o data/reg-$n.geojson; done
npx mapshaper data/reg-*.geojson combine-files -merge-layers -simplify visvalingam 8% keep-shapes \
  -o precision=0.00001 data/regioes-dissolved.geojson

# 5) embutir como JS em ../assets/regioes-geo.js
node wrap.js
```

> A região 7 (Complexos de Favelas) é montada a partir dos bairros-favela oficiais
> (Complexo do Alemão, Maré, Rocinha, Jacarezinho, Cidade de Deus, Manguinhos, Vidigal),
> por isso aparece espalhada pelo mapa, e não como uma zona contígua.
