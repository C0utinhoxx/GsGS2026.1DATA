# Mission Control - Sistema de Monitoramento de Missão Espacial

O Mission Control é um sistema desenvolvido em JavaScript com foco na simulação e monitoramento de parâmetros básicos de uma missão espacial experimental. A aplicação permite inserir ou simular dados de sensores em tempo real, analisando automaticamente as condições da missão e exibindo alertas visuais conforme o estado dos sistemas.

## Funcionalidades do Sistema

* **Monitoramento em Tempo Real:** Exibição dinâmica dos dados de temperatura, energia e comunicação.
* **Sistema de Alertas:** Geração automática de alertas visuais com base nas condições dos sensores.
* **Simulação de Sensores:** Possibilidade de gerar valores aleatórios para testes do sistema.
* **Histórico de Leituras:** Armazenamento das leituras realizadas durante a execução.
* **Análise Estatística:** Cálculo de médias e quantidade de falhas registradas.
* **Interface Interativa:** Navegação entre telas de status, inserção de dados, análise e histórico.

## Parâmetros e Regras de Negócio

O sistema analisa os dados com base nas seguintes condições:

### 1. Temperatura (°C)

* **Até 60 °C:** NORMAL
* **De 61 °C até 80 °C:** ATENÇÃO
* **Acima de 80 °C:** CRÍTICO (Superaquecimento)

### 2. Energia (%)

* **Acima de 40%:** NORMAL
* **De 20% até 40%:** ATENÇÃO
* **Abaixo de 20%:** CRÍTICO (Energia baixa)

### 3. Comunicação

* **Ativa:** NORMAL
* **Inativa:** CRÍTICO (Falha de comunicação)

### Classificação Geral do Sistema

A condição geral da missão é definida com base nos sensores:

* **NORMAL:** Todos os sistemas dentro dos parâmetros
* **ATENÇÃO:** Algum sensor em nível de alerta
* **CRÍTICO:** Falha grave (temperatura alta ou sem comunicação)

## Estrutura de Arquivos do Repositório

* **index.html** → Estrutura da interface do sistema
* **style.css** → Estilização e design visual
* **script.js** → Lógica da aplicação e controle dos dados

## Tecnologias Utilizadas

* HTML
* CSS
* JavaScript

## Objetivo do Projeto

Este projeto tem como objetivo demonstrar, de forma prática, a aplicação de conceitos básicos de programação, como estruturas condicionais, arrays e funções, em um cenário simulado de monitoramento de missão espacial.
