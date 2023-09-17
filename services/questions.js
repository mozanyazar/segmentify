import { storeParser } from '../utils/helper.js'

// GET QUESTION
export const getQuestion = async (currentStep) => {
   const store = storeParser()
   const response = await fetch('../data/questions.json')
   const data = await response.json()

   // if store or category doesn't exist return first question
   if (!store || !store.category) return data[0].steps[0]

   const question = data
      .find((element) => element.name === store.category)
      .steps.find((element) => element.step === currentStep)

   return question
}
