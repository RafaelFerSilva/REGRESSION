import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Team, User } from '@prisma/client'
import { TeamNotFoundError } from './errors/team-not-found-error'

// Importar as factories e helpers
import { makeUser } from '@/use-cases/factories/user-factory'
import { makeTeam } from '@/use-cases/factories/team-factory'
import { setupTeamRepositoryAndUseCase, setupUserRepositoryAndUseCase } from '@/use-cases/helpers/setup-repositories'
import { assertTeamProperties } from './helpers/test-assertions'

describe('Update Team Use Case', () => {
  let teamsRepository: ReturnType<typeof setupTeamRepositoryAndUseCase>['teamsRepository']
  let usersRepository: ReturnType<typeof setupUserRepositoryAndUseCase>['usersRepository']
  let sut: ReturnType<typeof setupTeamRepositoryAndUseCase>['updateTeamsUseCase']
  let userTeam: User
  let teamToUpdate1: Team
  let teamToUpdate2: Team

  beforeEach(async () => {
    // Usar os helpers para configurar repositórios e caso de uso
    const teamSetup = setupTeamRepositoryAndUseCase()
    teamsRepository = teamSetup.teamsRepository
    sut = teamSetup.updateTeamsUseCase
    
    const userSetup = setupUserRepositoryAndUseCase()
    usersRepository = userSetup.usersRepository

    // Criar usuário de teste usando a factory
    userTeam = await makeUser(usersRepository)

    // Criar equipes de teste usando a factory
    teamToUpdate1 = await makeTeam(teamsRepository, {
      name: 'Team 1',
      userId: userTeam.id
    })

    teamToUpdate2 = await makeTeam(teamsRepository, {
      name: 'Team 2',
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
    const updateTeam = await makeTeam(teamsRepository, { 
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
    
    // Act
    const { team } = await sut.execute(teamToUpdate1.id, { name: newName })
    
    // Assert
    assertTeamProperties(team, {
      name: newName,
      active: teamToUpdate1.active
    })
  })

  it('should be able to update only the team active status', async () => {
    
    // Act - Desativando o time
    const result1 = await sut.execute(teamToUpdate1.id, { active: false })
    
    // Assert
    assertTeamProperties(result1.team, {
      name: teamToUpdate1.name,
      active: false
    })
    
    // Act - Reativando o time
    const result2 = await sut.execute(teamToUpdate1.id, { active: true })
    
    // Assert
    assertTeamProperties(result1.team, {
      name: teamToUpdate1.name,
      active: true
    })
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