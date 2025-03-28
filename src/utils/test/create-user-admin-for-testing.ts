import { hash } from 'bcryptjs'
import { UsersRepository } from '@/repositories/interfaces/users-repository'
import { Role } from '@prisma/client'

export async function createAdminUserForTesting(
  usersRepository: UsersRepository,
) {
  // Verifica se já existe um admin
  const existingAdmin = await usersRepository.findByRole(Role.ADMIN)

  if (!existingAdmin[0]) {
    // Cria um usuário admin para testes
    const adminUser = await usersRepository.create({
      name: 'Test Admin',
      email: 'admin@test.com',
      password_hash: await hash('admin123', 6),
      role: Role.ADMIN,
      active: true,
    })

    return adminUser
  }

  return existingAdmin[0]
}
