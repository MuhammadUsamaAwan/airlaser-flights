import React from 'react';
import { Link } from 'react-router-dom'

const Flight = ({locationCity, locationAir, destinationAir, destinationCity, date, time, id}) => {
    return (
        <div className="card">
            <div className="card-body bg-dark text-light">
                <h5 className="card-title">{locationCity} to {destinationCity}</h5>
                <p className="card-text">{locationAir} to {destinationAir}</p>
            </div>
            <ul className="list-group list-group-flush">
                <li className="list-group-item">{date}</li>
                <li className="list-group-item">{time}</li>
            </ul>
            <div className="card-body">
                <Link to={`/${id}`}>Book Now!</Link>
            </div>
        </div>
    )
}

export default Flight
