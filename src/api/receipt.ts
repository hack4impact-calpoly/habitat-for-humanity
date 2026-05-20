const nextURL: string = "/api/receipt";

export interface Receipt {
  _id?: string;
  pdf: string;
  itemId: string;
  createdAt?: Date;
}

export const saveReceipt = async (
  pdf: Blob,
  itemId: string,
): Promise<string | null> => {
  try {
    const arrayBuffer = await pdf.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    const response = await fetch(nextURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pdf: base64, itemId }),
    });

    if (!response.ok) {
      throw new Error(`${response.status}-${response.statusText}`);
    }

    const data = await response.json();
    return data.receiptId as string;
  } catch (error) {
    console.error("Error saving receipt:", error);
    return null;
  }
};

export const saveOrUpdateReceipt = async (
  pdf: Blob,
  itemId: string,
): Promise<string | null> => {
  try {
    const arrayBuffer = await pdf.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    // Check if receipt already exists for this item
    const existing = await fetch(`${nextURL}?itemId=${itemId}`);
    const existingData = await existing.json();

    const isUpdate = existing.ok && existingData?.receiptId;

    const response = await fetch(
      isUpdate ? `${nextURL}/${existingData.receiptId}` : nextURL,
      {
        method: isUpdate ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pdf: base64, itemId }),
      },
    );

    if (!response.ok) {
      throw new Error(`${response.status}-${response.statusText}`);
    }

    const data = await response.json();
    return data.receiptId as string;
  } catch (error) {
    console.error("Error saving receipt:", error);
    return null;
  }
};

export const getReceipts = async (): Promise<Receipt[]> => {
  try {
    const response = await fetch(nextURL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`${response.status}-${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching receipts:", error);
    return [];
  }
};

export const getReceiptById = async (id: string): Promise<Receipt | null> => {
  try {
    const response = await fetch(`${nextURL}/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`${response.status}-${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching receipt:", error);
    return null;
  }
};
