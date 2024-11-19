import checkSum from "./checkSum.js";

const initializePayment = async (paymentObject) => {
  const checksum = await checkSum.generateSignature(
    JSON.stringify(paymentObject.body),
    process.env.PAYTM_MERCHANT_KEY
  );
  paymentObject.head = {
    signature: checksum,
  };

  //call transaction init API
  return (txnInfo = initializAPIRequest(paymentObject));
};

/**
 *
 * call this function to create checksum and initiate payment API call.
 */
const initializAPIRequest = (paymentObject) => {
  return new Promise((resolve, reject) => {
    let post_data = JSON.stringify(paymentObject);
    let options = {
      /* for Staging */
      hostname: process.env.PAYTM_HOST_STAGING,
      /* for Production */
      // hostname: process.env.PAYTM_HOST_PROD,
      port: 443,
      path: `/theia/api/v1/initiateTransaction?mid=${paymentObject.body.mid}&orderId=${paymentObject.body.orderId}`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": post_data.length,
      },
    };

    const paytmReq = https.request(options, (paytmRes) => {
      let responseData = "";

      paytmRes.on("data", (chunk) => (responseData += chunk));
      paytmRes.on("end", () => resolve(responseData));
    });

    paytmReq.on("error", (e) => reject(e));

    paytmReq.write(post_data);
    paytmReq.end();
  });
};

const verifyPaymentAuthenticity = (paymentObject) => {
  return new Promise((resolve, reject) => {
    const verifyStatus = checkSum.verifySignature(
      paymentObject,
      process.env.PAYTM_MERCHANT_KEY,
      paymentObject.CHECKSUMHASH
    );
    verifyStatus ? resolve(paymentObject) : false;
  });
};

export { initializePayment, verifyPaymentAuthenticity };
