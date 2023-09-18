import { getQuestion } from '../services/questions.js'
import { getProducts } from '../services/products.js'
import { storeParser, updateLocalStorage, checkTotalNumberOfStep } from '../utils/helper.js'

const form = document.getElementById('multi-step-form')
const dynamicArea = form.querySelector('.content')

// LOADING
export const showLoading = () => (dynamicArea.innerHTML = `<div class="loading">loading...</div>`)

// PRODUCT NOT FOUND
export const notFound = () => {
   dynamicArea.innerHTML = `
      <div class="not-found">
        <p >Products Not Found</p>
        <button id="back-step-0">back</button>
      </div>
    `

   const button = document.getElementById('back-step-0')

   button.addEventListener('click', (event) => {
      event.preventDefault()
      updateLocalStorage(2)
   })
}

// SHOW LAST STEP --- SHOW PRODUCTS
export const showProducts = (products) => {
   const product = products.map((product) => {
      return `
    <div class="swiper-slide">
        <div class="slider-image-wrapper"><img src=${product.image} loading="lazy" /></div>
        <p class="product-title">${product.name}</p>
        <p class="product-price">€ ${product.price}</p>
        <p class="product-old-price">${product.oldPrice ? '€' + product.oldPrice : ''}</p>
        <button disabled>VIEW PRODUCT</button>
        </div>
      `
   })

   dynamicArea.innerHTML = `
          <button id="go-step-0">Back Step 1</button>
          <div class="product-container">
          <div class="swiper mySwiper">
              <div class="swiper-wrapper">
                ${product.join('')}
              </div>
            
          </div>
          <div class="swiper-button-next"></div>
          <div class="swiper-button-prev"></div>
          <div class="swiper-pagination"></div>
          </div>

    `

   new Swiper('.mySwiper', {
      slidesPerView: 1,
      spaceBetween: 30,
      loop: true,
      pagination: {
         el: '.swiper-pagination',
         clickable: true,
      },
      navigation: {
         nextEl: '.swiper-button-next',
         prevEl: '.swiper-button-prev',
      },
   })

   if (product.length >= 15)
      document.querySelectorAll('.swiper-pagination-bullet').forEach((el) => (el.style.cssText = 'width:1.3%'))

   const backButton = document.getElementById('go-step-0')

   backButton.addEventListener('click', (event) => {
      event.preventDefault()
      updateLocalStorage(0)
   })
}

// SHOWING CURRENT QUESTION
export const showQuestion = async (currentStep) => {
   const [question, totalNumberOfSteps] = await Promise.all([
      getQuestion(currentStep),
      checkTotalNumberOfStep(storeParser()),
   ])

   const buttons = question.answers.map((btn) => {
      // Returns the answers as buttons and, if color selection is an active step, sets the background color accordingly.
      return `<button style=${
         question.subtype === 'color' ? `background-color:${btn === 'Cream' ? '#EADBC8' : btn}` : ''
      }>${btn}</button>`
   })

   const stepSpans = Array.from({ length: totalNumberOfSteps }, (_, index) => {
      return `<span class=${currentStep >= index ? 'active' : ''}></span>`
   })

   dynamicArea.innerHTML = `
  <div class="question">
   <p style=${!question.subtitle ? 'display:none' : ''}> ${question.subtitle}</p>
    <h1>${question.title}</h1>
    <div data-button=${question.subtype} class="step-buttons">
       ${buttons.join('')}
    </div>
    <div data-button=${question.subtype} class="prev-next-button-wrapper">
      <button><</button>
      <button>></button>
    </div>
    <div class="step-lines">
        ${stepSpans.join('')}
    </div>
    </div>
  `

   const answersButtons = document.querySelectorAll(`.step-buttons[data-button="${question.subtype}"] button`)

   // prev and next button listeners
   const prevButton = document.querySelectorAll(
      `.prev-next-button-wrapper[data-button="${question.subtype}"] button`
   )[0]
   const nextButton = document.querySelectorAll(
      `.prev-next-button-wrapper[data-button="${question.subtype}"] button`
   )[1]

   let selectedAnswer

   answersButtons.forEach((button, index) => {
      button.addEventListener('click', (event) => {
         event.preventDefault()

         // remove active class to all button
         for (let i = 0; i < answersButtons.length; i++) {
            if (index !== i) {
               answersButtons[i].classList.remove('active')
            }
         }

         // add active class to selected button
         button.classList.add('active')
         selectedAnswer = button.innerHTML
      })
   })

   // prev and next button listeners
   prevButton.addEventListener('click', (event) => {
      event.preventDefault()

      if (!storeParser() || storeParser().step === 0) return alert('Daha geride bir şey yok :)')
      updateLocalStorage(currentStep - 1, question.subtype, selectedAnswer)
   })

   nextButton.addEventListener('click', (event) => {
      event.preventDefault()

      if (!selectedAnswer) return alert('Seçim yapmadın nereye :)')
      updateLocalStorage(currentStep + 1, question.subtype, selectedAnswer)
   })
}

// DOM CONTENT LOADED
document.addEventListener('DOMContentLoaded', async () => {
   const store = storeParser()

   if (!store) return showQuestion(0)

   const totalNumberOfSteps = await checkTotalNumberOfStep(store)
   store.step === totalNumberOfSteps ? getProducts() : showQuestion(store.step)
})
