// import { NextRequest, NextResponse } from "next/server";
// import { auth } from "@/auth.config";
// import { getToken } from "next-auth/jwt";

// const failedAttempts = new Map<string, {attempts: number, blockedUntil:number}>();
// const BLOCK_TIME_MS = 60*1000;
// const MAX_INTENTO = 3;


// export async function middleware(req: NextRequest) {
//   // TODO 2 bloque para queno aya barios peticiones al login
//   // obtener  token con la clave secreta
//   const token = await getToken({ req, secret: process.env.AUTH_SECRET ?? 'fallback_secret' });

//   if(token && ['/auth/login', '/auth/register'].includes(req.nextUrl.pathname)){
//     return NextResponse.rewrite(new URL('/', req.url))
//   }
  
//   const ip = req.ip?? req.headers.get('x-forwarded-for') ?? 'unknown';
//   const attemptData = failedAttempts.get(ip);

//   if(attemptData){
//     const {blockedUntil} = attemptData;
//     if(Date.now() < blockedUntil){
//       return NextResponse.json({message:'Bloqueado'}, {status: 429});
//     }
//     if (Date.now() >= blockedUntil) {
//       failedAttempts.set(ip, {attempts:0, blockedUntil:0})
      
//     }
   
//   }
//   // TODO FIN 2
//   // Evitar interceptar archivos estáticos y APIs
//   if (
//     req.nextUrl.pathname.startsWith("/_next/") ||
//     req.nextUrl.pathname.startsWith("/api/") ||
//     req.nextUrl.pathname.startsWith("/static/")
//   ) {
//     return NextResponse.next();
//   }

//   const session = await auth();
//     // 📌 4️⃣ Ajustar protección de rutas según la estructura de `src/app`
//     const isProtectedRouter = req.nextUrl.pathname.startsWith("/admin") || req.nextUrl.pathname.startsWith("/dashboard");

//   if (!session && isProtectedRouter) {
//     return NextResponse.redirect(new URL("/auth/login", req.url), 307);
//   }

//   return NextResponse.next();
// }

// // TODO: funcion para registar un intento fallido
// export const failedAttempt = (ip: string) => {
//   const attemptData = failedAttempts.get(ip) ?? {attempts: 0, blockedUntil: 0};
//   attemptData.attempts++;

//   if(attemptData.attempts >= MAX_INTENTO){
//     attemptData.blockedUntil = Date.now() + BLOCK_TIME_MS; //bloquear por tiempo definido
//   }

//   failedAttempts.set(ip, attemptData);
// }

// // Configurar rutas protegidas
// export const config = {
//   matcher: ["/auth/login", "/auth/register", "/admin/:path*", "/dashboard/:path*"], // Solo intercepta estas rutas
//   // matcher: ["/", "/admin/:path*", "/dashboard/:path*"], // Agregar "/" para forzar el login antes de acceder a la home
// };




import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth.config";
import { getToken } from "next-auth/jwt";

const failedAttempts = new Map<string, { attempts: number; blockedUntil: number }>();
const BLOCK_TIME_MS = 60 * 1000; // 1 minuto
const MAX_INTENTOS = 3;

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET ?? "fallback_secret" });
  const ip = req.ip ?? req.headers.get("x-forwarded-for") ?? "unknown";
  const attemptData = failedAttempts.get(ip);

  // 📌 1️⃣ Bloquear /auth/login y /auth/register si ya está autenticado
  if (token && ["/auth/login", "/auth/register"].includes(req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/", req.url), 307); // 🔥 Ahora sí cambia la URL
  }

  // 📌 2️⃣ Bloquear intento de login tras 3 fallos
  if (req.nextUrl.pathname === "/auth/login" && attemptData) {
    const { blockedUntil } = attemptData;
    
    if (Date.now() < blockedUntil) {
      return NextResponse.redirect(new URL('/auth/login?error=blocked'), 303);
    }

    // Restablecer intentos después del bloqueo
    if (Date.now() >= blockedUntil) {
      failedAttempts.set(ip, { attempts: 0, blockedUntil: 0 });
    }
  }

  // 📌 3️⃣ Evitar interceptar archivos estáticos
  if (
    req.nextUrl.pathname.startsWith("/_next/") ||
    req.nextUrl.pathname.startsWith("/static/")
  ) {
    return NextResponse.next();
  }

  // 📌 4️⃣ Ajustar protección de rutas según la estructura de `src/app`
  const isProtectedRoute = req.nextUrl.pathname.startsWith("/admin") || req.nextUrl.pathname.startsWith("/dashboard");

  const session = await auth();
  if (!session && isProtectedRoute) {
    return NextResponse.redirect(new URL("/auth/login", req.url), 307); // 🔥 Ahora sí cambia la URL
  }

  return NextResponse.next();
}

// ✅ Función para registrar intentos fallidos en el login
export const failedAttempt = (ip: string) => {
  const attemptData = failedAttempts.get(ip) ?? { attempts: 0, blockedUntil: 0 };
  attemptData.attempts++;

  if (attemptData.attempts >= MAX_INTENTOS) {
    attemptData.blockedUntil = Date.now() + BLOCK_TIME_MS;
  }

  failedAttempts.set(ip, attemptData); // 🔥 Se actualiza correctamente
};

// ✅ Configurar rutas protegidas correctamente
export const config = {
  matcher: ["/auth/login", "/auth/register", "/admin/:path*", "/dashboard/:path*"], // Solo intercepta estas rutas
};
