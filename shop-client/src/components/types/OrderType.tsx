export type Order = {
    id: string;
    date: string;
    cartId: string;
    price: number;
    finished: boolean;
    customerName: string;
    customerSurname: string;
    customerAddress: string;
}