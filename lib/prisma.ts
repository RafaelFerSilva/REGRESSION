import { PrismaClient, Prisma } from '@prisma/client'
import { env } from '@/env'

// Define os tipos de ação que queremos auditar
type AuditAction = 'create' | 'update' | 'delete'

// Lista das tabelas que queremos auditar
const TABLES_TO_AUDIT = ['User', 'TestCase', 'Feature', 'Team']

// Cria uma extensão do PrismaClient com auditoria
export function createPrismaClientWithAudit() {
  const prisma = new PrismaClient({
    log: env.NODE_ENV === 'dev' ? ['query'] : [],
  }).$extends({
    query: {
      async $allOperations({ operation, model, args, query }) {
        // Ignora operações em AuditLog para evitar recursão infinita
        if (model === 'AuditLog') {
          return query(args)
        }

        // Ignora operações que não são de escrita ou tabelas que não estão na lista
        if (
          !['create', 'update', 'delete', 'upsert'].includes(operation) ||
          !TABLES_TO_AUDIT.includes(model || '')
        ) {
          return query(args)
        }

        // Para operações de update e delete, precisamos obter os dados antigos
        let oldData: any = null
        if (['update', 'delete'].includes(operation) && args.where) {
          try {
            // Busca o registro antes da modificação
            oldData = await (prisma as any)[
              model?.toLowerCase() || ''
            ].findFirst({
              where: args.where,
            })
          } catch (error) {
            console.error(`Failed to fetch old data for ${model}:`, error)
          }
        }

        // Executa a operação original
        const result = await query(args)

        // Determina a ação de auditoria
        let action: AuditAction
        if (operation === 'create') action = 'create'
        else if (operation === 'update') action = 'update'
        else if (operation === 'delete') action = 'delete'
        else if (operation === 'upsert') {
          // Para upsert, verifica se o registro já existia
          action = oldData ? 'update' : 'create'
        } else {
          return result
        }

        // Determina o ID do registro
        const recordId =
          operation === 'create'
            ? result.id
            : operation === 'update' || operation === 'upsert'
              ? result.id
              : oldData?.id

        if (!recordId) {
          console.error(`Unable to determine record ID for audit on ${model}`)
          return result
        }

        // Identifica o usuário que fez a alteração (se disponível no contexto)
        const userId = (prisma as any)._engineConfig?.context?.userId

        try {
          // Cria o registro de auditoria
          await prisma.auditLog.create({
            data: {
              table_name: model || '',
              record_id: recordId,
              action,
              old_data: oldData || undefined,
              new_data: ['create', 'update', 'upsert'].includes(operation)
                ? result
                : undefined,
              changed_by: userId,
            },
          })
        } catch (error) {
          console.error('Failed to create audit log:', error)
        }

        return result
      },
    },
  })

  return prisma
}

// Função auxiliar para definir o ID do usuário no contexto do Prisma
export function setUserContext(prismaInstance: any, userId?: string) {
  if (!prismaInstance._engineConfig) {
    prismaInstance._engineConfig = {}
  }

  prismaInstance._engineConfig.context = {
    ...(prismaInstance._engineConfig.context || {}),
    userId,
  }
}

// Cliente Prisma com auditoria integrada
export const prisma = createPrismaClientWithAudit()
