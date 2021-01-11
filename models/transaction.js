//require mongoose package
const mongoose = require("mongoose");

//access schema from mongoose
const Schema = mongoose.Schema;

//define a schema for transactions with name, value, date values.
const transactionSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: "Enter a name for transaction"
    },
    value: {
      type: Number,
      required: "Enter an amount"
    },
    date: {
      type: Date,
      default: Date.now
    }
  }
);

//create a Transaction model using the above schema
const Transaction = mongoose.model("Transaction", transactionSchema);

//export Transaction model
module.exports = Transaction;
