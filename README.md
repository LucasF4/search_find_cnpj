<div align="center">
    <img src="./icon.gif" width="300px" />
</div>

# SEARCH FIND CNPJ

Projeto desenvolvido apenas com a ideia de facilitar as consultas de CNPJ e retornar os dados de forma mais filtrada possível com o seu nível de importância. Também é uma ideia de fazer os códigos dos desenvolvedores mais limpos, declarando apenas uma classe e inserindo as informações necessárias no construtor, sem o uso de fetch no código principal.

## Documentação
> https://github.com/LucasF4/search_find_cnpj/blob/main/README.md
>
> https://www.npmjs.com/package/search_find_cnpj

Node Version Required v18+

### Instalação

```
    npm install search_find_cnpj
```

### Como usar

Através do construtor
```
    const Cnpj = require('search_find_cnpj')

    const cnpj = new Cnpj(99999999999999)
```
Versão 1.0.4:<br>
Por meio de funções
```
    const Cnpj = require('search_find_cnpj)
    const cnpj = new Cnpj()

    cnpj.setCnpj("99.999.999/9999-99")
```

Apenas com essa declaração, você consegue realizar a consulta do seu CNPJ.
Você pode informar tanto uma string como um número inteiro.

### Obtendo retorno

```
    cnpj.consulta()
    .then(console.log)

    // RETORNO
    {
        abertura: '11/03/2014',
        situacao: 'ATIVA',
        last_att: '2024-06-14T19:34:28.209Z',
        razaoSocial: 'RAZAO SOCIAL',
        fantasia: '',
        atividade_principal: 'Comércio varejista de produtos fictícios',
        status: 'OK'
    }
```

Você obterá como resposta esse objeto que é padrão, mas poderá adicionar campos adicionais conforme consta nesta documentação.

Informando parâmetros pelo construtor
```
    const cnpj = new Cnpj("seu cnpj aqui",
    {
        endereco: "completo",
        cep: true,
        atividades_secundarias: true
    })

    cnpj.consulta()
    .then(console.log)

    // RETORNO
    {
        
        abertura: '11/03/2014',
        situacao: 'ATIVA',
        last_att: '2024-06-14T19:34:28.209Z',
        razaoSocial: 'RAZAO SOCIAL',
        fantasia: '',
        atividade_principal: 'Comércio varejista de produtos fictícios',
        status: 'OK',
        atividades_secundarias: [
            'Comércio varejista de mercadorias legais',
            'Comércio varejista de cosméticos sensacionais',
            'Comércio varejista de produtos saneantes',
            'Atividades de profissionais da área de tecnologia'
        ],
        endereco: 'endereço completo aqui',
        cep: '40.028-922'
    }
```

Versão 1.0.4:<br>
Informando parâmetros por funções
```
    const cnpj = new Cnpj()

    cnpj
        .setCnpj("99999999999999")
        .setParams(
            {
                endereco: "completo",
                cep: true,
                atividades_secundarias: true
            }
        )

    cnpj.consulta()
    .then(console.log)

    // RETORNO
    {
        
        abertura: '11/03/2014',
        situacao: 'ATIVA',
        last_att: '2024-06-14T19:34:28.209Z',
        razaoSocial: 'RAZAO SOCIAL',
        fantasia: '',
        atividade_principal: 'Comércio varejista de produtos fictícios',
        status: 'OK',
        atividades_secundarias: [
            'Comércio varejista de mercadorias legais',
            'Comércio varejista de cosméticos sensacionais',
            'Comércio varejista de produtos saneantes',
            'Atividades de profissionais da área de tecnologia'
        ],
        endereco: 'endereço completo aqui',
        cep: '40.028-922'
    }
```

Após adicionar na classe dois campos `cep` e `atividades_secundarias` como verdadeiros, eles também são retornados na consulta, ficando a critério do desenvolvedor adicioná-los ou não. No caso do campo `endereco` foi definido como **"completo"**, assim você obterá a resposta com todas as informações de endereço completa, caso você retorne como **individual**, ele montará um objeto com os campos `logradouro, numero, municipio e uf` com seus respectivos valores.<br> 
Esses campos não são obrigatórios!

### Considerações

Foi utilizado a API da receita para realizar a consulta dos CNPJ, portanto toda aplicação terá até **3 consultas livres no período de 1 minuto**.

O intuito dessa lib é apenas deixar seu código limpo e realizar as consultas de forma mais facilitada.

### Parâmetros
```
    {
        cnpj: true,
        cep: true,
        atividades_secundarias: true,
        tipo: true,
        natureza_juridica: true,
        endereco: "completo" / "individual" (Escolher apenas um dos dois),
        telefone: true,
        email: true,
        capital_social: true
    }
```

### Benefícios
- Também trás alguns benefícios de testes, no que evita com que lance consultas desnecessárias, onde a receita não realiza esses tratamentos e conta o retorno mal sucedido como uma consulta, fazendo você perder 1 de 3 consultas por minuto.

- Utilizando a CNPJ Promise, você não terá esse problema pois antes da consulta, caso o CNPJ seja enviado incorretamente, entrará em um tratamento e retornará erro sem ao menos passar pela consulta.

- Realiza a filtragem de dados desnecessários, evitando um retorno de dados enorme que vem por padrão pela receita, permitindo com que o próprio desenvolvedor escolha quais campos serão retornados na sua consulta.

### Pontos Negativos

- Limita por 3 consultas por minuto, plano gratuito da receitaws.
