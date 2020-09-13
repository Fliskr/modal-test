import React, { useEffect, useState } from "react";
import { Modal, Button } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import BillingInfoModalForm from "./components/BillingInfoModalForm";
import styled from "styled-components";
import getBillingInfo from "./api/getBillingInfos";

const Layout = styled.div`
    display: flex;
    justify-content: center;
    padding: 20px 0;
`;

function App() {
    const [billingInfo, setBillingInfo] = useState(null);

    useEffect(() => {
        getBillingInfo().then(setBillingInfo);
    }, []);
    const [open, setOpen] = useState(false);
    return (
        <Layout>
            <Modal
                onClose={() => setOpen(false)}
                onOpen={() => {
                    setOpen(true);
                }}
                open={open}
                trigger={<Button color="blue">Ввести данные</Button>}
            >
                <BillingInfoModalForm
                    {...billingInfo}
                    closeModal={() => setOpen(false)}
                ></BillingInfoModalForm>
            </Modal>
        </Layout>
    );
}

export default App;
