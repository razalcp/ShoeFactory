const username = document.getElementById('username')
const error1 = document.getElementById('error1')
const regform = document.getElementById('logform')
const usermobile = document.getElementById('usermobile')
const error2 = document.getElementById('error2')
const addressline = document.getElementById('useraddress')
const error3 = document.getElementById('error3')
const locality = document.getElementById('userlocality')
const error4 = document.getElementById('error4')
const city = document.getElementById('usercity')
const error5 = document.getElementById('error5')
const pincode = document.getElementById('userpincode')
const error6 = document.getElementById('error6')
const state = document.getElementById('userstate')
const error7 = document.getElementById('error7')


function namevalidate(){
    const namePattern =/^[A-Za-z]+(?:\s[A-Za-z]+)?$/

    const nameval = username.value
    if(!namePattern.test(nameval))
    {
        error1.style.display = "block"
        error1.innerHTML = "Please Enter a valid Name."
    }
    else{
        error1.style.display = "none"
        error1.innerHTML = ""
    }
}

function mobilevalidate(){
    const mobval = usermobile.value
    const mobregex = /^(?!0{10})[6789]\d{9}$/;

    if(!mobregex.test(mobval))
    {
        error2.style.display = "block"
        error2.innerHTML = "Please Enter a valid Mobile Number."
    }
    else if(mobval.length < 10 || mobval.length > 10)
    {
        error2.style.display = "block"
        error2.innerHTML = "Please Enter atleast 10 digits."
    }
    else{
        error2.style.display = "none"
        error2.innerHTML = ""
    }   
}

function addressValidate(){
    const regex = /^[a-zA-Z0-9][a-zA-Z0-9\s.,#-]*$/
    const addressval=addressline.value

    if(!regex.test(addressval)){
        error3.style.display = "block"
        error3.innerHTML = "Please Enter a valid Address."
    }else{
        error3.style.display = "none"
        error3.innerHTML = ""
    }
    }

    function localityValidate(){
        const regex = /^[a-zA-Z0-9][a-zA-Z0-9\s.,#-]*$/
        const localityval=locality.value
    
        if(!regex.test(localityval)){
            error4.style.display = "block"
            error4.innerHTML = "Please Enter a valid Locality."
        }else{
            error4.style.display = "none"
            error4.innerHTML = ""
        }
        }


        function cityValidate(){
            const regex = /^[a-zA-Z][a-zA-Z\s.,#-]*$/

            const cityval=city.value
        
            if(!regex.test(cityval)){
                error5.style.display = "block"
                error5.innerHTML = "Please Enter a valid City."
            }else{
                error5.style.display = "none"
                error5.innerHTML = ""
            }
            }
            

            function pincodeValidate(){
                const regex = /^[1-9][0-9]{5}$/
    
                const pinval=pincode.value
            
                if(!regex.test(pinval)){
                    error6.style.display = "block"
                    error6.innerHTML = "Please Enter a valid City."
                }else{
                    error6.style.display = "none"
                    error6.innerHTML = ""
                }
                }
                


                
function stateValidate(){
    const regex =/^(Andhra Pradesh|Arunachal Pradesh|Assam|Bihar|Chhattisgarh|Goa|Gujarat|Haryana|Himachal Pradesh|Jharkhand|Karnataka|Kerala|Madhya Pradesh|Maharashtra|Manipur|Meghalaya|Mizoram|Nagaland|Odisha|Punjab|Rajasthan|Sikkim|Tamil Nadu|Telangana|Tripura|Uttar Pradesh|Uttarakhand|West Bengal)$/

    const val = state.value
    if(!regex.test(val))
    {
        error7.style.display = "block"
        error7.innerHTML = "Please Enter a valid Name."
    }
    else{
        error7.style.display = "none"
        error7.innerHTML = ""
    }
}

username.addEventListener('blur',namevalidate)
usermobile.addEventListener('blur',mobilevalidate)
addressline.addEventListener('blur',addressValidate)
locality.addEventListener('blur',localityValidate)
city.addEventListener('blur',cityValidate)
pincode.addEventListener('blur',pincodeValidate)
state.addEventListener('blur',stateValidate)








regform.addEventListener('submit',function(e){
  
    namevalidate()
    mobilevalidate()
    addressValidate()
    localityValidate()
    cityValidate()
    pincodeValidate()
    stateValidate()
    // passvalidate()
    
    if(error1.innerHTML ||  error2.innerHTML || error3.innerHTML || error4.innerHTML || error5.innerHTML || error6.innerHTML || error7.innerHTML)
    {
        e.preventDefault()
    }
})
