create database condominio;
use condominio;

CREATE TABLE blocos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    descricao VARCHAR(100) NOT NULL UNIQUE,
    qtd_apartamentos INT NOT NULL
);

INSERT INTO blocos (id,descricao, qtd_apartamentos) VALUES
(1,'Bloco A', 10),
(2, 'Bloco B', 8),
(3,'Bloco C', 12);

CREATE TABLE apartamentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero VARCHAR(50) NOT NULL UNIQUE,
    bloco varchar(255) NOT NULL
     FOREIGN KEY (bloco) REFERENCES blocos(id),
    UNIQUE KEY (bloco_id, numero)
);
insert into apartamentos( numero, bloco) values
( 10, 'Bloco A');

CREATE TABLE moradores (
  id INT AUTO_INCREMENT PRIMARY KEY,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    nome VARCHAR(100) NOT NULL,
    telefone VARCHAR(20),
    apartamento VARCHAR(10) UNIQUE,
    bloco VARCHAR(10),
    responsavel VARCHAR(5),
    proprietario VARCHAR(5),
    veiculo VARCHAR(5),
    qtd_vagas INT,
    num_vaga VARCHAR(10)
);
DESCRIBE moradores;


INSERT INTO moradores (cpf, nome, apartamento, bloco) VALUES
('123.456.789-00', 'Ana Silva', '101', 'Bloco A'),
('987.654.321-00', 'Bruno Souza', '202', 'Bloco B'),
('555.666.777-88', 'Carla Pereira', '303', 'Bloco C'),
('999.555.222-12', 'Carlos Pereira', '301', 'Bloco C');

CREATE TABLE referencia (
  id INT AUTO_INCREMENT PRIMARY KEY,
  mes TINYINT NOT NULL CHECK (mes BETWEEN 1 AND 12),
  ano SMALLINT NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  vencimento DATE NOT NULL,
  UNIQUE KEY uq_referencia (mes, ano)
);

-- 6) Tabela de Pagamentos
CREATE TABLE pagamento (
  id INT AUTO_INCREMENT PRIMARY KEY,
  moradores_id INT NOT NULL,
  referencia_id INT NOT NULL,
  data_pagamento DATE NOT NULL,
  valor_pago DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (moradores_id) REFERENCES moradores(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  FOREIGN KEY (referencia_id) REFERENCES referencia(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  UNIQUE KEY uq_pagamento (moradores_id, referencia_id)
);
select *from referencia;
select *from pagamento;

CREATE TABLE tipos_manutencao (
    id INT AUTO_INCREMENT PRIMARY KEY,
    descricao VARCHAR(100) UNIQUE
);

CREATE TABLE manutencoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo_id INT,
    data DATE,
    local VARCHAR(100),
    FOREIGN KEY (tipo_id) REFERENCES tipos_manutencao(id)
);
