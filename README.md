## Nasıl çalışır? Özet

###### Uygulamada kullanıcıdan aldığımız cevapları ve kaçıncı adımda olduğumuzu `store` isimdeki bir localStorage'a kaydederek kullanıcının sayfadan çıktığı veya sayfayı yenilediği durumlarda aynı adımdan devam edebilmesine olanak sağlar.

###### Kategorilerin adım sayısından html'de gördüğümüz tüm veriler dinamik olarak JSON dosyasından gelir ve eğer bu jsonları bir api olarak düşünürsek gelecek veri, örneğin bir kategorinin soru sayısı değişse dahi uygulama düzgün şekilde çalışmaya devam eder.

### Dosya düzeni

---

#### app/app.js

-  Ana javascript dosyası `app` klasörü altındaki `app.js`'tir. Bütün HTML buradan generate edilir.

---

#### utils/helper.js

-  local storage update işlemleri ve seçilen kategori'de kaç step olduğunun sayısını return eden fonksiyon buradadır.

---

#### services/\*

-  `JSON` dosyalarının fetch edildiği dosyalardır.

---

---

### Css

-  Cevap butonlarını javascript ile oluştururken kapsayıcısına data attribute olarak json'dan gelen question subtype'ını verdim bu sayede sadece css selektörlerini kullanarak her soruda butonların stillerini değiştirebildim.

```

  dynamicArea.innerHTML = `
  <div class="question">
  ...
    <div data-button=${question.subtype} class="step-buttons">
       ${buttons.join('')}
    </div>
    ...
    </div>
  `
    - css selector
    .step-buttons[data-button='price'] {
        display:grid;
        ...
    }

```

-  Renk seçim butonlarında background rengini direkt JSON dosyasından gelen renk isimlerini background-color olarak tanımladım.

```
 const buttons = question.answers.map((btn) => {
      return `<button style=${
         question.subtype === 'color' ? `background-color:${btn === 'Cream' ? '#EADBC8' : btn}` : ''
      }>${btn}</button>`
   })
```

### Javascript

#### Uygulama `app.js` dosyasındaki "DOMContentLoaded" event dinleyicisi ile başlar ve localStorage'ı kontrol eder. Eğer boş ise `showQuestion` fonksiyonunu çağırır ve ilk soruyu generate eder.

```
document.addEventListener('DOMContentLoaded', async () => {
   const store = storeParser()

   if (!store) return showQuestion(0)

   const totalNumberOfSteps = await checkTotalNumberOfStep(store)
   store.step === totalNumberOfSteps ? getProducts() : showQuestion(store.step)
})

```

#### checkTotalNumberOfStep

```
export const checkTotalNumberOfStep = async (store) => {
   if (!store) return 0
   const response = await fetch('../data/questions.json')
   const data = await response.json()

   const totalNumberOfSteps = data.find((element) => element.name === store.category).steps.length

   return totalNumberOfSteps
}


```

-  Yukarıdaki fonksiyonun yazılmasındaki amaç belirli bir kategoride adım sayısının değişebilecek olması. İşimize yaradığı alanlar ↓↓↓

```
 - UI'da gösterdiğimiz alt çubukları dinamik olarak arttırmak (aşağıdaki kod parçası)
 const stepSpans = Array.from({ length: totalNumberOfSteps }, (_, index) => {
      return `<span class=${currentStep >= index ? 'active' : ''}></span>`
   })

```

```
  - Bulunduğumuz adım eğer son adımsa ürünleri döndürdüğümüz alanlar.
  const totalNumberOfSteps = await checkTotalNumberOfStep(store)
  if (currentStep === totalNumberOfSteps) return getProducts()

```
