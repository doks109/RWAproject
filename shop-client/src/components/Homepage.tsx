import React from 'react';
import './style/Homepage.css';
import Typography from "@mui/material/Typography";

function Homepage(){
    return (
        <>
            <section className="jumbotron">
                <div className="heading-text">
                    <Typography variant='h3' sx={{ mb: 3, pr: 3 }}>
                        Shop
                    </Typography>
                    <Typography sx={{ pr: 3 }} color='text.secondary'>
                        Increase your engagement rates
                    </Typography>
                </div>
                <img src="/message_sentl.png" />
            </section>
            <section className="form-section">
                <Typography variant='h4' sx={{ mb: 3, pt: 5 }}>
                    Connect With Your Customers
                </Typography>
                <Typography sx={{ mb: 3 }}>
                    Reach more customers
                </Typography>
            </section>

            <section className="chart-section">
                <div className="text">
                    <Typography variant='h4' sx={{ mb: 3 }}>
                        View our delivery success rates
                    </Typography>
                    <Typography sx={{ mb: 3 }}>
                        You will have all the data<br />
                    </Typography>
                    <Typography sx={{ mb: 3 }}>
                    </Typography>
                </div>
            </section>

            <section className="latest-messages-section">
                <Typography variant='h4' sx={{ mb: 2 }}>
                    Some
                </Typography>
                <Typography sx={{ mb: 2 }}>
                    This is an example
                </Typography>
            </section>
        </>
    );
}

export default Homepage;