export const schemaOptions = {
  autoCreate: true,
  autoIndex: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
  toObject: {
    virtuals: true,
    getters: true,
  },
  versionKey: false,
  timestamps: true,
  id: false,
};
