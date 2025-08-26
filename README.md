# Autorização

## Providers / useAuth

signIn: login do usuário
signInMFA: Login quando requer 2FA
logout: sair do sistema

### Os metodos de signIn consultam a service auth.ts sentro de lib/api:

signIn: Requisição para o endpoint de autenticação
signInMFA: Requisição para o endpoint de autenticação por 2FA
getCurrentUser: Requisição para buscar usuário a partir de um token ja existente.
getCorporations: requisição para listar corporações a partir do login
logout: sair do sistema
isAuthenticated: Consulta se existe um token no navegador.
