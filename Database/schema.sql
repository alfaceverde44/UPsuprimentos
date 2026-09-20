
DROP DATABASE IF EXISTS controle_estoque;
CREATE DATABASE controle_estoque
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
USE controle_estoque;
-- ------------------------------------------------------------
-- Tabela: usuarios
-- ------------------------------------------------------------
CREATE TABLE usuarios (
id INT AUTO_INCREMENT PRIMARY KEY,
nome VARCHAR(100) NOT NULL,
email VARCHAR(150) NOT NULL UNIQUE,
senha_hash VARCHAR(255) NOT NULL,
tipo ENUM('ADMIN','FUNCIONARIO') NOT NULL DEFAULT 'FUNCIONARIO',
data_criacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;
-- ------------------------------------------------------------
-- Tabela: categorias
-- ------------------------------------------------------------
CREATE TABLE categorias (
id INT AUTO_INCREMENT PRIMARY KEY,
nome VARCHAR(80) NOT NULL UNIQUE,
descricao VARCHAR(255) NULL,
data_criacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;
-- ------------------------------------------------------------
-- Tabela: produtos
-- Cada produto pertence a uma categoria (FK). Guarda o saldo
-- atual em estoque (atualizado pelas movimentacoes).
-- ------------------------------------------------------------
CREATE TABLE produtos (
id INT AUTO_INCREMENT PRIMARY KEY,
nome VARCHAR(120) NOT NULL,
descricao VARCHAR(255) NULL,
preco DECIMAL(10,2) NOT NULL DEFAULT 0.00,
quantidade INT NOT NULL DEFAULT 0,
marca VARCHAR(100) NOT NULL,
estoque_minimo INT NOT NULL DEFAULT 0,
id_categoria INT NOT NULL,
data_criacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
CONSTRAINT fk_produto_categoria
FOREIGN KEY (id_categoria) REFERENCES categorias(id)
ON UPDATE CASCADE
ON DELETE RESTRICT
) ENGINE=InnoDB;
-- ------------------------------------------------------------
-- Tabela: movimentacoes
-- Historico de entradas e saidas de cada produto. Registra 
-- quem fez a movimentacao (FK usuarios) e qual produto (FK).
-- ------------------------------------------------------------
CREATE TABLE movimentacoes (
id INT AUTO_INCREMENT PRIMARY KEY,
id_produto INT NOT NULL,
id_usuario INT NOT NULL,
tipo ENUM('ENTRADA','SAIDA') NOT NULL,
quantidade INT NOT NULL,
observacao VARCHAR(255) NULL,
data_criacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
CONSTRAINT fk_mov_produto
FOREIGN KEY (id_produto) REFERENCES produtos(id)
ON UPDATE CASCADE -- Quando o id do produto for alterado, atualiza automaticamente na movimentacao
ON DELETE CASCADE, -- Quando um produto é excluido, todas as movimentacoes dele sao excluidas
CONSTRAINT fk_mov_usuario
FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
ON UPDATE CASCADE
ON DELETE RESTRICT
) ENGINE=InnoDB; 