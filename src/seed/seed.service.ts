import { Injectable } from '@nestjs/common'
//import axios, { AxiosInstance } from 'axios'
import { PokeResponse } from './interfaces/poke-response.interface'
import { InjectModel } from '@nestjs/mongoose'
import { Pokemon } from 'src/pokemon/entities/pokemon.entity'
import { Model } from 'mongoose'
import { AxiosAdapter } from '../common/adapters/axios.adapter'

@Injectable()
export class SeedService {
  // crea una dependencia de mi servicio - es buena practica hacerlo
  // crearemos un Provider para poder reemplazar esta depedencia de axios por otra que realize los mismo en caso de necesitarlo.

  // private readonly axios: AxiosInstance = axios  //Luego de utilizar el AxiosAdapter ya no necesitare las importaciones de axios.

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,

    private readonly http: AxiosAdapter
  ) {}

  async excecuteSeed() {
    //Previo a insertar los nuevos registros borraremos la coleccion de pokemon, para evitar intentar cargar duplciados y que dicha accion termine en un internal server error 500
    await this.pokemonModel.deleteMany({}) //delete * from pokemons;

    // const { data } = await axios.get<PokeResponse>(`https://pokeapi.co/api/v2/pokemon/?limit=650`) // Ya no usaremos axios en el servicio sino que utilizaremos el axios adapter.
    const data = await this.http.get<PokeResponse>(
      `https://pokeapi.co/api/v2/pokemon/?limit=650`
    ) //Ya no desestructuramos la data debido a que lo hicimos en el AxiosAdapter

    //logica para extraer la url de la data , y por consecuencia el id de los pokemon a traer para llenar la db.
    //Tenemos varias formas de insertar datos en nuestra base de mongoose, sin embargo algunas menos eficientes que otras.

    //Forma 1: en este caso deberiamos esperar a que se inserte el dato antes de avansar a la siguiente etapa en el ciclo lo cual lo hace poco eficiente.
    // data.results.forEach(async ({ name, url }) => {
    //   const segments = url.split('/');
    //   const no: number = +segments[segments.length - 2];

    //   const pokemon = await this.pokemonModel.create({ name, no });
    // });

    //Forma 2: mediante promesas insertandolas simultaneamente;
    // const insertPromisesArray = []

    // data.results.forEach(({ name, url }) => {
    //   const segments = url.split('/')
    //   const no: number = +segments[segments.length - 2]

    //   insertPromisesArray.push(this.pokemonModel.create({ name, no }))
    // })

    // //el siguiente arreglo tendria la resolucion de las distintas promesas.

    // const newArray = await Promise.all(insertPromisesArray)

    //Forma 3: forma optima haciendo multiples insercion usando estrategia de Forma 2, pero realizando una sola insercion en la base de datos.

    const pokemonToInsert: { name: string; no: number }[] = [] //podriamos rear la interfaz para el tipado de pokemonToInsert

    data.results.forEach(({ name, url }) => {
      const segments = url.split('/')
      const no: number = +segments[segments.length - 2]

      pokemonToInsert.push({ name, no }) //Ejemplo: [{name:bulbasaur,no: 1}]
    })

    await this.pokemonModel.insertMany(pokemonToInsert)
    //Si analizaramos como se insertara en SQL, la insercion multiple se podria ver de la siguiente manera
    // Insert into pokemons (name, no)
    //  (name: bulsaur, no:1)
    //  (name: pikachu, no:2)
    //  (name: charuzard, no:3)
    //  (name: mewtwo, no:4) ... etc.

    return 'Seed executed'
  }
}
