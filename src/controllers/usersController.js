//---API URL---//
// import
import { API } from "../config"

export const GetAllUsers = async () => {
  return await fetch(`${API}/users`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify()
  })
    .then(res => {
      return res.json()
    })
    .catch(error => {
      console.log(`Error: ${error}`);
      return error.json()
    })
}

export const DeleteUser = async (id) => {
  return await fetch(`${API}/user/delete`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ _id: id })
  })
    .then(res => {
      return res.json()
    })
    .catch(error => {
      console.log(error)
      return error.json()
    })
}

export const UpdateUser = async (user) => {
  return await fetch(`${API}/user/update`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },

    body: JSON.stringify(user)
  })
    .then(res => {

      return res.json()

    })
    .catch(error => {
      console.log(user);
      console.log(error)
    })
}

export const GetFilteredUsers = async () => {
  try {
    const response = await fetch(`${API}/filteredusers`)
    //console.log(response);
    return response.json()
  }
  catch (error) {
    //console.log(error);
    return error.json()
  }
}
