import React, { useEffect, useState }  from "react";
import Header_black from "../Blocks/Header_black/Header_black";
import Transfer from "../Blocks/Transfer/Transfer";

import server from '../../serverConfig';
function Transfer_Page({ children, ...props }) {
    const [transferInfo, setTransferInfo] = useState("");

    useEffect(() => {
        async function fetchMissionInfo() {
            try {
                const response = await fetch(`${server}/api/transfer`);
                const data = await response.json();
                setTransferInfo(data);
            } catch (error) {
                console.error("Error fetching transfer info:", error);
            }
        }

        fetchMissionInfo();
    }, []);
    
    return (
        <>
            <Header_black /> 
            <Transfer data={transferInfo}/>
        </>
    );
}

export default Transfer_Page;