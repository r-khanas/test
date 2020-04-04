var User = new Schema({
  name: {
    type: String,
  },
  surname: {
    type: String,
  },
  address: new Schema({
    number: {
      type: String,
    },
  }),
  hobbies: [
    {
      type: String,
    },
  ],
});
