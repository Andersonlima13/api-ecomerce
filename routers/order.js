const Order = require("../models/Order")

const {verifyToken, authToken , authTokenAdmin} = require("./verifyToken");

 //CREATE

const router = require("express").Router();

router.post("/", verifyToken , async (req,res) => {
    const newOrder = new Order(req.body);

    try{
        const savedOrder = await newOrder.save();
        res.status(200).json(savedOrder); 

    }catch(err){
        res.status(500).json(err);
    }
})



//UPDATE 
router.put("/:id", authTokenAdmin , async (req,res)=>{
    
try{
    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, {
        $set: req.body
     }, {new:true}
    ); res.status(200).json(updateOrder)
    }catch(err){
        res.status(500).json(err)
    }
}) 

router.delete("/:id", authTokenAdmin, async (req,res) =>{
    try{
        await Order.findByIdAndDelete(req.params.id)
        res.status(200).json("Pedido deletado com sucesso");
    }catch(err){
        res.status(500).json(err)
    }
} )

router.get("/find/:userId", authToken,  async (req,res) => {
    try{
    const orders = await Order.find({userId: req.params.userId})
    res.status(200).json(orders)
    }catch(err){
        res.status(500).json(err)
    }
});

router.get("/", authTokenAdmin, async (req,res) =>{
    try{
        const orders = await Order.find();
        res.status(200).json(orders);
    }catch (err){
        res.status(500).json(err)
    }
});

// GET POR MES

router.get("/income", authTokenAdmin, async (req,res) => {
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth()-1));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth()-1));

    try{
        const income = await Order.aggregate([
            { $match: { createdAt: { $gte: previousMonth } } },
            {
                $project: {
                month:{month:"ScreatedAt" },
                sales: "$amount",
            },
         },
            {
                $group:{
                    _id:"$month",
                    total:{$sum:"$sales"},

                },
            },
        ]);

    }catch(err){
        res.status(500).json(err)
    }

})

module.exports = router