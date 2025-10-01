// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value

  // Se não houver token, redireciona para a página de login (raiz '/')
  if (!token) {
    const loginUrl = new URL('/', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // Se houver token, permite a navegação para a rota solicitada.
  return NextResponse.next()
}

export const config = {
  // O middleware é aplicado APENAS em rotas dentro de /dashboard.
  // Isso impede que ele rode na raiz ('/') e cause o loop.
  matcher: '/dashboard/((?!api|_next/static|_next/image|favicon.ico).*)',
}