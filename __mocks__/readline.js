module.exports = {
  createInterface: jest.fn().mockReturnValue({
    question: jest.fn().mockImplementationOnce((questionText, cb) => {
      return cb("test.json");
    }),
    wrongfile: jest.fn().mockImplementationOnce((questionText, cb) => {
      return cb("test.js");
    }),
  }),
};
