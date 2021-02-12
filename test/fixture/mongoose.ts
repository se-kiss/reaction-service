import { Model, Document } from 'mongoose'

export const clearDatebase = async <T extends Document>(mongoose: Model<T>) => {
  await mongoose.deleteMany({})
  await mongoose.syncIndexes()
}