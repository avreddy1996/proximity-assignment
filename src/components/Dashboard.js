import React, {useEffect, useState,useRef} from "react";

import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    useMediaQuery,
    Button
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { grey } from '@mui/material/colors';
import {VictoryChart,VictoryLine,VictoryTheme,VictoryZoomContainer,VictoryGroup} from "victory"



const StyledButton = styled(Button)(({theme})=>({
    color: '#000',
    borderColor:'#000'
}))

var start=new Date();
var citiesData = {};
var aqiDataTemp = {};
var colorsTemp = {};
const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [cities, setCities] = useState({});
    const [aqiData, setAqiData] = useState({});
    const [selectedCity, setSelectedCity] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [anotherChartData,setAnotherChartData] = useState([]);
    const [colors, setColors] = useState({});
    const [zoomDomain, setZoomDomain] = useState([new Date(new Date().setTime(new Date().getTime() - 10)), new Date()]);
    const chart = useRef(null);
    const getAqiIndex = (aqiValue) => {
        let category, color;
        if (aqiValue >= 0 && aqiValue <= 50) {
            category = "Good";
            color = "#55a84f";
        } else if (aqiValue > 50 && aqiValue <= 100) {
            category = "Satisfactory";
            color = "#a2c853";
        } else if (aqiValue > 100 && aqiValue <= 200) {
            category = "Moderate";
            color = "#fff832";
        } else if (aqiValue > 200 && aqiValue <= 300) {
            category = "Poor";
            color = "#f39c32";
        } else if (aqiValue > 300 && aqiValue <= 400) {
            category = "Very Poor";
            color = "#e93f33";
        } else {
            category = "Severe";
            color = "#ae2d24";
        }
        return {category: category, color: color}
    }

    const handleMessage = (event) => {
        // Do nothing if event is triggered more than once in a second
        if(((new Date()).getTime() - start.getTime()) > 1000){
            let data = JSON.parse(event.data);
            // console.log(Object.keys(cities));
            data.forEach(dataItem => {
                let aqi = parseFloat(dataItem.aqi.toFixed(2));
                if (citiesData[dataItem.city] && citiesData[dataItem.city].length>0) {
                    citiesData[dataItem.city].push({
                        updated_at: new Date(),
                        value:aqi
                    })
                }else{
                    citiesData[dataItem.city] = [{
                        updated_at: new Date(),
                        value:aqi
                    }]
                }
                aqiDataTemp[dataItem.city] = {
                    aqi: aqi,
                    updated_at: Date.now(),
                    ...getAqiIndex(aqi)
                }
            })
            setCities({...cities,...citiesData});
            setAqiData({...aqiData,...aqiDataTemp});
            start=new Date();
        }
    }
    const handleZoom=(domain)=>{
        setZoomDomain(domain.x)
    }
    useEffect(() => {
        const socket = new WebSocket('ws://city-ws.herokuapp.com');
        socket.onopen = () => {
            setLoading(false);
        };
        socket.onmessage = handleMessage;
    })
    // useEffect(()=>{
    //     console.log("qd",Object.keys(cities));
    // },[cities])
    useEffect(()=>{
        if(chart && chart.current){
            chart.current.scrollIntoView();
        }
    },[selectedCity])
    // useEffect(()=>{
    //     if(selectedCity && chartData !== cities[selectedCity]){
    //
    //         console.log("sd",cities[selectedCity])
    //         if(!cities[selectedCity]){
    //             console.log(cities,selectedCity)
    //         }
    //         setChartData([...cities[selectedCity]])
    //     }
    // },[selectedCity,cities])
    // useEffect(()=>{
    //     console.log(chartData);
    // },[chartData])

    const handleTrackClick = (key)=>{
        let s = selectedCity
        s.push(key);
        colorsTemp[key] = '#'+(Math.random().toString(16)+'00000').slice(2,8);
        setSelectedCity([...s]);
        setColors({...colors,...colorsTemp});
    }
    const handleRemoveSelectedCity = (index)=>{
        let s = selectedCity;
        s.splice(index,1)
        setSelectedCity([...s]);
    }
    return (
        <div>
            <TableContainer component={Paper} sx={{maxWidth:'960px',width:'95%',margin:'2rem auto'}}>
                <Table sx={{minWidth: 650}} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>City</TableCell>
                            <TableCell>AQI</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Object.keys(aqiData).map((key) => (
                            <TableRow
                                key={key}
                                sx={{'&:last-child td, &:last-child th': {border: 0},background:aqiData[key].color,transition:'background 200ms ease-in-out'}}
                            >
                                <TableCell component={"th"} scope={"row"}>
                                    {key}
                                </TableCell>
                                <TableCell>
                                    <div style={{fontWeight:'bold'}}>
                                        {aqiData[key].aqi}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <StyledButton variant={"outlined"} onClick={()=>handleTrackClick(key)}>Live Tracking</StyledButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {
                selectedCity && selectedCity.length>0 &&
                        <div style={{width:'960px', margin:'1rem auto 3rem auto',display:'flex',alignItems:'center',justifyContent:'center'}} ref={chart}>
                            <div>
                            <VictoryChart
                                domainPadding={{x:0,y:10}}
                                containerComponent={
                                    <VictoryZoomContainer
                                        zoomDimension="x"
                                        zoomDomain={zoomDomain}
                                        onZoomDomainChange={handleZoom}
                                    />
                                }
                            >
                                <VictoryGroup>
                                    {
                                        selectedCity.map((x)=>(
                                            <VictoryLine
                                                animate={{
                                                    duration: 500,
                                                    onLoad: { duration: 500 }
                                                }}
                                                style={{data: {stroke: colors[x]}}}
                                                data={cities[x]}
                                                x={"updated_at"}
                                                y={"value"}
                                            />
                                        ))
                                    }
                                </VictoryGroup>

                            </VictoryChart>
                            <br />
                            <strong>Live AQI</strong>
                            </div>
                            <div style={{display:'flex',flexDirection:'column',alignItems:'start'}}>
                                {
                                    selectedCity.map((city,index)=>(
                                        <strong style={{color:colors[city],margin:'0.25rem'}}>{city}<span style={{color:'red',cursor:'pointer'}} onClick={()=>handleRemoveSelectedCity(index)}>&nbsp;&nbsp;X&nbsp;&nbsp;</span></strong>
                                    ))
                                }
                            </div>
                        </div>
            }
        </div>
    )
}
export default Dashboard;