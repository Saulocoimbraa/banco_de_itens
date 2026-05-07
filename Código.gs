// Esta função é chamada quando a URL pública do Web App é acessada
function doGet() {
  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL) // Permite incorporar em outros sites
    .setTitle("Banco de Questões"); // Título da aba do navegador
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

// Esta função carrega e formata as questões da planilha
function getQuestoes() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const aba = ss.getSheetByName("Resposta");
  if (!aba) return [];
  const dados = aba.getDataRange().getValues();
  const questoes = [];

  for (let i = 1; i < dados.length; i++) {
    const linha = dados[i];
    // Col A (0) = Timestamp, Col B (1) = Disciplina ... Col Q (16) = Gabarito
    const tipo = (linha[7] || "").toString().trim().toLowerCase(); 

    const questao = {
      numero: i,
      disciplina: linha[1] || "",
      descritor: linha[2] || "",
      nivel: linha[3] || "",
      enunciado: linha[4] || "",
      suporte: tratarLinkSuporte(linha[5] || ""),
      comando: linha[6] || "",
      tipo: tipo,
      A: "", B: "", C: "", D: "",
      gabarito: linha[16] || ""
    };

    if (tipo === "imagem") {
      questao.A = imagemIDParaURL(linha[8] || "");
      questao.B = imagemIDParaURL(linha[9] || "");
      questao.C = imagemIDParaURL(linha[10] || "");
      questao.D = imagemIDParaURL(linha[11] || "");
    } else {
      questao.A = linha[12] || "";
      questao.B = linha[13] || "";
      questao.C = linha[14] || "";
      questao.D = linha[15] || "";
    }
    questoes.push(questao);
  }
  return questoes;
}

//Ajusta Campo Suporte
function tratarLinkSuporte(link) {
  if (typeof link === "string") {
    // Formato: https://drive.google.com/open?id=ID
    if (link.includes("drive.google.com/open?id=")) {
      return link.replace("drive.google.com/open?id=", "lh3.googleusercontent.com/d/");
    }

    // Formato: https://drive.google.com/file/d/ID/view
    const match = link.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w600`;
    }
  }
  return link;
}


// Converte link do Google Drive para miniatura com base no ID
function imagemIDParaURL(link) {
  if (!link) return ""; // Se for vazio, retorna vazio
  const match = link.match(/id=([\w-]+)/); // Extrai o ID do link
  return match ? `https://drive.google.com/thumbnail?id=${match[1]}` : link;
}

// Extrai ID de imagem do Google Drive (alias para imagemIDParaURL)
function extrairIdImagem(link) {
  return imagemIDParaURL(link);
}

// Retorna os filtros únicos de Disciplina, Descritor e Nível
function getFiltros() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const aba = ss.getSheetByName("Resposta");
  const dados = aba.getDataRange().getValues();

  const disciplinas = new Set();
  const descritores = new Set();
  const niveis = new Set();

  for (let i = 1; i < dados.length; i++) {
    if (dados[i][1]) disciplinas.add(dados[i][1]); // Col B
    if (dados[i][2]) descritores.add(dados[i][2]); // Col C
    if (dados[i][3]) niveis.add(dados[i][3]);      // Col D
  }

  return {
    disciplinas: Array.from(disciplinas).sort(),
    descritores: Array.from(descritores).sort(),
    niveis: Array.from(niveis).sort()
  };
}

// Retorna dados do usuário e permissões
function getUserData() {
  const email = Session.getActiveUser().getEmail() || "anonimo";
  const masterEmail = "[Digite Seu E-mail de Administrador]";
  
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let abaAdmins = ss.getSheetByName("Admins");
  if (!abaAdmins) {
    abaAdmins = ss.insertSheet("Admins");
    abaAdmins.appendRow(["Email"]);
    abaAdmins.getRange(1, 1).setFontWeight("bold");
    abaAdmins.appendRow([masterEmail]);
  }
  
  const admins = abaAdmins.getDataRange().getValues().flat().map(e => e.toString().toLowerCase().trim());
  
  return {
    email: email,
    isAdmin: admins.includes(email.toLowerCase()) || email.toLowerCase() === masterEmail,
    isMaster: email.toLowerCase() === masterEmail
  };
}

// Retorna lista de administradores
function getListaAdmins() {
  const userData = getUserData();
  if (!userData.isAdmin) throw new Error("Acesso negado.");
  
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const aba = ss.getSheetByName("Admins");
  if (!aba) return [];
  return aba.getDataRange().getValues().slice(1).flat().filter(String);
}

// Adiciona um administrador
function adicionarAdmin(novoEmail) {
  const userData = getUserData();
  if (!userData.isAdmin) throw new Error("Acesso negado.");
  
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let aba = ss.getSheetByName("Admins");
  const emailLimpo = novoEmail.toString().toLowerCase().trim();
  
  const lista = aba.getDataRange().getValues().flat();
  if (lista.includes(emailLimpo)) return "Usuário já é administrador.";
  
  aba.appendRow([emailLimpo]);
  registrarLog("ADICIONAR_ADMIN", "Novo admin: " + emailLimpo);
  return "Administrador adicionado com sucesso!";
}

// Remove um administrador
function removerAdmin(emailRemover) {
  const userData = getUserData();
  if (!userData.isMaster) throw new Error("Apenas o usuário master pode remover administradores.");
  
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const aba = ss.getSheetByName("Admins");
  const dados = aba.getDataRange().getValues();
  const emailLimpo = emailRemover.toString().toLowerCase().trim();
  
  if (emailLimpo === "[Digite Seu E-mail de Administrador]") {
    throw new Error("O usuário master não pode ser removido.");
  }

  for (let i = 1; i < dados.length; i++) {
    if (dados[i][0].toString().toLowerCase().trim() === emailLimpo) {
      aba.deleteRow(i + 1);
      registrarLog("REMOVER_ADMIN", "Admin removido: " + emailLimpo);
      return "Administrador removido com sucesso!";
    }
  }
  return "Usuário não encontrado.";
}

/**
 * CRUD DE QUESTÕES
 */

function salvarQuestao(dadosQuestao) {
  const userData = getUserData();
  if (!userData.isAdmin) throw new Error("Acesso negado.");
  
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const aba = ss.getSheetByName("Resposta");
  
  const novaLinha = [
    dadosQuestao.disciplina,
    dadosQuestao.descritor,
    dadosQuestao.nivel,
    dadosQuestao.enunciado,
    dadosQuestao.suporte,
    dadosQuestao.comando,
    dadosQuestao.tipo,
    dadosQuestao.A_img || "",
    dadosQuestao.B_img || "",
    dadosQuestao.C_img || "",
    dadosQuestao.D_img || "",
    dadosQuestao.A_txt || "",
    dadosQuestao.B_txt || "",
    dadosQuestao.C_txt || "",
    dadosQuestao.D_txt || "",
    dadosQuestao.gabarito
  ];

  if (dadosQuestao.numero && dadosQuestao.numero > 0) {
    const rowIdx = parseInt(dadosQuestao.numero) + 1;
    // Edição: Escreve a partir da coluna 2 (B) para não apagar o Timestamp original
    aba.getRange(rowIdx, 2, 1, novaLinha.length).setValues([novaLinha]);
    registrarLog("EDITAR_QUESTAO", "Linha " + rowIdx);
    return "Questão atualizada com sucesso!";
  } else {
    // Nova: Adiciona data na Col A e dados a partir da B
    aba.appendRow([new Date(), ...novaLinha]);
    registrarLog("CRIAR_QUESTAO", "Nova questão em " + dadosQuestao.disciplina);
    return "Questão cadastrada com sucesso!";
  }
}

function excluirQuestao(numero) {
  const userData = getUserData();
  if (!userData.isAdmin) throw new Error("Acesso negado.");
  
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const aba = ss.getSheetByName("Resposta");
  const rowIdx = parseInt(numero) + 1;
  
  aba.deleteRow(rowIdx);
  registrarLog("EXCLUIR_QUESTAO", "Linha removida: " + rowIdx);
  return "Questão excluída com sucesso!";
}

/**
 * Registra uma ação na aba "Logs" da planilha para auditoria
 */
function registrarLog(acao, detalhes) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let aba = ss.getSheetByName("Logs");
    if (!aba) {
      aba = ss.insertSheet("Logs");
      aba.appendRow(["Data/Hora", "Usuário", "Ação", "Detalhes"]);
      aba.getRange(1, 1, 1, 4).setFontWeight("bold").setBackground("#f3f3f3");
    }
    const user = Session.getActiveUser().getEmail() || "Anônimo";
    aba.appendRow([new Date(), user, acao, detalhes || ""]);
  } catch (e) {
    console.error("Erro ao registrar log: " + e.toString());
  }
}
