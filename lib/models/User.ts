import { Schema, model, models } from 'mongoose';

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
    },
    avatarUrl: {
      type: String,
    },
    color: {
      type: String,
    },
  },
  { timestamps: true }
);

const User = models.User || model('User', UserSchema);

export default User;
