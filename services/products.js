import { showProducts, showLoading, notFound } from '../app/app.js'
import { storeParser } from '../utils/helper.js'

// GET PRODUCTS
export const getProducts = async () => {
   showLoading()
   const { category, price, color } = storeParser()

   const [minPrice, maxPrice] = price.split('-').map(Number)

   const response = await fetch('../data/products.json')
   const data = await response.json()

   const productsMatchingCategory = data.filter((product) => {
      if (product.category.map((el) => el.toLowerCase()).some((cat) => cat.includes(category.toLowerCase()))) {
         return product
      }
   })

   const products = productsMatchingCategory
      .filter((product) => product.colors.some((clr) => clr.toLowerCase() === color.toLowerCase()))
      .filter((product) => {
         if (price.includes('100+')) {
            return parseFloat(product.price) >= 100
         }
         return parseFloat(product.price) >= minPrice && parseFloat(product.price) <= maxPrice
      })

   // simulate loading
   setTimeout(() => {
      products.length > 0 ? showProducts(products) : notFound()
   }, 2000)
}
