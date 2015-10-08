'use strict'

let CatalogAPI = function CatalogAPI() {
    // Mock data responses
    let metricResponse = [
      [1, 'device', 'http', 'HTTP'],
      [2, 'device', 'dns', 'DNS'],
      [3, 'application', 'ldap', 'LDAP'],
      [4, 'application', 'mongo', 'MongoDB']
    ]

    let categoryResponse = [
      [1, 1, 'req', 'Requests'],
      [2, 1, 'rsp', 'Responses'],
      [3, 1, 'tprocess', 'Server Processing Time'],
      [4, 2, 'req', 'Requests'],
      [5, 2, 'rsp', 'Responses'],
      [6, 2, 'trunc', 'Truncated Responses'],
      [7, 3, 'plain', 'Plain Text Messages'],
      [8, 3, 'sasl', 'SASL Messages'],
      [9, 3, 'error', 'Errors'],
      [10, 4, 'req', 'Requests'],
      [11, 4, 'rsp', 'Responses'],
      [12, 4, 'tprocess', 'Server Processing Time']     
    ]

    // Helper function to generate promises
    let _generatePromise = function _generatePromise(data){
        return new Promise(function(resolve){
            resolve(data)
        })
    }

    // Get Metrics data
    let getMetrics = function getMetrics(){
        return _generatePromise(metricResponse)
    }

    // Get Category data
    let getCategories = function getCategories(){
        return _generatePromise(categoryResponse)
    }

    return {
      getMetrics: getMetrics,
      getCategories: getCategories
    }
}

export default CatalogAPI
