// /home/rafa/regression/src/lib/prisma.ts
import { PrismaClient } from '@prisma/client'
import { env } from '@/env'

// Define os tipos de ação que queremos auditar
type AuditAction = 'create' | 'update' | 'delete'

// Lista das tabelas que queremos auditar
const TABLES_TO_AUDIT = ['User', 'TestCase', 'Feature', 'Team']
const WRITE_OPERATIONS = ['create', 'update', 'delete', 'upsert']

// Função para verificar se a operação deve ser auditada
export function shouldAuditOperation(
  operation: string,
  model: string | undefined,
): boolean {
  return (
    WRITE_OPERATIONS.includes(operation) &&
    TABLES_TO_AUDIT.includes(model ?? '') &&
    model !== 'AuditLog'
  )
}

// Função para determinar a ação de auditoria
export function determineAuditAction(
  operation: string,
  oldData: any,
): AuditAction {
  if (operation === 'create') return 'create'
  if (operation === 'delete') return 'delete'
  if (operation === 'update') return 'update'
  // Para upsert, verifica se o registro já existia
  return oldData ? 'update' : 'create'
}

// Função para obter o ID do registro
export function getRecordId(
  operation: string,
  result: any,
  oldData: any,
): string | undefined {
  if (
    operation === 'create' ||
    operation === 'update' ||
    operation === 'upsert'
  ) {
    return result.id
  }
  return oldData?.id
}

// Função para buscar dados antigos antes de modificações
async function fetchOldData(
  prisma: any,
  model: string | undefined,
  where: any,
): Promise<any> {
  try {
    if (!model) return null

    return await prisma[model.toLowerCase()].findFirst({
      where,
    })
  } catch (error) {
    console.error(`Failed to fetch old data for ${model}:`, error)
    return null
  }
}

// Função para determinar os novos dados para o log
export function getNewDataForAudit(operation: string, result: any): any {
  if (['create', 'update', 'upsert'].includes(operation)) {
    return result
  }
  return undefined
}

// Cria uma extensão do PrismaClient com auditoria
export function createPrismaClientWithAudit() {
  // Criamos uma instância base do PrismaClient para operações de auditoria
  const prismaBase = new PrismaClient({
    log: env.NODE_ENV === 'dev' ? ['query'] : [],
  })

  // Estendemos o cliente com funcionalidade de auditoria
  const prisma = prismaBase.$extends({
    query: {
      async $allOperations({ operation, model, args, query }) {
        // Ignora operações que não precisam ser auditadas
        if (!shouldAuditOperation(operation, model)) {
          return query(args)
        }

        // Para operações de update e delete, precisamos obter os dados antigos
        const needsOldData = ['update', 'delete', 'upsert'].includes(operation)
        const oldData = needsOldData
          ? await fetchOldData(prismaBase, model, args.where)
          : null

        // Executa a operação original
        const result = await query(args)

        // Determina a ação de auditoria
        const action = determineAuditAction(operation, oldData)

        // Determina o ID do registro
        const recordId = getRecordId(operation, result, oldData)

        if (!recordId) {
          console.error(`Unable to determine record ID for audit on ${model}`)
          return result
        }

        // Identifica o usuário que fez a alteração (se disponível no contexto)
        const userId = (prismaBase as any)._engineConfig?.context?.userId

        // Prepara os novos dados para o log
        const newData = getNewDataForAudit(operation, result)

        // Cria o registro de auditoria diretamente
        try {
          await prismaBase.auditLog.create({
            data: {
              table_name: model || '',
              record_id: recordId,
              action,
              old_data: oldData || undefined,
              new_data: newData,
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
