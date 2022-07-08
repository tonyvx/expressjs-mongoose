import mongoose, { CallbackWithoutResultAndOptionalError } from "mongoose";
let Schema = mongoose.Schema;

//book schema definition
let BookSchema = new Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    year: { type: Number, required: true },
    pages: { type: Number, required: true, min: 1 },
    modifyAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
  },
  {
    versionKey: false
  }
);

//Exports the BookSchema for use elsewhere.
export const Book = mongoose.model('book', BookSchema);

// Sets the createdAt parameter equal to the current time
BookSchema.pre('save', function (next) {
  if (this && !this?.createdAt) {
    this.createdAt = new Date(Date.now());
  }
  this.modifyAt = new Date(Date.now());
  next();
});