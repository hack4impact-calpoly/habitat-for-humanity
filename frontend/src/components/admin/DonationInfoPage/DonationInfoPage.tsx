import React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import PropTypes from "prop-types";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import SubmitInfo from "../../donor/donation/SubmitInfo";
import ContactInfo from "../../donor/donation/ContactInfo";
import sofa1 from "../../donor/donation/images/sofa-01.png";
import AdminNavbar from "../AdminNavbar/AdminNavbar";
import ReceiptPage from "./ReceiptPage/ReceiptPage";
import temp from "./temp.png";

require("./DonationInfoPage.css");

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function TabPanel(props: {
  [x: string]: any;
  children: any;
  value: any;
  index: any;
}) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

const imagesPool = [{ src: sofa1 }];

const address = "1 Grand Avenue \nSan Luis Obispo, CA 93407";

const avaiTimes = [
  {
    day: "Tuesday, January 11",
    hours: [
      "10:00 AM to 11:00AM",
      "11:00 AM to 12:00 PM",
      "12:00 PM to 1:00 PM",
    ],
  },
  {
    day: "Wednesday, January 12",
    hours: [
      "10:00 AM to 11:00AM",
      "11:00 AM to 12:00 PM",
      "12:00 PM to 1:00 PM",
    ],
  },
  {
    day: "Friday, January 14",
    hours: ["2:00 PM to 3:00PM", "3:00 PM to 4:00PM", "4:00 PM to 5:00PM"],
  },
];

function DonationInfoPage(): JSX.Element {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: any, newValue: React.SetStateAction<number>) => {
    setValue(newValue);
  };
  return (
    <div>
      <AdminNavbar />
      <div id="DonInfoPage">
        <div id="ActiveDonHeader">
          <h1>Donation Approval</h1>
        </div>
        <div id="DonInfoBox">
          <div id="Tabs">
            <Box sx={{ borderBottom: 2, borderColor: "divider" }}>
              <Tabs
                value={value}
                onChange={handleChange}
                variant="fullWidth"
                TabIndicatorProps={{ style: { background: "#314d89" } }}
                textColor="primary"
              >
                <Tab
                  label={<span className="IndividTabs">Donation Info</span>}
                  {...a11yProps(0)}
                />
                <Tab
                  label={<span className="IndividTabs">Scheduling</span>}
                  {...a11yProps(1)}
                />
                <Tab
                  label={<span className="IndividTabs">Receipt</span>}
                  {...a11yProps(2)}
                />
              </Tabs>
            </Box>
          </div>
          <TabPanel value={value} index={0}>
            <div id="DonInfo">
              <div id="DonationInfoPage">
                <ContactInfo
                  name="John Smith"
                  email="johndoe@gmail.com"
                  phone="123-456-7890"
                />
                <SubmitInfo
                  name="Sofa"
                  dimensions='83" x 32" x 38"'
                  photos={imagesPool}
                  location={address}
                  dropOff={false}
                  component
                />
                <div id="TimeHours">
                  <h2 className="TimeAvailability">Time Availability</h2>
                  <div id="TimeTable">
                    {avaiTimes.map((element, index) => {
                      const { day } = element;
                      const { hours } = element;
                      return (
                        <tr key={index}>
                          <h4 className="donDropoffRow" key={index}>
                            {day}
                          </h4>
                          <div id="DayHours">
                            {hours.map((element1, index1) => (
                              <div id="EachDayHours" key={index1}>
                                {element1}
                              </div>
                            ))}
                          </div>
                        </tr>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </TabPanel>
          <TabPanel value={value} index={1}>
            {/* Scheduling Page goes here
                          Replace image with actual scheduling component
                        */}
            <img src={temp} alt="Schedule" style={{ paddingTop: "4rem" }} />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <ReceiptPage />
          </TabPanel>
        </div>
        <div id="DonInfoButtons">
          <button type="button" className="backButton">
            Back
          </button>
          <div id="NextButtons">
            <button type="button" className="rejectButton">
              Reject Donation
            </button>
            <button type="button" className="approveButton">
              Approve and Schedule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DonationInfoPage;
