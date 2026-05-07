# Manual de Implementação - Banco de Itens

Este guia explica como configurar e colocar em funcionamento o seu próprio sistema de Banco de Itens (Questões) utilizando Google Apps Script, Google Sheets e Google Forms.

## 1. Preparação da Planilha e Formulário

1. **Crie um Google Form**: Crie um formulário para a entrada de questões. Sugerimos os seguintes campos (na ordem):
   - Disciplina (Lista Suspensa)
   - Descritor (Texto Curto)
   - Nível (Lista Suspensa: Elementar, Básico, Desejável)
   - Enunciado (Texto Longo - HTML permitido)
   - Suporte (Link da imagem no Drive ou Texto)
   - Comando/Pergunta (Texto Curto)
   - Tipo de Alternativa (Lista Suspensa: texto, imagem)
   - Alternativa A (Link da imagem)
   - Alternativa B (Link da imagem)
   - Alternativa C (Link da imagem)
   - Alternativa D (Link da imagem)
   - Alternativa A (Texto)
   - Alternativa B (Texto)
   - Alternativa C (Texto)
   - Alternativa D (Texto)
   - Gabarito (Lista Suspensa: A, B, C, D)

   O resultado deverá ser **exatamente** este:

**Coluna A**: Carimbo de data/hora
**Coluna B**: Disciplina
**Coluna C**: Descritor
**Coluna D**: Nível
**Coluna E**: Enunciado
**Coluna F**: Suporte
**Coluna G**: Comando/Pergunta
**Coluna H**: Tipo de Alternativa
**Coluna I**: Alternativa A (imagem)
**Coluna J**: Alternativa B (imagem)
**Coluna K**: Alternativa C (imagem)
**Coluna L**: Alternativa D (imagem)
**Coluna M**: Alternativa A (texto)
**Coluna N**: Alternativa B (texto)
**Coluna O**: Alternativa C (texto)
**Coluna P**: Alternativa D (texto)
**Coluna Q**: Resposta do Item

2. **Vincule a uma Planilha**: No Google Forms, vá na aba "Respostas" e clique em "Link para as planilhas ou Ver no app Planilhas".

3. **Renomeie a Aba**: Na planilha criada, renomeie a aba de respostas de "Respostas do Formulário 1" para **"Resposta"**.

4. **Sobre as respostas no forms**: Cada resposta é um item. Se a questão não tiver imagem de suporte, deixe o campo em branco. Se não tiver imagens nas alternativas, preencha os campos de texto das alternativas (na aba resposta correspondem as colunas M a P).

5. **Crie a aba de Administradores**: Crie uma nova aba chamada **"Admins"** e na célula **A1** escreva `Email`.

## 2. Configuração do Script

1. Na sua planilha de respostas, vá em **Extensões > Apps Script**.
2. No editor de script, crie os seguintes arquivos (clicando no ícone `+` ao lado de "Arquivos"):
   - `Código.gs` (já existe um por padrão, pode renomear ou substituir o conteúdo)
   - `index.html`
   - `styles.html`
   - `scripts.html`
3. Copie o conteúdo de cada arquivo da pasta `banco_de_itens` deste repositório e cole nos respectivos arquivos criados no editor do Google.

## 3. Edições Necessárias antes de Rodar

Antes de publicar o sistema, você **DEVE** realizar as seguintes edições no arquivo `Código.gs`:

1. **E-mail de Administrador Master**:
   - Localize a linha: `const masterEmail = "[Digite Seu E-mail de Administrador]";`
   - Substitua `[Digite Seu E-mail de Administrador]` pelo seu e-mail do Google (o mesmo que você usa para acessar a planilha).

2. **Permissões**:
   - Ao rodar qualquer função pela primeira vez, o Google pedirá autorização. Conceda as permissões necessárias.

## 4. Publicação

1. No editor de script, clique no botão azul **Implantar > Nova implantação**.
2. Selecione o tipo **App da Web**.
3. Em "Descrição", coloque algo como "Versão Inicial".
4. Em "Executar como", selecione **Você**.
5. Em "Quem pode acessar", selecione **Qualquer pessoa** (ou "Qualquer pessoa com conta Google", dependendo da sua necessidade de segurança).
6. Clique em **Implantar**.
7. Copie a **URL do App da Web** gerada. Este é o link que você e seus usuários usarão para acessar o sistema.

## 5. Dicas de Uso

- **Imagens do Drive**: Para usar imagens como suporte ou alternativas, certifique-se de que o arquivo no Google Drive esteja com a permissão de compartilhamento definida como "Qualquer pessoa com o link pode ler".
- **Logs**: O sistema criará automaticamente uma aba "Logs" na sua planilha para registrar as ações dos administradores.
