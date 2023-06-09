const Product = require("../models/Product")

const {verifyToken, authToken , authTokenAdmin} = require("./verifyToken");

 //CREATE

const router = require("express").Router();

router.post("/", authTokenAdmin , async (req,res) => {
    const newProduct = new product(req.body);

    try{
        const savedProduct = await newProduct.save();
        res.status(200).json(savedProduct); 

    }catch(err){
        res.status(500).json(err);
    }
})





//UPDATE 
router.put("/:id", authTokenAdmin, async (req,res)=>{
    
try{
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
        $set: req.body
     }, {new:true}
    ); res.status(200).json(updateProduct)
    }catch(err){
        res.status(500).json(err)
    }
}) 

router.delete("/:id", authTokenAdmin, async (req,res) =>{
    try{
        await Product.findByIdAndDelete(req.params.id)
        res.status(200).json("Produto deletado com sucesso");
    }catch(err){
        res.status(500).json(err)
    }
} )

router.get("/find/:id",  async (req,res) => {
    try{
    const product = await Product.findById(req.params.id)
    res.status(200).json(product)
    }catch(err){
        res.status(500).json(err)
    }
} )

router.get("/",  async (req,res) => {
    const qNew = req.query.new
    const qCategory = req.query.category;     
    try{
        let products;
        if(qNew) {
            products = await Product.find().sort({ createdAt : -1 }).limit(1);
            } else if (qCategory) {
                products = await Product.find({
                    categories: {
                        $in: [qCategory],
                    },
                });
            }else {
                products = await Product.find()
            }
    
    res.status(200).json(products)
    }catch(err){
        res.status(500).json(err)
    }
} )



module.exports = router