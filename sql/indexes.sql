-- pessoas
CREATE UNIQUE INDEX IF NOT EXISTS pessoas_cpf_uq ON pessoas (cpf);
CREATE UNIQUE INDEX IF NOT EXISTS pessoas_email_uq ON pessoas (email);
CREATE INDEX IF NOT EXISTS pessoas_id_idx ON pessoas (id);
CREATE INDEX IF NOT EXISTS pessoas_nome_idx ON pessoas (nome);

-- planos
CREATE INDEX IF NOT EXISTS planos_id_idx ON planos (id);
CREATE INDEX IF NOT EXISTS planos_valor_idx ON planos (valor_credito);
CREATE INDEX IF NOT EXISTS planos_parcelas_idx ON planos (parcelas);

-- planos_contratados
CREATE INDEX IF NOT EXISTS contratos_id_idx ON planos_contratados (id);
CREATE INDEX IF NOT EXISTS contratos_pessoa_id_id_idx ON planos_contratados (pessoa_id, id);
CREATE INDEX IF NOT EXISTS contratos_status_id_idx ON planos_contratados (status, id);
CREATE INDEX IF NOT EXISTS contratos_plano_id_idx ON planos_contratados (plano_id);


