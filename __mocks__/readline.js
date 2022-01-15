module.exports = {
  createInterface: jest.fn().mockReturnValue({
    question: jest.fn().mockImplementation((file, cb) => {
      return cb(file);
    }),
  }),
};
