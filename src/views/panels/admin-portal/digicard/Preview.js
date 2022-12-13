import React from "react";
// import {Table} from 'react-bootstrap';
import { Link, useHistory, useParams } from 'react-router-dom';

function Preview (){
    
    
    const { digiCardContent } = useParams();

    return(

       <div>
        {digiCardContent}
       </div>
    )
       
    
}

export default Preview;