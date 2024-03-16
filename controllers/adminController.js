const User = require("../models/userModel");
const Product = require("../models/productModel");
const bcrypt = require("bcrypt");
const Brand = require("../models/brandModel");
const Order = require("../models/orderModel")

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

const adminHome = async (req, res) => {
    if (req.session.admin) {
        const orderData = await Order.find({ "products.status": { $all: ["Delivered"] } })
    
        let totalPriceSum = 0;
        let count = 0;
        for (const order of orderData) {
            count++;
            totalPriceSum += order.totalPrice;
        }

        let totalQtySum = 0;

        for (const order of orderData) {
            for (const product of order.products) {
                totalQtySum += product.qty;
            }
        }

        let onlinePriceSum = 0;

        for (const order of orderData) {
            if (order.paymentMethord === 'Online Payment') {
                onlinePriceSum += order.totalPrice;
            }
        }
        const orderata = await Order.find({ "products.status": { $all: ["Delivered"] } }).populate('products.product_id')


        function sumQuantitiesByProductTitle(orderData) {
            const productQtyMap = {};

            orderData.forEach((order) => {
                order.products.forEach((product) => {
                    const { product_id, qty } = product;
                    const productTitle = product_id.producttitle;
                    if (productTitle in productQtyMap) {
                        productQtyMap[productTitle] += qty;
                    } else {
                        productQtyMap[productTitle] = qty;
                    }
                });
            });

            return productQtyMap;
        }

        // Call the function and get the result
        const productQtyMap = sumQuantitiesByProductTitle(orderata);



        // Convert the object into an array of objects
        const productQtyArray = Object.keys(productQtyMap).map((productTitle) => {
            return { productTitle, quantity: productQtyMap[productTitle] };
        });

        // Sort the array by quantity in decreasing order
        productQtyArray.sort((a, b) => b.quantity - a.quantity);


        /////////////////////////////////////////////////////////////////////////////////////////////
        const odata = await Order.find({ "products.status": { $all: ["Delivered"] } })
            .populate({
                path: 'products.product_id',
                populate: { path: 'brandId' }
            });




        // Initialize an object to store the sum of quantities for each brand
        const brandQtyMap = {};

        // Iterate through each order
        odata.forEach((order) => {
            // Iterate through each product in the order
            order.products.forEach((product) => {
                // Extract the brand name from the product
                const brandName = product.product_id.brandId.brandName;

                // Add the quantity to the corresponding brand in the brandQtyMap
                if (brandName in brandQtyMap) {
                    brandQtyMap[brandName] += product.qty;
                } else {
                    brandQtyMap[brandName] = product.qty;
                }
            });
        });


        // Your object containing brand names and quantities

        // Convert the object into an array of objects
        const brandQtyArray = Object.keys(brandQtyMap).map((brandName) => {
            return { brandName, totalQuantity: brandQtyMap[brandName] };
        });
        brandQtyArray.sort((a, b) => b.totalQuantity - a.totalQuantity);

   
       
        res.render("adminHome", { totalPriceSum, count, totalQtySum, onlinePriceSum, productQtyArray, brandQtyArray });
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
    const product = await Product.find({ isProduct: 0 }).populate('brandId')

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


const editBrand = async (req, res) => {
    try {
        const { id } = req.query

        const brandData = await Brand.findOne({ _id: id })
        res.render('adminPages/editBrandPage', { brandData });
    } catch (error) {
        console.log(error.message);
    }
}


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

const listOrders = async (req, res) => {
    try {
        const orderData = await Order.find({ __v: 0 }).populate('userId products.product_id')


        res.render('adminPages/orderList', { orderData })
    } catch (error) {
        console.log(error.message);
    }
}

const orderDetails = async (req, res) => {

    try {
        const { orderId } = req.query

        const orderData = await Order.find({ _id: orderId }).populate('userId products.product_id')

        res.render('adminPages/userOrdersDetail', { orderData })
    } catch (error) {
        console.log(error.message);
    }
}

const updateStatus = async (req, res) => {
    const { status, productId, orderId, refundAmount } = req.query


    const upgrade = await Order.findOneAndUpdate({ _id: orderId, 'products._id': productId }, { $set: { 'products.$.status': status } })
    if (status == "Return Accepted") {
        const result = await User.findOneAndUpdate({ _id: req.session.user }, { $inc: { walletBalance: refundAmount } })
    }
    if (upgrade) {
        res.status(200).json({ message: 'STATUS Updated' });
    } else {
        res.status(500).json({ message: 'Error placing order' });
    }

}



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
    editBrand,
    listOrders,
    orderDetails,
    updateStatus
};
