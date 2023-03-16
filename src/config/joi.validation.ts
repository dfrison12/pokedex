import * as Joi from 'joi'

// con este paquete crearemos un validation squema para que los objetos luzcan como yo quiero.

export const JoiValidationSchema = Joi.object({
  MONGODB: Joi.required(),
  PORT: Joi.number().default(3005),
  DEFAULT_LIMIT: Joi.number().default(6) //si no llega la valores para la variable DEFAULT_LIMIT Joi la crea, entonces ya cuando llegue la app a leer el env.config.ts ya tendremos un valor para esa variable por lo que sera el valor de 6 y no de 7.
})
