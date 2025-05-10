import { Types } from 'mongoose'

export type TFeatures = {
  featureName: string
}

export interface IProduct {
  productName: string
  slug: string
  description: string
  brand?: Types.ObjectId
  category?: Types.ObjectId
  subcategory?: Types.ObjectId
  variant?: Types.ObjectId
  price: number
  quantity: number
  stock: number
  discountPercentage: number
  tax: number
  features: TFeatures[]
  images: string[]
  isActive: boolean
  isNewArrival: boolean
  averageRating: number
  totalReviews: number
}
