const User = require('../models/userModel')

const showPage =async (req,res)=>{
    const userdata = await User.findOne({ _id: req.session.user });
    res.render('userPages/orderSuccessPage',{userdata})
}

const showFailurePage = async(req,res) =>{
    const userdata = await User.findOne({ _id: req.session.user });
    res.render('userPages/orderFailurePage',{userdata})
}



module.exports={showPage,showFailurePage }