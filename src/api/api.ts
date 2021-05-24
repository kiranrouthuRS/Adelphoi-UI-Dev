import axios from "axios";
import * as Types from "./definitions";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import { useHistory } from "react-router-dom";
import { store } from "../index";
import * as user from "../redux-modules/user";
import { domainPath } from "../App"
import { AppState } from "../redux-modules/root";
import FormData from "form-data"
export const baseApiUrl = `http://3.7.135.210:8005/organizations`;
export const loginApiUrl = "http://3.7.135.210:8005"; 



interface PredictionResponse {
  referred_program: string;
  model_program: string;
}

interface LocationsResponse {
  result?: string;
  "Suggested Locations": string[];
}

const refreshAuthLogic = (failedRequest: {
  response: { config: { headers: { [x: string]: string } } };
}) => {
  const userState = store.getState().user;
  const currentUser = userState.user;
  // const refreshToken = localStorage.getItem("refreshToken");
  if (!userState) {
    return Promise.reject();
  }

  return axios
    .post(`${loginApiUrl}/login/refresh/`, {
      refresh: currentUser.refreshToken
    })
    .then(tokenRefreshResponse => {
      // localStorage.setItem("refresh", tokenRefreshResponse.data.token);
      const accessToken = tokenRefreshResponse.data.access_token;
      store.dispatch(
        user.actions.update({
          user: {
            ...currentUser,
            accessToken
          }
        })
      );
      failedRequest.response.config.headers["Authorization"] =
        "Bearer " + accessToken;
      return Promise.resolve();
    });
};
// Instantiate the interceptor (you can chain it as it returns the axios instance)
createAuthRefreshInterceptor(axios as any, refreshAuthLogic);

// Make a call. If it returns a 401 error, the refreshAuthLogic will be run,
// and the request retried with the new token
export const login = async (email: string, password: string, domain: string) => {
  try {
    const response: any = await axios.post(`${loginApiUrl}/organizations/${domain}/login`, {
      username: email,
      password: password
    });
    localStorage.setItem("refreshToken", response.data.response.token);
    return response.data;
  } catch (error) {
    console.error("api function login error");
    throwError(error);
  }
};

export const Logout = async (accessToken) => {
  const { dispatch } = store;
  const currentUser = store.getState().user.user.accessToken;
  
  try {
    let myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${accessToken ? accessToken : currentUser}`);

    let requestOptions = {
      method: 'POST',
      headers: myHeaders,

    };

    await fetch(`${baseApiUrl}/${domainPath}/logout`, requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
     localStorage.removeItem("refreshToken")
     

  } catch (error) {
    console.error("api function fetchLocationsList error");
    throwError(error);
  }
};
export const updateConfiguration = async (
  configuration: Types.Configuration
) => {
  try {
    const response = await axios.post(`${baseApiUrl}/${domainPath}/dataSave`, configuration);
    return response.data.data;
  } catch (error) {
    console.error("api function updateConfiguration error");
    throwError(error);
  }
};

export const insertClient = async (client: Types.Client) => {

  try {
    const response = await axios.post(`${baseApiUrl}/${domainPath}/list_view/`, client);
    if (response.data["ERROR"] && response.data["ERROR"].trim() !== "") {
      throw new Error(response.data["ERROR"]);
    }
    if (response.data["Result"] && response.data["Result"].trim() !== "") {
      return response.data;
    }
    const r = {
      ...response.data,
      program_type: response.data.program_type[0],
      referred_program: response.data.program_type[0],
      model_program: response.data.program_type[0]
    };

    return (r as unknown) as Partial<Types.Client>;
  } catch (error) {
    const data = error.response.data;
    let clientErrors: { [x: string]: any } = {};
    Object.keys(data).map(key => {
      return (clientErrors[key] = data[key][0]);
    });
    console.error("api function insertClient error");
    throw clientErrors;
  }
};

export const updateClient = async (client: Types.Client) => {
  try {
    const response = await axios.put(`${baseApiUrl}/${domainPath}/latest_update/${client.client_code}/`, client);
    if (response.data["ERROR"] && response.data["ERROR"].trim() !== "") {
      throw new Error(response.data["ERROR"]);
    }
    if (response.data["Result"] && response.data["Result"].trim() !== "") {
      return response.data;
    }
    const r = {
      ...response.data,
      program_type: response.data.program_type[0],
      referred_program: response.data.program_type[0],
      model_program: response.data.program_type[0]
    };

    return (r as unknown) as Partial<Types.Client>;
  } catch (error) {
    const data = error.response.data;
    let clientErrors: { [x: string]: any } = {};
    Object.keys(data).map(key => {
      return (clientErrors[key] = data[key][0]);
    });
    console.error("api function updateClient error");
    throw clientErrors;
  }
};

export const uploadcsvfile = async (data, is_accessToken) => {
  try {
    return await axios.post(`${baseApiUrl}/${domainPath}/clients`, data, {
      headers: {
        'Authorization': `Bearer ${is_accessToken}`
      }
    })
      .then(response => {
        const bill = response.data
        const path = response.data.response
        return response.data;
      })

  }

  catch (error) {
    console.log('error')

    throwError(error)

  }
};

export const downloadcsvfile = async (is_accessToken) => {
  try {
    return await axios.get(`${baseApiUrl}/${domainPath}/client-config?download`, {
      headers: {
        'Authorization': `Bearer ${is_accessToken}`
      }
    })
      .then(response => {
        const bill = response.data
        const path = response.data.response.csv
        window.open(`${loginApiUrl}/${path}`);
        return response.data;
      })

  }

  catch (error) {
    console.log('error')

    throwError(error)

  }
};

export const insertDClient = async (client_form, is_accessToken) => {
  const currentUser = store.getState().user.user.accessToken;
  var data = new FormData();
  var myJSON = JSON.stringify(client_form);
  data.append('client_form', myJSON);
  try {
    const response = await axios.post(`${baseApiUrl}/${domainPath}/clients`, data, {
      headers: {
        'Authorization': `Bearer ${is_accessToken}`
      }
    });
    // if (response.data["ERROR"] && response.data["ERROR"].trim() !== "") {
    //   throw new Error(response.data["ERROR"]);
    // }
    // if (response.data["Result"] && response.data["Result"].trim() !== "") {
    //   return response.data;
    // }
    const r = {
      ...response,
      program_type: response.data.response.program_type && response.data.response.program_type[0],
      referred_program: response.data.response.program_type && response.data.response.program_type[0],
      model_program: response.data.response.program_type && response.data.response.program_type[0]
    };

    return (r as unknown) as Partial<Types.DynamicClient>;
  } catch (error) {
    const data = error.response ? error.response : "";
    let clientErrors: { [x: string]: any } = {};
    Object.keys(data).map(key => {
      return (clientErrors[key] = data[key][0]);
    });
    console.error("api function insertClient error");
    throw clientErrors;
  }
};

export const updateDClient = async (client: Types.Client) => {
  try {

    const response = await axios.put(`${baseApiUrl}/${domainPath}/latest_update/${client.client_code}/`, client);
    if (response.data["ERROR"] && response.data["ERROR"].trim() !== "") {
      throw new Error(response.data["ERROR"]);
    }
    if (response.data["Result"] && response.data["Result"].trim() !== "") {
      return response.data;
    }

    const r = {
      ...response.data,
      program_type: response.data.program_type[0],
      referred_program: response.data.program_type[0],
      model_program: response.data.program_type[0]
    };

    return (r as unknown) as Partial<Types.Client>;
  } catch (error) {
    const data = error.response.data;
    let clientErrors: { [x: string]: any } = {};
    Object.keys(data).map(key => {
      return (clientErrors[key] = data[key][0]);
    });
    console.error("api function updateClient error");
    throw clientErrors;
  }
};

export const fetchConfiguredQuestions = async (is_accessToken) => {
  try {
    const response = await axios.get(`${baseApiUrl}/${domainPath}/client-config`, {
      headers: {
        'Authorization': `Bearer ${is_accessToken}`
      }
    });
    const data = response.data
    return data;
  } catch (error) {
    console.error("api function fetchConfiguredQuestions error");
    throwError(error);
  }
};

export const insertPrediction = async (client: Types.Client) => {
  if (!client.client_code) {
    throw new Error("client code required");
  }
  try {
    const response = await axios.put(
      `${baseApiUrl}/${domainPath}/refer/${client.client_code}/`,
      { referred_program: client.program_type }
    );

    return response;
  } catch (error) {
    console.error("api function insertPrediction error");
    throwError(error);
  }
};

export const fetchUsers = async () => {
  try {
    const response = await axios.get(`${loginApiUrl}/organizations/${domainPath}/users/`);
    const data = (response.data as unknown) as Types.Users[];

    return data;
  } catch (error) {
    console.error("api function fetchUsers error");
    throwError(error);
  }
};
export const fetchRoles = async (is_accessToken: any) => {
  const currentUser = store.getState().user.user.accessToken;

  try {
    const response = await axios.get(`${loginApiUrl}/organizations/${domainPath}/groups/`, {
      headers: {
        'Authorization': `Bearer ${is_accessToken}`
      }
    });
    return response.data;
  } catch (error) {

    console.error("api function fetchRoles error");
    throwError(error);
  }
};

export const fetchAvailableUsers = async (userID: any) => {
  const currentUser = store.getState().user.user.accessToken;
  try {
    const response = await axios.get(`${loginApiUrl}/organizations/${domainPath}/users/${userID}`, {
      headers: {
        'Authorization': `Bearer ${currentUser}`
      }
    });
    return response.data.response;
  } catch (error) {
    console.error("api function fetchAvailableUsers error");
    throwError(error);
  }
};

export const createUsers = async (users: Types.Users, is_accessToken: any) => {
  const currentUser = store.getState().user.user.accessToken;
  const data = {
    first_name: users.first_name !== null ? users.first_name.charAt(0).toUpperCase() + users.first_name.substr(1) : "",
    last_name: users.last_name !== null ? users.last_name.charAt(0).toUpperCase() + users.last_name.substr(1) : "",
    email_id: users.email_id,
    gender: users.gender,
    mobile: users.mobile,
    group_id: users.role_type
  }
  try {
    const response = await axios.post(`${loginApiUrl}/organizations/${domainPath}/users/`, data, {
      headers: {
        'Authorization': `Bearer ${is_accessToken}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("api function createUsers error");
    throwError(error);
  }
};

export const updateUsers = async (users: Types.Users, is_accessToken: any) => {
  const currentUser = store.getState().user.user.accessToken;
  try {
    const response = await axios.put(
      `${loginApiUrl}/organizations/${domainPath}/users/${users.id}/`,
      {
        first_name: users.first_name !== null ? users.first_name.charAt(0).toUpperCase() + users.first_name.substr(1) : "",
        last_name: users.last_name !== null ? users.last_name.charAt(0).toUpperCase() + users.last_name.substr(1) : "",
        email_id: users.email_id,
        mobile: users.mobile,
        gender: users.gender,
        group_id: users.role_type
      }
      , {
        headers: {
          'Authorization': `Bearer ${is_accessToken}`
        }
      });
    return response.data;
  } catch (error) {
    console.error("api function updateUsers error");
    throwError(error);
  }
};

export const deleteUsers = async (userID: any, is_accessToken: any) => {
  const currentUser = store.getState().user.user.accessToken;
  try {
    const response = await axios.delete(`${loginApiUrl}/organizations/${domainPath}/users/${userID}/`, {
      headers: {
        'Authorization': `Bearer ${is_accessToken}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("api function deleteUser error");
    throwError(error);
  }
};

export const fetchBillingStatus = async (accessToken) => {
  const { dispatch } = store
  const currentUser = store.getState().user.user.accessToken;
  try {
    return await axios.get(`${baseApiUrl}/${domainPath}/billing-status/`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
      .then(response => {
        const bill = response.data
        return response.data;
      })

  }

  catch (error) {
    console.log('error')

    throwError(error)

  }
};

export const fetchAllRecords = async (sDate, EDate, accessToken) => {
  const { dispatch } = store
  const currentUser = store.getState().user.user.accessToken;

  try {
    return await axios.get(`${baseApiUrl}/${domainPath}/orders/?start_date=${sDate}&end_date=${EDate}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
      .then(response => {
        const bill = response.data
        return response.data;
      })

  }

  catch (error) {
    console.log('error')

    throwError(error)

  }
};

export const getRecord = async (id, accessToken) => {
  const { dispatch } = store
  const currentUser = store.getState().user.user.accessToken;

  try {
    return await axios.get(`${baseApiUrl}/${domainPath}/orders/${id}/`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
      .then(response => {
        const bill = response.data

        return response.data;
      })

  }

  catch (error) {
    console.log('error')

    throwError(error)

  }
};

export const downloadRecords = async (accessToken) => {
  const currentUser = store.getState().user.user.accessToken;

  try {
    return await axios.get(`${baseApiUrl}/${domainPath}/download/`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
      .then(response => {
        const bill = response.data
        const path = response.data.response
        window.open(`${loginApiUrl}/${path}`);
        return response.data;
      })

  }

  catch (error) {
    console.log('error')

    throwError(error)

  }
};

export const getOrderDownload = async (sDate, eDate, accessToken) => {
  const currentUser = store.getState().user.user.accessToken;

  try {
    return await axios.get(`${baseApiUrl}/${domainPath}/download/?start_date=${sDate}&end_date=${eDate}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
      .then(response => {
        const path = response.data.response
        window.open(`${loginApiUrl}/${path}`);
        const records = response.data
        return response.data;
      })
  }

  catch (error) {
    console.log('error')

    throwError(error)

  }
};

export const downloadReportCSV = async (id, accessToken) => {
  const currentUser = store.getState().user.user.accessToken;
  try {
    return await axios.get(`${baseApiUrl}/${domainPath}/download/${id}/`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
      .then(response => {
        const bill = response.data
        const path = response.data.response
        window.open(`${loginApiUrl}/${path}`);
        return response.data;
      })

  }

  catch (error) {
    console.log('error')

    throwError(error)

  }
};

export const fetchReferral = async () => {
  try {
    const response = await axios.get(`${baseApiUrl}/${domainPath}/referral_list`);
    const data = (response.data as unknown) as Types.Referral[];

    return data;
  } catch (error) {
    console.error("api function fetchReferral error");
    throwError(error);
  }
};

export const fetchDReferral = async (accessToken) => {
  const currentUser = store.getState().user.user.accessToken;
  try {
    const response = await axios.get(`${baseApiUrl}/${domainPath}/clients/referralsources`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    const data = (response.data.response as unknown) as any;


    return data;
  } catch (error) {
    console.error("api function fetchDReferral error");
    throwError(error);
  }
};

export const fetchAvailableReferral = async () => {
  try {
    const response = await axios.get(`${baseApiUrl}/${domainPath}/referral_list`);
    const data = (response.data as unknown) as Types.Referral[];

    return data;
  } catch (error) {
    console.error("api function fetchAvailableReferral error");
    throwError(error);
  }
};

export const createReferral = async (referral: Types.Referral) => {
  try {
    const response = await axios.post(`${baseApiUrl}/${domainPath}/referral_save`, {
      referral_name: referral.referral_name
    });
    return response.data;
  } catch (error) {
    console.error("api function createReferral error");
    throwError(error);
  }
};

export const updateReferral = async (referral: Types.Referral) => {
  try {

    const response = await axios.put(
      `${baseApiUrl}/${domainPath}/referral_modify/${referral.referral_code}/`,
      {
        referral_name: referral.referral_name
      }
    );
    return response.data;
  } catch (error) {
    console.error("api function updateReferral error");
    throwError(error);
  }
};

export const deleteReferral = async (referral: Types.Referral) => {
  try {
    const response = await axios.delete(
      `${baseApiUrl}/${domainPath}/referral_modify/${referral.referral_code}/`,
      {
        //referral_name: referral.referral_name
      }
    );
    return response.data;
  } catch (error) {
    console.error("api function deleteReferral error");
    throwError(error);
  }
};

export const fetchPrograms = async () => {
  try {
    const response = await axios.get(`${baseApiUrl}/${domainPath}/program_list`);

    const data = (response.data as unknown) as Types.Program[];

    return data;
  } catch (error) {
    console.error("api function fetchPrograms error");
    throwError(error);
  }
};

export const fetchAvailablePrograms = async () => {
  try {
    const response = await axios.get(`${baseApiUrl}/${domainPath}/available_programs`);

    const data = (response.data as unknown) as Types.Program[];

    return data;
  } catch (error) {
    console.error("api function fetchAvailablePrograms error");
    throwError(error);
  }
};

export const createProgram = async (program: Types.Program) => {
  try {
    const response = await axios.post(`${baseApiUrl}/${domainPath}/program_save`, {
      program_name: program.program_name
    });
    return response.data;
  } catch (error) {
    console.error("api function createProgram error");
    throwError(error);
  }
};

export const updateProgram = async (program: Types.Program) => {
  try {
    const response = await axios.put(
      `${baseApiUrl}/${domainPath}/programs/${program.program}/`,
      {
        program_name: program.program_name
      }
    );
    return response.data;
  } catch (error) {
    console.error("api function updateProgram error");
    throwError(error);
  }
};

export const deleteProgram = async (program: Types.Program) => {
  try {
    const response = await axios.delete(
      `${baseApiUrl}/${domainPath}/programs/${program.program}/`,
      {
        //program_name: program.program_name
      }
    );
    return response.data;
  } catch (error) {
    console.error("api function deleteProgram error");
    throwError(error);
  }
};

export const fetchLocationsList = async () => {
  try {
    const response = await axios.get(`${baseApiUrl}/${domainPath}/location_list`);
    const data = (response.data as unknown) as Types.Location[];

    return data;
  } catch (error) {
    console.error("api function fetchLocationsList error");
    throwError(error);
  }
};

export const createLocation = async (location: Types.Location) => {
  try {
    const response = await axios.post(`${baseApiUrl}/${domainPath}/location_save`, {
      location_name: location.location_names
    });
    return response.data;
  } catch (error) {
    console.error("api function createLocation error");
    throwError(error);
  }
};

export const updateLocation = async (location: Types.Location) => {
  try {
    const response = await axios.put(
      `${baseApiUrl}/${domainPath}/locations/${location.location}/`,
      {
        location_names: location.location_names
      }
    );
    return response.data;
  } catch (error) {
    console.error("api function updateLocation error");
    throwError(error);
  }
};

export const deleteLocation = async (location: Types.Location) => {
  try {
    const response = await axios.delete(
      `${baseApiUrl}/${domainPath}/locations/${location.location}/`,
      {
        //location_names: location.location_names
      }
    );
    return response.data;
  } catch (error) {
    console.error("api function deleteLocation error");
    throwError(error);
  }
};

export const fetchLocations = async (
  client_code: string,
  referred_program: string,
  is_accessToken: any
) => {
  try {
    const currentUser = store.getState().user.user.accessToken;
    const response = await axios.get(
      `${baseApiUrl}/${domainPath}/location/${client_code}/?referred_program=${referred_program}`, {
      headers: {
        'Authorization': `Bearer ${is_accessToken}`
      }
    }
    );
    const data = (response.data as unknown) as LocationsResponse;
    return data;
    // return data["Suggested Locations"];
  } catch (error) {
    console.error("api function fetchLocations error");
    throwError(error);
  }
};

export const fetchAnalytics = async (accessToken: any) => {
  const currentUser = store.getState().user.user.accessToken;
  try {
    const response = await axios.get(`${baseApiUrl}/${domainPath}/analytics/referrals?days_count=30`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    const data = (response.data.response as unknown) as Types.Analytics[];

    return data;
  } catch (error) {
    console.error("api function fetchAnalytics error");
    throwError(error);
  }
};

export const fetchDateAnalytics = async (
  analytics: any,
  accessToken: any
) => {
  const currentUser = store.getState().user.user.accessToken;
  let queryString: any = "";
  let length: any = Object.keys(analytics).length
  for (const [key, value] of Object.entries(analytics)) {
    if (value) {
      queryString = `${key}=${value}&` + queryString
    }

  }
  try {
    const response = await axios.get(`${baseApiUrl}/${domainPath}/analytics/referrals?${queryString}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
const data = (response.data.response as unknown) as Types.Analytics[];

    return data;
  } catch (error) {
    console.error("api function fetchAnalytics error");
    throwError(error);
  }


};

export const fetchPCRAnalytics = async (
  filter: any,
  accessToken: any
) => {
  const currentUser = store.getState().user.user.accessToken;
  let queryString: any = "";
  let length: any = Object.keys(filter).length
  for (const [key, value] of Object.entries(filter)) {

    if (value) {
      queryString = `${key}=${value}&` + queryString
    }

  }

  try {
    const response = await axios.get(`${baseApiUrl}/${domainPath}/analytics/pcr?${queryString}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    const data = (response.data.response as unknown) as Types.Analytics[];

    return data;
  } catch (error) {
    console.error("api function fetchprogramAnalytics error");
    throwError(error);
  }
};
export const fetchROCAnalytics = async (
  analytics: any,
  accessToken: any
) => {
  const currentUser = store.getState().user.user.accessToken;
  let queryString: any = "";
  let length: any = Object.keys(analytics).length
  for (const [key, value] of Object.entries(analytics)) {

    if (value) {
      queryString = `${key}=${value}&` + queryString
    }

  }
  try {
    const response = await axios.get(`${baseApiUrl}/${domainPath}/analytics/roc?${queryString}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    const data = (response.data.response as unknown) as Types.Analytics[];

    return data;
  } catch (error) {
    console.error("api function fetchprogramAnalytics error");
    throwError(error);
  }
};

export const fetchReplacementAnalytics = async (
  analytics: any, accessToken: any
) => {
  const currentUser = store.getState().user.user.accessToken;
  let queryString: any = "";
  let length: any = Object.keys(analytics).length

  for (const [key, value] of Object.entries(analytics)) {

    if (value) {
      queryString = `${key}=${value}&` + queryString
    }

  }

  try {
    const response = await axios.get(`${baseApiUrl}/${domainPath}/analytics/replacement?${queryString}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    const data = (response.data.response as unknown) as Types.Analytics[];

    return data;
  } catch (error) {
    console.error("api function fetchprogramAnalytics error");
    throwError(error);
  }
};
export const fetchStayAnalytics = async (
  analytics: any, accessToken: any
) => {
  const currentUser = store.getState().user.user.accessToken;
  let queryString: any = "";
  let length: any = Object.keys(analytics).length

  for (const [key, value] of Object.entries(analytics)) {

    if (value) {
      queryString = `${key}=${value}&` + queryString
    }

  }

  try {
    const response = await axios.get(`${baseApiUrl}/${domainPath}/analytics/stay?${queryString}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    const data = (response.data.response as unknown) as Types.Analytics[];

    return data;
  } catch (error) {
    console.error("api function fetchprogramAnalytics error");
    throwError(error);
  }
};
export const fetchOccupancyAnalytics = async (
  analytics: any, accessToken: any
) => {
  const currentUser = store.getState().user.user.accessToken;
  let queryString: any = "";
  let length: any = Object.keys(analytics).length

  for (const [key, value] of Object.entries(analytics)) {

    if (value) {
      queryString = `${key}=${value}&` + queryString
    }

  }

  try {
    const response = await axios.get(`${baseApiUrl}/${domainPath}/analytics/occupancy?${queryString}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    const data = (response.data.response as unknown) as Types.Analytics[];

    return data;
  } catch (error) {
    console.error("api function fetchprogramAnalytics error");
    throwError(error);
  }
};

export const fetchAllocationAnalytics = async (
  analytics: any, accessToken: any
) => {
  const currentUser = store.getState().user.user.accessToken;
  let queryString: any = "";
  let length: any = Object.keys(analytics).length

  for (const [key, value] of Object.entries(analytics)) {

    if (value) {
      queryString = `${key}=${value}&` + queryString
    }

  }

  try {
    const response = await axios.get(`${baseApiUrl}/${domainPath}/analytics/statistics?${queryString}&q=all`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    const data = (response.data.response as unknown) as Types.Analytics[];

    return data;
  } catch (error) {
    console.error("api function fetchprogramAnalytics error");
    throwError(error);
  }
};

export const fetchAllocated_ProgramAnalytics = async (
  analytics: any, accessToken: any
) => {
  const currentUser = store.getState().user.user.accessToken;
  let queryString: any = "";
  let length: any = Object.keys(analytics).length

  for (const [key, value] of Object.entries(analytics)) {

    if (value) {
      queryString = `${key}=${value}&` + queryString
    }

  }

  try {
    const response = await axios.get(`${baseApiUrl}/${domainPath}/analytics/statistics?q=programs&${queryString}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
const data = (response.data.response as unknown) as Types.Analytics[];

    return data;
  } catch (error) {
    console.error("api function fetchprogramAnalytics error");
    throwError(error);
  }
};

export const fetch_Market_Analytics = async (
  analytics: any, accessToken: any
) => {
  const currentUser = store.getState().user.user.accessToken;
  let queryString: any = "";
  let length: any = Object.keys(analytics).length

  for (const [key, value] of Object.entries(analytics)) {

    if (value) {
      queryString = `${key}=${value}&` + queryString
    }

  }

  try {
    const response = await axios.get(`${baseApiUrl}/${domainPath}/analytics/market?${queryString}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    const data = (response.data.response as unknown) as Types.Analytics[];

    return data;
  } catch (error) {
    console.error("api function fetch_Market_Analytics error");
    throwError(error);
  }
};

export const fetch_Performance_Analytics = async (
  analytics: any, accessToken: any
) => {
  const currentUser = store.getState().user.user.accessToken;
  let queryString: any = "";
  let length: any = Object.keys(analytics).length

  for (const [key, value] of Object.entries(analytics)) {

    if (value) {
      queryString = `${key}=${value}&` + queryString
    }

  }

  try {
    const response = await axios.get(`${baseApiUrl}/${domainPath}/analytics/performance?${queryString}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
const data = (response.data.response as unknown) as Types.Analytics[];

    return data;
  } catch (error) {
    console.error("api function fetchPerformance_Analytics error");
    throwError(error);
  }
};
export const fetch_ROC_Calibration_Analytics = async (
  analytics: any, accessToken: any
) => {
  const currentUser = store.getState().user.user.accessToken;
  let queryString: any = "";
  let length: any = Object.keys(analytics).length

  for (const [key, value] of Object.entries(analytics)) {

    if (value) {
      queryString = `${key}=${value}&` + queryString
    }

  }

  try {
    const response = await axios.get(`${baseApiUrl}/${domainPath}/analytics/calibration?q=graph&${queryString}&q1=roc`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    const data = (response.data.response as unknown) as Types.Analytics[];

    return data;
  } catch (error) {
    console.error("api function fetchAge_Analytics error");
    throwError(error);
  }
};
export const fetch_PCR_Calibration_Analytics = async (
  analytics: any, accessToken: any
) => {
  const currentUser = store.getState().user.user.accessToken;
  let queryString: any = "";
  let length: any = Object.keys(analytics).length

  for (const [key, value] of Object.entries(analytics)) {

    if (value) {
      queryString = `${key}=${value}&` + queryString
    }

  }

  try {
    const response = await axios.get(`${baseApiUrl}/${domainPath}/analytics/calibration?q=graph&${queryString}&q1=pcr`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
   const data = (response.data.response as unknown) as Types.Analytics[];

    return data;
  } catch (error) {
    console.error("api function fetchAge_Analytics error");
    throwError(error);
  }
};
export const fetch_Gender_Analytics = async (
  analytics: any, accessToken: any
) => {
  const currentUser = store.getState().user.user.accessToken;
  let queryString: any = "";
  let length: any = Object.keys(analytics).length

  for (const [key, value] of Object.entries(analytics)) {

    if (value) {
      queryString = `${key}=${value}&` + queryString
    }

  }

  try {
    const response = await axios.get(`${baseApiUrl}/${domainPath}/analytics/demographics?q=sex&${queryString}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    const data = (response.data.response as unknown) as Types.Analytics[];

    return data;
  } catch (error) {
    console.error("api function fetchGender_Analytics error");
    throwError(error);
  }
};
export const fetch_Age_Analytics = async (
  analytics: any, accessToken: any
) => {
  const currentUser = store.getState().user.user.accessToken;
  let queryString: any = "";
  let length: any = Object.keys(analytics).length

  for (const [key, value] of Object.entries(analytics)) {

    if (value) {
      queryString = `${key}=${value}&` + queryString
    }

  }

  try {
    const response = await axios.get(`${baseApiUrl}/${domainPath}/analytics/demographics?q=age&${queryString}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    const data = (response.data.response as unknown) as Types.Analytics[];

    return data;
  } catch (error) {
    console.error("api function fetchAge_Analytics error");
    throwError(error);
  }
};
export const fetch_Demo_Analytics = async (
  analytics: any, accessToken: any
) => {
  const currentUser = store.getState().user.user.accessToken;
  let queryString: any = "";
  let length: any = Object.keys(analytics).length

  for (const [key, value] of Object.entries(analytics)) {

    if (value) {
      queryString = `${key}=${value}&` + queryString
    }

  }

  try {
    const response = await axios.get(`${baseApiUrl}/${domainPath}/analytics/demographics?${queryString}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    const data = (response.data.response as unknown) as Types.Analytics[];

    return data;
  } catch (error) {
    console.error("api function fetchAge_Analytics error");
    throwError(error);
  }
};
export const fetchPcr = async (
  client_code: string,
  referred_program: string,
  currentUser: any
) => {

  try {
    const response = await axios.put(
      `${baseApiUrl}/${domainPath}/program_pcr/${client_code}/`,
      { client_selected_program: referred_program }, {
      headers: {
        'Authorization': `Bearer ${currentUser}`
      }
    }
    );

    const data = (response.data as unknown) as any;
    return data;
  } catch (error) {
    console.error("api function fetch program_pcr error");
    throwError(error);
  }
};

export const saveLocationAndProgram = async (
  client_code: string,
  selected_program: string,
  selected_location: string,
  is_accessToken: any
) => {
  const currentUser = store.getState().user.user.accessToken;
  try {
    const response = await axios.put(
      `${baseApiUrl}/${domainPath}/update_list/${client_code}/`,
      {
        client_selected_program: selected_program,
        client_selected_locations: selected_location
      }, {
      headers: {
        'Authorization': `Bearer ${is_accessToken}`
      }
    }
    );
    return response.data;
  } catch (error) {
    console.error("api function saveLocationAndProgram error");
    throwError(error);
  }
};



export const updateProgramCompletion = async (
  client_code: string,
  Program_Completion: number | null,
  Returned_to_Care: number | null,
  Remained_Out_of_Care: number | null,
  program_significantly_modified: number,
  program: any,
  location: any,
  start_date: any,
  end_date: any,
  referral_status: any,
  confidence: any,
  roc_confidence: any, 
  currentUser: any
) => {
  try {
    const data = {
      Program_Completion : Program_Completion,
      Returned_to_Care : Returned_to_Care,
      ["Remained Out of Care"] : Remained_Out_of_Care,
      program_significantly_modified : program_significantly_modified,
      program: program,
      location: location,
      start_date : start_date,
      end_date : end_date,
      referral_status : referral_status,
      pcr_score: confidence,
      roc_score: roc_confidence
    }
    const response = await axios.put(
      `${baseApiUrl}/${domainPath}/program_complete/${client_code}/`,
      data, {
      headers: {
        'Authorization': `Bearer ${currentUser}`
      }
    }
    );
    return response.data.data;
  } catch (error) {
    console.error("api function updateProgramCompletion error");
    throwError(error);
  }
};

export const searchClient = async (
  client_code: string,
  client_name: string = ""
) => {
  const currentUser = store.getState().user.user.accessToken;
  try {
    const response = await axios.get(
      `${baseApiUrl}/${domainPath}/search/?name=${client_name}&client_code=${client_code}`
    );

    return response.data;
  } catch (error) {
    console.error("api function searchClient error");
    throwError(error);
  }
};

export const searchDClient = async (
  client_code: string,
  client_name: string = "",
  is_accessToken: any
) => {
  const currentUser = store.getState().user.user.accessToken;
  try {
    // const code : any = parseInt(client_code)
    let config: any = {
      method: 'get',
      url: `${baseApiUrl}/${domainPath}/clients?client_name=${client_name}&client_code=${client_code}`,
      headers: {
        'Authorization': `Bearer ${is_accessToken}`
      }
    };
    const response = await axios(config)
    return response.data;
  } catch (error) {
    console.error("api function searchClient error");
    throwError(error);
  }
};

// EXISTING CLIENT PAGE APIs
// list of programs for existing client
// http://13.232.1.126:8000/first_match/program/100/
// Program completion likelihood

export const fetchProgramsForClient = async (client_code: string, currentUser: any) => {
  try {
    const response = await axios.get(`${baseApiUrl}/${domainPath}/program/${client_code}/`, {
      headers: {
        'Authorization': `Bearer ${currentUser}`
      }
    });

    const data = (response.data as unknown) as any;
    return data;
  } catch (error) {
    console.error("api function fetch fetchProgramForClient error");
    throwError(error);
  }
};

function throwError(error: any) {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.log(error.response.data);
    console.log("code", error.response.status);
    console.log(error.response.headers);
    const errorResponse = {
      data: error.response.data || undefined,
      status: error.response.status || undefined
    };
    throw errorResponse;
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    console.log(error.request);
    const errorResponse = {
      data: { Error: "unknown error occurred while contacting the server" },
      status: undefined
    };
    throw errorResponse;
  } else {
    // Something happened in setting up the request that triggered an Error
    console.log("Error", error.message);
  }
}
