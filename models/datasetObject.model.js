const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let datasetObjectSchema = new Schema(
  {
    datasetObject: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const DatasetObject = mongoose.model("datasetObject", datasetObjectSchema);
module.exports = DatasetObject;
