const getBillingInfo = async () => {
    const req = await fetch("http://localhost:1337/billing_info");
    const { data, countries } = await req.json();
    return { ...data, countries };
};

export default getBillingInfo;
