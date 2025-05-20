module.exports = {
  port: process.env.PORT || 3001,
  jwtSecret: 'your-fixed-secret-key-1234567890', // Фиксированный секретный ключ
  jwtExpiresIn: '1d' // Токен действителен 1 день
};