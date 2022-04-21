import React from 'react';
import DonationDateTable from './DonationDateTable';
require('./DonationApproval.css');

const dummyDates = [
    {
        date: new Date('January 11, 2022'),
        times: [
            {
                begin: new Date('January 11, 2022 10:00:00'),
                end: new Date('January 11, 2022 11:00:00')
            },
            {
                begin: new Date('January 11, 2022 11:00:00'),
                end: new Date('January 11, 2022 12:00:00')
            },
            {
                begin: new Date('January 11, 2022 12:00:00'),
                end: new Date('January 11, 2022 13:00:00')
            },
            {
                begin: new Date('January 11, 2022 13:00:00'),
                end: new Date('January 11, 2022 14:00:00')
            },
            {
                begin: new Date('January 11, 2022 14:00:00'),
                end: new Date('January 11, 2022 15:00:00')
            }
        ]
    },
    {
        date: new Date('January 12, 2022'),
        times: [
            {
                begin: new Date('January 12, 2022 10:00:00'),
                end: new Date('January 12, 2022 11:00:00')
            },
            {
                begin: new Date('January 12, 2022 11:00:00'),
                end: new Date('January 12, 2022 12:00:00')
            },
            {
                begin: new Date('January 12, 2022 12:00:00'),
                end: new Date('January 12, 2022 13:00:00')
            }
        ]
    },
    {
        date: new Date('January 14, 2022'),
        times: [
            {
                begin: new Date('January 12, 2022 10:00:00'),
                end: new Date('January 12, 2022 11:00:00')
            },
            {
                begin: new Date('January 12, 2022 11:00:00'),
                end: new Date('January 12, 2022 12:00:00')
            },
            {
                begin: new Date('January 12, 2022 12:00:00'),
                end: new Date('January 12, 2022 13:00:00')
            }
        ]
    }
]

const DonationScheduling = (): JSX.Element => {
    return (
        <>
            <h1>Schedule Donation</h1>
            {dummyDates.map(d => {
                <div>
                    <h3>{d.date}</h3>
                    <DonationDateTable
                        date={d.date}
                        times={d.times}
                    />
                </div>
            })}
        </>
    )
}

export default DonationScheduling;