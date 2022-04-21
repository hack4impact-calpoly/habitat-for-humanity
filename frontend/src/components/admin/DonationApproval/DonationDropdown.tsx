import { InputLabel, MenuItem, Select } from '@mui/material';
import React from 'react';

const users: string[] = [
    "Sally Smith",
    "John Doe"
]

const DonationDropdown = (): JSX.Element => {
    const [user, setUser] = React.useState();

    return (
        <div>
            <InputLabel id="demo-simple-select-label">Volunteer</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={user}
                label="Age"
            >
                {users.map(u => {
                    <MenuItem>{u}</MenuItem>
                })}
            </Select>
        </div>
    )
}

export default DonationDropdown;