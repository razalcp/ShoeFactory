const User = require("../models/userModel");
const Product = require("../models/productModel");
const bcrypt = require("bcrypt");
const Brand = require("../models/brandModel");
const Order = require("../models/orderModel")
const sharp = require('sharp')
const path = require('path')

const adminLogin = (req, res) => {
    if (req.session.admin) {
        console.log(req.session.admin);
        
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
                    res.render("adminlogin", {
                        errmessage: "Login Failed ! Not an admin",
                    });
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

    res.render("add-product-page-variants", { brand });
};

const addproducttodb = async (req, res) => {
    try {
        
        const { hiddenField1, hiddenField2, hiddenField3, hiddenField4 } = req.body;
        
        // Validate required fields
        if (!req.body.producttitle || !req.body.brandname) {
            return res.status(400).render('add-product-page-variants', { 
                brand: await Brand.find({ isBlocked: 0 }),
                error: 'Product title and brand are required'
            });
        }
        
        // Parse variants from form data
        const variants = [];
        
        // Check if variants is sent as an array
        if (req.body.variants && Array.isArray(req.body.variants)) {
            
            // Process each variant from the array
            
            for (const [index, variant] of req.body.variants.entries()) {
                
                if (variant && variant.size && variant.color && variant.price && variant.stock) {
                    // Get images for this variant - filter the req.files array by fieldname
                    const variantImages = req.files.filter(file => file.fieldname === `variantImages_${index}`);
                    const imageFilenames = variantImages.map(img => img.filename);
                    
                    
                    
                    if (imageFilenames.length === 0) {
                        return res.status(400).render('add-product-page-variants', { 
                            brand: await Brand.find({ isBlocked: 0 }),
                            error: `Variant at index ${index} (size: ${variant.size}, color: ${variant.color}) must have at least one image. Looking for fieldname: variantImages_${index}`
                        });
                    }

                    variants.push({
                        size: variant.size,
                        color: variant.color,
                        price: parseFloat(variant.price),
                        stock: parseInt(variant.stock),
                        imageurl: imageFilenames,
                        isBlocked: 0
                    });
                }
            }
        } else {
            // Fallback to original parsing logic
            const variantKeys = Object.keys(req.body).filter(key => key.startsWith('variants['));
            
            // Group variant data by variant index
            const variantData = {};
            variantKeys.forEach(key => {
                const match = key.match(/^variants\[(\d+)\]\[(.+)\]$/);
                if (match) {
                    const variantIndex = match[1];
                    const field = match[2];
                    if (!variantData[variantIndex]) {
                        variantData[variantIndex] = {};
                    }
                    variantData[variantIndex][field] = req.body[key];
                }
            });
            

            // Process each variant
            for (const [index, data] of Object.entries(variantData)) {
                // Get images for this variant
                const variantImages = req.files[`variantImages_${index}`] || [];
                const imageFilenames = variantImages.map(img => img.filename);
                
                
                if (imageFilenames.length === 0) {
                    return res.status(400).render('add-product-page-variants', { 
                        brand: await Brand.find({ isBlocked: 0 }),
                        error: 'Each variant must have at least one image'
                    });
                }

                variants.push({
                    size: data.size,
                    color: data.color,
                    price: parseFloat(data.price),
                    stock: parseInt(data.stock),
                    imageurl: imageFilenames,
                    isBlocked: 0
                });
            }
        }

        if (variants.length === 0) {
            return res.status(400).render('add-product-page-variants', { 
                brand: await Brand.find({ isBlocked: 0 }),
                error: 'Please add at least one variant'
            });
        }

        // Create product with variants
        const product = await Product.create({
            producttitle: req.body.producttitle,
            description: req.body.description,
            brandId: req.body.brandname,
            variants: variants,
            isProduct: 0,
            isBlocked: 0
        });

        if (product) {
            res.redirect("/admin/home/addproduct");
        } else {
            res.status(500).render('add-product-page-variants', { 
                brand: await Brand.find({ isBlocked: 0 }),
                error: 'Failed to create product'
            });
        }
    } catch (error) {
        console.error("Error in addproducttodb:", error);
        res.status(500).render('add-product-page-variants', { 
            brand: await Brand.find({ isBlocked: 0 }),
            error: 'Server error: ' + error.message
        });
    }finally{
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

        if (!product) {
            return res.status(404).render('error', { message: 'Product not found' });
        }

        const brand = await Brand.find({ isActive: 0 });

        res.render("edit-product-page-variants", { product, brand });
    } catch (err) {
        console.error('Error in editProduct:', err);
        res.status(500).render('error', { message: 'Server error' });
    }
};

const editProductandUpdate = async (req, res) => {
    try {
        const { id } = req.query;
        

        // Validate required fields
        if (!req.body.producttitle || !req.body.description || !req.body.brandid) {
            return res.status(400).render('edit-product-page-variants', { 
                product: await Product.findById(id).populate('brandId'),
                brand: await Brand.find({ isActive: 0 }),
                error: 'Please fill all required fields'
            });
        }

        // Get the existing product to preserve unchanged variants
        const existingProduct = await Product.findById(id);
        if (!existingProduct) {
            return res.status(404).render('edit-product-page-variants', { 
                product: null,
                brand: await Brand.find({ isActive: 0 }),
                error: 'Product not found'
            });
        }

        // Group files by field name
        const filesByField = {};
        if (req.files) {
            req.files.forEach(file => {
                if (!filesByField[file.fieldname]) {
                    filesByField[file.fieldname] = [];
                }
                filesByField[file.fieldname].push(file);
            });
        }
        
        
        // Process variants from the form data
        const updatedVariants = [];
        
        // Check which variants have been updated (have new data or files)
        for (const [index, variant] of req.body.variants.entries()) {
            
            if (variant && variant.size && variant.color && variant.price && variant.stock) {
                // Get images for this variant from grouped files
                const variantImages = filesByField[`variantImages_${index}`] || [];
                const imageFilenames = variantImages.map(img => img.filename);
                
                
                // Check if this variant has new images or updated data
                const hasNewImages = imageFilenames.length > 0;
                const existingVariant = existingProduct.variants[index];
                
                // Compare with existing variant to detect changes
                const hasUpdatedData = existingVariant ? (
                    variant.size !== existingVariant.size ||
                    variant.color !== existingVariant.color ||
                    parseFloat(variant.price) !== existingVariant.price ||
                    parseInt(variant.stock) !== existingVariant.stock
                ) : true;
                
                if (hasNewImages || hasUpdatedData) {
                    // This variant was updated - use new data
                    let finalImages = imageFilenames;
                    
                    // If no new images but variant was updated, keep existing images
                    if (!hasNewImages && existingVariant && existingVariant.imageurl) {
                        finalImages = existingVariant.imageurl;
                    }
                    
                    if (finalImages.length === 0) {
                        return res.status(400).render('edit-product-page-variants', { 
                            product: await Product.findById(id).populate('brandId'),
                            brand: await Brand.find({ isActive: 0 }),
                            error: `Variant at index ${index} (size: ${variant.size}, color: ${variant.color}) must have at least one image.`
                        });
                    }
                    
                    updatedVariants.push({
                        size: variant.size,
                        color: variant.color,
                        price: parseFloat(variant.price),
                        stock: parseInt(variant.stock),
                        imageurl: finalImages,
                        isBlocked: 0
                    });
                    
                } else if (existingVariant) {
                    // This variant wasn't updated - keep existing data
                    updatedVariants.push(existingVariant);
                }
            }
        }
        
        // If no variants were processed but we have existing variants, keep them
        if (updatedVariants.length === 0 && existingProduct.variants.length > 0) {
            updatedVariants.push(...existingProduct.variants);
        }

        if (updatedVariants.length === 0) {
            return res.status(400).render('edit-product-page-variants', { 
                product: await Product.findById(id).populate('brandId'),
                brand: await Brand.find({ isActive: 0 }),
                error: 'At least one variant is required with all details and images.'
            });
        }

        // Update the product with new data
        const updatedProduct = await Product.findByIdAndUpdate(
            { _id: id },
            {
                $set: {
                    producttitle: req.body.producttitle,
                    description: req.body.description,
                    brandId: req.body.brandid,
                    variants: updatedVariants,
                    isProduct: 0,
                    isBlocked: 0
                }
            },
            { new: true }
        );

        if (updatedProduct) {
                res.redirect("/admin/home/listproducts");
        } else {
            throw new Error('Failed to update product');
        }

    } catch (err) {
        console.error('Error updating product:', err);
        res.status(500).render('edit-product-page-variants', { 
            product: await Product.findById(req.query.id).populate('brandId'),
            brand: await Brand.find({ isActive: 0 }),
            error: 'Server error: ' + err.message
        });
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
        const orderData = await Order.find({ __v: 0 }).populate('userId products.product_id').sort({ "createdAt": -1 });


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

    // First, get the order to find the user ID
    const order = await Order.findOne({ _id: orderId })
    
    const upgrade = await Order.findOneAndUpdate({ _id: orderId, 'products._id': productId }, { $set: { 'products.$.status': status } })
    if (status == "Return Accepted") {
        // Create wallet transaction record
        const walletTranscation = {
            date: new Date(),
            type: 'Credit',
            amount: parseInt(refundAmount)
        }
        
        // Update both wallet balance and add transaction record
        const result = await User.findOneAndUpdate(
            { _id: order.userId }, 
            { 
                $inc: { walletBalance: refundAmount },
                $push: { walletTranscation: walletTranscation }
            }
        )
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
