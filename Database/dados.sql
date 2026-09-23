USE controle_estoque;
-- Usuarios de exemplo: 
-- email:admin@estoque.com e funcionario@estoque.com
-- senha_hash : 123456 

INSERT INTO usuario ( nome, email, senha_hash, tipo) VALUES
('Adm', 'admin@estoque.com', '$2a$12$OoqaUtSUa4X6/83Jml3NAePnw7SGuwgoGahP7Nn3DFEt7rFmNr9yi', 'ADMIN'),
('Fun', 'funcionario@estoque.com', '$2a$12$OoqaUtSUa4X6/83Jml3NAePnw7SGuwgoGahP7Nn3DFEt7rFmNr9yi', 'FUNCIONARIO');

-- Categorias
INSERT INTO categoria (nome, descricao) VALUES
('EPIs', 'Capacetes, luvas, coletes e outros equipamentos '),
('Ferramentas', 'Chaves, martelos, máquinas e outros instrumentos'),
('Papelaria', 'Material de escritorio');

-- Produtos
INSERT INTO produto (nome, descricao, preco, quantidade, estoque_minimo, id_categoria, marca) VALUES
('Capacete', 'Capacete de segurança', 100.00, 20, 5, 1, 'MSA'),
('Furadeira Elétrica','Furadeira 820W', 550.00, 15, 1, 2, 'BOSCH'),
('Papel A4 500 folhas','Resma branca', 24.90, 15, 5, 3, 'CHAMEX');

-- Movimentacoes de exemplo 
-- usuario 1 = Administrador e usuario 2 = Funcionario
INSERT INTO movimentacao (id_produto, id_usuario, tipo, quantidade, descricao) VALUES
(1, 1, 'ENTRADA', 100, 'Compra inicial'),
(1, 2, 'SAIDA', 10, 'Venda balcao'),
(2, 2, 'ENTRADA', 40, 'Reposicao'),
(3, 1, 'SAIDA', 3, 'Uso interno');