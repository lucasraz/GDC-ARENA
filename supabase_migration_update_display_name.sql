
-- ADICIONA CAMPO DE PREFERÊNCIA DE EXIBIÇÃO NO PERFIL (CONSOLIDADO COM USERNAME)
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS display_name_preference TEXT DEFAULT 'full_name' 
CHECK (display_name_preference IN ('full_name', 'username'));

-- COMENTÁRIO PARA DOCUMENTAÇÃO
COMMENT ON COLUMN profiles.display_name_preference IS 'Determina se o site exibirá o nome completo ou o username (apelido/GDC-ID) do usuário.';
