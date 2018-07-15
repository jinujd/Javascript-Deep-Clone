function deepClone(obj) {
    /*
     * Duplicates an object 
     */
  
    var ret = null;
    if (obj !== Object(obj)) { // primitive types
        return obj;
    }
    if (obj instanceof String || obj instanceof Number || obj instanceof Boolean) { // string objecs
        ret = obj; // for ex: obj = new String("Spidergap")
    } else if (obj instanceof Date) { // date
        ret = new obj.constructor();
    } else
        ret = Object.create(obj.constructor.prototype);

    var prop = null;
    var allProps = Object.getOwnPropertyNames(obj); //gets non enumerables also


    var props = {};
    for (var i in allProps) {
        prop = allProps[i];
        props[prop] = false;
    }

    for (i in obj) {
        props[i] = i;
    }

    //now props contain both enums and non enums 
    var propDescriptor = null;
    var newPropVal = null; // value of the property in new object
    for (i in props) {
        prop = obj[i];
        propDescriptor = Object.getOwnPropertyDescriptor(obj, i);

        if (Array.isArray(prop)) { //not backward compatible
            prop = prop.slice(); // to copy the array
        } else
        if (prop instanceof Date == true) {
            prop = new prop.constructor();
        } else
        if (prop instanceof Object == true) {
            if (prop instanceof Function == true) { // function
                if (!Function.prototype.clone) {
                    Function.prototype.clone = function() {
                        var that = this;
                        var temp = function tmp() {
                            return that.apply(this, arguments);
                        };
                        for (var ky in this) {
                            temp[ky] = this[ky];
                        }
                        return temp;
                    }
                }
                prop = prop.clone();

            } else // normal object	
            {
                prop = deepClone(prop);
            }

        }

        newPropVal = {
            value: prop
        };
        if (propDescriptor) {
            /*
             * If property descriptors are there, they must be copied
             */
            newPropVal.enumerable = propDescriptor.enumerable;
            newPropVal.writable = propDescriptor.writable;

        }
        if (!ret.hasOwnProperty(i)) // when String or other predefined objects
            Object.defineProperty(ret, i, newPropVal); // non enumerable

    }
    return ret;
}