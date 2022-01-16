import axios from "axios";

export default module.exports = {
  post: jest.fn().mockImplementation(async (baseURL, params, get) => {
    try {
      const { data } = await axios.post(baseURL, "", {
        params,
        headers: params.getHeaders(),
      });

      return get(data);
    } catch (err) {
      console.log("🚀 ~ file: axios.js ~ line 17 ~ post:jest.fn ~ err", err);
    }
  }),

  mPost: jest.fn().mockImplementation(async (params, language, get) => {
    const { q } = params;

    const rules = {
      zh: q + "操作栏",
      es: q + "ciones",
      en: q + "ed",
    };

    try {
      const fakeTranslate = rules[language];

      const res = await new Promise((resolve) =>
        setTimeout(() => resolve(fakeTranslate), 2000)
      );

      return get({ data: { translatedText: res } });
    } catch (err) {
      console.log(err);
    }
  }),
};
