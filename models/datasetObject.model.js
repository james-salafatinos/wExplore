const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let datasetObjectSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    datasetObject: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const DatasetObject = mongoose.model("datasetObject", datasetObjectSchema);
module.exports = DatasetObject;
