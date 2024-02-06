const User=require("../models/userModel")

const usersession = async (req, res, next) => {
      if (req.session.user) {
             
                 next();
            }else{
                res.redirect('/')
            }
};

const userToLogin = async (req,res,next)=>
{
    try {
        
        const userdata =await User.findOne({_id: req.session.user})
        
        if(req.session.user && userdata.isBlocked==0)
        {
            
            next()
        }
        else{
            req.session.user=null;
            res.redirect('/login')
        }
    } catch (error) {
        console.log(error.message)
    }
}


 



module.exports={
    usersession,
    userToLogin
}