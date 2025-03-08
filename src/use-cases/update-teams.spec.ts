import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Team, User } from '@prisma/client'
import { hash } from 'bcryptjs'
import { randomUUID } from 'node:crypto'
import { InMemoryTeamsRepository } from '@/repositories/in-memory/in-memory-team-repository'
import { UpdateTeamsUseCase } from './update-teams'
import { TeamNotFoundError } from './errors/team-not-found-error'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-user-repository'

describe('Update Team Use Case', () => {
  let sut: UpdateTeamsUseCase
  let teamsRepository: InMemoryTeamsRepository
  let usersRepository: InMemoryUsersRepository
  let teamToUpdate1: Team
  let userTeam: User

  beforeEach(async () => {
    teamsRepository = new InMemoryTeamsRepository()
    usersRepository = new InMemoryUsersRepository()
    sut = new UpdateTeamsUseCase(teamsRepository)

    userTeam = await usersRepository.create({
      id: randomUUID(),
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
      rule: 'QA'
    })

    teamToUpdate1 = await teamsRepository.create({
      id: randomUUID(),
      name: 'Team 1',
      userId: userTeam.id
    })
  })

  it('should be able to update team data', async () => {
    // Arrange
    const updateData = {
      name: 'Update team',
      active: false
    }
    
    // Act
    const { team } = await sut.execute(teamToUpdate1.id, updateData)
    
    // Assert
    expect(team.name).toEqual(updateData.name)
    expect(team.active).toEqual(updateData.active)
  })

  it('should return the same team if no data to update is provided', async () => {
    // Arrange
    const updateTeam = await teamsRepository.create({
      id: randomUUID(),
      name: 'Team',
      userId: userTeam.id
    })
    
    // Act
    const { team } = await sut.execute(updateTeam.id, updateTeam)
    
    // Assert
    expect(team.name).toEqual(updateTeam.name)
    expect(team.active).toEqual(updateTeam.active)
  })

  it('should not be able to update a non-existing team', async () => {
    // Arrange
    const updateData = {
      name: 'Update team',
      active: false
    }
    const nonExistingId = 'non-existing-team'
    
    // Act & Assert
    await expect(() =>
      sut.execute(nonExistingId, updateData),
    ).rejects.toBeInstanceOf(TeamNotFoundError)
    
    // Verificando a mensagem de erro
    await expect(() =>
      sut.execute(nonExistingId, updateData),
    ).rejects.toThrowError('Team not found.')
  })

  it('should be able to update only the team name', async () => {
    // Arrange
    const newName = 'Team Silva'
    const originalActive = teamToUpdate1.active
    
    // Act
    const { team } = await sut.execute(teamToUpdate1.id, { name: newName })
    
    // Assert
    expect(team.name).toEqual(newName)
    expect(team.active).toEqual(originalActive) // Garante que outros campos não foram alterados
  })

  it('should be able to update only the team active status', async () => {
    // Arrange
    const originalName = teamToUpdate1.name
    
    // Act - Desativando o time
    const result1 = await sut.execute(teamToUpdate1.id, { active: false })
    
    // Assert
    expect(result1.team.active).toBe(false)
    expect(result1.team.name).toEqual(originalName) // Garante que o nome não foi alterado
    
    // Act - Reativando o time
    const result2 = await sut.execute(teamToUpdate1.id, { active: true })
    
    // Assert
    expect(result2.team.active).toBe(true)
    expect(result2.team.name).toEqual(originalName) // Garante que o nome não foi alterado
  })

  it('should validate team id before updating', async () => {
    // Arrange
    const findByIdSpy = vi.spyOn(teamsRepository, 'findById')
    const updateData = { name: 'New Name' }
    
    // Act
    await sut.execute(teamToUpdate1.id, updateData)
    
    // Assert
    expect(findByIdSpy).toHaveBeenCalledWith(teamToUpdate1.id)
  })
})