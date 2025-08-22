CREATE TABLE IF NOT EXISTS pessoas (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  cpf TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS planos (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  valor_credito BIGINT NOT NULL,
  parcelas INT NOT NULL,
  taxa_adm_percentual INT NOT NULL
);

CREATE TABLE IF NOT EXISTS planos_contratados (
  id SERIAL PRIMARY KEY,
  pessoa_id INT NOT NULL REFERENCES pessoas(id),
  plano_id INT NOT NULL REFERENCES planos(id),
  data_contratacao DATE NOT NULL,
  status TEXT NOT NULL,
  parcelas_pagas INT NOT NULL DEFAULT 0
);


