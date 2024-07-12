class Cnpj {
    
    constructor(cnpj, obj){
        this.cnpj = cnpj;
        this.SIZE_OF = 14;
        this.obj = obj;
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
            return (this.cnpj).toString().replace(/\D+/g, '')
        }else if(cnpjTypeOf === 'number'){
            return this.cnpj.toString()
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

        var leftPadWidthZeros = this.leftPadWidthZeros(sanitizacao)

        var validateCnpjLenght = this.validateCnpjLenght(leftPadWidthZeros)

        try {
            const response = await fetch(`https://receitaws.com.br/v1/cnpj/${validateCnpjLenght}`);
            const data = await response.json();

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
                atividade_principal: data.atividade_principal[0].text
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

}

module.exports = Cnpj