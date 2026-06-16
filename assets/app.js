/* ============================================================
   BARÕES DO ASFALTO — Apresentação (app.js)
   Site estático: abre direto no navegador (sem servidor).
   ============================================================ */
(function () {
  "use strict";

  /* -------------------- DADOS: REGIÕES -------------------- */
  const REGIONS = [
    { id:1, nome:"Centro", bicho:"Águia", controle:"Disputado", cor:"#7d7d7d",
      pol:8, pot:9, custo:"R$ 60–150 mil", desc:"Berço histórico do bicho e território de ninguém. Volume gigante, mas câmeras e polícia por todo lado.", frase:"Onde tudo começou — e onde nada é de ninguém." },
    { id:2, nome:"Zona Sul", bicho:"Pavão", controle:"Bicheiros de elite", cor:"#C9A227",
      pol:9, pot:7, custo:"R$ 100 mil+", desc:"Turismo, dinheiro graúdo e lavagem. Clientela rica que aposta baixo para não se expor.", frase:"Ostentação com discrição." },
    { id:3, nome:"Zona Norte", bicho:"Galo", controle:"Misto (coração do bicho)", cor:"#2C5F7C",
      pol:5, pot:10, custo:"R$ 30–80 mil", desc:"O coração popular do jogo do bicho. Tradição, volume e a melhor relação risco/retorno do mapa.", frase:"Madureira não dorme. Madureira aposta." },
    { id:4, nome:"Zona Oeste", bicho:"Touro", controle:"Milícia", cor:"#C8A97E",
      pol:4, pot:8, custo:"R$ 20–60 mil + taxa", desc:"Domínio miliciano (60-70%). Proteção cara e obrigatória; quem não paga, não opera.", frase:"Aqui a milícia é a lei." },
    { id:5, nome:"Grande Tijuca", bicho:"Leão", controle:"Bicheiros tradicionais", cor:"#C9A227",
      pol:7, pot:8, custo:"R$ 50–100 mil", desc:"Onde o jogo nasceu em 1892. Tradição orgulhosa, classe média apostadora, velha guarda atuante.", frase:"O berço, e o orgulho." },
    { id:6, nome:"Baixada Fluminense", bicho:"Jacaré", controle:"Guerra total", cor:"#A4161A",
      pol:3, pot:9, custo:"R$ 15–50 mil", desc:"Território de guerra entre milícia e facções. Potencial enorme, risco máximo, polícia ausente.", frase:"A polícia chega depois do enterro." },
    { id:7, nome:"Complexos de Favelas", bicho:"Cobra", controle:"Facções", cor:"#A4161A",
      pol:2, pot:7, custo:"Taxa + 25–30% da renda", desc:"Domínio absoluto das facções (CV/TCP). Polícia só entra em operação. A facção é a lei de fato.", frase:"Quem sobe sem avisar não desce." },
    { id:8, nome:"Região Portuária", bicho:"Elefante", controle:"Sindicatos + facções", cor:"#2C5F7C",
      pol:6, pot:6, custo:"R$ 40–80 mil", desc:"O porto move tudo. Trabalhadores com bom salário, logística clandestina e dinheiro circulando.", frase:"Carga pesada, dinheiro vivo." },
    { id:9, nome:"Barra da Tijuca e Recreio", bicho:"Tigre", controle:"Bicheiros empresariais", cor:"#C9A227",
      pol:8, pot:5, custo:"R$ 120 mil+", desc:"Crime de camisa polo. Muito dinheiro, mas baixa tradição do bicho e segurança privada pesada.", frase:"Crime de camisa polo." },
    { id:10, nome:"Niterói / São Gonçalo", bicho:"Camelo", controle:"Bicheiros + CV", cor:"#2C5F7C",
      pol:6, pot:8, custo:"R$ 40–100 mil", desc:"Do outro lado da Baía. Niterói tradicional e classe média; São Gonçalo, volume gigante e perigoso.", frase:"A travessia da Baía." }
  ];

  /* posições no mapa estilizado (viewBox 0 0 600 430) — usado como fallback offline */
  const MAP_POS = {
    6:[20,18,168,72], 7:[206,18,168,72], 8:[392,18,168,72],
    4:[20,104,168,72], 3:[206,104,168,72], 1:[392,104,168,72],
    9:[20,190,168,72], 5:[206,190,168,72], 2:[392,190,168,72],
    10:[300,310,168,72]
  };

  /* -------------------- DADOS GEO (mapa real / Leaflet) -------------------- */
  /* Polígonos aproximados das 10 macro-regiões — [lat, lng]. Estilizados, não são limites oficiais. */
  const REGION_POLYS = {
    1:[[-22.892,-43.208],[-22.898,-43.168],[-22.918,-43.176],[-22.913,-43.212]],
    2:[[-22.933,-43.162],[-22.957,-43.152],[-22.992,-43.226],[-22.965,-43.238],[-22.944,-43.196]],
    3:[[-22.840,-43.218],[-22.842,-43.360],[-22.912,-43.358],[-22.910,-43.240],[-22.880,-43.218]],
    4:[[-22.848,-43.402],[-22.860,-43.700],[-22.952,-43.720],[-22.972,-43.420]],
    5:[[-22.914,-43.214],[-22.914,-43.266],[-22.948,-43.266],[-22.948,-43.214]],
    6:[[-22.660,-43.282],[-22.658,-43.500],[-22.792,-43.520],[-22.802,-43.280]],
    7:[[-22.846,-43.248],[-22.846,-43.292],[-22.878,-43.292],[-22.878,-43.248]],
    8:[[-22.884,-43.178],[-22.879,-43.216],[-22.902,-43.226],[-22.907,-43.184]],
    9:[[-22.994,-43.302],[-23.000,-43.488],[-23.038,-43.492],[-23.026,-43.308]],
    10:[[-22.858,-43.018],[-22.858,-43.132],[-22.922,-43.132],[-22.932,-43.018]]
  };

  /* Pontos físicos de jogo do bicho (baseados nas fichas do doc 4.2) */
  const BICHO_POINTS = [
    {n:"Barraca do Seu Milton", local:"Madureira", tipo:"Barraca de rua", lat:-22.8730, lng:-43.3370, lucro:"R$ 7.650/mês", exp:2},
    {n:"Salão Glamour", local:"Madureira", tipo:"Comércio parceiro", lat:-22.8762, lng:-43.3402, lucro:"R$ 10.200/mês", exp:2},
    {n:"Bar do Neguinho", local:"Méier", tipo:"Bar parceiro", lat:-22.9020, lng:-43.2810, lucro:"R$ 14.850/mês", exp:3},
    {n:"Barraca da Central", local:"Centro", tipo:"Barraca de rua", lat:-22.9030, lng:-43.1910, lucro:"R$ 22.350/mês", exp:5},
    {n:"Lotérica do Carvalho", local:"Campo Grande", tipo:"Lotérica associada", lat:-22.9050, lng:-43.5600, lucro:"R$ 39.000/mês", exp:3},
    {n:"Bar do Russo", local:"Bangu", tipo:"Bar parceiro", lat:-22.8800, lng:-43.4650, lucro:"R$ 7.500/mês", exp:6},
    {n:"Casa da Tia Marta", local:"Complexo do Alemão", tipo:"Ponto em comunidade", lat:-22.8660, lng:-43.2730, lucro:"R$ 11.100/mês", exp:2},
    {n:"Banca da Glória", local:"Glória", tipo:"Banca parceira", lat:-22.9200, lng:-43.1750, lucro:"R$ 15.000/mês", exp:4},
    {n:"Mercadinho Santa Cruz", local:"Santa Cruz", tipo:"Comércio parceiro", lat:-22.9180, lng:-43.6840, lucro:"R$ 8.250/mês", exp:5},
    {n:"Oficina Ramos", local:"Ramos", tipo:"Comércio parceiro", lat:-22.8520, lng:-43.2620, lucro:"R$ 7.800/mês", exp:3},
    {n:"Cooperativa Táxi", local:"Penha", tipo:"Cooperativa", lat:-22.8440, lng:-43.2770, lucro:"R$ 11.400/mês", exp:3},
    {n:"Academia Fit Vida", local:"Ilha do Governador", tipo:"Comércio parceiro", lat:-22.8100, lng:-43.2100, lucro:"R$ 14.400/mês", exp:2},
    {n:"Barraca Mobile", local:"Copacabana", tipo:"Barraca móvel", lat:-22.9710, lng:-43.1840, lucro:"R$ 7.500/mês", exp:7},
    {n:"Igreja (dízimo)", local:"Duque de Caxias", tipo:"Fachada comunitária", lat:-22.7850, lng:-43.3050, lucro:"R$ 5.400/mês", exp:1}
  ];

  /* Áreas de domínio de milícia */
  const MILICIA_POINTS = [
    {n:"Rio das Pedras", det:"Berço histórico da milícia carioca. Domínio consolidado.", lat:-22.9920, lng:-43.3670},
    {n:"Campo Grande", det:"Disputa milícia × facção. Taxa pesada para operar.", lat:-22.9050, lng:-43.5550},
    {n:"Santa Cruz", det:"Domínio miliciano, polícia ausente.", lat:-22.9180, lng:-43.6850},
    {n:"Bangu", det:"Controle miliciano sobre comércio e transporte.", lat:-22.8780, lng:-43.4680},
    {n:"Vargem Grande", det:"Expansão recente da milícia na Zona Oeste.", lat:-22.9950, lng:-43.4700}
  ];

  /* Áreas de domínio de facção */
  const FACCAO_POINTS = [
    {n:"Complexo do Alemão", fac:"CV", det:"Comando Vermelho. Polícia só entra em operação.", lat:-22.8660, lng:-43.2700},
    {n:"Maré", fac:"CV × TCP", det:"Guerra ativa entre facções. Território perigosíssimo.", lat:-22.8520, lng:-43.2447},
    {n:"Rocinha", fac:"CV", det:"A maior favela do Rio, na divisa da Zona Sul.", lat:-22.9891, lng:-43.2484},
    {n:"Jacarezinho", fac:"TCP", det:"Reduto do Terceiro Comando Puro.", lat:-22.8893, lng:-43.2566},
    {n:"Providência", fac:"TCP", det:"Primeira favela do Brasil, hoje sob o TCP.", lat:-22.8970, lng:-43.1900},
    {n:"Cidade de Deus", fac:"CV", det:"Domínio do CV na Zona Oeste.", lat:-22.9490, lng:-43.3620}
  ];

  /* -------------------- SEÇÕES -------------------- */
  const SECTIONS = [
    { id:"capa",       group:"Começo aqui", ix:"00", label:"Abertura",                render:renderCapa },
    { id:"visao",      group:"Começo aqui", ix:"01", label:"O que é o jogo",          render:renderVisao },
    { id:"sistema",    group:"As regras",   ix:"02", label:"O sistema de dados",      render:renderSistema },
    { id:"personagem", group:"As regras",   ix:"03", label:"Personagem & Arquétipos", render:renderPersonagem },
    { id:"metricas",   group:"As regras",   ix:"04", label:"As 5 métricas",           render:renderMetricas },
    { id:"economia",   group:"O império",   ix:"05", label:"Economia & Jogo do Bicho",render:renderEconomia },
    { id:"lavagem",    group:"O império",   ix:"06", label:"Lavagem & Casa-Cofre",    render:renderLavagem },
    { id:"favores",    group:"O império",   ix:"07", label:"Sistema de Favores",      render:renderFavores },
    { id:"territorio", group:"As ruas",     ix:"08", label:"Território (mapa)",       render:renderTerritorio },
    { id:"faccoes",    group:"As ruas",     ix:"09", label:"Facções & Proteção",      render:renderFaccoes },
    { id:"npcs",       group:"As ruas",     ix:"10", label:"Quem você encontra",      render:renderNPCs },
    { id:"combate",    group:"As ruas",     ix:"11", label:"Combate & Segurança",     render:renderCombate },
    { id:"campanha",   group:"Bora jogar",  ix:"12", label:"Campanha & Missões",      render:renderCampanha },
    { id:"comecar",    group:"Bora jogar",  ix:"13", label:"Como começar",            render:renderComecar }
  ];

  /* -------------------- HELPERS DE HTML -------------------- */
  function secHead(kicker, title, sub) {
    return `<header class="sec-head">
      <div class="sec-kicker">${kicker}</div>
      <h1 class="sec-title">${title}</h1>
      ${sub ? `<p class="sec-sub">${sub}</p>` : ""}
    </header>`;
  }
  function cenario(tag, html, cls) {
    return `<div class="cenario ${cls||""}"><span class="tag">${tag}</span>${html}</div>`;
  }
  function navButtons(curId) {
    const i = SECTIONS.findIndex(s => s.id === curId);
    const prev = SECTIONS[i-1], next = SECTIONS[i+1];
    let h = `<nav class="sec-nav">`;
    h += prev ? `<a href="#${prev.id}"><span>◀ Anterior</span><strong>${prev.label}</strong></a>` : `<span></span>`;
    h += next ? `<a class="next" href="#${next.id}"><span>Próximo ▶</span><strong>${next.label}</strong></a>` : `<span></span>`;
    h += `</nav>`;
    return h;
  }
  function minibars(value, max, red) {
    let h = `<span class="minibars ${red?"red":""}">`;
    for (let k=1;k<=max;k++) h += `<i class="${k<=value?"on":""}"></i>`;
    return h + `</span>`;
  }

  /* ============================================================
     RENDERIZADORES DE SEÇÃO
     ============================================================ */

  function renderCapa() {
    return `<section class="section">
      <div class="hero">
        ${skylineSVG()}
        <span class="hero-badge">RPG DE MESA · RIO DE JANEIRO · SISTEMA d6</span>
        <h1>BARÕES <span class="gold">DO ASFALTO</span></h1>
        <p class="tagline">Jogo do bicho, dinheiro sujo e poder no Rio de Janeiro.</p>
        <p class="desc">Vocês são uma sociedade criminosa montando um império do jogo do bicho.
        Pontos rendem, o dinheiro precisa ser lavado, a proteção custa caro, os favores se acumulam
        — e cada bala atirada deixa rastro. <strong>Não é sobre atirar melhor. É sobre jogar melhor.</strong></p>
        <div class="hero-cta">
          <a class="btn primary" href="#visao">Entender o jogo ▶</a>
          <a class="btn" href="#sistema">Como se joga</a>
          <a class="btn" href="#territorio">Ver o mapa do Rio</a>
        </div>
      </div>

      <div class="quickfacts">
        <div class="qf"><b>3-5</b><span>Jogadores + 1 Mestre</span></div>
        <div class="qf"><b>d6</b><span>Pool de dados</span></div>
        <div class="qf"><b>9</b><span>Arquétipos</span></div>
        <div class="qf"><b>10</b><span>Regiões do Rio</span></div>
      </div>

      <h2 class="block">Como tudo se conecta</h2>
      <p class="lead">O jogo é um <span class="hl">ciclo econômico-criminal</span>. Cada peça alimenta a próxima.
      Este mapa mostra como os sistemas se encaixam — e cada um tem sua própria seção aqui na apresentação.</p>
      <div class="diagram">
        ${systemMapSVG()}
        <div class="cap">O motor do jogo — clique nas seções do menu para aprofundar cada engrenagem</div>
      </div>

      <div class="grid cols-3" style="margin-top:24px">
        <div class="card"><div class="ico">🎲</div><h4>Estratégia &gt; Força</h4><p>Planejamento, informação e lábia valem mais que tiro. O sistema recompensa quem pensa.</p></div>
        <div class="card"><div class="ico">💰</div><h4>Economia de verdade</h4><p>Renda, custos fixos, lavagem, impostos do crime. Dinheiro é finito e tudo cobra seu preço.</p></div>
        <div class="card"><div class="ico">🩸</div><h4>Violência tem preço</h4><p>Combate é rápido, letal e caro: Heat, vingança e trauma. O último recurso, nunca o primeiro.</p></div>
      </div>
      ${navButtons("capa")}
    </section>`;
  }

  function renderVisao() {
    return `<section class="section">
      ${secHead("Visão geral", "O que é o jogo", "Crime organizado inteligente no Rio de Janeiro real — sobre construir um império e pagar por ele.")}

      <p class="lead">Os jogadores interpretam operadores do submundo carioca — um contador sujo, um ex-policial, um articulador do morro, um político de bairro — que se juntam numa <span class="hl">sociedade criminosa</span> para dominar o jogo do bicho na cidade.</p>

      ${cenario("A premissa", `<p>Três bicheiros independentes decidem virar sociedade. Cada personagem entra com o que tem de melhor — dinheiro, contatos, músculo, fachada legal. A campanha é a <strong>ascensão</strong> dessa sociedade: tomar territórios, consolidar pontos, negociar com facções e sobreviver num ecossistema onde todos querem a sua fatia.</p>`)}

      <h2 class="block">A filosofia em 3 pilares</h2>
      <div class="grid cols-3">
        <div class="card"><div class="num">PILAR 01</div><h4>A economia é o motor</h4><p>O dinheiro entra e sai o tempo todo. As decisões financeiras são tão tensas quanto qualquer tiroteio. Não existe "super-rico invencível" — sempre há custo a pagar.</p></div>
        <div class="card"><div class="num">PILAR 02</div><h4>Violência é cara</h4><p>Cada tiro vira Heat, cada corpo vira investigação e vingança. Negociação, suborno e chantagem quase sempre são melhores caminhos.</p></div>
        <div class="card"><div class="num">PILAR 03</div><h4>Consequências longas</h4><p>O Rio lembra. NPCs têm memória e agenda. Uma morte "simples" na sessão 2 pode virar a trama de dez sessões.</p></div>
      </div>

      <h2 class="block">A estrutura de cada sessão</h2>
      <p>O jogo gira num ciclo de quatro fases. Você planeja, executa, colhe as consequências e fecha as contas.</p>
      <div class="diagram">
        ${sessionLoopSVG()}
        <div class="cap">O loop de uma sessão — a fase econômica fecha o mês e reinicia o ciclo</div>
      </div>

      <div class="grid cols-2" style="margin-top:6px">
        <div class="card"><h4>① Planejamento</h4><p>O grupo levanta informação, debate abordagens e ativa contatos/favores. Bons planos viram <span class="hl">dados de bônus</span> na execução.</p></div>
        <div class="card"><h4>② Execução</h4><p>O plano entra em ação. Testes de operação, social e — se inevitável — combate. O Heat pode subir.</p></div>
        <div class="card"><h4>③ Consequências</h4><p>Resultado imediato: ajusta-se Heat, Pressão, reputação e lealdades. Novos ganchos nascem aqui.</p></div>
        <div class="card"><h4>④ Fase econômica</h4><p>Balanço do mês: coleta de renda, pagamento de proteção e equipe, lavagem, investimentos e um evento aleatório.</p></div>
      </div>

      <blockquote class="quote">"Bandido inteligente não atira. Bandido burro morre cedo."<cite>Ditado do submundo carioca</cite></blockquote>
      ${navButtons("visao")}
    </section>`;
  }

  function renderSistema() {
    return `<section class="section">
      ${secHead("As regras · base", "O sistema de dados", "Tudo se resolve com um punhado de dados de seis faces. Simples de aprender, rápido na mesa.")}

      <p class="lead">Quando um personagem tenta algo incerto e importante, monta-se um <span class="hl">pool de dados d6</span>. Quanto mais dados, maior a chance.</p>

      <div class="grid cols-3">
        <div class="card"><div class="ico">①</div><h4>Monte o pool</h4><p><b>Atributo</b> (1–5) <b>+ Perícia</b> (0–5) <b>+ modificadores</b> (situação, equipamento, favores).</p></div>
        <div class="card"><div class="ico">②</div><h4>Role e conte</h4><p>Cada dado que mostrar <b>5 ou 6</b> é um <span class="hl">sucesso</span>. Cada <b>6 explode</b>: role um dado extra (que também pode explodir).</p></div>
        <div class="card"><div class="ico">③</div><h4>Compare</h4><p>Some os sucessos e compare com a <b>dificuldade</b> da tarefa (de 1 a 5 sucessos).</p></div>
      </div>

      <h2 class="block">Experimente: role um pool</h2>
      <p>Escolha quantos dados e a dificuldade, e role. Veja como os sucessos e as explosões funcionam de verdade.</p>
      <div id="diceRoller"></div>

      <h2 class="block">Dificuldades</h2>
      <div class="table-wrap"><table>
        <thead><tr><th>Dificuldade</th><th class="t-center">Sucessos necessários</th><th>Exemplo</th></tr></thead>
        <tbody>
          <tr><td>Rotina</td><td class="t-center">1</td><td>Algo simples sob leve pressão</td></tr>
          <tr><td>Moderada</td><td class="t-center">2</td><td>Convencer um dono de bar a aceitar um ponto</td></tr>
          <tr><td>Difícil</td><td class="t-center">3</td><td>Fugir da polícia pelas ruas de Madureira</td></tr>
          <tr><td>Muito Difícil</td><td class="t-center">4</td><td>Tomar um ponto fortemente guardado</td></tr>
          <tr><td>Quase Impossível</td><td class="t-center">5+</td><td>Estruturar uma lavagem milionária à prova de rastro</td></tr>
        </tbody>
      </table></div>

      <h2 class="block">Os graus de resultado</h2>
      <p>Não é só passar ou falhar — há nuance. O famoso <span class="hl">"sim, mas..."</span> torna cada teste interessante.</p>
      <div class="grid cols-2">
        <div class="card"><h4 style="color:var(--vermelho-claro)">Falha Crítica</h4><p>0 sucessos e a maioria dos dados em 1. Falha <b>e</b> complicação séria. <span class="hl-red">+1 Heat.</span></p></div>
        <div class="card"><h4 style="color:#d98a6a">Falha</h4><p>0 sucessos. O objetivo não é alcançado; a situação piora um pouco.</p></div>
        <div class="card"><h4 style="color:var(--dourado-claro)">Sucesso Parcial</h4><p>1 a menos que a dificuldade. Você consegue, <b>mas</b>: custa mais, demora, chama atenção ou fica devendo favor.</p></div>
        <div class="card"><h4 style="color:#7fe0a6">Sucesso Total</h4><p>Sucessos = dificuldade. Objetivo pleno, sem complicações.</p></div>
        <div class="card" style="grid-column:span 2"><h4 style="color:#7fe0a6">Sucesso Crítico</h4><p>2+ acima da dificuldade. Objetivo superado <b>com vantagem extra</b>: escolha −1 Heat, informação valiosa, +1 lealdade, metade do custo ou do tempo.</p></div>
      </div>

      ${cenario("Exemplo de jogo", `<p class="voz">Marcão quer instalar um ponto no bar do Zé. Tem <strong>Lábia 3 + Negociação 2</strong> e está oferecendo um bom dinheiro (+1 dado): <strong>6 dados</strong>. A dificuldade é Difícil (3 sucessos).</p>
      <p>Ele rola e tira <strong>2, 4, 5, 6, 6</strong> e mais um (faltava 1 dado) <strong>3</strong>. Os dois 6 explodem: saem <strong>5</strong> e <strong>2</strong>. Total: os 5, 6, 6 e o 5 explodido = <strong>4 sucessos</strong>. Contra dificuldade 3, isso é <span class="hl">Sucesso Crítico</span> — o Zé topa <em>e</em> indica dois amigos donos de bar.</p>`)}

      <h3 class="sub">Modificadores comuns (em dados)</h3>
      <div class="table-wrap"><table>
        <thead><tr><th>Situação</th><th class="t-center">Dados</th></tr></thead>
        <tbody>
          <tr><td>Preparação, condições ideais</td><td class="t-center">+1 a +3</td></tr>
          <tr><td>Cada fonte confiável de informação</td><td class="t-center">+1</td></tr>
          <tr><td>Equipamento bom / profissional</td><td class="t-center">+1 a +3</td></tr>
          <tr><td>Gastar um favor (pequeno / médio / grande)</td><td class="t-center">+1 / +2 / +3</td></tr>
          <tr><td>Pressa, recursos limitados</td><td class="t-center">−1</td></tr>
          <tr><td>Improviso sob grande pressão</td><td class="t-center">−2</td></tr>
          <tr><td>Desespero, nada a favor</td><td class="t-center">−3</td></tr>
        </tbody>
      </table></div>
      ${navButtons("sistema")}
    </section>`;
  }

  function renderPersonagem() {
    const attrs = [
      ["MENTE","Planejamento, estratégia, cálculo","🧠"],
      ["LÁBIA","Persuasão, manipulação, charme","🗣️"],
      ["SANGUE FRIO","Controle sob pressão, resistência","❄️"],
      ["OPERAÇÃO","Execução física, combate, técnica","🔧"],
      ["CONTATOS","Rede de influência e acesso","📇"],
      ["INSTINTO","Percepção, intuição, reação","👁️"]
    ];
    const arqs = [
      ["O Contador Sujo","Faço o dinheiro sumir e voltar batizado.","Lavagem com perda menor; fareja oportunidade financeira.","Papel rastreável: Exposição alta de saída.","Coelho","MEN 4·LÁB 3·SF 2·OP 1·CON 3·INS 2"],
      ["O Político de Bairro","Não mando em ninguém. Todo mundo me deve.","Na sua região: +2 dados sociais e mutirão de moradores.","Visibilidade pública: não age em crime explícito.","Galo","MEN 3·LÁB 4·SF 2·OP 1·CON 4·INS 1"],
      ["O Atravessador","Nada se move nesta cidade sem passar por mim.","+3 dados em direção/fuga no Rio; rota fantasma.","Alvo fácil: sempre exposto, sem base fixa.","Cavalo","MEN 3·LÁB 3·SF 3·OP 3·CON 2·INS 1"],
      ["O Operador de Elite","Ex-BOPE. O triplo do salário do outro lado.","+2 dados em combate; age primeiro; treina a equipe.","Fantasma do passado: trauma e inimigos antigos.","Tigre","MEN 3·LÁB 1·SF 4·OP 4·CON 2·INS 1"],
      ["O Vigarista","Minha arma é um terno bem cortado.","Identidades falsas; +3 dados sociais na persona; golpes.","Casa de cartas: o passado sempre reaparece.","Macaco","MEN 4·LÁB 4·SF 3·OP 1·CON 2·INS 1"],
      ["O Articulador do Morro","Eu sou a ponte entre o morro e o asfalto.","Trânsito livre nas favelas; media conflitos.","Refém de dois mundos: trair um lado é fatal.","Cobra","MEN 2·LÁB 4·SF 2·OP 2·CON 4·INS 1"],
      ["O Empresário de Fachada","CNPJ de 15 anos não levanta suspeita.","Lava até R$ 300k/mês com taxa baixa; bode expiatório.","Vida dupla: se cair, perde tudo — e a família.","Elefante","MEN 4·LÁB 3·SF 2·OP 2·CON 3·INS 1"],
      ["O Informante","Eu não faço nada. Eu só sei das coisas.","Descobre qualquer informação; alerta de operações.","Refém da neutralidade: frágil, não toma lado.","Águia","MEN 3·LÁB 3·SF 2·OP 1·CON 5·INS 1"],
      ["O Herdeiro Relutante","Meu pai morreu e me deixou um império.","Começa rico, com pontos e nome respeitado.","Alvo nas costas: inimigos e dívidas herdados.","Leão","MEN 4·LÁB 3·SF 2·OP 1·CON 3·INS 2"]
    ];
    return `<section class="section">
      ${secHead("As regras · personagem", "Personagem & Arquétipos", "Seis atributos, vinte e duas perícias e um arquétipo que define quem você é no crime.")}

      <h2 class="block">Os 6 atributos (escala 1–5)</h2>
      <p>São a base de todo teste. Na criação, você distribui <span class="hl">15 pontos</span> (mín. 1, máx. 4).</p>
      <div class="grid cols-3">
        ${attrs.map(a=>`<div class="card"><div class="ico">${a[2]}</div><h4>${a[0]}</h4><p>${a[1]}</p></div>`).join("")}
      </div>

      <h2 class="block">As perícias (escala 0–5)</h2>
      <p>22 perícias somam-se ao atributo no pool. Na criação, <span class="hl">20 pontos</span> (máx. 3 cada). Organizadas em cinco famílias:</p>
      <div class="grid cols-2">
        <div class="card"><h4 style="color:var(--dourado-claro)">Sociais</h4><p>Negociação · Intimidação · Sedução · Mentira · Leitura de Intenções</p></div>
        <div class="card"><h4 style="color:var(--dourado-claro)">Estratégicas</h4><p>Planejamento · Economia Ilegal · Lavagem · Logística</p></div>
        <div class="card"><h4 style="color:var(--dourado-claro)">Operacionais</h4><p>Direção · Fuga · Disfarce · Invasão · Ocultação</p></div>
        <div class="card"><h4 style="color:var(--dourado-claro)">Combate</h4><p>Armas de Fogo · Combate Corpo a Corpo · Táticas</p></div>
        <div class="card" style="grid-column:span 2"><h4 style="color:var(--dourado-claro)">Conhecimento</h4><p>Submundo Carioca · Política · Tecnologia · Direito · Medicina de Rua</p></div>
      </div>

      <h2 class="block">Os 9 arquétipos</h2>
      <p class="lead">Modelos prontos de personagem. Cada um traz uma <span class="hl">vantagem única</span>, uma <span class="hl-red">fraqueza estrutural</span> e ganchos que convergem para a mesma sociedade.</p>
      <div class="grid cols-2">
        ${arqs.map(a=>`<div class="arq-card">
          <span class="bicho">🐾</span>
          <h4>${a[0]}</h4>
          <span class="esp">"${a[1]}"</span>
          <div class="arq-attrs">${a[5].split("·").map(x=>`<span>${x.trim()}</span>`).join("")}</div>
          <p class="vant"><b>Vantagem:</b> ${a[2]}</p>
          <p class="vant desv"><b>Fraqueza:</b> ${a[3]}</p>
          <p class="muted" style="font-size:.78rem;margin-top:6px">Bicho-brasão sugerido: ${a[4]}</p>
        </div>`).join("")}
      </div>
      <p class="muted" style="margin-top:14px">Os <strong>9 arquétipos</strong> são modelos de partida — o mestre pode adaptá-los e criar variações. Todos convergem para a mesma premissa: a sociedade de bicheiros que vira império.</p>
      ${navButtons("personagem")}
    </section>`;
  }

  function renderMetricas() {
    const M = [
      ["🔥","HEAT","Atenção da polícia e da mídia","heat","3+ fichado · 5+ investigado · 7+ procurado · 9+ força-tarefa"],
      ["👁️","EXPOSIÇÃO","Seu rastro no mundo legal","expo","Quanto mais alta, mais fácil te investigar · 8+ Receita automática"],
      ["👑","CAPITAL DE RUA","Sua reputação no submundo","cap","+1 dado social no crime a cada 2 pontos; descontos e respeito"],
      ["💀","PRESSÃO","Estresse e trauma acumulados","pres","3-4 tenso · 5-6 estressado · 7-8 abalado · 10 COLAPSO"],
      ["🤝","LEALDADE","Confiança de cada NPC (individual)","leal","0-2 trai · 5-6 confiável · 7-8 arrisca por você · 9-10 morre por você"]
    ];
    return `<section class="section">
      ${secHead("As regras · estado", "As 5 métricas", "Cinco barras de 0 a 10 que medem o seu mundo. Elas sobem, descem e mudam tudo.")}
      <p class="lead">Além de dinheiro e perícia, cada personagem é definido por cinco medidores. São eles que tornam o jogo <span class="hl">sobre consequências</span>, não sobre força.</p>

      <div class="panel framed">
        ${M.map(m=>`<div class="metric">
          <div class="mhead">
            <div class="mname"><span class="dot">${m[0]}</span> ${m[1]}</div>
            <div class="mwhat">${m[2]}</div>
          </div>
          <div class="gauge">
            <div class="bar">${Array.from({length:10},(_,k)=>`<span class="seg ${m[3]}" style="opacity:${0.35+k*0.07}"></span>`).join("")}</div>
            <div class="legend">${m[4]}</div>
          </div>
        </div>`).join("")}
      </div>

      <h2 class="block">Heat × Exposição: o jogo dentro do jogo</h2>
      <p>As duas se combinam de um jeito perigoso. <span class="hl">Heat</span> é atenção ativa (a polícia atrás de você agora); <span class="hl">Exposição</span> é o quanto existe sobre você em registros. Onde você cai neste quadrante decide a sua sobrevivência:</p>
      <div class="diagram">${heatExpoSVG()}<div class="cap">O objetivo é viver no canto verde — invisível. O canto vermelho é só questão de tempo.</div></div>

      ${cenario("Regra especial · Colapso", `<p>Se a <strong>Pressão chega a 10</strong>, o personagem rola 1d6: <strong>1-2</strong> foge e desaparece · <strong>3-4</strong> se entrega às autoridades · <strong>5-6</strong> tem um surto violento (+4 Heat, consequências imprevisíveis). O crime cobra também da mente.</p>`, "note-red")}
      ${navButtons("metricas")}
    </section>`;
  }

  function renderEconomia() {
    return `<section class="section">
      ${secHead("O império · dinheiro", "Economia & Jogo do Bicho", "O motor do jogo. Pontos rendem, custos corroem, e o dinheiro vem em três cores.")}

      <h2 class="block">As três cores do dinheiro</h2>
      <div class="diagram">${moneyFlowSVG()}<div class="cap">O ciclo do dinheiro — o sujo precisa virar limpo, perdendo uma taxa no caminho</div></div>
      <div class="grid cols-3">
        <div class="card"><h4 style="color:#7fe0a6">💵 Limpo</h4><p>Legal e rastreável. Compra qualquer coisa abertamente. O destino de todo dinheiro.</p></div>
        <div class="card"><h4 style="color:var(--vermelho-claro)">💴 Sujo</h4><p>Do crime. Gasta-se até <b>R$ 10 mil</b> sem chamar atenção; acima disso, <b>precisa ser lavado</b>.</p></div>
        <div class="card"><h4 style="color:var(--dourado-claro)">🔄 Em trânsito</h4><p>Sendo lavado. Indisponível por 2 a 16 semanas, até virar limpo (menos a taxa).</p></div>
      </div>

      <h2 class="block">As escalas de poder</h2>
      <p>O jogo acompanha a sua ascensão — da rua ao topo.</p>
      <div class="table-wrap"><table>
        <thead><tr><th>Nível</th><th>Movimentação típica</th><th>Quem é</th></tr></thead>
        <tbody>
          <tr><td><b>Rua</b></td><td class="money">R$ 200 – 2 mil</td><td>Cambista, olheiro, segurança básico</td></tr>
          <tr><td><b>Ponto</b></td><td class="money">R$ 5 – 50 mil</td><td>Dono de 1-3 pontos, operador independente</td></tr>
          <tr><td><b>Banqueiro</b></td><td class="money">R$ 100 – 500 mil</td><td>Dono de rede de pontos, bicheiro estabelecido</td></tr>
          <tr><td><b>Barão</b></td><td class="money">R$ 1 milhão+</td><td>Dono de império, líder de organização</td></tr>
        </tbody>
      </table></div>

      <h2 class="block">Tipos de ponto de jogo do bicho</h2>
      <p>Cada ponto é um investimento com renda, custos e exposição próprios. Do mais discreto ao mais lucrativo:</p>
      <div class="table-wrap"><table>
        <thead><tr><th>Tipo de ponto</th><th>Investimento</th><th>Lucro líquido/mês</th><th class="t-center">Exposição</th></tr></thead>
        <tbody>
          <tr><td>Barraca de rua</td><td class="money">R$ 5–8 mil</td><td class="money">R$ 3–8 mil</td><td class="t-center"><span class="pill low">2</span></td></tr>
          <tr><td>Bar / boteco parceiro</td><td class="money">R$ 15–25 mil</td><td class="money">R$ 6–15 mil</td><td class="t-center"><span class="pill low">3</span></td></tr>
          <tr><td>Ponto em comunidade</td><td class="money">R$ 10–20 mil</td><td class="money">R$ 4–12 mil</td><td class="t-center"><span class="pill mid">5</span></td></tr>
          <tr><td>Lotérica associada</td><td class="money">R$ 40–80 mil</td><td class="money">R$ 15–35 mil</td><td class="t-center"><span class="pill high">6</span></td></tr>
          <tr><td>Casa de apostas</td><td class="money">R$ 60–120 mil</td><td class="money">R$ 20–60 mil</td><td class="t-center"><span class="pill high">7</span></td></tr>
          <tr><td>Plataforma online</td><td class="money">R$ 80–200 mil</td><td class="money">R$ 10–180 mil</td><td class="t-center"><span class="pill high">9</span></td></tr>
        </tbody>
      </table></div>
      <p class="muted">O online é o mais lucrativo e escalável — e o mais exposto: a Polícia Federal adora rastro digital.</p>

      <h2 class="block">A fase econômica — fechando o mês</h2>
      <p>Ao fim de cada mês de jogo, o "banqueiro" da mesa fecha as contas em <span class="hl">6 passos</span>:</p>
      <div class="flow">
        <div class="step"><span class="n">1</span><h5>Coletar renda</h5><p>Soma o lucro de cada ponto.</p></div>
        <div class="step"><span class="n">2</span><h5>Pagar proteção</h5><p>Facção, milícia, polícia.</p></div>
        <div class="step"><span class="n">3</span><h5>Pagar equipe</h5><p>Seguranças, laranjas, contadores.</p></div>
        <div class="step"><span class="n">4</span><h5>Lavar dinheiro</h5><p>Quanto do sujo vira limpo?</p></div>
        <div class="step"><span class="n">5</span><h5>Investir</h5><p>Novos pontos, expansões.</p></div>
        <div class="step"><span class="n">6</span><h5>Evento (1d20)</h5><p>O mundo reage.</p></div>
      </div>
      ${cenario("Imposto do crime", `<p>Uma operação média (3-4 pontos) gasta <strong>R$ 40-60 mil por mês</strong> só em proteção e "impostos" para facções, milícias e policiais. Renda alta não é lucro alto — é volume passando pela peneira.</p>`)}
      ${navButtons("economia")}
    </section>`;
  }

  function renderLavagem() {
    return `<section class="section">
      ${secHead("O império · finanças sujas", "Lavagem & Casa-Cofre", "Dinheiro sujo é maldição: você é rico no papel e pobre na prática. Lavar é sobreviver.")}

      <blockquote class="quote">"Você tem milhões, mas não pode comprar nem um apartamento. É rico no papel, pobre na prática."<cite>Marcelo "Contador" Dias, lavador profissional</cite></blockquote>

      <h2 class="block">Por que lavar?</h2>
      <div class="grid cols-2">
        <div class="card"><h4>O que o sujo NÃO compra</h4><p>Imóvel, carro 0km, empresa, investimento, depósito acima de R$ 10 mil. Tudo isso exige declarar origem — e a Receita cruza gastos com renda.</p></div>
        <div class="card"><h4>O que delata você</h4><p>Vida luxuosa sem renda, depósitos fracionados (o COAF vê o padrão), pagar tudo em dinheiro vivo. Al Capone caiu por sonegação, não por assassinato.</p></div>
      </div>

      <h2 class="block">O processo de lavagem</h2>
      <div class="flow">
        <div class="step"><span class="n">1</span><h5>Declarar valor</h5><p>"Quero lavar R$ 200 mil."</p></div>
        <div class="step"><span class="n">2</span><h5>Escolher método</h5><p>Qual empresa de fachada?</p></div>
        <div class="step"><span class="n">3</span><h5>Pagar a taxa</h5><p>Perde-se 10% a 28%.</p></div>
        <div class="step"><span class="n">4</span><h5>Aguardar</h5><p>2 a 16 semanas processando.</p></div>
        <div class="step"><span class="n">5</span><h5>Rolar risco (1d6)</h5><p>Complicação se der 1.</p></div>
        <div class="step"><span class="n">6</span><h5>Receber limpo</h5><p>O dinheiro entra como "lucro" legal.</p></div>
      </div>

      <h2 class="block">Métodos de fachada</h2>
      <p class="lead">A regra de ouro: <span class="hl">quanto mais sofisticada a estrutura, menor a taxa</span> e maior o volume. Mas o investimento e a complexidade sobem junto.</p>
      <div class="table-wrap"><table>
        <thead><tr><th>Empresa de fachada</th><th>Capacidade/mês</th><th class="t-center">Taxa</th><th class="t-center">Risco</th></tr></thead>
        <tbody>
          <tr><td>Lava-rápido / lanchonete</td><td class="money">R$ 15–80 mil</td><td class="t-center">25–28%</td><td class="t-center"><span class="pill mid">Médio</span></td></tr>
          <tr><td>Estacionamento</td><td class="money">R$ 60–120 mil</td><td class="t-center">22%</td><td class="t-center"><span class="pill low">Baixo</span></td></tr>
          <tr><td>Construtora pequena</td><td class="money">R$ 150–400 mil</td><td class="t-center">18%</td><td class="t-center"><span class="pill mid">Médio</span></td></tr>
          <tr><td>Holding / consultoria</td><td class="money">R$ 200–800 mil</td><td class="t-center">16%</td><td class="t-center"><span class="pill low">Baixo</span></td></tr>
          <tr><td>Importadora</td><td class="money">R$ 300 mil–1 mi</td><td class="t-center">15%</td><td class="t-center"><span class="pill low">Baixo</span></td></tr>
          <tr><td>Offshore / paraíso fiscal</td><td class="money">R$ 500 mil–5 mi+</td><td class="t-center">10–12%</td><td class="t-center"><span class="pill high">Conclusivo se pego</span></td></tr>
        </tbody>
      </table></div>

      <h2 class="block">Os laranjas</h2>
      <p>Pessoas que emprestam o <span class="hl">nome</span> para serem donos formais. Se a empresa cai, o laranja é preso — não você. Mas laranja mal cuidado é uma bomba.</p>
      <div class="table-wrap"><table>
        <thead><tr><th>Perfil</th><th class="t-center">Custo/mês</th><th class="t-center">Lealdade</th><th class="t-center">Risco</th></tr></thead>
        <tbody>
          <tr><td>Morador de rua / descartável</td><td class="t-center money">R$ 200–500</td><td class="t-center"><span class="pill high">2–4</span></td><td class="t-center"><span class="pill high">Alto</span></td></tr>
          <tr><td>Trabalhador comum</td><td class="t-center money">R$ 800</td><td class="t-center"><span class="pill mid">5</span></td><td class="t-center"><span class="pill mid">Médio</span></td></tr>
          <tr><td>Profissional experiente</td><td class="t-center money">R$ 2.000</td><td class="t-center"><span class="pill low">7</span></td><td class="t-center"><span class="pill low">Baixo</span></td></tr>
          <tr><td>"Laranja profissional"</td><td class="t-center money">R$ 5.000+</td><td class="t-center"><span class="pill low">9</span></td><td class="t-center"><span class="pill low">Muito baixo</span></td></tr>
        </tbody>
      </table></div>
      ${cenario("Lição de campanha", `<p>Economizar no laranja barato (Lealdade 3) sai caro: ele bebe, fala demais, pede mais dinheiro, some com documentos. Pagar bem um <strong>laranja profissional</strong> é investir em silêncio. <span class="voz">"Laranja protegido é laranja leal."</span></p>`)}

      <h2 class="block">Casa-cofre & ocultação</h2>
      <p>Onde guardar o que não pode aparecer. A <span class="hl">casa-cofre</span> é um imóvel discreto — em nome de laranja, entrada disfarçada — onde ficam dinheiro vivo, armas e documentos longe de batidas.</p>
      <div class="grid cols-3">
        <div class="card"><div class="ico">🏠</div><h4>Casa-cofre básica</h4><p>Apartamento discreto em nome de laranja. Custo: ~R$ 3 mil/mês. Ninguém sabe que é seu.</p></div>
        <div class="card"><div class="ico">🔒</div><h4>Esconderijo de valores</h4><p>Dinheiro dentro de paredes, pisos, eletrônicos. Teste de <b>Operação + Ocultação</b> contra a batida.</p></div>
        <div class="card"><div class="ico">🕳️</div><h4>Dinheiro guardado</h4><p>O sujo no cofre fica seguro — mas continua sujo para sempre. Dinheiro guardado &gt; dinheiro limpo na prisão.</p></div>
      </div>
      ${navButtons("lavagem")}
    </section>`;
  }

  function renderFavores() {
    return `<section class="section">
      ${secHead("O império · poder social", "Sistema de Favores", "No Rio, palavra vale mais que contrato. O favor é a moeda que dinheiro nenhum compra.")}

      <p class="lead">Favores são a <span class="hl">moeda social do submundo</span>. Resolvem o que a bala não resolve — e voltam para te assombrar se não forem pagos. Eles podem dar <span class="hl">dados de bônus</span> em qualquer teste.</p>

      <h2 class="block">Os quatro graus</h2>
      <div class="table-wrap"><table>
        <thead><tr><th>Grau</th><th class="t-center">Pontos de débito</th><th class="t-center">Bônus em teste</th><th>Exemplo</th></tr></thead>
        <tbody>
          <tr><td><b>Pequeno</b></td><td class="t-center">1</td><td class="t-center">+1 dado</td><td>"Me passa a fita daquele cara."</td></tr>
          <tr><td><b>Médio</b></td><td class="t-center">3</td><td class="t-center">+2 dados</td><td>Atrasar uma fiscalização, esconder alguém.</td></tr>
          <tr><td><b>Grande</b></td><td class="t-center">6</td><td class="t-center">+3 dados</td><td>Soltar um preso, eliminar um rival.</td></tr>
          <tr><td><b>Crítico</b></td><td class="t-center">10</td><td class="t-center">+4 dados / auto</td><td>Uma facção entra na sua guerra.</td></tr>
        </tbody>
      </table></div>
      <p class="muted">Atenção: usar um favor num teste <b>não quita a dívida</b>. É um empréstimo de influência — você ainda vai pagar.</p>

      <h2 class="block">O ciclo de um favor</h2>
      <div class="diagram">${favorFlowSVG()}<div class="cap">Pedir, dever e pagar — e os juros de quem não paga</div></div>

      <div class="grid cols-2">
        <div class="card"><h4>Pedindo um favor</h4><p>Teste de <b>Lábia + Contatos</b> + modificadores (relacionamento, risco, urgência, Capital de Rua). A dificuldade depende do grau pedido.</p></div>
        <div class="card note-red" style="border:1px solid var(--line-soft);border-left:4px solid var(--vermelho-claro)"><h4 style="color:var(--vermelho-claro)">Não pagar custa caro</h4><p>Favores não pagos acumulam <b>juros</b> (mais pontos de débito). Ao dobrar, o credor cobra <b>do jeito dele</b>: Capital de Rua despenca, e ninguém mais te empresta favor.</p></div>
      </div>

      <h2 class="block">Tipos de favor</h2>
      <div class="grid cols-3">
        <div class="card"><div class="ico">🏛️</div><h4>Políticos</h4><p>Liberar alvará, atrasar investigação, influenciar licitação.</p></div>
        <div class="card"><div class="ico">🚨</div><h4>Policiais</h4><p>Avisar de operação, perder evidência, soltar preso, fabricar álibi.</p></div>
        <div class="card"><div class="ico">✊</div><h4>Facção / Milícia</h4><p>Proteção, passagem por território, armamento, eliminar rival.</p></div>
        <div class="card"><div class="ico">🐍</div><h4>Submundo</h4><p>Lavar emergencial, esconder alguém, falsificar documentos.</p></div>
        <div class="card"><div class="ico">💼</div><h4>Empresariais</h4><p>Empregar laranja, fornecer fachada, abrir empresa, facilitar crédito.</p></div>
        <div class="card"><div class="ico">🎴</div><h4>Banqueiros de favores</h4><p>NPCs especializados que "bancam" favores — e cobram com precisão.</p></div>
      </div>
      ${cenario("Como funciona na mesa", `<p>No jogo físico, o favor é uma <strong>carta</strong> que troca de mãos: quem segura a carta é o credor. Resgatar o favor é devolver a carta. <span class="voz">"Tamo junto, irmão. Mas essa vai pro caderninho, viu?"</span></p>`)}
      ${navButtons("favores")}
    </section>`;
  }

  function renderTerritorio() {
    return `<section class="section">
      ${secHead("As ruas · geografia", "Território", "O Rio dividido em 10 macro-regiões. Cada uma com um dono, um preço e um risco. Clique para explorar.")}

      <p class="lead">Antes de abrir qualquer ponto, a pergunta é sempre a mesma: <span class="hl">quem controla essa área, e a quem se paga aqui?</span> Passe o mouse e clique nas regiões e nos pontos do mapa real do Rio.</p>

      <div class="map-toolbar" id="mapToolbar">
        <span class="mt-label">Camadas:</span>
        <label class="mt-toggle" data-layer="regioes"><input type="checkbox" checked> <i style="background:#C9A227"></i> Regiões</label>
        <label class="mt-toggle" data-layer="bicho"><input type="checkbox" checked> <i class="mk-dot bicho">$</i> Pontos do bicho</label>
        <label class="mt-toggle" data-layer="milicia"><input type="checkbox" checked> <i class="mk-dot milicia">▣</i> Milícia</label>
        <label class="mt-toggle" data-layer="faccao"><input type="checkbox" checked> <i class="mk-dot faccao">✊</i> Facção</label>
      </div>

      <div class="map-app">
        <div class="map-stage">
          <div id="leafletMap" class="leaflet-map" role="application" aria-label="Mapa interativo do Rio de Janeiro"></div>
          <div class="legend-controle">
            <span><i style="background:#C9A227"></i> Bicheiros</span>
            <span><i style="background:#A4161A"></i> Facção/Guerra</span>
            <span><i style="background:#C8A97E"></i> Milícia</span>
            <span><i style="background:#2C5F7C"></i> Misto</span>
            <span><i style="background:#7d7d7d"></i> Disputado</span>
          </div>
        </div>
        <div class="map-info" id="mapInfo">
          <div class="rkicker">Selecione no mapa</div>
          <h4>As 10 regiões do Rio</h4>
          <p class="muted">Cada região tem um perfil de controle criminal, nível de policiamento, potencial para o jogo do bicho e um custo de entrada. Clique numa região (área tracejada) para ver os detalhes; passe o mouse nos pontos para o nome e clique para abrir.</p>
          <p class="muted">No jogo físico, este mapa vira o <strong>tabuleiro</strong>, onde os tokens marcam seus pontos e o avanço dos rivais.</p>
        </div>
      </div>
      <p class="muted" style="font-size:.82rem;margin-top:8px">🟡 14 pontos físicos de bicho · ▣ 5 áreas de milícia · ✊ 6 redutos de facção. As 2 plataformas <em>online</em> (maior renda do jogo) não têm endereço — operam de qualquer lugar.</p>
      <p class="muted" style="font-size:.82rem;margin-top:4px">Os contornos das regiões são <strong>limites reais</strong> (bairros oficiais do Rio + municípios da Baixada e de Niterói/São Gonçalo). A região <strong>Complexos de Favelas</strong> aparece <em>espalhada</em> pelo mapa (hachura densa), porque não é uma zona contígua — são redutos de facção dentro de outras zonas.</p>

      <h2 class="block">Como ler o território</h2>
      <div class="grid cols-3">
        <div class="card"><div class="ico">🎖️</div><h4>Controle</h4><p>Quem manda: bicheiros tradicionais, facção, milícia, ou território disputado. Define a quem você paga.</p></div>
        <div class="card"><div class="ico">🚓</div><h4>Policiamento (1–10)</h4><p>Quanto mais alto, mais câmeras e batidas — mas também mais polícia comprável.</p></div>
        <div class="card"><div class="ico">💸</div><h4>Potencial (1–10)</h4><p>O tamanho do mercado de apostas. A Zona Norte é o coração: potencial 10.</p></div>
      </div>
      ${navButtons("territorio")}
    </section>`;
  }

  function renderFaccoes() {
    const F = [
      ["Comando Vermelho (CV)","✊","A maior facção. Domina muitos complexos. Código próprio, estrutura de guerra.","#A4161A"],
      ["Terceiro Comando Puro (TCP)","✊","Rival histórico do CV. Disputa territórios estratégicos como a Maré.","#A4161A"],
      ["Amigos dos Amigos (ADA)","✊","Facção menor, oportunista, troca de alianças conforme a maré.","#A4161A"],
      ["Milícias","🛡️","Ex-policiais 'empresariais'. Dominam a Zona Oeste. Cobram caro e são disciplinadas.","#C8A97E"],
      ["Bicheiros tradicionais","🎩","A velha guarda. Honra, palavra e tradição desde 1892. Desprezam a violência gratuita.","#C9A227"],
      ["Polícia corrupta","🚨","Uma 'facção' dentro do Estado. Vende proteção, avisa batidas — e cobra a sua mensalidade.","#2C5F7C"]
    ];
    return `<section class="section">
      ${secHead("As ruas · poder", "Facções & Proteção", "Operar sem proteção é suicídio. Operar com facção é perigoso. A chave é respeito, pagamento e discrição.")}

      <p class="lead">Seis poderes dividem o submundo carioca. Eles não são seus amigos — são organizações que te usam enquanto você for útil. Mas sem a proteção deles, você é esmagado.</p>

      <div class="grid cols-2">
        ${F.map(f=>`<div class="card" style="border-left:4px solid ${f[3]}"><div class="ico">${f[1]}</div><h4>${f[0]}</h4><p>${f[2]}</p></div>`).join("")}
      </div>

      <h2 class="block">O "imposto" do crime</h2>
      <p>Toda operação paga proteção. Os valores variam conforme quem manda na área:</p>
      <div class="table-wrap"><table>
        <thead><tr><th>Proteção</th><th class="t-center">Custo mensal</th><th>Cobertura</th></tr></thead>
        <tbody>
          <tr><td>Facção (pequeno)</td><td class="t-center money">R$ 3–5 mil</td><td>1-2 pontos em comunidade</td></tr>
          <tr><td>Facção (operação)</td><td class="t-center money">25–30% da renda</td><td>Operar em área controlada</td></tr>
          <tr><td>Milícia</td><td class="t-center money">R$ 5–30 mil</td><td>Mais cara e mais "profissional" que facção</td></tr>
          <tr><td>PM individual</td><td class="t-center money">R$ 1.500</td><td>Ignora você, avisa batidas</td></tr>
          <tr><td>Comandante de batalhão</td><td class="t-center money">R$ 20 mil</td><td>Desvia operações da região</td></tr>
          <tr><td>Delegado</td><td class="t-center money">R$ 20–40 mil</td><td>Arquiva investigações, "perde" evidências</td></tr>
        </tbody>
      </table></div>

      <div class="diagram">${protectionPyramidSVG()}<div class="cap">A cadeia de proteção — do aviso barato do PM ao delegado que arquiva tudo. Império grande paga vários níveis ao mesmo tempo.</div></div>

      ${cenario("A quebra de acordo", `<p>Atrasar a proteção tem um cronograma implacável: <strong>1ª semana</strong> aviso amigável → <strong>2ª</strong> ameaça direta → <strong>3ª</strong> pontos fechados à força → <strong>1 mês</strong> expulsão ou execução. Tentar operar sem pagar: morte imediata.</p>`, "note-red")}

      <h2 class="block">Sobreviver às facções — o protocolo</h2>
      <ol class="loop-list">
        <li><strong>Identifique</strong> quem controla a área <em>antes</em> de abrir o ponto.</li>
        <li><strong>Respeite a hierarquia</strong> — fale com a pessoa certa, do jeito certo.</li>
        <li><strong>Pague em dia.</strong> Atraso é problema; calote é morte.</li>
        <li><strong>Não minta</strong> sobre a receita — eles descobrem.</li>
        <li><strong>Nunca fale com a facção rival.</strong> Traição se paga com a vida.</li>
      </ol>
      ${navButtons("faccoes")}
    </section>`;
  }

  function renderCombate() {
    return `<section class="section">
      ${secHead("As ruas · violência", "Combate & Segurança", "Combate é rápido, letal e caro. Existe para ser evitado — e quando acontece, cobra por anos.")}

      <blockquote class="quote">"Combate é rápido e mortal. 2 a 5 rodadas antes de alguém morrer ou fugir. Não existe trocar tiros por 20 minutos como no cinema."<cite>Princípio do sistema de combate</cite></blockquote>

      <h2 class="block">Por que evitar a violência</h2>
      <div class="grid cols-3">
        <div class="card"><div class="ico">🔥</div><h4>Heat dispara</h4><p>A polícia prioriza homicídios. Um tiroteio público é +2; um fuzil, +3; matar um policial, +4.</p></div>
        <div class="card"><div class="ico">⚰️</div><h4>Vendetta</h4><p>Toda morte cria uma vingança. A família, a facção ou o parceiro do morto não esquecem.</p></div>
        <div class="card"><div class="ico">💀</div><h4>Trauma</h4><p>Matar acumula Pressão. O profissional aguenta; o amador desmorona e colapsa.</p></div>
      </div>

      <h2 class="block">Como o combate funciona</h2>
      <p>Combate é um <span class="hl">teste contestado</span>: o atacante e o defensor montam seus pools e comparam sucessos. A diferença — a <span class="hl">margem</span> — define a gravidade.</p>
      <div class="diagram">${combatFlowSVG()}<div class="cap">Resolução de um ataque — margem + arma definem o ferimento</div></div>

      <div class="grid cols-2">
        <div class="card"><h4>Iniciativa</h4><p>Pool de <b>Instinto + Sangue Frio</b>. Mais sucessos age primeiro. Emboscar dá +3 dados; ser surpreendido, −3.</p></div>
        <div class="card"><h4>Ataque vs Defesa</h4><p>Atacante: <b>Operação + Armas de Fogo</b>. Defesa: <b>Instinto + Fuga</b> + cobertura. Quem tiver mais sucessos vence.</p></div>
      </div>

      <h3 class="sub">Gravidade do ferimento (margem + bônus de arma)</h3>
      <div class="table-wrap"><table>
        <thead><tr><th class="t-center">Gravidade</th><th>Ferimento</th><th>Efeito</th></tr></thead>
        <tbody>
          <tr><td class="t-center">0</td><td>Arranhão</td><td>Sem penalidade</td></tr>
          <tr><td class="t-center">1</td><td>Leve</td><td>−1 dado em tudo</td></tr>
          <tr><td class="t-center">2</td><td>Grave</td><td>−2 dados, hemorragia, médico urgente</td></tr>
          <tr><td class="t-center">3</td><td>Crítico</td><td>−3 dados, fora de combate, risco de morte</td></tr>
          <tr><td class="t-center">4+</td><td>Mortal</td><td>Morte em 1-3 rodadas</td></tr>
        </tbody>
      </table></div>
      <p class="muted">Bônus de arma somado à margem: faca/.38 <b>+0</b> · pistola pesada/escopeta <b>+1</b> · fuzil <b>+2</b>. Cobertura dá dados de defesa: leve +1, parcial +2, sólida +3, total +4.</p>

      <h2 class="block">Tabela de armas</h2>
      <div class="table-wrap"><table>
        <thead><tr><th>Arma</th><th class="t-center">Bônus</th><th class="t-center">Mercado ilegal</th><th class="t-center">Heat se usada</th></tr></thead>
        <tbody>
          <tr><td>Revólver .38</td><td class="t-center">+0</td><td class="money">R$ 800</td><td class="t-center"><span class="pill mid">+1</span></td></tr>
          <tr><td>Pistola 9mm</td><td class="t-center">+1</td><td class="money">R$ 1.200</td><td class="t-center"><span class="pill mid">+2</span></td></tr>
          <tr><td>Escopeta calibre 12</td><td class="t-center">+1</td><td class="money">R$ 1.000–1.500</td><td class="t-center"><span class="pill high">+2</span></td></tr>
          <tr><td>Submetralhadora</td><td class="t-center">+2</td><td class="money">R$ 8–12 mil</td><td class="t-center"><span class="pill high">+3</span></td></tr>
          <tr><td>Fuzil AK-47 / AR-15</td><td class="t-center">+2</td><td class="money">R$ 10–15 mil</td><td class="t-center"><span class="pill high">+3</span></td></tr>
        </tbody>
      </table></div>

      <h2 class="block">Alternativas ao combate</h2>
      <p>O sistema sempre oferece uma saída antes da bala. <span class="hl">É aqui que mora a maestria.</span></p>
      <div class="grid cols-4">
        <div class="card"><div class="ico">😨</div><h4>Intimidação</h4><p>Lábia/SF + Intimidação. Faça o outro recuar sem um tiro.</p></div>
        <div class="card"><div class="ico">💵</div><h4>Suborno</h4><p>Quanto vale a sua vida ou a passagem? Quase sempre menos que uma guerra.</p></div>
        <div class="card"><div class="ico">🏃</div><h4>Fuga</h4><p>Operação + Fuga contestado. Conhecer a área (becos, favela) dá +dados.</p></div>
        <div class="card"><div class="ico">🤝</div><h4>Rendição</h4><p>Às vezes render-se e negociar depois é mais esperto que morrer.</p></div>
      </div>

      <h2 class="block">Segurança pessoal</h2>
      <p>Quem tem império precisa de músculo. Os tipos de segurança vão do moleque da esquina ao ex-BOPE lendário:</p>
      <div class="table-wrap"><table>
        <thead><tr><th>Tipo</th><th class="t-center">Custo/mês</th><th class="t-center">Lealdade base</th><th>Para quê</th></tr></thead>
        <tbody>
          <tr><td>Básico ("O Rala")</td><td class="t-center money">R$ 2,5–3,5 mil</td><td class="t-center"><span class="pill high">4</span></td><td>Vigia de ponto, intimidação leve</td></tr>
          <tr><td>Experiente</td><td class="t-center money">R$ 6–9 mil</td><td class="t-center"><span class="pill mid">6</span></td><td>Proteção real, comanda básicos</td></tr>
          <tr><td>Ex-policial / militar</td><td class="t-center money">R$ 12–18 mil</td><td class="t-center"><span class="pill low">7</span></td><td>Tático, contatos na PM</td></tr>
          <tr><td>Capanga de confiança</td><td class="t-center money">R$ 4–10 mil</td><td class="t-center"><span class="pill low">9–10</span></td><td>Lealdade absoluta, morre por você</td></tr>
          <tr><td>Elite ("O Fantasma")</td><td class="t-center money">R$ 25–40 mil</td><td class="t-center"><span class="pill low">8</span></td><td>Operações especiais, vale por dez</td></tr>
        </tbody>
      </table></div>
      ${cenario("Milícia × segurança própria", `<p>A <strong>milícia</strong> te cobra proteção territorial (você paga para existir na área dela). O <strong>segurança pessoal</strong> é seu — leal a você, não à área. Império grande precisa dos dois: pagar a milícia para operar <em>e</em> manter capangas fiéis para o caso de tudo dar errado.</p>`)}
      ${navButtons("combate")}
    </section>`;
  }

  function renderComecar() {
    return `<section class="section">
      ${secHead("Bora jogar", "Como começar", "Tudo o que vocês precisam para a primeira noite de jogo.")}

      <p class="lead">Barões do Asfalto é jogado <span class="hl">fisicamente, na mesa</span>: fichas impressas, um tabuleiro do Rio, cartas de favor e de ponto, dinheiro do jogo e dados d6.</p>

      <h2 class="block">A sessão zero (montagem)</h2>
      <ol class="loop-list">
        <li>Cada jogador escolhe um <strong>arquétipo</strong> e monta a ficha (15 pontos de atributo, 20 de perícia).</li>
        <li>Definam <strong>como os personagens se conhecem</strong> e por que formam a sociedade.</li>
        <li>Combinem os <strong>limites da mesa</strong> (temas que ficam de fora).</li>
        <li>Escolham um <strong>bicho-brasão</strong> para a organização — entre os 25 bichos do jogo.</li>
      </ol>

      <h2 class="block">A primeira missão</h2>
      ${cenario("\"O Ponto de Madureira\"", `<p>O grupo conquista seu primeiro ponto de bicho: o Seu Milton quer se aposentar e vender a barraca histórica dele — mas a milícia local quer o mesmo ponto de graça. Vocês negociam com o Milton, lidam com o cobrador da milícia e decidem a quem pagar proteção. <span class="voz">A recompensa: o primeiro ponto, e a fundação do império.</span></p>`)}

      <h2 class="block">O que você precisa imprimir</h2>
      <div class="grid cols-3">
        <div class="card"><div class="ico">📄</div><h4>Fichas de personagem</h4><p>Uma por jogador.</p></div>
        <div class="card"><div class="ico">🗺️</div><h4>Tabuleiro do Rio</h4><p>As 10 regiões e suas conexões.</p></div>
        <div class="card"><div class="ico">🎴</div><h4>Cartas de favor & ponto</h4><p>A moeda social e os pontos.</p></div>
        <div class="card"><div class="ico">💵</div><h4>Dinheiro do jogo</h4><p>Notas limpas e sujas.</p></div>
        <div class="card"><div class="ico">📖</div><h4>Livro rápido do mestre</h4><p>Tabelas e a missão inicial.</p></div>
        <div class="card"><div class="ico">🎲</div><h4>Dados d6</h4><p>~12 por jogador (pools chegam a 10+).</p></div>
      </div>

      <div class="panel framed" style="margin-top:30px;text-align:center">
        <span class="stamp gold">BEM-VINDOS AO JOGO</span>
        <p class="lead" style="margin:18px auto 4px;max-width:60ch">Construam o império. Lavem o dinheiro. Paguem os favores.<br>E nunca esqueçam o preço de cada escolha.</p>
        <p class="muted" style="font-family:var(--ff-eleg);font-style:italic">"No Rio, palavra vale mais que contrato. E dívida nunca prescreve."</p>
        <div class="hero-cta" style="justify-content:center">
          <a class="btn primary" href="#capa">↑ Voltar ao início</a>
          <a class="btn" href="#territorio">Explorar o mapa</a>
        </div>
      </div>
      ${navButtons("comecar")}
    </section>`;
  }

  function renderNPCs() {
    // cat: cor da categoria · L: lealdade inicial · vermelha: linha vermelha/risco
    const NPCS = [
      { cat:"Autoridade", cor:"#2C5F7C", nome:"Delegado Bruno Sampaio", alc:"\"O Doutor\"", L:4,
        oferece:"Arquiva inquérito, \"perde\" evidência, avisa de operação, solta preso em 24h.",
        vermelha:"Não toca em caso que já virou mídia. Nada por escrito.",
        fala:"Eu não vi nada, você não falou nada, e a gente continua amigo." },
      { cat:"Autoridade", cor:"#A4161A", nome:"Invest. Cláudia Rangel", alc:"\"A Linha-Dura\"", L:0,
        oferece:"Nada — é uma ameaça. Dá rosto ao Heat: a investigação que avança entre sessões.",
        vermelha:"Não tem preço. Só pode ser enganada, distraída ou transferida.",
        fala:"Cada real sujo deixa um rastro. Eu sigo rastro." },
      { cat:"Autoridade", cor:"#C9A227", nome:"Vereadora Solange Pita", alc:"\"A Madrinha\"", L:5,
        oferece:"Alvarás, vista grossa municipal, verba social desviável, blindagem na Câmara.",
        vermelha:"Não rompe com a Igreja nem com a comunidade. Cobra fatia de tudo.",
        fala:"Meu amor, política é troca. Você me dá, eu te dou." },
      { cat:"Profissional", cor:"#C9A227", nome:"Dr. Said Khoury", alc:"Advogado", L:6,
        oferece:"Defesa criminal de elite, habeas corpus relâmpago, ponte com juízes.",
        vermelha:"Não entrega um cliente para salvar outro. O sigilo é sagrado.",
        fala:"Culpado e condenado são coisas muito diferentes. Eu vivo do espaço entre elas." },
      { cat:"Profissional", cor:"#2C5F7C", nome:"\"Bug\"", alc:"Hacker", L:3,
        oferece:"Plataforma de apostas online, rastreamento digital, derrubar o site do rival.",
        vermelha:"Nunca se encontra pessoalmente. Pânico de alvo federal.",
        fala:"Tudo deixa log. Eu só sei apagar melhor que os outros." },
      { cat:"Lavagem", cor:"#5fae7e", nome:"Dona Geralda", alc:"\"A Calculadora\"", L:6,
        oferece:"Contabilidade criativa, fachada pequena/média, declarações que batem.",
        vermelha:"Não trabalha para quem trata laranja mal.",
        fala:"Meu filho, número não mente. Quem mente é gente." },
      { cat:"Laranja", cor:"#5fae7e", nome:"\"Seu Hélio\"", alc:"Laranja profissional", L:7,
        oferece:"Nome 100% limpo para empresas grandes; paciência sob pressão.",
        vermelha:"Cale se preso — desde que cumpram o trato e cuidem da família dele.",
        fala:"Se eu cair, vocês cuidam da Neusa. Acordo é acordo." },
      { cat:"Laranja", cor:"#A4161A", nome:"Wesley", alc:"Laranja descartável", L:3,
        oferece:"Nome para empresa descartável de curto prazo — barato.",
        vermelha:"Fala demais quando bebe. Entra em pânico, pede mais, pode delatar.",
        fala:"Relaxa, eu não falei pra ninguém! ...só pra um cara." },
      { cat:"Submundo", cor:"#C9A227", nome:"Seu Anísio", alc:"Bicheiro da velha guarda", L:4,
        oferece:"Legitimidade, mentoria, mediação entre bicheiros, ponte com a velha guarda.",
        vermelha:"Nenhuma aliança com quem trai a palavra. Despreza métodos de facção.",
        fala:"No meu tempo, a palavra valia mais que a bala. Ainda vale, para mim." }
    ];
    return `<section class="section">
      ${secHead("As ruas · gente", "Quem você encontra", "O Rio é feito de gente. Estes são alguns rostos que vão cruzar o caminho da sociedade — aliados, ferramentas e ameaças.")}

      <p class="lead">No submundo, <span class="hl">relacionamento é tudo</span>. Cada NPC tem uma <span class="hl">Lealdade</span> (0–10), um preço, o que oferece e uma <span class="hl-red">linha vermelha</span> que não cruza. Trate-os bem e eles te seguram; trate mal e a conta chega.</p>

      <div class="npc-grid">
        ${NPCS.map(n=>`<div class="npc-card" style="--cat:${n.cor}">
          <div class="npc-top">
            <span class="npc-cat">${n.cat}</span>
            <span class="npc-leal" title="Lealdade inicial">❤ ${n.L}</span>
          </div>
          <h4>${n.nome}</h4>
          <div class="npc-alc">${n.alc}</div>
          <p class="npc-of"><b>Oferece:</b> ${n.oferece}</p>
          <p class="npc-rv"><b>Linha vermelha:</b> ${n.vermelha}</p>
          <p class="npc-fala">“${n.fala}”</p>
        </div>`).join("")}
      </div>

      ${cenario("Como a lealdade muda tudo", `<p>Lealdade <strong>0–2</strong>: trai na primeira oportunidade. <strong>5–6</strong>: confiável se bem pago. <strong>7–8</strong>: arrisca por você. <strong>9–10</strong>: morre por você. Pagar em dia, proteger a família e respeitar o código sobem a lealdade; calote, mentira e humilhação derrubam.</p>`)}

      <p class="muted">Este é um recorte. O livro do mestre traz um banco com <strong>30+ NPCs</strong> em cinco categorias — autoridades, profissionais do crime, empresários e laranjas, submundo e civis — além dos banqueiros de favores e especialistas de lavagem e segurança.</p>
      ${navButtons("npcs")}
    </section>`;
  }

  function renderCampanha() {
    const arcos = ["A Herança do Banqueiro Morto","Operação Lava-Bets","A Guerra da Zona Oeste",
      "O Político Inconveniente","O Traidor","A Invasão Digital","O Resgate Impossível","A Virada de Mesa"];
    const missoes = [
      { n:"O Ponto de Madureira", dif:"2/10", tipo:"inicial",
        gancho:"Seu Milton quer se aposentar e vender a barraca histórica — mas a milícia quer o ponto de graça. Vocês têm uma semana.",
        recompensa:"O primeiro ponto (~R$ 11 mil/mês) e a fundação do império." },
      { n:"Proteção Necessária", dif:"3/10", tipo:"inicial",
        gancho:"\"Sobe aqui pra gente conversar.\" O gerente da facção quer taxar a operação nova. Ignorar é suicídio; aceitar é ajoelhar.",
        recompensa:"Proteção estável — e uma mensalidade no orçamento." },
      { n:"O Contador Nervoso", dif:"2/10", tipo:"inicial",
        gancho:"O dinheiro sujo se acumula e vira maldição. Um contador apavorado topa montar a primeira fachada — se tiver garantias contra a Rangel.",
        recompensa:"A primeira estrutura de lavagem funcional." },
      { n:"Operação Lava-Bets", dif:"7/10", tipo:"avançada",
        gancho:"A Polícia Federal mira o mercado de apostas. A investigação ameaça todos os bicheiros — inclusive vocês.",
        recompensa:"Se sobreviverem: Heat reduzido, rivais afundados e XP alto." },
      { n:"Guerra da Zona Oeste", dif:"8/10", tipo:"avançada",
        gancho:"A milícia dominante decide engolir os pontos do grupo. A taxa triplica, ou um operador é morto como recado. Guerra aberta.",
        recompensa:"Território e Capital de Rua — mas Heat e Pressão altíssimos." },
      { n:"Endgame", dif:"10/10", tipo:"avançada",
        gancho:"Todos os inimigos acumulados convergem ao mesmo tempo: a vendetta, a investigação federal, os rivais e os traidores internos.",
        recompensa:"O trono do submundo carioca — ou a queda épica." }
    ];
    const finais = [
      ["Ascensão ao Topo","Ricos, respeitados, intocados — e agora todo mundo mira em você.","#5fae7e"],
      ["Queda Trágica","Subiu rápido, caiu mais rápido. O Rio já esqueceu seu nome.","#A4161A"],
      ["Fuga / Exílio","Vivos e com dinheiro, mas para sempre olhando por cima do ombro.","#C9A227"],
      ["Redenção","Uma vida pequena e limpa, comprada com traição ao passado.","#2C5F7C"],
      ["Traição Final","Quem traiu herda o império — e os fantasmas.","#C8A97E"],
      ["Guerra sem Vencedores","Provaram quem era mais forte. E não sobrou nada para governar.","#7d7d7d"]
    ];
    return `<section class="section">
      ${secHead("Bora jogar · campanha", "Campanha & Missões", "Barões do Asfalto é uma história de ascensão. De um ponto de rua ao topo do submundo — ou à queda no caminho.")}

      <p class="lead">A campanha é a <span class="hl">ascensão de uma sociedade criminosa</span>. Nada é trilho: o mestre encaixa missões e arcos, e as escolhas da mesa empurram a história para um destino que <span class="hl">vocês</span> constroem.</p>

      <h2 class="block">Três tamanhos de campanha</h2>
      <div class="grid cols-3">
        <div class="card"><div class="num">5–8 sessões</div><h4>A Ascensão</h4><p>Três operadores se juntam e fincam o primeiro território. Do nada ao primeiro respeito de rua: 3–4 pontos lucrativos e protegidos.</p></div>
        <div class="card"><div class="num">12–20 sessões</div><h4>Guerra do Bicho</h4><p>O grupo já é um nome. A expansão colide com outros barões e facções. Três atos: expansão, o estopim, e a conta.</p></div>
        <div class="card"><div class="num">20+ sessões</div><h4>Barões do Asfalto</h4><p>A epopeia: dos pontos de rua ao império que disputa a cidade inteira — e atrai poderes muito além da polícia local.</p></div>
      </div>

      <h2 class="block">A estrutura de uma guerra (3 atos)</h2>
      <div class="flow">
        <div class="step"><span class="n">1</span><h5>Expansão</h5><p>O grupo cresce para uma nova região. Cada ponto traz um novo poder a satisfazer.</p></div>
        <div class="step"><span class="n">2</span><h5>O Estopim</h5><p>Uma morte ou traição acende a guerra. Facções escolhem lados; o Heat dispara.</p></div>
        <div class="step"><span class="n">3</span><h5>A Conta</h5><p>A guerra cobra seu preço. Uma jogada decisiva — e a polícia bate à porta no pior momento.</p></div>
      </div>

      <h2 class="block">Arcos modulares</h2>
      <p>Capítulos autocontidos (3–5 sessões) que o mestre encaixa onde quiser:</p>
      <div class="chips">${arcos.map(a=>`<span class="chip">${a}</span>`).join("")}</div>

      <h2 class="block">Missões de exemplo</h2>
      <p>Do primeiro ponto ao confronto final — uma amostra do que espera a sociedade:</p>
      <div class="grid cols-2">
        ${missoes.map(m=>`<div class="card mission ${m.tipo}">
          <div class="mission-head"><h4>${m.n}</h4><span class="dif">Dificuldade ${m.dif}</span></div>
          <p class="mission-g"><b>Gancho:</b> ${m.gancho}</p>
          <p class="mission-r"><b>Recompensa:</b> ${m.recompensa}</p>
        </div>`).join("")}
      </div>

      <h2 class="block">Como termina</h2>
      <p>Os finais não são "vitória/derrota" — são destinos, desenhados pelas escolhas do grupo:</p>
      <div class="grid cols-3">
        ${finais.map(f=>`<div class="card" style="border-left:4px solid ${f[2]}"><h4 style="color:${f[2]}">${f[0]}</h4><p>${f[1]}</p></div>`).join("")}
      </div>

      ${cenario("A reviravolta da primeira campanha", `<p>Na campanha curta, o contato que apresentou os três bicheiros — o NPC que costurou a sociedade — estava plantado por um poder maior (Seu Anísio testando, ou um rival armando). A sociedade descobre que foi <strong>peça num jogo alheio</strong> desde o começo.</p>`)}
      ${navButtons("campanha")}
    </section>`;
  }

  /* ============================================================
     SVGs — diagramas e ilustrações
     ============================================================ */

  function skylineSVG() {
    return `<svg class="skyline" viewBox="0 0 1200 160" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <defs><linearGradient id="sk" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#0a1a12" stop-opacity="0"/><stop offset="1" stop-color="#06100b" stop-opacity=".9"/>
      </linearGradient></defs>
      <g fill="#0c2018" opacity=".9">
        <rect x="0" y="90" width="60" height="70"/><rect x="64" y="60" width="40" height="100"/>
        <rect x="110" y="100" width="70" height="60"/><rect x="186" y="72" width="34" height="88"/>
        <rect x="226" y="110" width="80" height="50"/><rect x="312" y="50" width="46" height="110"/>
        <rect x="364" y="96" width="60" height="64"/><rect x="430" y="78" width="38" height="82"/>
        <rect x="474" y="104" width="90" height="56"/><rect x="570" y="64" width="44" height="96"/>
        <rect x="620" y="98" width="64" height="62"/><rect x="690" y="84" width="36" height="76"/>
        <rect x="732" y="108" width="86" height="52"/><rect x="824" y="58" width="48" height="102"/>
        <rect x="878" y="100" width="60" height="60"/><rect x="944" y="80" width="40" height="80"/>
        <rect x="990" y="106" width="84" height="54"/><rect x="1080" y="70" width="44" height="90"/>
        <rect x="1130" y="100" width="70" height="60"/>
      </g>
      <g fill="#C9A227" opacity=".5">
        <rect x="74" y="72" width="4" height="4"/><rect x="84" y="84" width="4" height="4"/>
        <rect x="322" y="64" width="4" height="4"/><rect x="332" y="80" width="4" height="4"/>
        <rect x="580" y="78" width="4" height="4"/><rect x="834" y="72" width="4" height="4"/>
        <rect x="844" y="90" width="4" height="4"/><rect x="1090" y="84" width="4" height="4"/>
      </g>
      <rect x="0" y="0" width="1200" height="160" fill="url(#sk)"/>
    </svg>`;
  }

  function systemMapSVG() {
    const cx = 410, cy = 215, Rx = 268, Ry = 150;
    const node = (x,y,w,label,sub,fill,stroke) =>
      `<g transform="translate(${x},${y})">
        <rect x="${-w/2}" y="-27" width="${w}" height="54" rx="11" fill="${fill||'#16291f'}" stroke="${stroke||'#C9A227'}" stroke-opacity=".6" stroke-width="1.5"/>
        <text x="0" y="-4" text-anchor="middle" font-family="Anton, sans-serif" font-size="15" fill="#F4ECD8">${label}</text>
        <text x="0" y="15" text-anchor="middle" font-family="Oswald, sans-serif" font-size="11" fill="#cdbf9f">${sub}</text>
      </g>`;
    // satélites em volta do hub; setas calculadas borda-a-borda
    const sats = [
      {a:-90,  w:188, label:"PONTOS DE BICHO", sub:"geram dinheiro sujo"},
      {a:-30,  w:176, label:"FACÇÕES",         sub:"cobram proteção"},
      {a:30,   w:176, label:"FAVORES",         sub:"moeda social"},
      {a:90,   w:188, label:"COMBATE",         sub:"último recurso", fill:"#3a1414", stroke:"#A4161A"},
      {a:150,  w:176, label:"LAVAGEM",         sub:"sujo → limpo"},
      {a:210,  w:188, label:"TERRITÓRIO",      sub:"onde você opera"}
    ];
    let arrows = "", nodes = "";
    sats.forEach(s => {
      const rad = s.a*Math.PI/180, ux = Math.cos(rad), uy = Math.sin(rad);
      const nx = cx + Rx*ux, ny = cy + Ry*uy;
      const x1 = cx + 118*ux, y1 = cy + 70*uy;     // sai da borda do hub
      const x2 = nx - 100*ux,  y2 = ny - 38*uy;     // chega na borda do satélite
      arrows += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#C9A227" stroke-opacity=".45" stroke-width="2" marker-end="url(#arr)"/>`;
      nodes += node(nx, ny, s.w, s.label, s.sub, s.fill, s.stroke);
    });
    return `<svg viewBox="0 0 820 430" aria-label="Diagrama de como os sistemas se conectam">
      <defs><marker id="arr" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
        <path d="M0,0 L8,4 L0,8 Z" fill="#C9A227" fill-opacity=".6"/></marker></defs>
      ${arrows}
      ${node(cx, cy, 220, "A SOCIEDADE", "você e seus sócios", "#1B4332")}
      ${nodes}
    </svg>`;
  }

  function sessionLoopSVG() {
    const r = 60;
    const P = { tl:[180,95], tr:[500,95], br:[500,255], bl:[180,255] };
    const seg = (cx,cy,label,sub,col) =>
      `<g transform="translate(${cx},${cy})">
        <circle r="${r}" fill="#13231b" stroke="${col}" stroke-width="2.5"/>
        <text y="-6" text-anchor="middle" font-family="Anton, sans-serif" font-size="15" fill="#F4ECD8">${label}</text>
        <text y="16" text-anchor="middle" font-family="Oswald" font-size="11" fill="#cdbf9f">${sub}</text>
      </g>`;
    // setas borda-a-borda formando o retângulo (sentido horário)
    const A = (x1,y1,x2,y2)=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" fill="none" stroke="#C9A227" stroke-opacity=".6" stroke-width="2.5" marker-end="url(#arr2)"/>`;
    return `<svg viewBox="0 0 680 350" aria-label="Loop das quatro fases da sessão">
      <defs><marker id="arr2" markerWidth="9" markerHeight="9" refX="7.5" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 Z" fill="#C9A227" fill-opacity=".8"/></marker></defs>
      ${A(P.tl[0]+r, P.tl[1], P.tr[0]-r, P.tr[1])}
      ${A(P.tr[0], P.tr[1]+r, P.br[0], P.br[1]-r)}
      ${A(P.br[0]-r, P.br[1], P.bl[0]+r, P.bl[1])}
      ${A(P.bl[0], P.bl[1]-r, P.tl[0], P.tl[1]+r)}
      <text x="340" y="170" text-anchor="middle" font-family="Special Elite, monospace" font-size="12" fill="#7d7d7d">CICLO</text>
      <text x="340" y="188" text-anchor="middle" font-family="Special Elite, monospace" font-size="12" fill="#7d7d7d">DA SESSÃO</text>
      ${seg(P.tl[0],P.tl[1],"① PLANEJAR","estratégia","#C9A227")}
      ${seg(P.tr[0],P.tr[1],"② EXECUTAR","ação","#A4161A")}
      ${seg(P.br[0],P.br[1],"③ CONSEQUÊNCIA","o mundo reage","#2C5F7C")}
      ${seg(P.bl[0],P.bl[1],"④ ECONOMIA","fecha o mês","#5fae7e")}
    </svg>`;
  }

  function moneyFlowSVG() {
    return `<svg viewBox="0 0 760 180" aria-label="Fluxo do dinheiro sujo até limpo">
      <defs><marker id="arr3" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 Z" fill="#C9A227"/></marker></defs>
      <g transform="translate(110,90)"><rect x="-86" y="-40" width="172" height="80" rx="12" fill="#2a1414" stroke="#A4161A"/>
        <text y="-8" text-anchor="middle" font-family="Anton" font-size="16" fill="#D33A2C">SUJO</text>
        <text y="14" text-anchor="middle" font-family="Oswald" font-size="11" fill="#b8ad94">do crime</text></g>
      <line x1="200" y1="90" x2="300" y2="90" stroke="#C9A227" stroke-width="2.5" marker-end="url(#arr3)"/>
      <g transform="translate(390,90)"><rect x="-90" y="-46" width="180" height="92" rx="12" fill="#2a2410" stroke="#C9A227"/>
        <text y="-12" text-anchor="middle" font-family="Anton" font-size="15" fill="#E3C353">EM TRÂNSITO</text>
        <text y="8" text-anchor="middle" font-family="Oswald" font-size="10.5" fill="#b8ad94">lavando · 2-16 sem.</text>
        <text y="26" text-anchor="middle" font-family="Oswald" font-size="10.5" fill="#D33A2C">− taxa 10 a 28%</text></g>
      <line x1="485" y1="90" x2="585" y2="90" stroke="#C9A227" stroke-width="2.5" marker-end="url(#arr3)"/>
      <g transform="translate(670,90)"><rect x="-82" y="-40" width="164" height="80" rx="12" fill="#13281c" stroke="#5fae7e"/>
        <text y="-8" text-anchor="middle" font-family="Anton" font-size="16" fill="#7fe0a6">LIMPO</text>
        <text y="14" text-anchor="middle" font-family="Oswald" font-size="11" fill="#b8ad94">usa em tudo</text></g>
    </svg>`;
  }

  function favorFlowSVG() {
    return `<svg viewBox="0 0 760 170" aria-label="Ciclo de um favor">
      <defs><marker id="arr4" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 Z" fill="#C9A227"/></marker></defs>
      <g transform="translate(120,80)"><rect x="-92" y="-42" width="184" height="84" rx="12" fill="#16291f" stroke="#C9A227"/>
        <text y="-8" text-anchor="middle" font-family="Anton" font-size="15" fill="#F4ECD8">PEDIR</text>
        <text y="14" text-anchor="middle" font-family="Oswald" font-size="10.5" fill="#b8ad94">Lábia + Contatos</text></g>
      <line x1="214" y1="80" x2="304" y2="80" stroke="#C9A227" stroke-width="2.5" marker-end="url(#arr4)"/>
      <g transform="translate(395,80)"><rect x="-92" y="-42" width="184" height="84" rx="12" fill="#16291f" stroke="#C9A227"/>
        <text y="-8" text-anchor="middle" font-family="Anton" font-size="15" fill="#F4ECD8">DEVER</text>
        <text y="14" text-anchor="middle" font-family="Oswald" font-size="10.5" fill="#b8ad94">vai pro "caderninho"</text></g>
      <line x1="489" y1="80" x2="579" y2="80" stroke="#C9A227" stroke-width="2.5" marker-end="url(#arr4)"/>
      <g transform="translate(672,80)"><rect x="-86" y="-42" width="172" height="84" rx="12" fill="#16291f" stroke="#5fae7e"/>
        <text y="-8" text-anchor="middle" font-family="Anton" font-size="15" fill="#7fe0a6">PAGAR</text>
        <text y="14" text-anchor="middle" font-family="Oswald" font-size="10.5" fill="#b8ad94">quita a dívida</text></g>
      <path d="M672,124 Q400,165 120,124" fill="none" stroke="#A4161A" stroke-width="2" stroke-dasharray="6 5" marker-end="url(#arr4)"/>
      <text x="396" y="160" text-anchor="middle" font-family="Special Elite, monospace" font-size="10" fill="#D33A2C">não pagou? juros + o credor cobra do jeito dele</text>
    </svg>`;
  }

  function combatFlowSVG() {
    return `<svg viewBox="0 0 760 220" aria-label="Resolução de um ataque em combate">
      <defs><marker id="arr5" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 Z" fill="#C9A227"/></marker></defs>
      <g transform="translate(115,60)"><rect x="-95" y="-34" width="190" height="68" rx="11" fill="#16291f" stroke="#D33A2C"/>
        <text y="-6" text-anchor="middle" font-family="Anton" font-size="13" fill="#F4ECD8">ATACANTE</text>
        <text y="14" text-anchor="middle" font-family="Oswald" font-size="10" fill="#b8ad94">Operação + Armas</text></g>
      <g transform="translate(115,160)"><rect x="-95" y="-34" width="190" height="68" rx="11" fill="#16291f" stroke="#2C5F7C"/>
        <text y="-6" text-anchor="middle" font-family="Anton" font-size="13" fill="#F4ECD8">DEFENSOR</text>
        <text y="14" text-anchor="middle" font-family="Oswald" font-size="10" fill="#b8ad94">Instinto + Fuga + cobertura</text></g>
      <line x1="212" y1="60" x2="320" y2="100" stroke="#C9A227" stroke-width="2.2" marker-end="url(#arr5)"/>
      <line x1="212" y1="160" x2="320" y2="120" stroke="#C9A227" stroke-width="2.2" marker-end="url(#arr5)"/>
      <g transform="translate(415,110)"><rect x="-92" y="-38" width="184" height="76" rx="11" fill="#2a2410" stroke="#C9A227"/>
        <text y="-10" text-anchor="middle" font-family="Anton" font-size="13" fill="#E3C353">MARGEM</text>
        <text y="10" text-anchor="middle" font-family="Oswald" font-size="10" fill="#b8ad94">sucessos do atacante</text>
        <text y="25" text-anchor="middle" font-family="Oswald" font-size="10" fill="#b8ad94">− do defensor</text></g>
      <line x1="509" y1="110" x2="600" y2="110" stroke="#C9A227" stroke-width="2.2" marker-end="url(#arr5)"/>
      <g transform="translate(685,110)"><rect x="-72" y="-38" width="144" height="76" rx="11" fill="#2a1414" stroke="#A4161A"/>
        <text y="-10" text-anchor="middle" font-family="Anton" font-size="13" fill="#D33A2C">FERIMENTO</text>
        <text y="10" text-anchor="middle" font-family="Oswald" font-size="9.5" fill="#b8ad94">+ bônus da arma</text>
        <text y="25" text-anchor="middle" font-family="Oswald" font-size="9.5" fill="#b8ad94">Leve→Mortal</text></g>
    </svg>`;
  }

  function heatExpoSVG() {
    const cell = (x,y,w,h,fill,stroke,title,desc) =>
      `<g><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="${fill}" fill-opacity=".16" stroke="${stroke}" stroke-width="1.5"/>
        <text x="${x+w/2}" y="${y+h/2-6}" text-anchor="middle" font-family="Anton, sans-serif" font-size="15" fill="${stroke}">${title}</text>
        <text x="${x+w/2}" y="${y+h/2+16}" text-anchor="middle" font-family="Oswald, sans-serif" font-size="11.5" fill="#cdbf9f">${desc}</text></g>`;
    const GR="#5fae7e", GO="#C9A227", RD="#A4161A";
    return `<svg viewBox="0 0 560 470" aria-label="Quadrante Heat versus Exposição">
      <defs><marker id="axq" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#7d7d7d"/></marker></defs>
      <!-- eixos -->
      <line x1="74" y1="404" x2="74" y2="32" stroke="#7d7d7d" stroke-width="1.5" marker-end="url(#axq)"/>
      <line x1="74" y1="404" x2="540" y2="404" stroke="#7d7d7d" stroke-width="1.5" marker-end="url(#axq)"/>
      <text transform="translate(40,220) rotate(-90)" text-anchor="middle" font-family="Anton" font-size="14" fill="#b8ad94">HEAT (atenção ativa)</text>
      <text x="305" y="438" text-anchor="middle" font-family="Anton" font-size="14" fill="#b8ad94">EXPOSIÇÃO (seu rastro legal)</text>
      <text x="92" y="48" font-family="Oswald" font-size="11" fill="#7d7d7d">alto</text>
      <text x="92" y="398" font-family="Oswald" font-size="11" fill="#7d7d7d">baixo</text>
      <text x="96" y="420" font-family="Oswald" font-size="11" fill="#7d7d7d">baixa</text>
      <text x="500" y="420" font-family="Oswald" font-size="11" fill="#7d7d7d">alta</text>
      <!-- células -->
      ${cell(90,52,210,164,GO,GO,"FANTASMA","procurado, difícil de achar")}
      ${cell(312,52,210,164,RD,RD,"VOCÊ ESTÁ FODIDO","é só questão de tempo")}
      ${cell(90,224,210,164,GR,GR,"INVISÍVEL","o operador inteligente")}
      ${cell(312,224,210,164,GO,GO,"VULNERÁVEL","muito a puxar quando cair")}
    </svg>`;
  }

  function protectionPyramidSVG() {
    // trapézios empilhados — base barata/larga → topo caro/estreito
    const cx = 310;
    const tier = (y,h,wb,wt,fill,stroke,label,price) => {
      const pts = `${cx-wb/2},${y+h} ${cx+wb/2},${y+h} ${cx+wt/2},${y} ${cx-wt/2},${y}`;
      return `<g><polygon points="${pts}" fill="${fill}" fill-opacity=".82" stroke="${stroke}" stroke-width="1.5"/>
        <text x="${cx}" y="${y+h/2-2}" text-anchor="middle" font-family="Anton, sans-serif" font-size="14" fill="#0d130f">${label}</text>
        <text x="${cx}" y="${y+h/2+16}" text-anchor="middle" font-family="Oswald, sans-serif" font-size="11" fill="#0d130f">${price}</text></g>`;
    };
    return `<svg viewBox="0 0 620 360" aria-label="Pirâmide da cadeia de proteção">
      ${tier(258,72,560,470,"#5fae7e","#7fe0a6","PM individual","R$ 1.500 · avisa batidas")}
      ${tier(186,72,452,372,"#C9A227","#E3C353","Facção (por ponto)","R$ 3–5 mil · deixa operar")}
      ${tier(114,72,354,266,"#C8A97E","#e0c9a8","Milícia / Comandante","R$ 5–30 mil · controla a área")}
      ${tier(42,72,248,150,"#A4161A","#D33A2C","Delegado","R$ 20–40 mil · arquiva tudo")}
      <text x="600" y="300" text-anchor="end" font-family="Special Elite, monospace" font-size="10.5" fill="#7d7d7d">mais alto = mais caro e mais poder</text>
    </svg>`;
  }

  function territoryMapSVG() {
    let g = `<svg viewBox="0 0 600 430" id="territorySvg" aria-label="Mapa estilizado das 10 regiões do Rio">`;
    // baía
    g += `<path d="M240,300 q60,-20 120,0 q60,20 120,0 l0,130 l-240,0 z" fill="#16384a" opacity=".35"/>
      <text x="468" y="360" font-family="Oswald" font-size="10" fill="#7fb4d4" opacity=".7">BAÍA DE GUANABARA</text>`;
    REGIONS.forEach(r => {
      const [x,y,w,h] = MAP_POS[r.id];
      g += `<g class="region" data-id="${r.id}" tabindex="0" role="button" aria-label="${r.nome}">
        <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="9" fill="${r.cor}" fill-opacity=".22" stroke="${r.cor}" stroke-opacity=".8" stroke-width="1.5"/>
        <text class="rnum" x="${x+12}" y="${y+24}">${String(r.id).padStart(2,"0")}</text>
        <text x="${x+12}" y="${y+44}">${r.nome.length>16?r.nome.slice(0,15)+"…":r.nome}</text>
        <text x="${x+w-12}" y="${y+h-12}" text-anchor="end" font-family="Oswald" font-size="9" fill="#C9A227" opacity=".8">${r.bicho}</text>
      </g>`;
    });
    g += `</svg>`;
    return g;
  }

  /* ============================================================
     WIDGETS INTERATIVOS
     ============================================================ */

  function initDiceRoller(root) {
    const el = root.querySelector("#diceRoller");
    if (!el) return;
    let dice = 6, diff = 3;
    el.innerHTML = `<div class="roller">
      <div class="roller-controls">
        <div class="ctrl"><label>Dados no pool</label>
          <div class="stepper"><button data-act="dec">−</button><span class="val" id="dVal">6</span><button data-act="inc">+</button></div>
        </div>
        <div class="ctrl"><label>Dificuldade</label>
          <select class="diff" id="dDiff">
            <option value="1">Rotina (1)</option>
            <option value="2">Moderada (2)</option>
            <option value="3" selected>Difícil (3)</option>
            <option value="4">Muito Difícil (4)</option>
            <option value="5">Quase Impossível (5)</option>
          </select>
        </div>
        <button class="btn primary" id="rollBtn">🎲 Rolar</button>
      </div>
      <div class="dice-tray" id="tray"><span class="muted">Ajuste o pool e clique em rolar.</span></div>
      <div class="roll-result" id="rollResult"></div>
    </div>`;

    const dVal = el.querySelector("#dVal");
    el.querySelectorAll(".stepper button").forEach(b => b.addEventListener("click", () => {
      dice += (b.dataset.act === "inc" ? 1 : -1);
      dice = Math.max(1, Math.min(15, dice));
      dVal.textContent = dice;
    }));
    el.querySelector("#dDiff").addEventListener("change", e => diff = parseInt(e.target.value,10));
    el.querySelector("#rollBtn").addEventListener("click", () => rollPool(el, dice, diff));
  }

  function rollPool(el, n, diff) {
    const tray = el.querySelector("#tray");
    const res = el.querySelector("#rollResult");
    tray.innerHTML = ""; res.innerHTML = "";
    let toRoll = n, successes = 0, ones = 0, total = 0, isBonus = false;
    const queue = [];
    for (let i=0;i<n;i++) queue.push(false); // false = original, true = bônus de explosão

    let idx = 0;
    function step() {
      if (idx >= queue.length) return finish();
      const bonus = queue[idx];
      const face = 1 + Math.floor(Math.random()*6);
      total++;
      if (face === 1) ones++;
      const success = face >= 5;
      if (success) successes++;
      const die = document.createElement("div");
      die.className = "die" + (success?" success":"") + (face===6?" explode":"") + (bonus?" bonus":"");
      die.textContent = face;
      tray.appendChild(die);
      if (face === 6) queue.push(true); // explode
      idx++;
      setTimeout(step, 90);
    }

    function finish() {
      let cls, label;
      if (successes === 0 && ones > total/2) { cls="fail"; label="FALHA CRÍTICA · +1 Heat"; }
      else if (successes === 0) { cls="fail"; label="FALHA"; }
      else if (successes >= diff + 2) { cls="win"; label="SUCESSO CRÍTICO"; }
      else if (successes >= diff) { cls="win"; label="SUCESSO TOTAL"; }
      else if (successes === diff - 1) { cls="partial"; label="SUCESSO PARCIAL · sim, mas..."; }
      else { cls="fail"; label="FALHA"; }
      const explosions = total - n;
      res.innerHTML = `<span class="result-badge ${cls}">${label}</span>
        <span class="tally"><b>${successes}</b> sucesso(s) · dificuldade ${diff}${explosions>0?` · ${explosions} explosão(ões) 🔥`:""}</span>`;
    }
    step();
  }

  /* Atualiza o painel lateral com os dados de uma região */
  function showRegionInfo(info, r) {
    info.innerHTML = `
      <div class="rkicker">Região ${String(r.id).padStart(2,"0")} · bicho ${r.bicho}</div>
      <h4>${r.nome}</h4>
      <p style="font-size:.92rem">${r.desc}</p>
      <div class="stat"><span>Controle</span><b style="color:${r.cor}">${r.controle}</b></div>
      <div class="stat"><span>Policiamento</span>${minibars(r.pol,10,true)}</div>
      <div class="stat"><span>Potencial do bicho</span>${minibars(r.pot,10,false)}</div>
      <div class="stat"><span>Custo de entrada</span><b class="money" style="color:var(--dourado-claro)">${r.custo}</b></div>
      <p class="muted" style="font-family:var(--ff-eleg);font-style:italic;margin-top:12px">"${r.frase}"</p>`;
  }

  function initTerritory(root) {
    const info = root.querySelector("#mapInfo");
    const stage = root.querySelector("#leafletMap");
    if (!info || !stage) return;

    /* ---- Fallback offline: sem Leaflet, usa o mapa estilizado em SVG ---- */
    if (!window.L) {
      stage.outerHTML = territoryMapSVG();
      const svg = root.querySelector("#territorySvg");
      const tb = root.querySelector("#mapToolbar"); if (tb) tb.style.display = "none";
      const select = id => {
        svg.querySelectorAll(".region").forEach(g => g.classList.toggle("sel", g.dataset.id === String(id)));
        showRegionInfo(info, REGIONS.find(x => x.id === id));
      };
      svg.querySelectorAll(".region").forEach(g => {
        g.addEventListener("click", () => select(parseInt(g.dataset.id,10)));
        g.addEventListener("keydown", e => { if (e.key==="Enter"||e.key===" "){ e.preventDefault(); select(parseInt(g.dataset.id,10)); }});
      });
      select(3);
      return;
    }

    /* ---- Mapa real com Leaflet ---- */
    const L = window.L;
    const map = L.map(stage, { zoomControl:true, scrollWheelZoom:true, attributionControl:true });
    L.tileLayer("https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png", {
      subdomains:"abc", maxZoom:19,
      attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
    }).addTo(map);

    function icon(kind, label) {
      return L.divIcon({ className:"mk-wrap", html:`<span class="mk mk-${kind}">${label}</span>`, iconSize:[26,26], iconAnchor:[13,13], popupAnchor:[0,-12] });
    }

    /* Regiões — usa limites reais (window.REGIOES_GEO) ou cai nos retângulos aproximados */
    const regioes = L.featureGroup();
    const regById = {}; REGIONS.forEach(r => regById[r.id] = r);
    const baseStyle = r => r.id === 7
      ? { color:r.cor, weight:2, dashArray:"2 4", fillColor:r.cor, fillOpacity:0.22, opacity:0.9 } // complexos: hachura densa
      : { color:r.cor, weight:2, dashArray:"7 6", fillColor:r.cor, fillOpacity:0.12, opacity:0.85 };

    function wireRegion(layer, r) {
      const base = baseStyle(r);
      layer.bindTooltip(`<b>${String(r.id).padStart(2,"0")} · ${r.nome}</b><br>${r.controle}`, { sticky:true, className:"barao-tt" });
      layer.on("mouseover", () => layer.setStyle({ fillOpacity:Math.min(0.45, base.fillOpacity+0.18), weight:3 }));
      layer.on("mouseout",  () => layer.setStyle({ fillOpacity:base.fillOpacity, weight:2 }));
      layer.on("click", () => { showRegionInfo(info, r); map.fitBounds(layer.getBounds().pad(0.25)); });
    }

    if (window.REGIOES_GEO) {
      L.geoJSON(window.REGIOES_GEO, {
        style: f => baseStyle(regById[f.properties.id]),
        onEachFeature: (f, layer) => { const r = regById[f.properties.id]; if (r) wireRegion(layer, r); }
      }).eachLayer(l => l.addTo(regioes));
    } else {
      REGIONS.forEach(r => {
        const poly = L.polygon(REGION_POLYS[r.id], baseStyle(r));
        wireRegion(poly, r);
        poly.addTo(regioes);
      });
    }

    /* Pontos de jogo do bicho */
    const bicho = L.layerGroup();
    BICHO_POINTS.forEach(p => {
      const m = L.marker([p.lat,p.lng], { icon:icon("bicho","$") });
      m.bindTooltip(p.n, { direction:"top", offset:[0,-10], className:"barao-tt" });
      m.bindPopup(`<div class="pop"><span class="pop-kind bicho">PONTO DE BICHO</span>
        <h5>${p.n}</h5>
        <div class="pop-row"><span>Bairro</span><b>${p.local}</b></div>
        <div class="pop-row"><span>Tipo</span><b>${p.tipo}</b></div>
        <div class="pop-row"><span>Lucro líquido</span><b class="g">${p.lucro}</b></div>
        <div class="pop-row"><span>Exposição</span><b>${p.exp}/10</b></div></div>`, { className:"barao-popup" });
      m.addTo(bicho);
    });

    /* Milícia */
    const milicia = L.layerGroup();
    MILICIA_POINTS.forEach(p => {
      const m = L.marker([p.lat,p.lng], { icon:icon("milicia","▣") });
      m.bindTooltip("Milícia · "+p.n, { direction:"top", offset:[0,-10], className:"barao-tt" });
      m.bindPopup(`<div class="pop"><span class="pop-kind milicia">MILÍCIA</span>
        <h5>${p.n}</h5><p>${p.det}</p>
        <div class="pop-row"><span>Proteção</span><b class="g">R$ 5–30 mil/mês</b></div></div>`, { className:"barao-popup" });
      m.addTo(milicia);
    });

    /* Facção */
    const faccao = L.layerGroup();
    FACCAO_POINTS.forEach(p => {
      const m = L.marker([p.lat,p.lng], { icon:icon("faccao","✊") });
      m.bindTooltip(p.fac+" · "+p.n, { direction:"top", offset:[0,-10], className:"barao-tt" });
      m.bindPopup(`<div class="pop"><span class="pop-kind faccao">FACÇÃO · ${p.fac}</span>
        <h5>${p.n}</h5><p>${p.det}</p>
        <div class="pop-row"><span>Taxa</span><b class="g">25–30% da renda</b></div></div>`, { className:"barao-popup" });
      m.addTo(faccao);
    });

    regioes.addTo(map); bicho.addTo(map); milicia.addTo(map); faccao.addTo(map);
    map.fitBounds(regioes.getBounds().pad(0.05));
    setTimeout(() => map.invalidateSize(), 250);

    /* Filtros de camada (checkboxes do toolbar) */
    const layers = { regioes, bicho, milicia, faccao };
    root.querySelectorAll("#mapToolbar .mt-toggle").forEach(lbl => {
      const key = lbl.dataset.layer, cb = lbl.querySelector("input");
      cb.addEventListener("change", () => {
        if (cb.checked) map.addLayer(layers[key]); else map.removeLayer(layers[key]);
      });
    });

    showRegionInfo(info, REGIONS.find(x => x.id === 3)); // começa na Zona Norte
  }

  /* ============================================================
     NAVEGAÇÃO / ROUTER
     ============================================================ */

  function buildNav() {
    const nav = document.getElementById("nav");
    const groups = [];
    SECTIONS.forEach(s => {
      let grp = groups.find(g => g.name === s.group);
      if (!grp) { grp = { name:s.group, items:[] }; groups.push(grp); }
      grp.items.push(s);
    });
    nav.innerHTML = groups.map(g => `
      <div class="nav-group">
        <div class="nav-group-title">${g.name}</div>
        ${g.items.map(s => `<a href="#${s.id}" data-id="${s.id}"><span class="ix">${s.ix}</span>${s.label}</a>`).join("")}
      </div>`).join("");
  }

  function setActive(id) {
    document.querySelectorAll("#nav a").forEach(a => a.classList.toggle("active", a.dataset.id === id));
  }

  function route() {
    const id = (location.hash || "#capa").slice(1);
    const sec = SECTIONS.find(s => s.id === id) || SECTIONS[0];
    const content = document.getElementById("content");
    content.innerHTML = sec.render();
    setActive(sec.id);
    // inicializa widgets da seção
    if (sec.id === "sistema") initDiceRoller(content);
    if (sec.id === "territorio") initTerritory(content);
    // foco e topo
    window.scrollTo({ top:0, behavior:"instant" in window ? "instant" : "auto" });
    content.focus({ preventScroll:true });
    closeSidebar();
  }

  /* ---------- sidebar mobile ---------- */
  function openSidebar(){ document.getElementById("sidebar").classList.add("open"); document.getElementById("sidebarBackdrop").classList.add("show"); }
  function closeSidebar(){ document.getElementById("sidebar").classList.remove("open"); document.getElementById("sidebarBackdrop").classList.remove("show"); }

  /* ---------- progresso + to top ---------- */
  function onScroll() {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    const pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
    document.getElementById("readingBar").style.width = pct + "%";
    document.getElementById("toTop").classList.toggle("show", h.scrollTop > 400);
  }

  /* ---------- init ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    buildNav();
    route();
    window.addEventListener("hashchange", route);
    window.addEventListener("scroll", onScroll, { passive:true });
    document.getElementById("navToggle").addEventListener("click", () => {
      const sb = document.getElementById("sidebar");
      sb.classList.contains("open") ? closeSidebar() : openSidebar();
    });
    document.getElementById("sidebarBackdrop").addEventListener("click", closeSidebar);
    document.getElementById("toTop").addEventListener("click", () => window.scrollTo({ top:0, behavior:"smooth" }));
  });
})();
