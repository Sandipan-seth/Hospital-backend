const addDoctor = async (req,res) =>{
    try {
        
        const {name,email,password,image,spaciality,degree,experience,about,available,fees,address} = req.body;



    } catch (error) {
        console.log(error);
    }
}

export  { addDoctor };