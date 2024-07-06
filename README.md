<div align="center">
    <img src="./icon.gif" width="250x" />
</div>

# SEARCH FIND CNPJ

Projeto desenvolvido apenas com a ideia de facilitar as consultas de CNPJ e retornar os dados de forma mais filtrada possível com o seu nível de importância. Também é uma ideia de fazer os códigos dos desenvolvedores mais limpos, declarando apenas uma classe e inserindo as informações necessárias no construtor, sem o uso de fetch no código principal.

### Como usar

```
    
    const Cnpj = require('search_find_cnpj')

    const cnpj = new Cnpj(27865757000102)
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
        atividades_secundarias: [
            'Comércio varejista de mercadorias legais',
            'Comércio varejista de cosméticos sensacionais',
            'Comércio varejista de produtos saneantes',
            'Atividades de profissionais da área de tecnologia'
        ]
    }
```

Você obterá como resposta esse objeto que é padrão, mas poderá adicionar campos adicionais conforme consta nesta documentação.

```
    const cnpj = new Cnpj("seu cnpj aqui",
    {
        cnpj: true,
        cep: true
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
        atividades_secundarias: [
            'Comércio varejista de mercadorias legais',
            'Comércio varejista de cosméticos sensacionais',
            'Comércio varejista de produtos saneantes',
            'Atividades de profissionais da área de tecnologia'
        ],
        cnpj: 'seu cnpj também vem aqui',
        cep: '40.028-922'
    }
```

Após adicionar na classe dois campos `cnpj` e `cep` como verdadeiros, eles também são retornados na consulta, ficando a critério do desenvolvedor adicioná-los ou não. Esses campos não são obrigatórios!

### Considerações

Foi utilizado a API da receita para realizar a consulta dos CNPJ, portanto toda aplicação terá até **3 consultas livres no período de 1 minuto**.

O intuito dessa lib é apenas deixar seu código limpo e realizar as consultas de forma mais facilitada.

### Benefícios
- Também trás alguns benefícios de testes, no que evita com que lance consultas desnecessárias, onde a receita não realiza esses tratamentos e conta o retorno mal sucedido como uma consulta, fazendo você perder 1 de 3 consultas por minuto.

- Utilizando a CNPJ Promise, você não terá esse problema pois antes da consulta, caso o CNPJ seja enviado incorretamente, entrará em um tratamento e retornará erro sem ao menos passar pela consulta.

- Realiza a filtragem de dados desnecessários, evitando um retorno de dados enorme que vem por padrão pela receita, permitindo com que o próprio desenvolvedor escolha quais campos serão retornados na sua consulta.

### Pontos Negativos

- Limita por 3 consultas por minuto, plano gratuito da receitaws.

- Limitações no retorno. Até o momento dessa versão **(v1)**, apenas estará disponíveis os campos `cnpj, cep` na filtragem.
