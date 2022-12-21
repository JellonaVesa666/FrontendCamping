//---API URL---//
// import
import { API } from "../config"

export const GetCabinList = async (id) => {

  // Initialize as url address variable
  let request;

  // Set as url address if id parameter exists
  if (id == null) {
    request = `${API}/cabinlists`;
  }
  else {
    request = `${API}/cabinlist/${id}`;
  }

  try {
    const response = await fetch(request)
    //console.log(response);
    return response.json()
  }
  catch(error) {
    //console.log(error);
    return error.json()
  }
}