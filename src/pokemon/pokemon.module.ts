import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PokemonService } from './pokemon.service'
import { PokemonController } from './pokemon.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Pokemon, PokemonSchema } from './entities/pokemon.entity'

// nota: los modulos estan encampsulados de modo que puedan vivir por si solos, por eso debemos exportarlo para utilizarlo dentro de otro

@Module({
  controllers: [PokemonController],
  providers: [PokemonService],
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: Pokemon.name, schema: PokemonSchema }])
  ],
  exports: [MongooseModule]
})
export class PokemonModule {}
