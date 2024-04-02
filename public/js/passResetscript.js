const passid = document.getElementById('typePasswordX')
const passid2 = document.getElementById('typePasswordY')

const error1 = document.getElementById('error1')
const error2 = document.getElementById('error2')

const regform = document.getElementById('logform')


function passvalidate(){
    const passval = passid.value
    const alpha = /[a-zA-Z]/
    const digit = /\d/
    if(passval.length < 8)
    {   
        error1.style.display = "block"
        error1.innerHTML = "Must have atleast 8 characters"
    }
    else if(!alpha.test(passval) || !digit.test(passval) )
    {
        error1.style.display = "block"
        error1.innerHTML = "Should contain Numbers and Alphabets!!"
    }
    else{
        
        error1.style.display = "none"
        error1.innerHTML = ""
    }
}



function passvalidate2(){
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
    else{
        
        error2.style.display = "none"
        error2.innerHTML = ""
    }
}

passid.addEventListener('blur',passvalidate)
passid2.addEventListener('blur',passvalidate2)



regform.addEventListener('submit',function(e){
       
        passvalidate()
        passvalidate2()

        
        if(error1.innerHTML || error2.innerHTML)
        {
            e.preventDefault()
        }
})