//(function() {
    'use strict'

    var CatalogStubAPI = function CatalogStubAPI() {
        // Mock data responses
        var categoryResponse = [
          [1, 'device', 'http', 'HTTP'],
          [2, 'device', 'dns', 'DNS'],
          [3, 'application', 'ldap', 'LDAP'],
          [4, 'application', 'mongo', 'MongoDB']
        ]

        var metricResponse = [
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

        // Get Metrics data
        var getMetrics = function getMetrics(){
            return generatePromise(metricResponse)
        }

        // Get Category data
        var getCategories = function getCategories(){
            return generatePromise(categoryResponse)
        }

        return {
          getMetrics: getMetrics,
          getCategories: getCategories
        }
    }

    // fallback to stub function for data
    if (window.CatalogAPI === undefined) {
        var CatalogAPI = CatalogStubAPI()
    }

    var CatalogProvider = function CatalogProvider(itemString){

        var _LocalStorage = {
            getItem: function getItem(itemString){
                return JSON.parse(localStorage.getItem(itemString))
            },
            setItem : function setItem(itemString, itemValue){
                return localStorage.setItem(itemString, JSON.stringify(itemValue))
            },
            clear: function clear(itemString){
                return localStorage.clear(itemName)
            }
        }

        // Check for item in localStorage
        var item = _LocalStorage.getItem(itemString)
        if(item){
            console.log('Using cached response')
            return generatePromise(item)
        }

        var itemMethod = 'get' + itemString

        // Check for item in localStorage
        if(CatalogAPI[itemMethod]){
            item = CatalogAPI[itemMethod]()
            item.then(function(data){
                console.log('Using API response')
                _LocalStorage.setItem(itemString, data)
                return data
            })
            return item
        }
    }

    // Helper function to generate promises
    var generatePromise = function generatePromise(data){
        return new Promise(function(resolve){
            resolve(data)
        })
    }

    var Catalog = function Catalog() {

        var _data = {}

        // Query by ID within array, then turn result into object
        var _arrayToObject = function _arrayToObject(type, array, id) {

            var isCategory = type === 'category'
            var index

            if (id && array.length > 1) {
                /* index = array.filter(function findByID(arr) {
                    return arr[0] === id
                }) */
                index = array[id - 1]

            } else {
                index = array
            }



            var result = {
                id: index[0],
                display_name: index[3]
            }

            if (isCategory) {
                result.object_type = index[1],
                    result.stat_name = index[2]
            } else {
                result.category_id = index[1],
                    result.field_name = index[2]
            }

            return result
        }

        var _statStringToObject = function _statStringToObject(type, statString) {
            var result = {}

            if (type === 'category') {
                result.objectType = statString.split(':')[0].split('.')[1]
                result.statName = statString.split(':')[0].split('.')[2]
            } else {
                result.fieldName = statString.split(':')[1]
            }
            return result

        }

        var initialize = function initialize() {
            var fetchData = Promise.all([
                CatalogProvider('Categories'),
                CatalogProvider('Metrics')
            ])

            var successHandler = function successHandler(response) {
                _data.categories = response[0]
                _data.metrics = response[1]

            }

            var errorHandler = function errorHandler(error) {
                throw error
            }

            fetchData.then(successHandler, errorHandler)

            return fetchData

        }

        var getCategoryById = function getCategoryById(id) {
            return _arrayToObject('category', _data.categories, id)
        }

        var getCategoryByStatString = function getCategoryByStatString(statString) {
            var stat = _statStringToObject('category', statString)
            var array = _data.categories
            var i = -1
            var len = array.length

            while(i++ < len){
                if(stat.objectType === array[i][1] && stat.statName === array[i][2]){
                    var category = array[i]
                    return _arrayToObject('category', category)
                }
            }

            return false

        }

        var getMetricByStatString = function getMetricByStatString(statString) {
            var stat = _statStringToObject('metric', statString)
            var category = getCategoryByStatString(statString)

            var array = _data.metrics
            var i = -1
            var len = array.length

            while(i++ < len){
                if(category.id === array[i][1] && stat.fieldName === array[i][2]){
                    var metric = array[i]
                    return _arrayToObject('metric', metric)
                }
            }

            return false
        }

        var getMetricById = function getMetricById(id) {
            return _arrayToObject('metric', _data.metrics, id)
        }

        return {
            _data: _data,
            initialize: initialize,
            getCategoryByStatString: getCategoryByStatString,
            getCategoryById: getCategoryById,
            getMetricByStatString: getMetricByStatString,
            getMetricById: getMetricById
        }
    }

    window.Catalog = Catalog

//}(window))
