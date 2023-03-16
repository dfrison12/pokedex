import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectModel } from '@nestjs/mongoose'
import { isValidObjectId, Model } from 'mongoose'
import { Pokemon } from './entities/pokemon.entity'
import { CreatePokemonDto } from './dto/create-pokemon.dto'
import { UpdatePokemonDto } from './dto/update-pokemon.dto'
import { PaginationDto } from '../common/dto/pagination.dto'

@Injectable()
export class PokemonService {
  // aqui van las propiedades de la class
  private defaultLimit: number

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly configService: ConfigService
  ) {
    // console.log(process.env.DEFAUL_LIMIT)
    this.defaultLimit = configService.get<number>('defaultLimit') // esta seria la forma correcta de traer las variables de entorno al servicio, si observamos el casi de la linea de arriba obtenemos un undefined mientras que de esta forma obtenemos el valor correcto desde las variables de entorno.
  }

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase()

    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto)

      return pokemon
    } catch (error) {
      this.handleExceptions(error)
    }
  }

  findAll(paginationDto: PaginationDto) {
    const { limit = this.defaultLimit, offset = 0 } = paginationDto

    return this.pokemonModel
      .find()
      .limit(limit)
      .skip(offset)
      .sort({ no: 1 })
      .select('-__v')
  }

  async findOne(term: string) {
    let pokemon: Pokemon
    if (!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({ no: term })
    }

    //Mongo ID verify
    if (!pokemon && isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term)
    }

    //Name verify
    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({
        name: term.toLocaleLowerCase().trim()
      })
    }

    if (!pokemon) {
      throw new NotFoundException(
        `Pokemon with id, name ir no "${term}" not found`
      )
    }
    return pokemon
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(term)
    if (updatePokemonDto.name)
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase()

    // Forma 1 - para actualizar y devolver esos datos

    // const updatedPokemon = await pokemon.updateOne(updatePokemonDto, {
    //   new: true,
    // }); // seteamos new con el fin de que al completarse la llamada nos devuelva los nuevos valores y no los anteriores
    // return updatedPokemon;

    // Forma 2 - para actualizar y devolver esos datos
    try {
      await pokemon.updateOne(updatePokemonDto)

      return { ...pokemon.toJSON(), ...updatePokemonDto }
    } catch (error) {
      this.handleExceptions(error)
    }
  }

  async remove(id: string) {
    //Alternativa 1:
    // const pokemon = await this.findOne(id);
    // await pokemon.deleteOne();
    //return {id}

    // Alternativa 2: la siguiente linea nos ayudaria a buscarlo y eliminarlo en un solo llamado pero debemos asegurarnos que le estoy enviando un id - de esta forma evitamos consultar dos veces la db.

    // const result = this.pokemonModel.findByIdAndDelete(id); -- esta alternativa tiene el problema de que si no encuentra el doc correspondiente al id usado , de igual manera genera un status 200 lo cual le podria dar un falso positivo el frontend

    // const result = await this.pokemonModel.deleteMany({}) -- cuidado con este metodo, (delete * pokemons), borraria toda la data de la coleccion

    // una buena alternativa para solucionar dicho problema seria usar el metodo deleteOne y comparar el mongoid de la db con el mongoid del pipe, ya que dicho metodo nos devuelve un objeto donde podremos observar los registros eliminados
    const { deletedCount } = await this.pokemonModel.deleteOne({
      _id: id
    })

    if (deletedCount === 0) {
      throw new BadRequestException(`Pokemon with id "${id}" not found`)
    }
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Pokemon exists in db ${JSON.stringify(error.keyValue)}`
      )
    }
    console.log(error)
    throw new InternalServerErrorException(
      `Can't create/Update Pokemon - Check server logs`
    )
  }
}
