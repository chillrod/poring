import axios from "axios";

export default module.exports = {
  post: jest.fn().mockImplementationOnce(async (baseURL, params, get) => {
    await axios
      .post(baseURL, "", {
        params,
        headers: params.getHeaders(),
      })
      .then((res) => {
        const { data } = res;

        get(data);
      })
      .catch((err) => console.log(err));
  }),
};
