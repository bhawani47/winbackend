const {addUPIModel,addBankModel} =  require('../model/model');
const getBankCard = async(req,res,next)=>{
     const bankCard = await addBankModel.findOne({userId:req.body.userId});
     const upiCard = await addUPIModel.findOne({userId:req.body.userId});

    if(bankCard && upiCard){
       res.json({upi:upiCard.upi, bankName:bankCard.bankName,bankAccount:bankCard.bankAccount});
       return;
    }
    if (bankCard) {
       res.json({bankName:bankCard.bankName,bankAccount:bankCard.bankAccount,upi:false});
       return;
    }
    if (upiCard) {
        res.json({upi:upiCard.upi,bankName:false});
        return;
     }
     res.json({message:'EMPTY'});
}

module.exports = {getBankCard};