import { Module } from '@nestjs/common'
import { AxiosAdapter } from './adapters/axios.adapter'

@Module({
  providers: [AxiosAdapter],
  exports: [AxiosAdapter] // linea de codigo necesaria para que sea visible y accesible.
})
export class CommonModule {}
