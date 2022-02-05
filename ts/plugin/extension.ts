export function removeArrayItem<T>(arr: Array<T>, value: T): Array<T> { 
    if (typeof value === 'number' || typeof value === 'string') {
        const index = arr.indexOf(value);
        if (index > -1) {
          arr.splice(index, 1);
        }
    } else if (typeof value === 'object') {
        for (let i = 0; i < arr.length; i++) {
            if (objectEqual(arr[i], value)) {
                arr.splice(i, 1)
            }
        }
    }
    return arr;
  }
  
export function arrayEqual(arr: any[], array: any[]) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time 
    if (arr.length != array.length)
        return false;

    for (var i = 0, l=arr.length; i < l; i++) {
        // Check if we have nested arrays
        if (arr[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!arr[i].equals(array[i])) return false;
            
        } else if (arr[i] instanceof Object && array[i] instanceof Object){
            if (!objectEqual(arr[i], array[i])) return false

        } else if (arr[i] != array[i]) { 
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;   
        }
    }       
    return true;
}
  
export function objectEqual(obj: any, object2: any) {
    //For the first loop, we only check for types
    for (const propName in obj) {
        //Check for inherited methods and properties - like .equals itself
        //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty
        //Return false if the return value is different
        if (obj.hasOwnProperty(propName) != object2.hasOwnProperty(propName)) {
            return false;
        }
        //Check instance type
        else if (typeof obj[propName] != typeof object2[propName]) {
            //Different types => not equal
            return false;
        }
    }
    //Now a deeper check using other objects property names
    for(const propName in object2) {
        //We must check instances anyway, there may be a property that only exists in object2
            //I wonder, if remembering the checked values from the first loop would be faster or not 
        if (obj.hasOwnProperty(propName) != object2.hasOwnProperty(propName)) {
            return false;
        }
        else if (typeof obj[propName] != typeof object2[propName]) {
            return false;
        }
        //If the property is inherited, do not check any more (it must be equa if both objects inherit it)
        if(!obj.hasOwnProperty(propName))
          continue;
        
        //Now the detail check and recursion
        
        //This returns the script back to the array comparing
        /**REQUIRES Array.equals**/
        if (obj[propName] instanceof Array && object2[propName] instanceof Array) {
                   // recurse into the nested arrays
           if (!arrayEqual(obj[propName], (object2[propName]))) return false;
        }
        else if (obj[propName] instanceof Object && object2[propName] instanceof Object) {
                   // recurse into another objects
                   //console.log("Recursing to compare ", this[propName],"with",object2[propName], " both named \""+propName+"\"");
           if (!arrayEqual(obj[propName], (object2[propName]))) return false;
        }
        //Normal value comparison for strings and numbers
        else if(obj[propName] != object2[propName]) {
           return false;
        }
    }
    //If everything passed, let's say YES
    return true;
}  

export function removeAllChild(node: HTMLElement) {
    Array.from(node.children).forEach(child => child.remove())
}