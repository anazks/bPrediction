import axios from "axios";

const instance = axios.create({
    baseURL: 'https://api.waqi.info/feed',
  });

export default instance