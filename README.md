- [x] Criar usuários
- [x] Listar usuários
- [x] Atualizar de usuários
- [x] Retornar usuários pela rule

- [x] Criar times
- [x] Listar todos os times
- [] Atualizar de times
- [x] Retornar os times criados por um usuário - validar retorno de times

- [X] Criar tabela de log que registre as alterações nas tabelas

- [] Utilizar Helpers e factories nos testes

- [] Criar features
- [] Listar features
- [] Atualizar de features
- [] Listar as features de um time
- [] Listar as features de um usuário


- [] Criar testcases
- [] Listar testcases
- [] Atualizar de testcases
- [] Listar os testscases de uma feature
- [] Listar os tests cases de um usuário



Sugestões Adicionais

Considere usar fixtures ou factories para criar dados de teste, reduzindo a repetição no beforeEach
Implemente testes de limites e casos de borda, como:

Atualizar para um nome vazio ou muito longo
Verificar comportamento ao passar dados inválidos


Use mocks mais específicos para testar o comportamento de erros internos do repositório
Adicione testes para verificar autorização, se aplicável (ex: verificar se um usuário só pode atualizar equipes próprias)
Considere implementar testes de integração além destes testes unitários

Considere testes para validações adicionais:

Testar validação do formato de email
Testar limite máximo de caracteres para o nome


Adicione testes para casos de borda:

Comportamento quando undefined é passado para campos específicos
Comportamento com campos vazios como name: ''


Teste de regras de negócio específicas:

Regras específicas para mudança de role (ex: verificar se apenas admin pode mudar roles)
Regras para desativação de usuários (ex: se existem dependências)


Refatoração para reduzir duplicação:

Considere usar factories ou helpers para criação de usuários de teste
Implemente funções auxiliares para verificações comuns

