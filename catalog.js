import CatalogAPI from 'catalogAPI'

function Catalog(){

    var _data = {}

    // Query by ID within array, then turn result into object
    const _arrayToObject = function _arrayToObject(type, array, id){
        let index = array.filter(function findByID(value) {
            return value[0] === id
        })

        let result = {
            id: index[0],
            display_name: index[3]
        }

        if(type === 'category'){
            result.object_type = index[1],
            result.stat_name = index[2]
        } else {
            result.category_id = index[1],
            result.field_name = index[2]
        }

        return result;
    }

    const initialize = function initialize(){
        const catalogapi = CatalogAPI()
        let fetchData = Promise.all([
            catalogapi.getCategories(),
            catalogapi.getMetrics()
        ])

        let successHandler = function successHandler(response){
            _data.categories = response[0]
            _data.metrics = response[1]
        }

        let errorHandler = function errorHandler(error){
            throw error
        }

        fetchData.then(successHandler, failureHandler)

        return fetchData
    }

    const getCategoryById = function getCategoryById(id){
        return _arrayToObject('category', _data.categories, id)
    }

    const _statStringtoObject = _statStringtoObject(type, statString){
        let result = {}

        if(type === 'category'){
            result.objectType = statString.split(':')[0].split('.')[1]
            result.statName = statString.split(':')[0].split('.')[2]
        } else {
            result.fieldName = statString.split(':')[1]
        }
        return result

    }

    const getCategoryByStatString = function getCategoryByStatString(statString){
        let str = _statStringtoObject('category', statString)
    }

    const getMetricByStatString = function getMetricByStatString(statString){
        let str = _statStringtoObject('metric', statString)
    }

    const getMetricById  = function getMetricById (id){
        return _arrayToObject('metric', _data.metric, id)
    }

    return {
        initialize: initialize,
        getCategoryByStatString: getCategoryByStatString,
        getCategoryById : getCategoryById,
        getMetricByStatString : getMetricByStatString,
        getMetricById : getMetricById
    }
}

  let c = Catalog()

  it(' Catalog has correct methods', function() {
      assert.notEqual(c.initialize, undefined)
      assert.notEqual(c.getCategoryById, undefined)
      assert.notEqual(c.getMetricByStatString, undefined)
      assert.notEqual(c.getMetricById, undefined)
  })











Produce a JavaScript object called Catalog, with the

following five API methods. Optimize for time and memory

performance.

getCategoryById(id):

   Takes a numeric ID, and returns a Category object.

 Category objects have the following attributes: id,

object_type, stat_name, display_name. These fields are

described in the Catalog API section below.

   Example Response:

       id: 1,

       object_type: 'device',

       stat_name: 'http',

       display_name: 'HTTP'

getCategoryByStatString(statString):

   Takes a string with the format "extrahop.%s.%s", where

%s represent the "object_type" and "stat_name" attributes

(described later). Returns a category object in the same

format as getCategoryById.

getMetricById(id):

   Takes a numeric ID, and returns a Metric object.  Metric

objects have the following attributes: id, category_id,

field_name, display_name. These fields are described in the

Catalog API section below.

   Example Response:

       id: 1,

       category_id: 1,

       field_name: 'req',

       display_name: 'Reequests'

getMetricByStatString(statString):

   Takes a string with the format "extrahop.%s.%s:%s",

where %s represent the "object_type" and "stat_name"

attributes from the category, and the "field_name"

attribute from the metric.  Returns a metric object, in the

same format as getMetricById.

initialize():

   Downloads data using the using the CatalogAPI. Returns a

promise that resolves when the catalog is ready to use.

This function may be called multiple times, but should only

download the catalog data once.

EXAMPLE USAGE:

var c = new Catalog();

c.initialize().then(

   function() {

       var category1, category2, metric1, metric2;

       // Test category lookups

       category1 = c.getCategoryById(1);

       category2 =

c.getCategoryByStatString('extrahop.device.http');

       if (category1.id === category2.id) {

           console.log(category1.display_name + ' lookups

match!');

       }

       // Test metric lookups

       metric1 = c.getMetricById(4);

       metric2 =

c.getMetricByStatString('extrahop.device.dns:req');

       if (metric1.id === metric2.id) {

           console.log(metric.display_name + ' lookups

match!');

       }

CATALOG API:

You should retrieve data via the CatalogAPI object. You can

assume that this module is already written and simply write

a stub function that returns a promise that is immediately

resolved.

Give the CatalogAPI two methods:

getCategories():

   Returns a promise.  When it resolves, it returns an

array of arrays, containing category data.

   Each inner array represents the following fields (in

order): id, object_type, stat_name, display_name

   Example return data:

       [1, 'device', 'http', 'HTTP'],

       [2, 'device', 'dns', 'DNS'],

       [3, 'application', 'ldap', 'LDAP'],

       [4, 'application', 'mongo', 'MongoDB']

getMetrics():

   Returns a promise. When it resolves, it returns an array

of arrays, containing category data.

   Each inner array represents the following fields (in

order):

   id, category_id, field_name, display_name

   Example return data:

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
