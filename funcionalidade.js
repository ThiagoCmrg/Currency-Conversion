///API DAS BANDEIRAS
document.getElementById('from-currency-select').addEventListener('change', function() {
  const paisSelecionado = this.value;
  const imgElement = document.getElementById('from-flag');

  const flags = {
    'USD': 'https://flagsapi.com/US/flat/64.png',
    'BRL': 'https://flagsapi.com/BR/flat/64.png',
    'EUR': 'https://flagsapi.com/DE/flat/64.png',
    'JPY': 'https://flagsapi.com/JP/flat/64.png',
    'ZAR': 'https://flagsapi.com/ZA/flat/64.png',
    'AUD': 'https://flagsapi.com/AU/flat/64.png',
    'ARS': 'https://flagsapi.com/AR/flat/64.png',
    'CAD': 'https://flagsapi.com/CA/flat/64.png',
  };
  imgElement.src = flags[paisSelecionado] || '';
});

document.getElementById('to-currency-select').addEventListener('change', function() {
  const paisSelecionado = this.value;
  const imgElement = document.getElementById('to-flag');

  const flags = {
    'USD': 'https://flagsapi.com/US/flat/64.png',
    'BRL': 'https://flagsapi.com/BR/flat/64.png',
    'EUR': 'https://flagsapi.com/DE/flat/64.png',
    'JPY': 'https://flagsapi.com/JP/flat/64.png',
    'ZAR': 'https://flagsapi.com/ZA/flat/64.png',
    'AUD': 'https://flagsapi.com/AU/flat/64.png',
    'ARS': 'https://flagsapi.com/AR/flat/64.png',
    'CAD': 'https://flagsapi.com/CA/flat/64.png',
  };
  imgElement.src = flags[paisSelecionado] || '';
});


//API DAS COTAÇÕES

// Função para fazer a requisição e processar as cotações
const request = function(callback) {
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
    'BRL': 'BRLUSD',
  };
  return json[chaves[moeda]] || null;
};

// Função para converter valor entre duas moedas e mostrar a data de atualização(Chamar a função apertando enter)
document.getElementById('valor').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    const valor = parseFloat(this.value);
    const deMoeda = document.getElementById('from-currency-select').value;
    const paraMoeda = document.getElementById('to-currency-select').value;

    request(function(json) {
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


    // Exibir a data de atualização das cotações
    const formattedDate = cotacaoDe.create_date;
    document.querySelector('.Atualizacao center').innerText = `Cotação atualizada em: ${formattedDate}`;
  } else {
    console.log('Erro ao obter cotações para conversão');
  }
};