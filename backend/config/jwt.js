require('dotenv').config();

module.exports = {
  secret: process.env.JWT_SECRET || 'Clave123', // Clave secreta para firmar tokens
  expiresIn: process.env.JWT_EXPIRES_IN || '1h', // Tiempo de expiración del token
  algorithms: ['HS256'], // Algoritmo de encriptación (usado para verificar)
  
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
    maxAge: 3600000, // 1 hora en ms (debe coincidir con expiresIn)
    sameSite: 'strict'
  }
};