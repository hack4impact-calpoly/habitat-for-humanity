import Image from "next/image";

export default function AdminDashboard(){
    return(
    <div>
        <div style = {styles.navbar}>
        <Image
        src="/images/ReStoreLogo.png"
        alt="habitat logo"
        width={500}
        height={300}
        />
        {/* TODO: Replace placeholder buttons*/}
        <button>
            Manage Pickups
        </button>
        <button>
            Pickup Requests
        </button>
        </div>

        <h3>Dashboard</h3>

        <div style = {styles.summaryCards}>
        {/* TODO: Replace placeholder summary cards*/}
        <div>
            <h3>Total Donations</h3>
            <p>0</p>
        </div>
        <div>
            <h3>Estimated Value</h3>
            <p>0</p>
        </div>
        <div>
            <h3>Most Common</h3>
            <p>0</p>
        </div>
        <div>
            <h3>Pending Donations</h3>
            <p>0</p>
        </div>
        </div>
        {/* TODO: Replace placeholder donation graph and table*/}
        <div className="donationGraph">
        Donation Tracker Graph Placeholder
        </div>

        <div className = "donationDetailsTable">
        <table>
            <thead>
                <tr>
                    <th>Item</th>
                    <th>Location</th>
                    <th>Donor</th>
                    <th>Date - Time</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Placeholder</td>
                    <td>Placeholder</td>
                    <td>Placeholder</td>
                    <td>Placeholder</td>
                </tr>
            </tbody>
        </table>
        </div>
    </div>
    )
}

const styles: { [key: string]: React.CSSProperties } = {
navabr:{
    display: "flex",
    flexDirection: "row"
},
summaryCards: {
    display: "flex",
    flexDirection: "row"
}

}