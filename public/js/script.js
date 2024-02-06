const emailid = document.getElementById('email')
const passid = document.getElementById('password')
const error1 = document.getElementById('error1')
const error2 = document.getElementById('error2')
const logform = document.getElementById('logform')

function emailvalidate(e){

    const emailval = emailid.value
    const emailpattern = /^([a-zA-Z][a-zA-Z0-9._-]*)@(gmail\.com|yahoo\.com|outlook\.com)$/
    
    if(!emailpattern.test(emailval))
    {   
        console.log("Invalid format"); 
        error1.style.display = "block"
        error1.innerHTML = "Invalid Format!!"
    }
    else{
        error1.style.display = "none"
        error1.innerHTML = ""
    }
}


function passvalidate(e){
    const passval = passid.value
    const alpha = /[a-zA-Z]/
    const digit = /\d/
    if(passval.length < 8)
    {   
        error2.style.display = "block"
        error2.innerHTML = "Must have atleast 8 characters"
    }
    else if(!alpha.test(passval) || !digit.test(passval) )
    {
        error2.style.display = "block"
        error2.innerHTML = "Should contain Numbers and Alphabets!!"
    }
    else if(passval.trim() === ""){
        error2.style.display = "block"
        error2.innerHTML = "Please Enter the password."
    }
    else{

        error2.style.display = "none"
        error2.innerHTML = ""
    }
}

emailid.addEventListener('blur', emailvalidate)
passid.addEventListener('blur',passvalidate)

logform.addEventListener('submit',function(e){
        emailvalidate()
        passvalidate()
        
        if(!error1.innerHTML === "" || !error2.innerHTML === "")
        {
            e.preventDefault()
        }
})