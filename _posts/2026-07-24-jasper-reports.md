---
layout: post
title: "Como usar o JasperReports 6.13.0 no Jaspersoft Studio 6.21 em Macs Apple Silicon"
date: 2026-07-24 14:30
categories: [dev, jasper]
tags: [jasper, java, mac, apple-silicon]
author: João Santos
---

Recentemente precisei voltar a trabalhar com um projeto que ainda utiliza **JasperReports 6.13.0** em produção. Até aí tudo bem.

O problema começou quando tentei editar e compilar os relatórios usando a versão mais recente do **Jaspersoft Studio (6.21.1)**.

Em teoria, bastaria configurar o runtime antigo dentro do Studio. Na prática... não foi exatamente assim

## O problema

Nossa aplicação gera todos os relatórios utilizando o **JasperReports 6.13.0**, então faz sentido que qualquer alteração em um `.jrxml` também seja compilada usando essa mesma versão.

O Jaspersoft Studio permite configurar diferentes runtimes, então imaginei que seria apenas uma questão de selecionar a versão correta.

Assim que fiz isso começaram os erros.

Praticamente qualquer relatório apresentava um `NoClassDefFoundError` reclamando de bibliotecas como:

* commons-logging
* groovy-all
* joda-time
* commons-beanutils
* entre várias outras

À primeira vista parece algum problema de instalação, mas na verdade o comportamento faz sentido.

## O que realmente acontece

O JasperReports não é apenas um único JAR.

A versão **6.13.0** depende de aproximadamente cinquenta bibliotecas externas, declaradas no próprio `pom.xml` do projeto.

O que o Jaspersoft Studio faz quando você altera o runtime é simplesmente trocar o JAR principal do JasperReports.

Ele **não baixa automaticamente as dependências** daquela versão.

Ou seja, a responsabilidade de montar todo esse classpath continua sendo nossa.

Depois de entender isso, a solução ficou bem mais simples.

## Montando um runtime manualmente

A solução foi criar uma pasta contendo exatamente todos os JARs necessários para o JasperReports 6.13.0.

### 1. Criando a estrutura

```bash
mkdir -p ~/jasper-runtime/6.13.0
cd ~/jasper-runtime/6.13.0
```

Depois basta baixar os JARs principais do JasperReports (engine, fonts, functions e metadata).

### 2. Baixando todas as dependências

Além do JAR principal, também é necessário baixar todas as dependências utilizadas pelo JasperReports.

Algumas delas são:

* Commons Logging
* Commons BeanUtils
* Commons Digester
* Commons Collections
* Groovy
* Joda-Time
* Jackson
* iText
* Apache POI
* JFreeChart
* Batik
* Velocity
* ICU4J

O comando abaixo mostra parte dessa lista:

```bash
# Logging
curl -sLO "https://repo1.maven.org/maven2/commons-logging/commons-logging/1.1.1/commons-logging-1.1.1.jar"

# Commons
curl -sLO "https://repo1.maven.org/maven2/commons-beanutils/commons-beanutils/1.9.4/commons-beanutils-1.9.4.jar"
curl -sLO "https://repo1.maven.org/maven2/commons-digester/commons-digester/2.1/commons-digester-2.1.jar"

# Groovy
curl -sLO "https://repo1.maven.org/maven2/org/codehaus/groovy/groovy-all/2.4.16/groovy-all-2.4.16.jar"

# Joda Time
curl -sLO "https://repo1.maven.org/maven2/joda-time/joda-time/2.10.5/joda-time-2.10.5.jar"
```

No total, a pasta ficou com aproximadamente **54 JARs**, ocupando cerca de **62 MB**.

## Configurando o Jaspersoft Studio

Com todos os arquivos no lugar, basta configurar o Studio:

1. Abra **Window → Preferences → Jaspersoft Studio → Compatibility**
2. Em **Jasper Reports Runtime**, selecione a pasta criada anteriormente.
3. Escolha a versão **6.13.0**.
4. Reinicie o Studio.

Depois disso os `.jrxml` passaram a compilar normalmente, gerando os respectivos arquivos `.jasper` exatamente como acontece em produção.

## Um compilador HTTP para não depender do Studio

Outra necessidade que surgiu durante o projeto foi compilar relatórios sem precisar abrir o Jaspersoft Studio.

Como alguns templates são gerados automaticamente (inclusive por IA), fazia muito mais sentido expor a compilação através de uma pequena aplicação HTTP.

A implementação ficou bem simples.

Utilizando apenas o `HttpServer` da própria JDK e o `JasperCompileManager`, é possível criar um serviço que recebe um arquivo `.jrxml` e gera o `.jasper`.

```java
import net.sf.jasperreports.engine.JasperCompileManager;

// JasperCompileManager.compileReportToFile(
//     "/caminho/template.jrxml",
//     "/caminho/template.jasper"
// );
```

A interface web lista todos os templates encontrados, permite compilar um único relatório ou todos de uma vez e ainda exibe o tempo gasto em cada compilação.

Para executar:

```bash
M2="$HOME/.m2/repository"
CP="$M2/net/sf/jasperreports/jasperreports/6.20.0/jasperreports-6.20.0.jar"
CP="$CP:$M2/commons-digester/commons-digester/2.1/commons-digester-2.1.jar"
CP="$CP:$M2/commons-logging/commons-logging/1.2/commons-logging-1.2.jar"
CP="$CP:$M2/org/apache/commons/commons-collections4/4.4/commons-collections4-4.4.jar"
CP="$CP:$M2/org/eclipse/jdt/ecj/3.21.0/ecj-3.21.0.jar"
CP="$CP:$M2/commons-beanutils/commons-beanutils/1.9.4/commons-beanutils-1.9.4.jar"

javac -cp "$CP" CompileJasper.java
java -Djava.awt.headless=true -cp "$CP" CompileJasper 9090
```

Depois é só abrir `http://localhost:9090` no navegador.

## Considerações finais

Apesar de parecer um problema específico do Apple Silicon, na verdade a dificuldade está muito mais na forma como o Jaspersoft Studio gerencia os runtimes antigos.

Depois que todas as dependências são adicionadas manualmente, o JasperReports 6.13.0 funciona normalmente mesmo em um Mac M4.

Algumas recomendações que facilitaram bastante:

* Utilize **JDK 11** para trabalhar com o JasperReports 6.13.0. Embora versões mais novas funcionem em alguns cenários, o Java 11 costuma oferecer a melhor compatibilidade.
* Prefira distribuições ARM64 nativas, como Eclipse Temurin ou Azul Zulu.
* Mantenha um diretório dedicado para cada versão do JasperReports. Isso evita conflitos entre projetos e facilita futuras migrações.
* Se você gera templates automaticamente, vale muito a pena criar um pequeno compilador HTTP. Além de agilizar o desenvolvimento, ele pode ser integrado facilmente a pipelines e ferramentas de automação.
