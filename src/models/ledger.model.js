const mongoose = require('mongoose');

const ledgerSchema = new mongoose.Schema({
    account:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
        required: [true, "Ledger must be associated with an account"],
        index: true,
        immutable: true
    },
    amount:{
        type: Number,
        required: [true, "Amount is required for creating a ledger entry"],
        min: [0, "Amount cannot be negative"],
        immutable: true
    },
    transaction: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "transaction",
        required: [true, "Ledger must be associated with a transaction"],
        index: true,
        immutable:true
    },
    type:{
        type: String,
        enum: {
            values: ["CREDIT", "DEBIT"],
            message: "Type can be either CREDIT or DEBIT"
        },
        required: [true, "Ledger type is required"],
        immutable: true
    }
}, {
    timestamps : true
})

function preventLedgerModification(){
    throw new Error("Ledger entries are immutable and cannot be modified or deleted")
}

[
   'findOneAndUpdate',
   'updateOne',
   'updateMany',
   'findByIdAndUpdate',
   'deleteOne',
   'deleteMany',
   'findOneAndDelete',
   'findByIdAndDelete',
   'replaceOne'
].forEach(method => {
   ledgerSchema.pre(method, function () {
      throw new Error(
         "Ledger entries are immutable and cannot be modified or deleted"
      )
   })
})

// ledgerSchema.pre('save', function(next) {

//     if(!this.isNew){
//         return next(
//             new Error("Ledger entries are immutable and cannot be modified")
//         )
//     }

//     next()
// })


ledgerSchema.pre('save', function () {

    if (!this.isNew) {
        throw new Error(
            "Ledger entries are immutable and cannot be modified"
        )
    }
})

const ledgerModel = mongoose.model("ledger", ledgerSchema)

module.exports = ledgerModel