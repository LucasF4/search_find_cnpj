class Cnpj {
    
    constructor(cnpj, obj){
        this.cnpj = cnpj;
        this.SIZE_OF = 14;
        this.obj = obj;
        this.fd = '';
        this.sd = '';
    }

    setCnpj(cnpj){
        this.cnpj = cnpj
        return this;
    }

    setParams(obj){
        this.obj = obj
    }

    // Função responsável pela sanitização da string, equivale ao remover todos os caracteres especiais que o CNPJ possuir
    // apenas em caso da variável que for passada por parâmebro seja uma string
    sanitizacao(){
        const cnpjTypeOf = typeof this.cnpj

        if(cnpjTypeOf === 'string'){
            var cnpjSanitized = (this.cnpj).toString().replace(/\D+/g, '')
            var p = this.firstDigit(cnpjSanitized)
            if(p.cnpj === false){
                return p
            }
            return cnpjSanitized
        }else if(cnpjTypeOf === 'number'){
            var cnpjSanitized = this.cnpj.toString()
            var p = this.firstDigit(cnpjSanitized)
            if(p.cnpj === false){
                return p
            }
            return cnpjSanitized
        }

        throw new Error("Tipo não configurado")
    }

    // Função que adicionar zeros na frente caso o tamanho informado não seja atingido
    // Isso serve para o tratamento de aplicações que utilizam o CNPJ como inteiro e o zero inicial acaba não sendo validado
    leftPadWidthZeros(cnpjSanitizado){
        return '0'.repeat(this.SIZE_OF - cnpjSanitizado.toString().length) + cnpjSanitizado;
    }

    // Com o dado completamente tratado, é realizado a verificação do tamanho da string
    // caso o tamanho exceda o limite padrão de um CNPJ, ele emitira avisos ao usuário antes de fazer a consulta
    // tendo como base que a API da receita limita seu teste em até 3 consultas, também é contado as consultas com cnpj inválidos
    // Esse tratamento corrige esse problema, deixando mais mais precisas os CNPJ que serão consultados
    validateCnpjLenght(cnpjCleanValue){

        if(cnpjCleanValue.length <= this.SIZE_OF) return cnpjCleanValue
    }
    
    // Realiza o tratamento de todas funções desenvolvidas acima do CNPJ informado
    // Realiza a consulta do CNPJ informado através da receita
    // Caso seja implementado outras fontes para realizar a consulta, sua estrutura irá mudar, mas os resultados continuaram os mesmos
    // Retorna como padrão um Objeto dentro de um contrato da interface CNPJ
    // O desenvolvedor também tem a livre escolha de retornar mais campos além dos que vem por padrão
    // Para retornar os outros objetos dentro da consulta, basta adicionar o nome do parâmetro como verdadeiro dentro do construtor da classe
    async consulta(){

        var sanitizacao = this.sanitizacao()

        if(sanitizacao.cnpj === false){
            return sanitizacao
        }

        var leftPadWidthZeros = this.leftPadWidthZeros(sanitizacao)

        var validateCnpjLenght = this.validateCnpjLenght(leftPadWidthZeros)

        try {
            const response = await fetch(`https://receitaws.com.br/v1/cnpj/${validateCnpjLenght}`);
            const data = await response.json();

            if(data.status == 'ERROR'){
                return data
            }

            var atividades = []
            data.atividades_secundarias.forEach((element) => {
                atividades.push(element.text)
            });

            var retorno = {
                abertura: data.abertura, 
                situacao: data.situacao,
                last_att: data.ultima_atualizacao,
                razaoSocial: data.nome,
                fantasia: data.fantasia,
                atividade_principal: data.atividade_principal[0].text,
                status: data.status
            }

            var fullAddress = `${data.logradouro}, ${data.numero} ${data.municipio} ${data.uf}`
            
            if(this.obj){
                this.obj.cnpj                   == true ? retorno.cnpj = data.cnpj : ''
                this.obj.cep                    == true ? retorno.cep = data.cep : ''
                this.obj.atividades_secundarias == true ? retorno.atividades_secundarias = atividades : ''
                this.obj.tipo                   == true ? retorno.tipo = data.tipo : ''
                this.obj.natureza_juridica      == true ? retorno.natureza_juridica = data.natureza_juridica : ''
                this.obj.endereco               == 'completo' ? retorno.endereco = fullAddress :
                        this.obj.endereco       == 'individual' ? 
                            retorno.endereco = [{logradouro : data.logradouro, numero: data.numero, municipio: data.municipio, uf: data.uf}] : ''
                this.obj.telefone               == true ? retorno.telefone = data.telefone : '',
                this.obj.email                  == true ? retorno.email = data.email : '',
                this.obj.capital_social         == true ? retorno.capital_social = data.capital_social : ''
            }
            
            return retorno;
        } catch (error) {
            throw new Error("Ocorreu um erro na consulta");
        }
    }

    // CRIAÇÃO DOS MÉTODOS PARA A VALIDAÇÃO DA VALIDADE DO CNPJ
    // PARA EVITAR CONSULTAS DE CNPJ QUE SÃO INVÁLIDOS
    // FOI CRIADO UMA LÓGICA QUE REALIZA O CALCULO ONDE VALIDA TODOS OS NUMEROS DO CNPJ INFORMADO
    // PERCORRENDO TODOS OS VALORES E VERIFICANDO O DIGITO VERIFICADOR
    // ESSE PROCESSO OCORRE APÓS A SANATIZAÇÃO DO CNPJ, PARA EVITAR QUALQUER PROBLEMA COM VALORES NÃO INFORMADOS
    // CASO OS VALORES VERIFICADORES SEREM IGUAIS COM OS VERIFICADORES INFORMADOS, REALIZARÁ A CONSULTA
    // REDUZINDO AINDA MAIS O NUMERO DE VERIFICAÇÕES E AUMENTANDO AS CONSULTAS DIRETAMENTE NA RECEITA
    firstDigit(cnpjSanitized){
        var j = 0
        var value = []
        for(var i = 5; i > 1; i--){
            value.push( i * cnpjSanitized[j] )
            j++
        }
        
        for(var i = 9; i > 1; i--){
            value.push(i * cnpjSanitized[j])
            j++
        }
        
        let n1 = value.reduce((a, e) => a + e, 0)
        let result = n1 % 11;
        var verify;
        if(result < 2){
            verify = 0
        }else{
            verify = 11 - result;
        }
        this.fd = verify;
        return this.secondDigit(cnpjSanitized)
    }

    secondDigit(cnpjSanitized){
        var j = 0
        var value = []
        for(var i = 6; i > 1; i--){
            value.push( i * cnpjSanitized[j] )
            j++
        }
        
        for(var i = 9; i > 1; i--){
            value.push(i * cnpjSanitized[j])
            j++
        }
        let n1 = value.reduce((a, e) => a + e, 0)
        let result = n1 % 11;
        var verify;
        if(result < 2){
            verify = 0;
        }else{
            verify = 11 - result;
        }
        this.sd = verify;
        return this.compareDigit(cnpjSanitized)
    }

    compareDigit(cnpjSanitized){
        let digVerif = '';
        let digVerifed = (this.fd).toString() + (this.sd).toString(); // CNPJ com Tratamento de String
        for(var i = cnpjSanitized.length-2; i < cnpjSanitized.length; i++){
            digVerif += cnpjSanitized[i]
        }
        
        if(digVerif == digVerifed){
            return {cnpj: true}
        }else{
            return {cnpj: false}
        }
    }

}

module.exports = Cnpj