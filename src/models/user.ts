import { Model, Schema, model, models } from "mongoose";

const userSchema: Schema<Users> = new Schema<Users>({
    id: String,
    username: String,
    password: String,
    desc: String,
    atmin: Boolean,
});

const userModel: Model<Users> = models.user || model("user", userSchema);
export { userModel, userSchema };