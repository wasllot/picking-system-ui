import axios from "./index";

class OrdersApi {
  static getOrders = (data) => {
    return axios.get(`${base}/get_list`, data);
  };
}

let base = "orders";

export default OrdersApi;
