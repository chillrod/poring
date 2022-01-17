export default module.exports = {
  input: jest.fn().mockImplementation((char, data) => {
    return data(char);
  }),
  singleLineMenu: jest.fn().mockImplementationOnce((items, selected, data) => {
    return data(selected);
  }),
};
