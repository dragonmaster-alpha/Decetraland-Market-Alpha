import axios from "axios";

const http = axios.create({
  baseURL: 'http://localhost:3000/api/',
  headers: {
    "Content-type": "application/json",
  }
});

export default {
  auth(url = 'auth') {
    return {
        login: ({username, password}) => http.post(url + '/login', {username, password}),
        register: ({email, username, password}) => http.post(url + '/register', {email, username, password}),
        verify: (code) => http.get(url + '/confirm/' + code)
    }
  },

  user(url = 'user') {
      const config = {
        headers: {
          'authorization': 'Bearer ' + localStorage.getItem('token'),
        }
      };

      return {
          fetchAll: () => http.get(url + '/list', config),
          fetchPagination: (page, limit) => 
              http.get(url + "?page=" + page + "&limit=" + limit, config),
          fetchById: id => http.get(url + "/" + id, config),
          create: newRecord => http.post(url, newRecord, config),
          update: (id, updatedRecord) => http.put(url + "/" + id, updatedRecord, config),
          delete: id => http.delete(url + "/" + id, config),
          updateMana: mana => http.post(url + "/update-mana", mana, config),
      }
  },

  card(url = 'card') {
    const config = {
      headers: {
        'authorization': 'Bearer ' + localStorage.getItem('token')
      }
    };
    const configForm = {
      headers: {
        'authorization': 'Bearer ' + localStorage.getItem('token'),
        'content-type': 'multipart/form-data'
      }
    };

    return {
        fetchAll: () => http.get(url + '/list', config),
        fetchPagination: (page, limit) => 
            http.get(url + "?page=" + page + "&limit=" + limit, config),
        fetchById: id => http.get(url + "/" + id, config),
        // create: ({card_name, card_desc, card_price, user_id}) => http.post(url, {card_name, card_desc, card_price, user_id}, config),
        create: (newRecord) => http.post(url, newRecord, configForm),
        update: (id, updatedRecord) => http.put(url + "/" + id, updatedRecord, config),
        delete: id => http.delete(url + "/" + id, config),
        loadSubAll: () => http.get(url + "/sub-list", config),
        updateStatus: (newRecord) => http.post(url + "/update-status", newRecord, config),
        getReceivedBid: () => http.get(url + "/get-received-bid", config),
    }
},

  bid(url = 'bid') {
  const config = {
    headers: {
      'authorization': 'Bearer ' + localStorage.getItem('token')
    }
  };

  return {
      fetchAll: () => http.get(url + '/list', config),
      fetchPagination: (page, limit) => 
          http.get(url + "?page=" + page + "&limit=" + limit, config),
      fetchById: id => http.get(url + "/" + id, config),
      // create: ({card_name, card_desc, card_price, user_id}) => http.post(url, {card_name, card_desc, card_price, user_id}, config),
      create: (newRecord) => http.post(url, newRecord, config),
      update: (id, updatedRecord) => http.put(url + "/" + id, updatedRecord, config),
      delete: id => http.delete(url + "/" + id, config),
      getMatchedBid: (newRecord) => http.post(url + "/get-bid", newRecord, config),
      updateOrCreate: (newRecord) => http.post(url + "/update", newRecord, config),
      getPlacedBid: () => http.get(url + "/get-placed-bid", config),
      getReceivedBid: () => http.get(url + "/get-received-bid", config),
  }
},

}