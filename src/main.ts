import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.setGlobalPrefix('api/v2')

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true, //activamos si queremos que trabnforme esa informacion que pasa por los dto, la desventaja es que tiene mayor costo de memoria utilizada
      transformOptions: {
        enableImplicitConversion: true //esta al igual que el transform lo necesitacion ya que al usar el decorador de query paramt la inform de los params en el path llega como string y al validar nuestro dto establecemos que dichos params serian numbers. Recordar que: validamos tanto el limit y el offset del paginado como numeros.
      }
    })
  )
  await app.listen(process.env.PORT) //main se encuentra fuera de un building block de nest por lo que no puedo hacer inyeccion de dependencias por eso ponemos directamente el process.env.PORT.
  console.log(`app running on port ${process.env.PORT}`)
}
bootstrap()
