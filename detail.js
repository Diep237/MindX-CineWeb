import { firebaseDB } from "./FB.js"

const thumbnailImg = document.getElementById('body-box-left_img')
const engTitle = document.querySelector('.body-box-center-title h3')
const vieTitle = document.querySelector('.body-box-center-title p')
const description = document.querySelector('.body-box-center-content_description')
const nation = document.querySelector('.body-box-center-content-Info_nation')
const gerne = document.querySelector('.body-box-center-content-Info_gerne')
const director = document.querySelector('.body-box-center-content-Info_director')
const actors = document.querySelector('.body-box-center-content-Info_actors')


const cmtInput = document.getElementById('comment-input')

// Click
const idSelected = localStorage.getItem('id')
async function getData() {

    // console.log(idSelected)
    const result = await firebase.firestore().collection('Home').doc(idSelected).get()
    const showText = 'Đang cập nhật'

    thumbnailImg.src = result.data().thumbnail
    engTitle.innerText = result.data().eTitle.toUpperCase()
    vieTitle.innerText = result.data().vTitle
    description.innerText = result.data().description != undefined ? result.data().description : showText;
    nation.innerText = result.data().nation != undefined ? result.data().nation : showText;
    actors.innerText = result.data().actors != undefined ? result.data().actors : showText;
    gerne.innerText = result.data().gerne != undefined ? result.data().gerne : showText;
    director.innerText = result.data().director != undefined ? result.data().director : showText;

}
getData()



document.getElementById('navbarLeft-detail_Search').addEventListener('click', () => {
    // localStorage.removeItem('keyword')
    window.location.assign('search.html')

})

document.getElementById('navbarLeft-detail_Home').addEventListener('click', () => {
    // localStorage.removeItem('keyword')
    window.location.assign('home.html')

})




const loginId = localStorage.getItem('loginId')

document.querySelector('.comment_btn').addEventListener('click', (e) => {

    if (loginId == null) {
        window.alert('Bạn phải đăng nhập để bình luận')
    } else if (loginId != null && cmtInput != '') {

        async function addCmt() {
            const data = await firebase.firestore().collection('Users').doc(loginId).get()

            firebase.firestore().collection('Home').doc(idSelected)
                .collection('viewers').add({
                    userId: loginId,
                    userName: data.data().name,
                    userCmts: cmtInput.value,
                    createAt: firebase.firestore.FieldValue.serverTimestamp()
                }).then(function (docRef) {

                    async function getId() {
                        const dataX = await firebase.firestore().collection('Home').doc(idSelected)
                            .collection('viewers').doc(docRef.id).get()
                        firebase.database().ref('movie').push().set({
                            rtId: idSelected,
                            rtUserId: dataX.data().userId,
                            rtUserName: dataX.data().userName,
                            rtUserCmts: dataX.data().userCmts,
                            rtViewerId: docRef.id,

                        })

                    }
                    getId()

                })
        }
        addCmt()
    }
})






firebase.database().ref('movie').orderByChild('rtId').equalTo(idSelected)
    .on("child_added", (snapshot) => {
        document.getElementById('RTsec').innerHTML += `
        <div class='userComment' id = 'cmt-${snapshot.key}'>
        <div class='userComment_image'>
            <img src="https://i.ibb.co/svd6QPK/default-avatar.jpg" alt="">
        </div>

        <div class='userComment_cmt'>
            <h4 id = 'userName-${snapshot.key}'>${snapshot.val().rtUserName}</h4>
            <p id = 'userCmt-${snapshot.key}'>${snapshot.val().rtUserCmts}</p>

            <div id = 'userUpdate-${snapshot.key}' class='userComment_cmt_update'contenteditable="true"></div>
        </div>
        

        <div class='ellipsis' id = 'ellipsis-${snapshot.key}' >  
        
            <i id = '${snapshot.val().rtViewerId}' class="fas fa-ellipsis-v"></i>

            <div class = 'ellipsis-option'>
                <div class = 'ellipsis-option_update'>
                    <i class="fas fa-pen"></i>
                    <p>Chỉnh sửa</p>
                </div>
                <div class = 'ellipsis-option_delete' id='${snapshot.key}'>
                    <i class="fas fa-trash"></i>
                    <p>Xóa</p>
                </div>
                <div class = 'ellipsis-option_report'>
                    <i class="fas fa-flag"></i>
                    <p>Báo cáo</p>
                </div>

            </div>

          
        </div>

        <div class = 'update-option' id = 'updateOption-${snapshot.key}'>
            <div class = 'update-option_cancel'>HỦY</div>
            <div class = 'update-option_save' id = 'save-${snapshot.key}'>LƯU</div>
        </div>

        
    </div>

        `


        console.log('sbc')



        // Show/Hide options
        const ellipsisIcon = RTsec.querySelectorAll('.fas.fa-ellipsis-v')
        const option = RTsec.querySelectorAll('.ellipsis-option')

        if (loginId != null) {
            for (let i = 0; i < ellipsisIcon.length; i++) {
                ellipsisIcon[i].addEventListener('click', (e) => {
                    if (window.getComputedStyle(option[i]).display == 'none') {
                        e.target.nextElementSibling.style.display = 'block'
                    } else {
                        e.target.nextElementSibling.style.display = 'none'
                    }
                })
            }
        }



        async function handleCmt() {
            const opt = await firebase.firestore().collection('Home').doc(idSelected)
                .collection('viewers').where('userId', '==', `${loginId}`).get()

            for (let i = 0; i < ellipsisIcon.length; i++) {
                ellipsisIcon[i].addEventListener('click', (e) => {
                    if (opt.docs.some((i) => {
                        return i.id == e.target.id
                    })) {
                        e.target.nextElementSibling.lastElementChild.style.display = 'none'
                    } else {
                        e.target.nextElementSibling.firstElementChild.style.display = 'none'
                        e.target.nextElementSibling.firstElementChild.nextElementSibling.style.display = 'none'
                    }
                })
            }



            // 2.XÓA 
            const del = RTsec.querySelectorAll('.ellipsis-option_delete')
            for (let i = 0; i < del.length; i++) {
                del[i].addEventListener('click', (e) => {
                    const delId = e.target.parentElement.id
                    // console.log(delId)
                    if (delId) {
                        firebase.database().ref('movie').child(delId).remove()
                    }
                })

            }

            firebase.database().ref('movie').on("child_removed", (snapshot) => {

                if (document.getElementById("cmt-".concat(snapshot.key))) {
                    document.getElementById("cmt-".concat(snapshot.key)).remove()
                }

            })



            const delFS = document.querySelectorAll('.ellipsis-option_delete')
            const cmtRemoved = await firebase.firestore().collection('Home').doc(idSelected)
                .collection('viewers')
            for (let i = 0; i < delFS.length; i++) {

                delFS.item(i).addEventListener('click', (e) => {
                    if (e.target.parentElement.parentElement.previousElementSibling.id) {
                        const removeId = e.target.parentElement.parentElement.previousElementSibling.id
                        cmtRemoved.doc(removeId).delete()
                    }
                })
            }



            const update = RTsec.querySelectorAll('.ellipsis-option_update')
            console.log(update.length)
            for (let i = 0; i < update.length; i++) {

                update[i].addEventListener('click', (e) => {






                    e.target.parentElement.parentElement.parentElement.nextElementSibling.style.display = 'flex'

                    console.log(e.target.parentElement.parentElement.parentElement.previousElementSibling
                        .firstElementChild.nextElementSibling)


                    if (e.target.parentElement.parentElement.parentElement.previousElementSibling
                        .firstElementChild.nextElementSibling) {

                        e.target.parentElement.parentElement.parentElement.previousElementSibling
                            .firstElementChild.nextElementSibling
                            .style.display = 'none'
                    }



                    e.target.parentElement.parentElement.parentElement.previousElementSibling
                        .lastElementChild
                        .style.display = 'block'


                    e.target.parentElement.parentElement.parentElement.style.display = 'none'








                    let oldCmt = e.target.parentElement.parentElement.parentElement
                        .previousElementSibling.lastElementChild



                    oldCmt.innerText = e.target.parentElement.parentElement.parentElement
                        .previousElementSibling.lastElementChild.previousElementSibling.innerText





                    oldCmt.addEventListener('blur', event => {
                        const newCmt = event.target.innerText
                        const save = [...RTsec.getElementsByClassName('update-option_save')]

                        save.forEach(element => {
                            element.addEventListener('click', (i) => {
                                const updateId = i.target.id.slice(5)


                                firebase.database().ref('movie').child(updateId)
                                    .update({ rtUserCmts: newCmt })

                            })
                        });

                    })

                })

            }

            firebase.database().ref('movie').on("child_changed", (snapshot) => {
                document.getElementById(`updateOption-${snapshot.key}`).style.display = 'none'
                document.getElementById(`userUpdate-${snapshot.key}`).style.display = 'none'
                document.getElementById(`userCmt-${snapshot.key}`).style.display = 'block'
                document.getElementById(`userCmt-${snapshot.key}`).innerHTML = snapshot.val().rtUserCmts
                document.getElementById(`ellipsis-${snapshot.key}`).style.display = 'block'
                document.getElementById(`ellipsis-${snapshot.key}`).lastElementChild.style.display = 'none'
            })
        }

        handleCmt()

    })



// Go to movie


document.getElementById('body-box-left').addEventListener('click', () => {
    localStorage.setItem('movieId', idSelected)
    window.location.assign('movie.html')

})


