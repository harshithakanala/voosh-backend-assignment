import { Models } from '../schemas';

const tokenModel = Models.Token;

export const isTokenInvalidated = async (token: string) => {
  const invalidatedToken = await tokenModel.findOne({ token });

  return !!invalidatedToken;
};

export const invalidateToken = async (token: string) => {
  const newInvalidatedToken = new tokenModel({ token });

  return newInvalidatedToken.save();
};
