INSERT INTO planos (nome, valor_credito, parcelas, taxa_adm_percentual)
VALUES
  ('Plano Bronze', 5000, 12, 10),
  ('Plano Prata', 10000, 24, 9),
  ('Plano Ouro', 20000, 36, 8)
ON CONFLICT DO NOTHING;


