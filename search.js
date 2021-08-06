
import { firebaseDB } from "./FB.js"

const bodyEl = document.getElementById('bodyWrapper')
const searchInput = document.getElementById('search_input')
const searchBtn = document.getElementById('search_btn')







async function getSearchResult() {

  const result = await firebase.firestore().collection('Home').get()
  

    for (let i = 0; i < result.docs.length; i++) {
        
            bodyEl.innerHTML += `
            <div class = 'bodyItem' id='${result.docs[i].id}' >
            <img class='bodyItem_img' src="${result.docs[i].data().thumbnail}" alt="">
            <h3 class='bodyItem_eTitle'>${result.docs[i].data().eTitle.toUpperCase()}</h3>
            <p class='bodyItem_vTitle'>${result.docs[i].data().vTitle}</p>

            <div class='bodyLeft-item-viewer'> 
            <i class="fas fa-user"></i>
            <p class = 'bodyLeft-item-viewer_count' >0</p>
            <p class = 'bodyLeft-item-viewer_content'>Lượt xem</p>
            </div>
            </div> 
            `
      
    }



    // Chuyển trang 
    const x = bodyEl.querySelectorAll('.bodyItem')
    console.log(x.length)
    x.forEach((value) => {

        value.addEventListener('click', () => {
            localStorage.setItem('id', value.id)
            window.location.assign('detail.html')

        })
    })


    searchBtn.addEventListener('click', () => {
        bodyEl.innerHTML = ''
        for (let i = 0; i < result.docs.length; i++) {
            if (result.docs[i].data().eTitle.toLowerCase().includes(searchInput.value.toLowerCase())
                || result.docs[i].data().vTitle.toLowerCase().includes(searchInput.value.toLowerCase())
            ) {
               
                bodyEl.innerHTML += `
                <div class = 'bodyItem' id='${result.docs[i].id}' >
                <img class='bodyItem_img' src="${result.docs[i].data().thumbnail}" alt="">
                <h3 class='bodyItem_eTitle'>${result.docs[i].data().eTitle.toUpperCase()}</h3>
                <p class='bodyItem_vTitle'>${result.docs[i].data().vTitle}</p>
    
                <div class='bodyLeft-item-viewer'> 
                <i class="fas fa-user"></i>
                <p class = 'bodyLeft-item-viewer_count' >0</p>
                <p class = 'bodyLeft-item-viewer_content'>Lượt xem</p>
                </div>
                </div> 
                
                `
            }
          
        }


        const x = bodyEl.querySelectorAll('.bodyItem')
        console.log(x.length)

        x.forEach((value) => {

            value.addEventListener('click', () => {
                localStorage.setItem('id', value.id)
                window.location.assign('detail.html')

            })
        })
    })

}
getSearchResult()





document.getElementById('navbarLeft-detail_Home').addEventListener('click', () => {
    // localStorage.removeItem('keyword')
    window.location.assign('home.html')
})








