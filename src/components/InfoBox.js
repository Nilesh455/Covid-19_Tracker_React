import React from 'react';
import './InfoBox.css';
import { Card, CardContent, Typography } from '@material-ui/core';

function InfoBox({ title, cases, active, isRed, total, ...props }) {

    return (
        <Card 
            onClick={props.onClick} 
            className={`infoBox ${active && "infoBox--selected"} ${active && isRed && "infoBox--red"}`}
        >
            <CardContent>
                {/* Title */}
                <Typography className="infoBox__title" color="textSecondary">{title}</Typography>
                
                {/* Number of Cases */}
                <h2 className={`infoBox__cases ${!isRed && "infoBox__cases--green"}`}>{cases}</h2>

                {/* Total Numbet of Cases */}
                <Typography className="infoBox__total" color="textSecondary">{total} Total</Typography>
            </CardContent>
        </Card>
    );
}

export default InfoBox;