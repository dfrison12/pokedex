import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  BadRequestException
} from '@nestjs/common'
import { isValidObjectId } from 'mongoose'

@Injectable()
export class ParseMongoIdPipe implements PipeTransform {
  //Nota: recordar que los pipes, transforman la data, fisicamente cambia el tipo de dato.
  transform(value: string, metadata: ArgumentMetadata) {
    if (!isValidObjectId(value)) {
      throw new BadRequestException(`${value} is not valid MondoId`)
    }

    return value
  }
}
