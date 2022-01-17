import axios from "axios";

const baseURL = "https://translate.argosopentech.com/";

const translateService = axios.create({
  baseURL,
});

export default translateService;
