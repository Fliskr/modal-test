import { IFormValues } from "../components/BillingInfoModalForm";

const saveBillingInfo = async (body: IFormValues): Promise<boolean> => {
    const req = await fetch("http://localhost:1337/save", {
        method: "POST",
        body: JSON.stringify(body),
    });
    const res = await req.json();
    return res.ok === 1;
};

export default saveBillingInfo;
