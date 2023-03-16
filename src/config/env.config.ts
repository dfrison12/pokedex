export const EnvConfiguration = () => ({
  enviroment: process.env.NODE_ENV || 'dev',
  mongodb: process.env.MONGODB,
  port: process.env.PORT || 3002,
  defaultLimit: +process.env.DEFAULT_LIMIT || 3 //si no lo transformo devolvera un string al acceder a esta propiedad debido a que nos llega un 6(number) desde el validation schema, sin embargo el envConfiguration lo trabaja como si llegara desde .env directamente. TENERLO EN CUENTA! Porque ? porque las variables de entornos por defecto se graban como strings.
})

//nota: esta config solo se puede usar en un modulo dentro de nestJs , por lo que no se podra utilizar en main.ts ya que el mismo esta fuera de los building blocks
