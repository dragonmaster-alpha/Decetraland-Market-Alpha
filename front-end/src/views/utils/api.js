import axios from "axios";

const http = axios.create({
  baseURL: 'http://localhost:3000/api/',
  headers: {
    "Content-type": "application/json"
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
          'authorization': 'Bearer ' + localStorage.getItem('token')
        }
      };

      return {
          fetchAll: () => http.get(url + '/list', config),
          fetchPagination: (page, limit) => 
              http.get(url + "?page=" + page + "&limit=" + limit, config),
          fetchById: id => http.get(url + "/" + id, config),
          create: newRecord => http.post(url, newRecord, config),
          update: (id, updatedRecord) => http.put(url + "/" + id, updatedRecord, config),
          delete: id => http.delete(url + "/" + id, config)
      }
  },

  card(url = 'card') {
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
        create: ({card_name, card_desc, card_price}) => http.post(url, {card_name, card_desc, card_price}, config),
        update: (id, updatedRecord) => http.put(url + "/" + id, updatedRecord, config),
        delete: id => http.delete(url + "/" + id, config)
    }
},

  track(url = 'track') {
    const config = {
      headers: {
        'authorization': 'Bearer ' + localStorage.getItem('token')
      }
    };
    return {
      fetchPaginate: (team_id, page, limit, status, from, to) => http.get(url + '/list?id=' + team_id + '&page=' + page + '&limit=' + limit + '&status=' + status + '&from=' + from + '&to=' + to, config),
      fetchCollections : () => http.get(url + '/collections', config),
      fetchTimeHistory: (team_id) => http.get(url + '/timehistory?id=' + team_id, config)
    }
  }

}