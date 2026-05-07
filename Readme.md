# Sistema de Gerenciamento de Banco de Itens

Este documento apresenta a estrutura, as funcionalidades e a base tecnológica do sistema de Banco de Itens (Questões) desenvolvido como uma solução modular para gestão pedagógica. O objetivo principal do projeto é centralizar, organizar e facilitar o acesso ao acervo de itens de avaliação, permitindo que professores e gestores localizem, visualizem e exportem materiais de forma eficiente.

## Sobre o Autor

**Saulo Augusto Coimbra Santos da Silva**  
Mestre em Educação Matemática e Tecnológica (Edumatec/UFPE) e Licenciado em Matemática pela mesma instituição. Possuo uma trajetória consolidada na intersecção entre pedagogia e tecnologia, atuando hoje como Técnico Formador Pedagógico e docente na Educação de Jovens e Adultos (EJA). Sou movido pela resolução de problemas complexos e pelo desenvolvimento de soluções criativas que otimizem a didática da matemática. Tenho como foco constante a investigação de novas metodologias e ferramentas que facilitem a democratização do conhecimento.

---

## 1. Descrição Geral do Sistema

O sistema atua como uma interface inteligente integrada a uma base de dados no Google Planilhas. Ele processa informações originadas de formulários e as organiza em uma aplicação web intuitiva, dividida em módulos principais, cada um voltado para uma necessidade específica do cotidiano educacional.

## 2. Funcionalidades por Módulo (Abas)

### 2.1 Início e Filtragem (Módulo 1)
Este é o módulo central de busca e visualização. Ele oferece as seguintes capacidades:
- **Pesquisa Multicritério**: Localização de questões por disciplina (Matemática ou Português), descritor da matriz de referência e nível de dificuldade (Elementar, Básico ou Desejável).
- **Busca Textual**: Campo de busca livre para encontrar palavras-chave no enunciado, comando ou suporte da questão.
- **Visualização Dinâmica**: Exibição completa das questões, incluindo textos de suporte, imagens integradas e alternativas (texto ou imagem).
- **Gestão de Seleção**: Ferramenta para selecionar questões individualmente ou em lote para exportação imediata.
- **Ações Administrativas**: Usuários autorizados visualizam botões para edição de conteúdo e exclusão de itens diretamente na interface.

### 2.2 Gerador de Simulado (Módulo 2)
Voltado para a criação rápida de avaliações personalizadas:
- **Seleção por Descritor**: Permite escolher múltiplos descritores de uma mesma disciplina.
- **Customização de Quantidade**: O usuário define quantas questões deseja incluir para cada descritor selecionado.
- **Sorteio Aleatório**: O sistema seleciona aleatoriamente as questões dentro dos critérios definidos, garantindo diversidade nos simulados gerados.

### 2.3 Teste Diagnóstico (Módulo 3)
Módulo especializado em avaliações de nivelamento:
- **Estruturação por Níveis**: Ao selecionar um descritor, o sistema busca automaticamente três questões distintas que representem os níveis Elementar, Básico e Desejável.
- **Equilíbrio Pedagógico**: Garante que o teste cubra toda a gradação de complexidade de uma habilidade específica.

### 2.4 Navegação por Temas - Matriz SAEPE (Módulo 4)
Uma visão organizada da estrutura pedagógica:
- **Hierarquia de Habilidades**: Exibe a árvore completa de descritores das matrizes de Matemática e Português.
- **Integração Direta**: Ao clicar em uma habilidade, o sistema redireciona o usuário para o módulo de filtros, exibindo apenas as questões correspondentes àquele tema.

### 2.5 Painel de Estatísticas (Módulo 5)
Módulo de auditoria e monitoramento do acervo:
- **Indicadores Gerais**: Exibição do total de questões cadastradas e divisão quantitativa por disciplina.
- **Distribuição de Desempenho**: Gráfico de barras que mostra o equilíbrio do banco entre os níveis Elementar (Vermelho), Básico (Laranja) e Desejável (Verde).
- **Detalhamento Analítico**: Tabela completa que lista cada descritor e a quantidade de questões disponíveis em cada nível de dificuldade, com ferramenta de busca rápida.

### 2.6 Configurações e Administração (Módulo 6)
Controle de acesso e segurança do sistema:
- **Gestão de Usuários**: Sistema de níveis de acesso (Master e Administrador). Somente o usuário Master pode remover outros administradores.
- **Controle de Permissões**: Gerenciamento de e-mails autorizados a realizar edições no banco de dados.
- **Auditoria de Logs**: Registro detalhado de todas as ações importantes realizadas (quem editou, o que foi excluído e quando), garantindo a rastreabilidade das informações.

## 3. Recursos de Exportação

O sistema possui uma barra de exportação flutuante que permite converter as questões selecionadas para o formato Microsoft Word (.docx):
- **Modo Aluno**: Gera um documento formatado com cabeçalho escolar oficial, sem gabaritos e sem metadados pedagógicos.
- **Modo Professor**: Gera o documento com gabaritos inclusos e identificação completa de descritores e níveis de dificuldade para cada questão.

## 4. Informações Técnicas

Esta seção detalha as tecnologias utilizadas para a sustentação do sistema.

### 4.1 Arquitetura e Linguagens
- **Ambiente de Execução**: Google Apps Script (GAS).
- **Linguagem Base**: JavaScript (ES6+).
- **Interface**: HTML5 estrutural e CSS3 para estilização (Vanilla CSS, sem bibliotecas externas para garantir leveza).
- **Banco de Dados**: Google Sheets (Planilhas Google), utilizando a aba "Resposta" como fonte primária.

### 4.2 Segurança e Acesso
- **Autenticação**: Integrada à Conta Google do usuário.
- **Validação Server-side**: Todas as operações de edição (Escrita, Atualização e Exclusão) possuem validação dupla no servidor, impedindo que usuários sem permissão manipulem os dados, mesmo que tentem alterar o código no navegador.
- **Proteção de Dados**: O sistema utiliza o serviço `Session.getActiveUser()` para identificar o operador de cada ação.

### 4.3 Bibliotecas Externas Utilizadas
- **html-docx-js**: Responsável pela conversão dinâmica do DOM HTML para o formato OpenXML (.docx).
- **FileSaver.js**: Utilizada para gerenciar o download dos arquivos gerados diretamente pelo navegador do usuário.
- **Google Drive Thumbnails**: O sistema processa IDs de arquivos do Drive para gerar miniaturas de imagens em tempo real.
