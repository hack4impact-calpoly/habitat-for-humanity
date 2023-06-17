const emailURL = "http://localhost:3001/api/email/";
/* ----------------------POST Requests---------------------------*/

// Email data model
export interface Email {
  recipientEmail: string;
  subject: string;
  body: string | HTMLElement;
  isHTML: boolean;
}

// Send an email without attachment
export const sendEmail = async (email: Email) =>
  fetch(emailURL, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      recipientEmail: email.recipientEmail,
      subject: email.subject,
      body: email.body,
      isHTML: email.isHTML,
    }),
  })
    .then(async (res) => {
      const response = await res.json();
      if (!res.ok) {
        // check server response
        throw new Error(`${res.status}-${res.statusText}`);
      }
      return response;
    })
    .catch((error) => console.error("Error: ", error)); // handle error

/* --------------Functions for Creating HTMLElements-------------- */
export const createParagraph = (text: string) => {
  const paragraph = document.createElement("p");
  paragraph.style.fontFamily = "Rubik, sans-serif";
  paragraph.innerText = text;
  return paragraph;
};

export const createListItem = (label: string, value: any) => {
  const listItem = document.createElement("li");
  const strong = document.createElement("strong");
  strong.style.fontFamily = "Rubik, sans-serif";
  strong.innerText = label;
  listItem.appendChild(strong);
  listItem.appendChild(document.createTextNode(String(value)));
  return listItem;
};
