
import { RazorpayInstance } from "../server";


export const createPayment = async (totalAmount: number, orderId: string) => {

    const paymentDetails = await RazorpayInstance.orders.create({
        amount: totalAmount,
        currency: 'INR',
        payment_capture: true,
        receipt: orderId
    });

    return paymentDetails;
}