import { request } from "../../utils/request";

export const fetchNintendoGameSale = () => {
  return request<LearnAntvG2.INintendoGameSaleItem[]>(
    "https://gw.alipayobjects.com/os/antvdemo/assets/data/nintendo.json",
    {
      method: "get",
    }
  );
};
