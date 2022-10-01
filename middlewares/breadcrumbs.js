function getBreadCrumbs(id,name,product_id){
    var items
    var link
                                
        if(id=="") {
            items = "" 
        }
        else{
            link = id
            items = id.split("-");
        }

    var breadCrumbs = [{key:"HOME",value:""}] 

    if(items.length == 3){
        breadCrumbs.push({key:items[0].toUpperCase(),value:"categories/".concat(items[0])})
        breadCrumbs.push({key:items[1].toUpperCase(),value:"categories/".concat(items[0],"-",items[1])})
        breadCrumbs.push({key:items[2].toUpperCase(),value:"products/".concat(link,"?page=1")})
    }

    else if(items.length == 4){
        breadCrumbs.push({key:items[0].toUpperCase(),value:"categories/".concat(items[0])})
        breadCrumbs.push({key:items[1].toUpperCase(),value:"categories/".concat(items[0],"-",items[1])})
        breadCrumbs.push({key:items[2].concat("-",items[3]).toUpperCase(),value:"products/".concat(link,"?page=1")})
    }

    else if(items.length == 2){
        breadCrumbs.push({key:items[0].toUpperCase(),value:"categories/".concat(items[0])})
        breadCrumbs.push({key:items[1].toUpperCase(),value:"categories/".concat(items[0])})
    }

    else if(items.length == 1){
        breadCrumbs.push({key:id.toUpperCase(),value:"categories/".concat(link)})
    }


    if(name && product_id){breadCrumbs.push({key:name,value:"product/".concat(product_id)})}
    
    return breadCrumbs
}

module.exports = getBreadCrumbs