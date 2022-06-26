const Product = require('../models/Product');
const Catalogs = require('../models/Catalog');
const User_accounts = require('../models/User_account');
const Transaction = require('../models/Transaction');


const { multipleMongooseToObject, moongoseToObject } = require("../../utility/mongoose");
const md5 = require('../../utility/md5');
const session = require('express-session')
const cookieParser = require("cookie-parser");



class SiteController {
    
   

    //[get] /
    home(req, res, next) {
        if (typeof req.session.cart == 'undefined') {
            req.session.cart = {
                count: 0,
                total: 0,
                products: []
            }
            res.redirect(req.originalUrl)
        }else {
            let cart = req.session.cart;
            cart.total = 0;
             //Find Products in Database
            Catalogs.find({})
            .then(catalogs => {
                let cataloglist = multipleMongooseToObject(catalogs);
                const sortDescendingView = {view: -1};
                Product.find({}).sort(sortDescendingView).limit(1)
                    .then(top1Views => {
                        top1Views = multipleMongooseToObject(top1Views)
                        Product.find({}).sort(sortDescendingView).skip(1).limit(2)
                            .then(top2_3Views => {
                                top2_3Views = multipleMongooseToObject(top2_3Views);
                                Product.find({}).sort(sortDescendingView).skip(3).limit(8)
                                    .then(top3_8Views =>{
                                        top3_8Views = multipleMongooseToObject(top3_8Views)
                                        res.render('home',{
                                            layout: 'main',
                                            Object: {
                                                top1Views,
                                                top2_3Views,
                                                top3_8Views,
                                                cataloglist,
                                                cartnum: cart.count,
                                            },
                                            WebUser: req.cookies.WebUser,
                                            Error: req.cookies.Error,
                                        });  
                                    })
                                    .catch(next);
                                
                            })
                            .catch(next);
                    })
                    .catch(next);
            })
            .catch(next);
        }
        
    }

    //[get] /about
    about(req, res) {
        res.send('New Detail !!');
    }

    //[get] /products/:catalog_name
    catalog(req, res, next) {
        if (typeof req.session.cart == 'undefined') {
            req.session.cart = {
                count: 0,
                total: 0,
                products: []
            }
            res.redirect(req.originalUrl)
        }else {
            let cart = req.session.cart;
            cart.total = 0;
            Catalogs.find({})
            .then(catalogs => {
                let cataloglist = multipleMongooseToObject(catalogs);
                Catalogs.findOne({
                    name: req.params.catalog_name,
                })
                    .then(catalog => {
                        catalog = moongoseToObject(catalog);
                        const limit = 4;
                        const StartIndex = (parseInt(req.query.page) - 1) * limit;
                        Product.countDocuments({
                            catalogid: catalog._id
                        }, function(err, docCount) {
                            if (err) { return handleError(err) } //handle possible errors
                            const TotalPages = Math.ceil(docCount/limit);
                            Product.find({
                                catalogid: catalog._id
                            }).limit(limit).skip(StartIndex)
                            .then(products => {
                                res.render('products', {
                                    title: catalog.name,
                                    Object: {
                                        cataloglist,
                                        products: multipleMongooseToObject(products),
                                        catalog,
                                        cartnum: cart.count,
                                    },
                                    WebUser: req.cookies.WebUser,
                                    Error: req.cookies.Error,
                                    EnablePaging: docCount > limit,

                                    pagination: {
                                        page: parseInt(req.query.page),
                                        pageCount: TotalPages
                                    }
                                      

                                });
                            })
                            .catch(next);
                        })
                        
                    })
                    .catch(next);
            })
            .catch(next);
        }
        

    }

    //[get] /product/:slug
    product(req, res, next) {
        if (typeof req.session.cart == 'undefined') {
            req.session.cart = {
                count: 0,
                total: 0,
                products: []
            }
            res.redirect(req.originalUrl)
        }else {
            let cart = req.session.cart;
            cart.total = 0;
            Catalogs.find({})
            .then(catalogs => {
                let cataloglist = multipleMongooseToObject(catalogs);
                Product.findOne({
                    slug: req.params.slug,
                })
                    .then(product => {
                        product = moongoseToObject(product);
                        Catalogs.findOne({
                            _id: product.catalogid,
                        })
                        .then(catalog => {
                            let NEWVIEW = product.view + 1;
                            Product.updateOne({
                                slug: req.params.slug,
                            },
                            {
                                view: NEWVIEW
                            }) 
                            .then(() => {
                                catalog = moongoseToObject(catalog);
                                res.render('productdetail', {
                                    title: product.productname,
                                    Object: {
                                        cataloglist,
                                        product,
                                        catalog,
                                        cartnum: cart.count,
                                    },
                                    WebUser: req.cookies.WebUser,
                                    Error: req.cookies.Error,
    
                                });
                            })
                            .catch(next);                    
                            
                        })
                        .catch(next);
                    })
                    .catch(next);
            })
            .catch(next);
        }
        
    }

    // [post] /signup
    signup(req, res, next) {
        if (typeof req.session.cart == 'undefined') {
            req.session.cart = {
                count: 0,
                total: 0,
                products: []
            }
            res.redirect(req.originalUrl)
        }else {
            let cart = req.session.cart;
            cart.total = 0;
            //Save object to Database
            const formData = req.body;
            formData.password = md5.MD5(formData.password);
            delete formData.SignUp;
            const User_account = new User_accounts(formData);
            User_account.save()
                .then(() => {
                    res.redirect(req.get('referer'));
                })
                .catch((error) => {
                let errorMsg;
                if (error.code == 11000) {
                    errorMsg = Object.keys(error.keyValue)[0] + ' already exists.';
                } else {
                    errorMsg = error.message;
                }
                res.status(400).send('Bad Request:' + errorMsg);
            });
        }
        
    }

    // [post] /check
    check(req, res, next) {
        if (typeof req.session.cart == 'undefined') {
            req.session.cart = {
                count: 0,
                total: 0,
                products: []
            }
            res.redirect(req.originalUrl);
        }else {
            let cart = req.session.cart;
            cart.total = 0;
            const inputuser = req.body.user;
            const inputpassword = md5.MD5(req.body.password);

            User_accounts.findOne({
                $and: [{
                    $or: [{username: inputuser}, {email: inputuser}],
                    password: inputpassword
                }]
            })
                .then(user => {
                    const outuser = moongoseToObject(user);

                    res.cookie('WebUser', outuser.name);
                    res.cookie('WebUserEmail', outuser.email);
                    res.cookie('WebUserPassword', outuser.password);
                    res.clearCookie("Error");

                        
                    res.redirect(req.get('referer'));
                })
                .catch(error => {
                    res.cookie('Error', 'Error');
                    res.redirect(req.get('referer'));
                });
        }
        
    }

    // [get] /logout
    logout(req, res, next) {
        res.clearCookie("WebUser");
        res.clearCookie("WebUserEmail");
        res.clearCookie("WebUserPassword");
        req.session.destroy();
        res.redirect(req.get('referer'));

    }

    //[get] /search/
    search(req, res, next) {
        if (typeof req.session.cart == 'undefined') {
            req.session.cart = {
                count: 0,
                total: 0,
                products: []
            }
            res.redirect(req.originalUrl);
        }else {
            let cart = req.session.cart;
            cart.total = 0;
            Catalogs.find({})
            .then(catalogs => {
                let cataloglist = multipleMongooseToObject(catalogs);
                Product.find({
                    productname: {$regex: req.query.productname, $options: 'i'}
                })
                    .then(products => {
                        res.render('products', {
                            Object: {
                                cataloglist,
                                products: multipleMongooseToObject(products),
                                cartnum: cart.count,
                            },
                            WebUser: req.cookies.WebUser,
                            Error: req.cookies.Error,

                        });
                    })
                    .catch(next);
            })
            .catch(next);
        }
        
    }

    // [post] /product/:slug
    addtocart(req, res, next) {
        Product.findOne({
            slug: req.params.slug
        })
            .then(product =>  {
                let cart = req.session.cart;
                cart.total = 0;
                product = moongoseToObject(product)
                
                let products = cart.products;

                let IsFind = false;
                for(let i=0; i< products.length; i++){
                    if(products[i].productname == product.productname){
                        products[i].amount = products[i].amount + 1;
                        products[i].total = products[i].price * products[i].amount;
                        IsFind = true;
                        cart.count = cart.count + 1;
                        break;
                    }
                }

                if(!IsFind) {
                    product.amount = 1;
                    product.total = product.price * product.amount;
                    products.push(product);
                    cart.count = cart.count + 1;
                }
                
                req.session.cart = cart

                res.redirect(req.get('referer'));                
            })
            .catch(next);
    }

    // [get] /cart/deletecart?productname=?
    deletecart(req, res, next) {
        let cart = req.session.cart;

        let products = cart.products;
        for(let i = 0; i < products.length; i++){
            if(products[i].productname == req.query.productname) {
                cart.count = cart.count - products[i].amount;
                products.splice(i, 1);
                break;
            };
        }

        req.session.cart = cart;        
        res.redirect(req.get('referer'));                
    }

    // [get] /cart
    cart(req, res, next) {
        if (typeof req.session.cart == 'undefined') {
            req.session.cart = {
                count: 0,
                total: 0,
                products: []
            }
            res.redirect(req.originalUrl)
        }else {
            let cart = req.session.cart;
            cart.total = 0;
            let products = cart.products;
            for(let i=0; i<products.length; i++){
                cart.total += products[i].amount * products[i].price;
            }
            Catalogs.find({})
            .then(catalogs => {
                let cataloglist = multipleMongooseToObject(catalogs);
                User_accounts.findOne({
                    name: req.cookies.WebUser
                })
                    .then(user => {
                        res.render('cart', {
                            title: 'Cart',
                            Object: {
                                cataloglist,
                                cartnum: cart.count,
                                products: cart.products,
                                carttotal: cart.total,
                                user: moongoseToObject(user),
                            },
                            WebUser: req.cookies.WebUser,
                            Error: req.cookies.Error,

                        });
                    })  
                    .catch(next);
            })
            .catch(next);
        }
    }

    transaction(req, res, next) {
        User_accounts.findOne({
            name: req.cookies.WebUser
        })
            .then(user => {
                user = moongoseToObject(user);
                let formData = req.body;
                delete formData.check_out;
                formData.user = user;
                formData.total = req.session.cart.total;
                formData.Products = req.session.cart.products;

                for(let i = 0; i<formData.Products.length; i++) {
                    formData.Products[i].status = 0;
                    formData.Products[i].username = user.name;
                    formData.Products[i].payment_info = req.body.payment_info;
                }


                const transaction = new Transaction(formData);

                transaction.save()
                    .then(() => {
                        req.session.destroy();
                        res.redirect(req.get('referer'));
                    })
                    .catch(next);
            })
    }
}

module.exports = new SiteController;