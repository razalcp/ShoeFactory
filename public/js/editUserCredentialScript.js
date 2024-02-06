const userName = document.getElementById('username')
const rform = document.getElementById('logform')
const error1 = document.getElementById('error1')
const userEmail = document.getElementById('useremail')
const error2 = document.getElementById('error2')
const userMobile =document.getElementById('usermobile')
const error3 =document.getElementById('error3')
const password =document.getElementById('userpassword')
const error4 =document.getElementById('error4')
const confirmpassword =document.getElementById('confirmpassword')
const error5 =document.getElementById('error5')


function nameValidate() {
    
    const namePattern =/^[A-Za-z]+(?:\s[A-Za-z]+)?$/
    const nameval =userName.value
    console.log(nameval);

    if(!namePattern.test(nameval)){
      
        error1.style.display = 'block'
        error1.innerHTML = 'Enter a Valid Name'
    } else {
        error1.style.display = 'none'
        error1.innerHTML = ''
    }

}

function emailValidate() {

    const emailpattern = /^([a-zA-Z][a-zA-Z0-9._-]*)@(gmail\.com|yahoo\.com|outlook\.com)$/
    const emailval=userEmail.value

    if(!emailpattern.test(emailval)){
        error2.style.display='block'
        error2.innerHTML='Enter a valid Email address'
    } else {
        error2.style.display ='none'
        error2.innerHTML =''
    }

}

function mobileValidate() {
    const mobileValue = userMobile.value
    const mobregex = /^(?!0{10})[6789]\d{9}$/;

    if(!mobregex.test(mobileValue)) {
        error3.style.display='block'
        error3.innerHTML='Enter a valid Mobile Number'
    } else {
        error3.style.display ='none'
        error3.innerHTML =''
    }


}


function passwordValidate(e){
    const passval = password.value
    const alpha = /[a-zA-Z]/
    const digit = /\d/
    if(passval.length < 8)
    {   
        error4.style.display = "block"
        error4.innerHTML = "Must have atleast 8 characters"
    }
    else if(!alpha.test(passval) || !digit.test(passval) )
    {
        error4.style.display = "block"
        error4.innerHTML = "Should contain Numbers and Alphabets!!"
    }
    else{

        error4.style.display = "none"
        error4.innerHTML = ""
    }
}



function confirmpasswordValidate(e){
    const passval = confirmpassword.value
    const alpha = /[a-zA-Z]/
    const digit = /\d/
    if(passval.length < 8)
    {   
        error5.style.display = "block"
        error5.innerHTML = "Must have atleast 8 characters"
    }
    else if(!alpha.test(passval) || !digit.test(passval) )
    {
        error5.style.display = "block"
        error5.innerHTML = "Should contain Numbers and Alphabets!!"
    }
    else{

        error5.style.display = "none"
        error5.innerHTML = ""
    }
}








userName.addEventListener('blur',nameValidate)
userEmail.addEventListener('blur',emailValidate)
userMobile.addEventListener('blur',mobileValidate)
password.addEventListener('blur',passwordValidate)
// confirmpassword.addEventListener('blur',confirmpasswordValidate) 

rform.addEventListener('submit',function(e){

    console.log("Entry");
    nameValidate()
    emailValidate()
    mobileValidate()
    passwordValidate()




    if(error1.innerHTML || error2.innerHTML || error3.innerHTML || error4.innerHTML|| error5.innerHTML){
        console.log("prevent default");
        e.preventDefault()
    }
})

