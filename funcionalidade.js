///API DAS BANDEIRAS
document.getElementById('from-currency-select').addEventListener('change', function() {
  const paisSelecionado = this.value;
  const imgElement = document.getElementById('from-flag');

  switch (paisSelecionado) {
      case 'USD':
          imgElement.src = 'https://flagsapi.com/US/flat/64.png'; 
          break;
      case 'BRL':
          imgElement.src = 'https://flagsapi.com/BR/flat/64.png'; 
          break;
      case 'EUR':
          imgElement.src = 'https://flagsapi.com/DE/flat/64.png'; 
          break;
      case 'JPY':
          imgElement.src = 'https://flagsapi.com/JP/flat/64.png'; 
          break;
      case 'ZAR':
          imgElement.src = 'https://flagsapi.com/ZA/flat/64.png'; 
          break;
      case 'AUD':
          imgElement.src = 'https://flagsapi.com/AU/flat/64.png'; 
          break;
      case 'ARS':
          imgElement.src = 'https://flagsapi.com/AR/flat/64.png'; 
          break;
      case 'CAD':
          imgElement.src = 'https://flagsapi.com/CA/flat/64.png'; 
          break;
      default:
          imgElement.src = ''; 
          break;
  }
});

document.getElementById('to-currency-select').addEventListener('change', function() {
  const paisSelecionado = this.value;
  const imgElement = document.getElementById('to-flag');

  switch (paisSelecionado) {
      case 'USD':
          imgElement.src = 'https://flagsapi.com/US/flat/64.png'; 
          break;
      case 'BRL':
          imgElement.src = 'https://flagsapi.com/BR/flat/64.png'; 
          break;
      case 'EUR':
          imgElement.src = 'https://flagsapi.com/DE/flat/64.png'; 
          break;
      case 'JPY':
          imgElement.src = 'https://flagsapi.com/JP/flat/64.png'; 
          break;
      case 'ZAR':
          imgElement.src = 'https://flagsapi.com/ZA/flat/64.png'; 
          break;
      case 'AUD':
          imgElement.src = 'https://flagsapi.com/AU/flat/64.png';
          break;
      case 'ARS':
          imgElement.src = 'https://flagsapi.com/AR/flat/64.png'; 
          break;
      case 'CAD':
          imgElement.src = 'https://flagsapi.com/CA/flat/64.png'; 
          break;
      default:
          imgElement.src = ''; 
          break;
    }
});

//API DAS COTAÇÕES

// Função para fazer a requisição e processar as cotações
const obterCotacoes = function(callback) {
  const moedas = 'USD-BRL,EUR-BRL,JPY-BRL,ZAR-BRL,AUD-BRL,ARS-BRL,CAD-BRL,BRL-USD,BRL-EUR,BRL-JPY,BRL-ZAR,BRL-AUD,BRL-ARS,BRL-CAD';

  fetch(`https://economia.awesomeapi.com.br/last/${moedas}`)
    .then(response => response.json())
    .then(json => callback(json))
    .catch(error => console.error('Erro na requisição:', error));
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

// Função para converter valor entre duas moedas e mostrar a data de atualização(Chamar a função apertando enter)
document.getElementById('valor').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    const valor = parseFloat(this.value);
    const deMoeda = document.getElementById('from-currency-select').value;
    const paraMoeda = document.getElementById('to-currency-select').value;

    obterCotacoes(function(json) {
      converterMoedas(json, deMoeda, paraMoeda, valor);
    });
  }
});


// Modificando a função converterMoedas pra receber o valor fornecido pelo usuário
const converterMoedas = function(json, deMoeda, paraMoeda, valor) {
  const cotacaoDe = obterCotacao(json, deMoeda);
  const cotacaoPara = obterCotacao(json, paraMoeda);

  if (cotacaoDe && cotacaoPara) {
    const valorEmReal = deMoeda === 'BRL' ? valor : valor * cotacaoDe.bid;
    const valorConvertido = paraMoeda === 'BRL' ? valorEmReal : valorEmReal / cotacaoPara.bid;

    console.log(`${valor} ${deMoeda} = ${valorConvertido.toFixed(2)} ${paraMoeda}`);


    // Atualizar a interface com o valor convertido
    document.getElementById('converted-value').innerText = ` ${valorConvertido.toFixed(2)}`;


    // Exibir a data de atualização das cotações (em teste)
    const formattedDate = cotacaoDe.create_date;
    document.querySelector('.Atualizacao center').innerText = `Cotação atualizada em: ${formattedDate}`;
  } else {
    console.log('Erro ao obter cotações para conversão');
  }
};