(function() {
    'use strict'

    var catalog = Catalog()

    function tests(){
      console.dir(catalog.getCategoryById(1), "getCategoryById")
      console.dir(catalog.getCategoryByStatString('extrahop.device.http'), "getCategoryByStatString")
      console.dir(catalog.getMetricById(1), "getMetricById")
      console.dir(catalog.getMetricByStatString('extrahop.device.dns:req'), "getMetricByStatString")
    }

    catalog
        .initialize()
        .then(tests)

}(window))
