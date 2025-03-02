import { prisma } from "lib/prisma";
import { hash } from "bcryptjs";

interface RegisterUseCaseRequest {
  name: string,
  email: string,
  password: string,
  rule: string,
  active: boolean
}

export async function registerUseCase({
  name, email, password, rule, active
}: RegisterUseCaseRequest) {
  const password_hash = await hash(password, 6)

  const userWithSameEmail = await prisma.user.findUnique({
    where: {
      email
    }
  })

  if (userWithSameEmail) {
    throw new Error('Email already exists')
  }

  await prisma.user.create({
    data: {
      name,
      email,
      password_hash,
      rule,
      active
    }
  })
}