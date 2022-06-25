


let tags="    "
let subcategory="      "



if(tags||subcategory) {if(tags.trim() && subcategory.trim())
    { 
        tags=tags.trim()
        subcategory=subcategory.trim()
    }else if(tags.trim()){
        tags=tags.trim()

    }else if(subcategory.trim()){
        subcategory=subcategory.trim() 
    }
    else{
        return res.status(400).send({Status:false,msg:"Plz dont give empty tag"})
    }
}

console.log(`this is tag value ${tags}`)
console.log(`this is subcategory value ${subcategory}`)