const request = require('request');
const readline = require('readline');
const { format } = require('date-fns');
const { ptBR } = require('date-fns/locale'); // Importando o locale pt-BR para formatar em português



// Funcionalidades do JavaScript(botões))














// Função para formatar a data no padrão brasileiro
const formatarDataBrasileira = (data) => {
    return format(new Date(data), 'dd/MM/yyyy HH:mm:ss', { locale: ptBR });
  };
  // Criando uma interface para entrada do usuário
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  // Função para fazer a requisição e processar as cotações
  const obterCotacoes = function(callback) {
    const moedas = 'USD-BRL,EUR-BRL,JPY-BRL,ZAR-BRL,AUD-BRL,ARS-BRL,CAD-BRL,BRL-USD,BRL-EUR,BRL-JPY,BRL-ZAR,BRL-AUD,BRL-ARS,BRL-CAD';
  
    const options = {
      url: `https://economia.awesomeapi.com.br/last/${moedas}`,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    };
  
    const callback_todas_cotacoes = function(erro, res, body) {
      if (erro) {
        console.error('Erro na requisição:', erro);
        return;
      }
  
      try {
        let json = JSON.parse(body);
        callback(json);
      } catch (e) {
        console.error('Erro ao processar o JSON:', e);
      }
    };
  
    request(options, callback_todas_cotacoes);
  };
  
  // Função para obter a cotação de uma moeda específica
  const obterCotacao = function(json, moeda) {
    const chaves = {
      'USD': 'USDBRL',
      'EUR': 'EURBRL',
      'JPY': 'JPYBRL',
      'ZAR': 'ZARBRL',
      'AUD': 'AUDBRL',
      'ARS': 'ARSBRL',
      'CAD': 'CADBRL',
      'BRL': 'BRLUSD'
    };
  
    return json[chaves[moeda]] || null;
  };
  
  // Função para converter valor entre duas moedas e mostrar a data de atualização
  const converterMoedas = function(json, deMoeda, paraMoeda) {
    const valor = 1; // Valor fixo para conversão
    const cotacaoDe = obterCotacao(json, deMoeda);
    const cotacaoPara = obterCotacao(json, paraMoeda);
    
    if (cotacaoDe && cotacaoPara) {
      const valorEmReal = deMoeda === 'BRL' ? valor : valor * cotacaoDe.bid;
      const valorConvertido = paraMoeda === 'BRL' ? valorEmReal : valorEmReal / cotacaoPara.bid;
      console.log(`${valor} ${deMoeda} = ${valorConvertido.toFixed(2)} ${paraMoeda}`);
  
      // Exibir a data de atualização das cotações no formato brasileiro
      console.log(`Cotação atualizada em: ${formatarDataBrasileira(cotacaoDe.create_date)}`);
    } else {
      console.log('Erro ao obter cotações para conversão');
    }
  };
  
  // Pergunta ao usuário quais moedas ele deseja converter
  const perguntarConversao = function() {
    rl.question('Qual moeda você quer converter? (USD, EUR, JPY, ZAR, AUD, ARS, CAD, BRL): ', function(deMoeda) {
      rl.question('Qual moeda você quer converter (para)? (USD, EUR, JPY, ZAR, AUD, ARS, CAD, BRL): ', function(paraMoeda) {
        obterCotacoes(function(json) {
          converterMoedas(json, deMoeda.toUpperCase(), paraMoeda.toUpperCase());
          rl.close();
        });
      });
    });
  };
  
  // Iniciando o processo
  perguntarConversao();