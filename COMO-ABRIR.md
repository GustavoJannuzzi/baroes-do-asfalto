# Apresentação — Barões do Asfalto

Aplicação web de apresentação do jogo, para mostrar aos jogadores como o jogo funciona e despertar interesse.

## Como abrir

**Basta dar duplo-clique no arquivo `index.html`.** Ele abre no seu navegador padrão (Chrome, Edge, Firefox). Não precisa de servidor nem internet para funcionar.

> Dica: para apresentar, abra e aperte **F11** para tela cheia.

## O que tem aqui

Uma navegação por seções (menu à esquerda; no celular, botão ☰ no topo):

| Grupo | Seções |
|-------|--------|
| **Começo aqui** | Abertura · O que é o jogo |
| **As regras** | O sistema de dados (com **rolador de dados interativo**) · Personagem & Arquétipos · As 5 métricas |
| **O império** | Economia & Jogo do Bicho · Lavagem & Casa-Cofre · Sistema de Favores |
| **As ruas** | Território (**mapa do Rio clicável**) · Facções & Proteção · **Quem você encontra** (NPCs) · Combate & Segurança |
| **Bora jogar** | **Campanha & Missões** · Como começar |

## Recursos interativos

- **Rolador de dados** (seção "O sistema de dados"): ajuste o tamanho do pool e a dificuldade e role — vê os sucessos, as explosões do 6 e o grau de resultado na hora.
- **Mapa real do Rio** (seção "Território"): mapa de verdade (Leaflet + OpenStreetMap), com **12 regiões** em **limites reais** — bairros oficiais da cidade (data.rio) e municípios da Baixada, Niterói/São Gonçalo e das fronteiras de expansão (IBGE), delineados em tracejado. São 10 regiões no núcleo metropolitano + 2 fronteiras: **Região dos Lagos** (Maricá, Cabo Frio, Búzios) a leste e **Costa Verde** (Angra, Paraty, Itaguaí) a oeste. Há marcadores dos **pontos de jogo do bicho** ($), **milícia** (▣), **facção** (✊) e **bocas de fumo** (☠, camada opcional). Clique numa região para ver controle, custo, **poder político** e **bocas**. Passe o mouse nos pontos para o nome; clique para abrir. Use as **Camadas** no topo para ligar/desligar cada tipo. A região "Complexos de Favelas" aparece espalhada (hachura), por não ser uma zona contígua.
- Diagramas e fluxogramas: como os sistemas se conectam, o loop da sessão, o fluxo do dinheiro, o ciclo de um favor e a resolução de combate.

> **Sobre o mapa:** ele usa internet para carregar o mapa do Rio. Sem internet, a seção cai automaticamente num mapa estilizado (diagrama) das 12 regiões, e o resto da apresentação funciona normalmente.

## Estrutura dos arquivos

```
apresentacao/
├── index.html          ← abra este
├── COMO-ABRIR.md       ← este guia
└── assets/
    ├── styles.css      ← tema visual
    └── app.js          ← conteúdo, navegação e interatividade
```

## Personalizar

Todo o conteúdo está em `assets/app.js` (funções `render*`). As cores e o estilo estão em `assets/styles.css` (variáveis no topo, em `:root`). É um site estático simples — edite os textos diretamente nessas funções.

> As fontes vêm do Google Fonts (precisa de internet para ficarem idênticas). Sem internet, o site usa fontes do sistema e continua funcionando normalmente.
