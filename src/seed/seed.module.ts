import { Module } from '@nestjs/common'
import { SeedService } from './seed.service'
import { SeedController } from './seed.controller'
import { PokemonModule } from '../pokemon/pokemon.module'
import { CommonModule } from '../common/common.module'

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [PokemonModule, CommonModule] //CommoModule contiene nuestro provider con el axiosAdapter
})
export class SeedModule {}
