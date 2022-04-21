import { Checkbox, Table, TableBody, TableCell, TableRow, TableHead } from "@mui/material";
import DonationDropdown from "./DonationDropdown";
import React from "react";

const header = [
    "",
    "Time",
    "Time Conflicts",
    "Assign Available Volunteers"
]

const dummyUsers = [
    {
        name: "John Doe",
        dates: [
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
    },
    {
        name: "Sally Smith",
        dates: [
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
                        begin: new Date('January 12, 2022 12:00:00'),
                        end: new Date('January 12, 2022 13:00:00')
                    }
                ]
            }
        ]
    }
]

interface IDonationDateTable {
    date: Date,
    times: any[]
}

interface IUser {
    name: string,
    begin: Date,
    end: Date
}

const DonationDateTable = ({ date, times }: IDonationDateTable): JSX.Element => {
    const [users, setUsers] = React.useState<IUser[]>();

    const timeConflicts = (): boolean => {
        return false;
    }

    return (
        <Table>
            <TableHead sx={{ minWidth: 650 }} aria-label="simple table">
                <TableRow>
                    {header.map((h) => {
                        return (
                            <TableCell>
                                <p className="tableCell">{h}</p>
                            </TableCell>
                        );
                    })}
                </TableRow>
            </TableHead>
            <TableBody>
                {times.map((time: any): any => {
                    return (
                        <TableRow>
                            <TableCell component="th" scope="row">
                                <Checkbox />
                            </TableCell>
                            <TableCell>
                                {time.begin + " to " + time.end}
                            </TableCell>
                            {timeConflicts() ? <TableCell><p className="timeConflict">Time Conflict</p></TableCell> : <TableCell>No Conflicts</TableCell>}
                            <TableCell>
                                
                            </TableCell>
                        </TableRow>
                    )
                })}
            </TableBody>
        </Table>
    );
};

export default DonationDateTable;
