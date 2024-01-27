import React, { useState, useEffect } from 'react';
import moment from 'moment';

const CustomTooltip = ({ active, payload, label, data, hoveredLine }) => {
    const [minMaxValues, setMinMaxValues] = useState({});

    useEffect(() => {
        const newMinMaxValues = {};
        payload.forEach(({ dataKey }) => {
            const values = data.map(item => item[dataKey]);
            newMinMaxValues[dataKey] = {
                min: Math.min(...values),
                max: Math.max(...values),
            };
        });
        setMinMaxValues(newMinMaxValues);
    }, [data, payload]);

    function dataKeyFormatter(dataKey) {
        switch (dataKey) {
            case "humidity":
                return "Humidity";
            case "cloud":
                return "Cloud";
            case "chance_of_rain":
                return "Chance of Rain";
            case "uv":
                return "UV Index";
            case "vis_km":
                return "Visibility";
            case "temp_c":
                return "Temperature";
            default:
                return dataKey;
        }
    }

    function valueUnitFormatter(dataKey, value) {
        switch (dataKey) {
            case "humidity":
                return `${value}%`;
            case "cloud":
                return `${value}%`;
            case "chance_of_rain":
                return `${value}%`;
            case "uv":
                return `${value}`;
            case "vis_km":
                return `${value} km`;
            case "temp_c":
                return `${value} °C`;
            default:
                return value;
        }
    }

    function getConditionRecommendation(data) {
        let humidity, cloud, chance_of_rain, uv, vis_km, temp_c;

        data.forEach(({ dataKey, value }) => {
            switch (dataKey) {
                case "humidity":
                    humidity = value;
                    break;
                case "cloud":
                    cloud = value;
                    break;
                case "chance_of_rain":
                    chance_of_rain = value;
                    break;
                case "uv":
                    uv = value;
                    break;
                case "vis_km":
                    vis_km = value;
                    break;
                case "temp_c":
                    temp_c = value;
                    break;
                default:
                    break;
            }
        });

        if (temp_c > 30 && humidity > 80 && uv > 10) {
            return "Unhealthy for outdoor activity";
        } else if (temp_c < 10 && cloud > 80 && chance_of_rain > 50) {
            return "Cold and wet";
        } else if (temp_c > 20 && temp_c < 30 && humidity < 60 && uv < 8 && vis_km > 10) {
            return "Best for outdoor sports";
        } else if (temp_c > 30 && humidity < 40 && cloud < 20) {
            return "Hot and dry";
        } else if (temp_c < 0 && cloud > 60 && chance_of_rain > 80) {
            return "Snowy and stormy";
        } else if (temp_c > 15 && temp_c < 25 && humidity > 60 && cloud > 40 && chance_of_rain < 20) {
            return "Mild and pleasant";
        } else if (cloud > 20 && cloud < 50) {
            return "Partly cloudy";
        } else {
            return "Average Conditions";
        }
    }

    if (active) {
        return (
            <div className="custom-tooltip" style={{ backgroundColor: '#000000DD', backdropFilter: "blur(10px)", padding: '15px 80px 15px 15px', color: "white", borderRadius: "20px", boxShadow: "4px 4px 30px black" }}>
                <h1 style={{ fontSize: "40px" }} className="label" >{`${moment(label, 'YYYY-MM-DD HH:mm').format('h A')}`}</h1>
                <p style={{ fontSize: "20px" }}>
                    {getConditionRecommendation(payload)}
                </p>
                <br />
                {payload.map(({ dataKey, value, color }) => (
                    <p key={dataKey} style={{ fontSize: "20px", color, fontWeight: hoveredLine === dataKey ? "bolder" : "normal", textDecoration: hoveredLine === dataKey ? "underline" : "none" }}>
                        {`${dataKeyFormatter(dataKey)}: ${valueUnitFormatter(dataKey, value)}`}
                        <span style={{ color: "gray" }}>
                            {minMaxValues[dataKey]?.min !== minMaxValues[dataKey]?.max ? (
                                <>
                                    {value === minMaxValues[dataKey]?.min && ', At its lowest point'}
                                    {value === minMaxValues[dataKey]?.max && ', At its highest point'}
                                </>
                            ) : (
                                ', Constant at 0 throughout the day'
                            )}
                        </span>
                    </p>
                ))}
            </div>
        );
    }

    return null;
};

export default CustomTooltip;