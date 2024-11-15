import BackOffice from "../../components/Backoffice";
import React, { useEffect } from "react";
import { useState } from "react";
import {Bar} from"react-chartjs-2";
import {Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,  } from "chart.js/auto";
import axios from "axios";
import config from "../../config";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
function DashBoard(){

    const [data, setData] = useState(null);
    const options = useState({
        
            resonsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Monthly Sales Data', 
                },
                scales: {
                    y: {
                        beginAtZero: true,
                    }
                }
            }
        
    });
    
    
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const res = await axios.get(config.apiPath + '/api/sale/dashboard', config.headers());
        let data = [];
        if (res.data.results !== undefined) {
            for (let i = 0; i < res.data.results.length; i++) {
                data.push(res.data.results[i].sumPrice);
            }
        }
        setData( {
            labels: ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'],
            datasets: [
                {
                    label: 'Monthly Sales',
                    data:  data,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
    
                }
            ]
        })
    }
    
    
return <BackOffice>
   {data ? (
     <Bar data={data} options={options} />
   ) : (
    <p>loading...</p>
   )}

</BackOffice>
}

export default DashBoard;