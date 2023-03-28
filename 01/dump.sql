--A API precisa se conectar com um banco de dados `postgreSQL` chamado `biblioteca` e todo código de criação das tabelas deverá se colocado no arquivo `dump.sql`

create database biblioteca;

--1 - Implemente uma tabela chamada `autores` contendo as seguintes características:

- Um identificador único do autor como chave primaria e auto incremento;
- O nome (obrigatório)
- A idade

create table if not exists autores (
  id serial primary key,
  nome text not null,
  idade integer
);

--4 - Implemente uma tabela chamada livros contendo as seguintes características:

--Um identificador único do livro como chave primaria e auto incremento;
--O nome (obrigatório)
--O genero
--A editora
--A data de publicação no formato YYYY-MM-DD
--O identificador do autor responsável pelo livro

create table if not exists livros(
  id serial primary key,
  nome text not null,
  genero text,
  editora text,
  data_de_publicacao date,
  autor_id integer not null references autores(id)
);
  