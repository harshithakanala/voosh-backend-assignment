import { model, Schema } from 'mongoose';
import { Types } from 'music-types';

const TokenSchema = new Schema<Types.Token>({
  token: {
    type: String,
    required: true,
    unique: true,
  },
}, { timestamps: true });

const Token = model<Types.Token>('token', TokenSchema, 'token');

export { Token, TokenSchema };
