const User = require("../models/userModel");
const Product = require("../models/productModel");
const bcrypt = require("bcrypt");
const Brand = require("../models/brandModel");

const adminLogin = (req, res) => {
    if (req.session.admin) {
        res.redirect("/admin/home");
    } else {
        res.render("adminlogin");
    }
};
const admincheck = async (req, res) => {
    const logemail = req.body.uname;
    const logpassword = req.body.pwd;

    try {
        const loggedadmin = await User.findOne({ email: logemail });
        
        if (loggedadmin && loggedadmin.isBlocked === 0) {
            const userpassword = await bcrypt.compare(
                logpassword,
                loggedadmin.password,
            );

            if (userpassword) {
                if (loggedadmin.isAdmin === 1) {
                    req.session.admin = loggedadmin._id;

                    res.redirect("/admin/home");
                } else {
                    console.log("Fail");
                }
            } else {
                res.render("adminlogin", {
                    errmessage: "Login Failed ! Enter Valid Credentials",
                });
            }
        } else {
            res.render("adminlogin", {
                errmessage: "Login Failed ! Invalid Credentials",
            });
        }
    } catch (err) {
        console.log(err.message);
    }
};

const adminHome = (req, res) => {
    if (req.session.admin) {
        res.render("adminHome");
    } else {
        res.redirect("/admin");
    }
};

const addproduct = async (req, res) => {
    const brand = await Brand.find({ isBlocked: 0 });
    
    res.render("add-product-page", { brand });
};

const addproducttodb = async (req, res) => {
    

    try {
        const Images = req.files;
        const imagefilename = Images.map((img) => {
            return img.filename;
        });
        const productIn = {
            producttitle: req.body.producttitle,
            description: req.body.description,
            brandId: req.body.brandname,
            price: req.body.price,
            stock: req.body.stock,
            imageurl: imagefilename,
            isProduct: 0,
            isBlocked: 0,
        };

        const result = await Product.create(productIn);

        res.redirect("/admin/home/addproduct");
    } catch (error) {
        console.log(error);
    }
};

const usermanagement = async (req, res) => {
    const user = await User.find({ isAdmin: 0 }); //finding all documents with isAdmin==0

    res.render("list-users-page", { user });
};

const blockuser = async (req, res) => {
    try {
        const { id } = req.query;
        const da = await User.findByIdAndUpdate(
            { _id: id },
            { $set: { isBlocked: 1 } },
            { new: true },
        );

        res.status(200).json({ data: "success" });
    } catch (err) {
        console.error(err);
    }
};

const unblockuser = async (req, res) => {
    try {
        const { id } = req.query;

        const da = await User.findByIdAndUpdate(
            { _id: id },
            { $set: { isBlocked: 0 } },
            { new: true },
        );

        res.status(200).json({ data: "success" });
    } catch (err) {
        console.error(err);
    }
};

const productsList = async (req, res) => {
    const product = await Product.find({ isProduct: 0 });
    
    res.render("page-products-list", { product });
};

const blockProduct = async (req, res) => {
    try {
        
        const { id } = req.query;
        const da = await Product.findByIdAndUpdate(
            { _id: id },
            { $set: { isBlocked: 1 } },
            { new: true },
        );

        res.status(200).json({ data: "success" });
    } catch (err) {
        console.error(err);
    }
};

const unblockProduct = async (req, res) => {
    try {
        const { id } = req.query;

        const da = await Product.findByIdAndUpdate(
            { _id: id },
            { $set: { isBlocked: 0 } },
            { new: true },
        );
        console.log(da);
        res.status(200).json({ data: "success" });
    } catch (err) {
        console.error(err);
    }
};

const editProduct = async (req, res) => {
    try {
        const { id } = req.query;

        const product = await Product.findById({ _id: id }).populate('brandId')
  

        const brand = await Brand.find({ isActive: 0 });


        res.render("edit-product-page", { product, brand });
    } catch (err) {
        console.error(err);
    }
};

const editProductandUpdate = async (req, res) => {
    try {
        const { id } = req.query;

        const Images = req.files;
        const imagefilename = Images.map((img) => {
            return img.filename;
        });

        const productIn = {
            producttitle: req.body.producttitle,
            description: req.body.description,
            brandId: req.body.brandid,
            price: req.body.price,
            category: req.body.category,
            imageurl: imagefilename,
            isProduct: 0,
            isBlocked: 0,
        };

        const dataupdate = await Product.findByIdAndUpdate(
            { _id: id },
            { $set: productIn },
            { new: true },
        );
        res.redirect("/admin/home/listproducts");
    } catch (err) {
        console.error(err);
    }
};

const deleteproduct = async (req, res) => {
    try {
        const { id } = req.query;
        const da = await Product.findByIdAndDelete({ _id: id }, { new: true });

        res.status(200).json({ data: "success" });
    } catch (err) {
        console.error(err);
    }
};

const addBrandLoad = async (req, res) => {
    res.render("addBrandPage");
};

const insertBrand = async (req, res) => {
    try {
        const imageFileName = req.file.filename;

        const brandIn = {
            brandName: req.body.brandname,
            description: req.body.description,
            imageName: imageFileName,
        };

        const result = await Brand.create(brandIn);
        res.redirect("/admin/home/addBrand");
    } catch (Error) {
        console.log(Error);
    }
};

const listBrand = async (req, res) => {
    const brand = await Brand.find({ isActive: 0 });
    res.render("listBrand", { brand });
};

const deleteBrand = async (req, res) => {
    try {
        const { id } = req.query;
        const da = await Brand.findByIdAndDelete({ _id: id }, { new: true });

        res.status(200).json({ data: "success" });
    } catch (err) {
        console.error(err);
    }
};

const blockBrand = async (req, res) => {
    try {
        console.log(req.query);
        const { id } = req.query;
        const da = await Brand.findByIdAndUpdate(
            { _id: id },
            { $set: { isBlocked: 1 } },
            { new: true },
        );

        res.status(200).json({ data: "success" });
    } catch (err) {
        console.error(err);
    }
};

const UnblockBrand = async (req, res) => {
    try {
        console.log(req.query);
        const { id } = req.query;
        const da = await Brand.findByIdAndUpdate(
            { _id: id },
            { $set: { isBlocked: 0 } },
            { new: true },
        );

        res.status(200).json({ data: "success" });
    } catch (err) {
        console.error(err);
    }
};

const logoutadmin = (req, res) => {
    if (req.session.admin) {
        req.session.destroy((err) => {
            if (err) {
                console.log("error in logging out");
            } else {
                res.redirect("/admin/home");
            }
        });
    } else {
        res.redirect("/admin");
    }
};

// router.get("/logout",(req,res)=>{
//     req.session.destroy((err)=>{
//         if(err)
//         {
//             console.log("Error in logout")
//         }
//         else{
//             res.redirect("/")
//         }
//     })
// })

module.exports = {
    adminLogin,
    admincheck,
    adminHome,
    addproduct,
    usermanagement,
    blockuser,
    unblockuser,
    addproducttodb,
    productsList,
    blockProduct,
    unblockProduct,
    editProduct,
    editProductandUpdate,
    deleteproduct,
    logoutadmin,
    addBrandLoad,
    insertBrand,
    listBrand,
    deleteBrand,
    blockBrand,
    UnblockBrand,
};
