import { cronicaRepository, Cronica, Comment } from '@execution/repositories/cronica_repository'

export class CronicaService {
  /**
   * Orchestrates Crônica creation or update.
   */
  static async saveCronica(
    authorId: string, 
    tenantId: string, 
    data: Partial<Cronica>
  ): Promise<Cronica> {
    // 1. Validation
    if (!authorId || !tenantId) {
      throw new Error("Orchestration Error: Author and Tenant are mandatory.")
    }

    if (!data.title?.trim() || !data.content?.trim()) {
      throw new Error("Orchestration Error: Título e conteúdo são obrigatórios.")
    }

    // 2. Prepare Final Data
    const updatedCronica: Partial<Cronica> = {
      ...data,
      author_id: authorId,
      tenant_id: tenantId,
    }

    // 3. Persist
    return await cronicaRepository.save(updatedCronica)
  }

  static async deleteCronica(id: string, authorId: string): Promise<void> {
    if (!id || !authorId) throw new Error("ID and Author are mandatory.")
    return await cronicaRepository.delete(id, authorId)
  }

  // --- COMMENTS ---
  static async addComment(
    authorId: string, 
    cronicaId: string, 
    text: string
  ): Promise<Comment> {
    if (!authorId || !cronicaId || !text.trim()) {
        throw new Error("Orchestration Error: Comentário não pode ser vazio.")
    }

    return await cronicaRepository.saveComment({
      author_id: authorId,
      cronica_id: cronicaId,
      text: text.trim()
    })
  }

  static async deleteComment(id: string, authorId: string): Promise<void> {
    return await cronicaRepository.deleteComment(id, authorId)
  }
}
