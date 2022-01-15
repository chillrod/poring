export default module.exports = {
  input: jest.fn().mockImplementation((char, data) => {
    return data(char);
  }),
};
