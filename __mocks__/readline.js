module.exports = {
  createInterface: jest.fn().mockReturnValue({
    question: jest.fn().mockImplementationOnce((questionText, cb) => {
      return cb("test.json");
    }),
    wrongfile: jest.fn().mockImplementationOnce((questionText, cb) => {
      return cb("test.js");
    }),
    needtobejson: jest.fn().mockImplementationOnce((questionText, cb) => {
      return cb("You need to provide a JSON file to this works properly");
    }),
  }),
};
