import axios from "axios";

const API_BASE_URL = 'https://twosport-api-offcial-685025377967.asia-southeast1.run.app/api/RentalOrder';

export const getRentalsListAPI = () => {
  return axios.get(`${API_BASE_URL}/get-all-rental-orders`, {
    headers: {
      'accept': '*/*'
    }
  });
};
export const getRentalbyStatusAPI = (orderStatus) => {
    return axios.get(`${API_BASE_URL}/get-rental-orders-by-status`, {
      headers: {
        'accept': '*/*'
      },
      params: {
        orderStatus: orderStatus
      }
    });
  };

  export const getRentalDetailAPI = (orderCode) => {
    return axios.get(`${API_BASE_URL}/get-rental-order-by-orderCode?orderCode=${orderCode}`, {
      headers: {
        'accept': '*/*'
      }
    });
  };

  export const getRentalbyBranchAPI = (branchId) => {
    return axios.get(`${API_BASE_URL}/get-orders-by-branch?branchId=${branchId}`, {
      headers: {
        'accept': '*/*'
      }
    });
  };

  export const approveRentalAPI = (orderId) => {
    return axios.post(`${API_BASE_URL}/${orderId}/approve`, {
      headers: {
        'accept': '*/*'
      }
    });
  };
  
  export const rejectRentalAPI = (orderId) => {
    // console.log(orderId);
    
    return axios.post(`${API_BASE_URL}/${orderId}/reject`, {
      headers: {
        'accept': '*/*'
      }
    });
  };

  export const removeRentalAPI = (orderId) => {
    return axios.delete(`${API_BASE_URL}/remove/${orderId}`, {
      headers: {
        'accept': '*/*'
      }
    });
  };

  export const getListExtension = (extensionStatus, branchId) => {
    return axios.get(`${API_BASE_URL}/get-extension-orders/${extensionStatus }?branchId=${branchId}`, {
      headers: {
        'accept': '*/*'
      }
    });
  };

  export const approveExtensionAPI = (rentalOrderCode) => {
    return axios.post(`${API_BASE_URL}/approve-extension/${rentalOrderCode}`, {
      headers: {
        'accept': '*/*'
      }
    });
  };

  export const rejectExtensionAPI = (rentalOrderCode, rejectionReason) => {
    return axios.post(`${API_BASE_URL}/approve-extension/${rentalOrderCode}`,{rejectionReason}, {
      headers: {
        'accept': '*/*'
      }
    });
  };
  
export const getRentalReturnAPI = () => {
  return axios.get(`${API_BASE_URL}/get-return-request`, {
    headers: {
      'accept': '*/*'
    },
  });
};