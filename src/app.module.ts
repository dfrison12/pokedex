import { join } from 'path'
import { Module } from '@nestjs/common'
import { ServeStaticModule } from '@nestjs/serve-static'
import { PokemonModule } from './pokemon/pokemon.module'
import { MongooseModule } from '@nestjs/mongoose'
import { CommonModule } from './common/common.module'
import { SeedModule } from './seed/seed.module'
import { ConfigModule } from '@nestjs/config'
import { EnvConfiguration } from './config/env.config'
import { JoiValidationSchema } from './config/joi.validation'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [EnvConfiguration], //pueden trabajar en conjunto ya que este hace converciones y mappeos y el otro validaciones.
      validationSchema: JoiValidationSchema
    }), // es importante esta linea antes de usar el procces.evn.MONGODB en el MongooseModule, debido que si esta linea se cuentra debajo nest al momento de intentar leer la variable de entorno la misma sera undefined. Nota> ademas el ConfigModel ofrece un servicio que nos permite hacer inyeccion de dependencias de nuestras variables de entorno.

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public') // path to the static files
    }),

    MongooseModule.forRoot(process.env.MONGODB),

    PokemonModule,

    CommonModule,

    SeedModule
  ]
})
export class AppModule {
  //Como esto es una classe y eventualmente la misma se intancia en un momento podemos agregarle un constructor.
  // Probaremos esto para ejecutar un console.log que imprima las varialbles de entorno.

  constructor() {
    // console.log(process.env) //infomacion sobre el ambiente y procesos que se estan corriendo. Pero si observamos bien no encontraremos las variables de entorno si no le indicamos a nest que las cargue y las lea desde el archivo .env (mirar variables de entrono en pdf NestJS) - nota: DESPUES DE INSTALAR ConfigModule tener en cuenta que todo incluido el puerto vendra como tipo string.
  }
}
