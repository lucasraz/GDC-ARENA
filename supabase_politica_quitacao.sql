-- REGRA DE MESTRE: Permite que o organizador do evento altere o status de pagamento de qualquer torcedor
-- 1. Verifique se a RLS está ativa
ALTER TABLE event_attendees ENABLE ROW LEVEL SECURITY;

-- 2. Crie a regra de permissão
DO $$ 
BEGIN
    -- Remove a regra se ela já existir para evitar erros
    DROP POLICY IF EXISTS "Organizer can update payment status" ON event_attendees;
    
    -- Cria a nova regra
    CREATE POLICY "Organizer can update payment status" ON event_attendees
        FOR UPDATE
        TO authenticated
        USING (
            -- O torcedor autenticado deve ser o ORGANIZADOR (author_id) do evento onde os convidados estão
            EXISTS (
                SELECT 1 FROM events 
                WHERE events.id = event_attendees.event_id 
                AND events.author_id = auth.uid()
            )
        )
        WITH CHECK (
            -- Mesma lógica para a verificação final
            EXISTS (
                SELECT 1 FROM events 
                WHERE events.id = event_attendees.event_id 
                AND events.author_id = auth.uid()
            )
        );
END $$;

-- 3. Verifique as permissões (Opcional)
GRANT UPDATE(is_paid) ON event_attendees TO authenticated;
