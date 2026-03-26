
-- ADICIONA CAMPOS DE APELIDO E PREFERÊNCIA DE EXIBIÇÃO NO PERFIL
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS nickname TEXT,
ADD COLUMN IF NOT EXISTS display_name_preference TEXT DEFAULT 'full_name' 
CHECK (display_name_preference IN ('full_name', 'nickname'));

-- COMENTÁRIO PARA DOCUMENTAÇÃO
COMMENT ON COLUMN profiles.display_name_preference IS 'Determina se o site exibirá o nome completo ou o apelido do usuário.';
