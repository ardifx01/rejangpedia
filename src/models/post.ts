import { Model, Schema, model, models } from "mongoose";

// Main post schema
const mainSchema = new Schema<Data>({
    id: String,
    Title: String,
    Image: String,
    Pembuat: String,
    Diedit: String,
    Link: String,
    Waktu: String,
    Edit: String,
    Content: [
      {
        babTitle: String,
        babContent: String,
      },
    ],
});

const mainModel: Model<Data> = models.mains || model<Data>("mains", mainSchema);
const goingModel: Model<Data> = models.ongoings || model<Data>("ongoings", mainSchema);

export { mainModel, goingModel };