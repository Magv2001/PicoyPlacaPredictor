import React, { useState, useEffect } from 'react';

const PicoYPlacaPredictor = () => {
    const [licensePlate, setLicensePlate] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [canDrive, setCanDrive] = useState(null);

    // Manage the lifetime of the result message
    useEffect(() => {
        let timeoutId = null;
        if (canDrive !== null) {
            timeoutId = setTimeout(() => {
                setCanDrive(null);
            }, 3000); 
        }
        return () => {
            clearTimeout(timeoutId);
        };
    }, [canDrive]);

    // Function to check if the vehicle is drivable based on the entered license plate, date, and time.
    const checkPicoYPlaca = () => {
        const lastNumber = parseInt(licensePlate.slice(-1));
        const weekday = new Date(date).getDay();
        const hour = parseInt(time.split(':')[0]);
        const minute = parseInt(time.split(':')[1]);

        const picoYPlacaDays = {
            1: [1, 2], // Monday
            2: [3, 4], // Tuesday
            3: [5, 6], // Wednesday
            4: [7, 8], // Thursday
            5: [9, 0], // Friday
        };

        // Check if it is a weekend or a holiday and if it is within the restricted hours
        const isWeekendOrHoliday = weekday === 0 || weekday === 6;
        const isRestrictedHour =
            (hour >= 7 && hour < 9) ||
            (hour === 9 && minute <= 30) ||
            (hour >= 16 && hour < 19) ||
            (hour === 19 && minute <= 30);

        let canDrive = true;

        if (
            !isWeekendOrHoliday && 
            picoYPlacaDays[weekday].includes(lastNumber) && 
            isRestrictedHour
        ){
            canDrive = false;
        }

        setCanDrive(canDrive);
    };

    return (
        <div className="pico-y-placa-predictor">
            <h2>Pico y Placa Predictor</h2>
            <label>
                License Plate Number:
                <input
                    type="text"
                    value={licensePlate}
                    onChange={(e) => setLicensePlate(e.target.value)}
                />
            </label>
            <br />
            <label>
                Date (DD-MM-YYYY):
                <input
                    type="text"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
            </label>
            <br />
            <label>
                Time (HH:MM):
                <input
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                />
            </label>
            <br />
            <button onClick={checkPicoYPlaca}>Send</button>
            {canDrive !== null && (
                <p className={`status ${canDrive ? 'green' : 'red'}`}>
                    The car {canDrive ? 'can' : 'cannot'} be on the road.
                </p>
            )}
        </div>
    );
};

export default PicoYPlacaPredictor;