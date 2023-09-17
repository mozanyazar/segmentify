import { showQuestion } from '../app/app.js'
import { getProducts } from '../services/products.js'

// LOCALSTORAGE PARSER
export const storeParser = () => JSON.parse(localStorage.getItem('store'))

// CHECK CURRENT CATEGORY TOTAL STEP
export const checkTotalNumberOfStep = async (store) => {
   if (!store) return 0
   const response = await fetch('../data/questions.json')
   const data = await response.json()

   const totalNumberOfSteps = data.find((element) => element.name === store.category).steps.length

   return totalNumberOfSteps
}

// UPDATES THE LOCAL STORAGE
export const updateLocalStorage = async (currentStep, subtype, value) => {
   var store = storeParser()

   if (!store) {
      localStorage.setItem('store', JSON.stringify({ step: currentStep, [subtype]: value }))
      return showQuestion(currentStep)
   }

   // Returns to the previous step
   if (currentStep < store.step) {
      store.step = currentStep
      delete store[subtype]

      localStorage.setItem('store', JSON.stringify(store))
      return showQuestion(currentStep)
   }

   // Update store and go to new step
   store[subtype] = value
   store.step = currentStep
   localStorage.setItem('store', JSON.stringify(store))

   //  We are in the final step, show the products
   const totalNumberOfSteps = await checkTotalNumberOfStep(store)
   if (currentStep === totalNumberOfSteps) return getProducts()

   // Else: goes to next step
   showQuestion(currentStep)
}
