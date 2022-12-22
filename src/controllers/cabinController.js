//---API URL---//
// import
import { API } from "../config"

// Gets all Cabins when AdminCabinsPage is loaded
export const GetCabinsById = async (cabinList) => {
  try {
    const response = await fetch(`${API}/cabins/${cabinList}`)
    //console.log(response);
    return response.json()
  }
  catch (error) {
    //console.log(error);
    return error.json()
  }
}

export const GetCabinById = async (cabin) => {
  try {
    const response = await fetch(`${API}/cabin/${cabin._id}`)
    //console.log(response.json);
    return response.json()
  }
  catch (error) {
    //console.log(error);
    return error.json()
  }
}

export const CreateCabin = async (newCabinData) => {
  //console.log(JSON.stringify(newCabinData));
  try {
    const response = await fetch(`${API}/cabin`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newCabinData)
    })
    //console.log(response);
    return response.json()
  }
  catch (error) {
    //console.log(error);
    return error.json()
  }
}

export const UpdateCabinStatus = async (newCabinData) => {
  //console.log(JSON.stringify(newCabinData));
  try {
    const response = await fetch(`${API}/cabin/update/status`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newCabinData)
    })
    //console.log(response);
    return response.json()
  }
  catch (error) {
    //console.log(error);
    return error.json()
  }
}

export const UpdateCabin = async (newCabinData) => {
  //console.log(JSON.stringify(newCabinData));
  try {
    const response = await fetch(`${API}/cabin/update`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newCabinData)
    })
    //console.log(response);
    return response.json()
  }
  catch (error) {
    //console.log(error);
    return error.json()
  }
}

export const DeleteCabin = async (cabin) => {
  //console.log(JSON.stringify(cabinId));
  try {
    const response = await fetch(`${API}/cabin/delete`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(cabin)
    })
    //console.log(response);
    return response.json()
  }
  catch (error) {
    //console.log(error);
    return error.json()
  }
}