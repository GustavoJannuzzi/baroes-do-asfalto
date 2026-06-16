# Barões do Asfalto — Apresentação

Aplicação web de apresentação do RPG de mesa **Barões do Asfalto** (jogo do bicho e crime organizado no Rio de Janeiro). Explica conceitos, mecânicas, território, favores, lavagem de dinheiro e combate — para os jogadores entenderem e se interessarem pelo jogo.

🔗 **Site:** _(adicione o link da Vercel aqui depois do deploy)_

## Tecnologia

Site **100% estático** — HTML, CSS e JavaScript puro, sem build. Abre direto no navegador ou em qualquer hospedagem estática.

- Navegação por seções (SPA com hash routing)
- **Rolador de dados interativo** (ensina a mecânica do pool de d6)
- **Mapa real do Rio** (Leaflet + OpenStreetMap/CARTO) com as 10 regiões, pontos de jogo do bicho, milícias e facções
- Diagramas, fluxogramas e tabelas

## Rodar localmente

Basta abrir o `index.html` no navegador. Não precisa de servidor.

## Estrutura

```
.
├── index.html          # página principal
├── assets/
│   ├── styles.css      # tema visual
│   └── app.js          # conteúdo, navegação, mapa e interatividade
├── COMO-ABRIR.md       # guia rápido de uso
└── README.md
```

## Deploy (Vercel)

Site estático sem build. Na Vercel: **Framework Preset = Other**, **Root Directory = `.`**, sem comando de build. A Vercel detecta o `index.html` e serve automaticamente.
