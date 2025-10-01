import Cookies from 'js-cookie';

const TOKEN_KEY = "auth_token";

// Salva o token no Cookie. Este cookie é enviado automaticamente
// em todas as requisições para o seu domínio, permitindo que o Middleware
// o leia no servidor/Edge.
export function setToken(token: string) {
  // Configuração recomendada para autenticação:
  Cookies.set(TOKEN_KEY, token, {
    expires: 7, 
    secure: process.env.NODE_ENV === 'production', 
    sameSite: 'Lax', 
    path: '/', 
  });
}

// Obtém o token do Cookie.
export function getToken(): string | undefined {
  return Cookies.get(TOKEN_KEY);
}

// Remove o token.
export function removeToken() {
  Cookies.remove(TOKEN_KEY, { path: '/' }); 
}

// Verifica se o token existe.
export function isAuthenticated(): boolean {
  return !!getToken();
}