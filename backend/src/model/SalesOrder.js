const mongoose = require('mongoose');
const Customer = require('./Customer');
const Schema = mongoose.Schema;

const SalesOrderSchema = new Schema({
    salesOrderID: {
        type: Number,
        unique: true
    },
    customerID: {
        type: Number,
        required: true
    },
    orderDate: {
        type: Date,
        required: true
    },
    items: {
        type: Array,
        required: true
    },
    status: {
        type: String,
        required: true
    }
});

//Generate Customer ID
SalesOrderSchema.pre("save", async function (next) {
    try {
        if (this.isNew) {
            let total = await SalesOrder.find().sort({ salesOrderID: -1 }).limit(1);
            this.salesOrderID = total.length === 0 ? 1 : Number(total[0].salesOrderID) + 1;
        }
        next()
    } catch (error) {
        next(error)
    }
})

SalesOrderSchema.methods.getCustomerDetails = async function (cb) {
    const custDetails = await Customer.find({ customerID: this.customerID }, cb);
    return custDetails;
}

const SalesOrder = mongoose.model("salesorder", SalesOrderSchema);
module.exports = SalesOrder;